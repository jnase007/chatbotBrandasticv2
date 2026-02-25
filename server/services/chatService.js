import OpenAI from 'openai';
import NodeCache from 'node-cache';
import { brandkDb } from '../data/knowledgeBase.js';
import config from '../config/environment.js';

export class ChatService {
  constructor() {
    // Initialize OpenAI with proper error handling
    this.initializeOpenAI();
    
    // Cache for responses (TTL: 1 hour)
    this.cache = new NodeCache({ stdTTL: 3600 });
    
    // Store conversation history with cleanup
    this.conversations = new Map();
    
    // Cleanup old conversations every hour
    setInterval(() => this.cleanupOldConversations(), 3600000);
  }

  initializeOpenAI() {
    const apiKey = config.openai.apiKey;
    
    console.log('🔑 Initializing OpenAI...');
    console.log('Key configured:', !!apiKey);
    console.log('Key format valid:', apiKey?.startsWith('sk-'));
    console.log('Key length:', apiKey?.length || 0);
    
    if (!apiKey || apiKey === 'your_openai_api_key_here' || apiKey.length < 20) {
      console.warn('⚠️  OpenAI API key not configured properly. Using fallback responses.');
      this.openai = null;
      this.fallbackMode = true;
    } else {
      try {
        this.openai = new OpenAI({
          apiKey: apiKey,
          timeout: 30000, // 30 second timeout
          maxRetries: 2
        });
        this.fallbackMode = false;
        console.log('✅ OpenAI client initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize OpenAI client:', error);
        this.openai = null;
        this.fallbackMode = true;
      }
    }
  }

  async processMessage({ message, conversationId, context = {}, userAgent, ip }) {
    try {
      console.log('📨 Processing message:', message.substring(0, 50) + '...');
      
      // Rate limiting check (basic implementation)
      const userKey = ip || 'unknown';
      const userRequests = this.cache.get(`requests_${userKey}`) || 0;
      if (userRequests > 20) { // 20 requests per hour per IP
        throw new Error('Rate limit exceeded');
      }
      this.cache.set(`requests_${userKey}`, userRequests + 1, 3600);

      // If OpenAI is not configured, return intelligent fallback
      if (this.fallbackMode) {
        console.log('🔄 Using intelligent fallback response');
        return this.getIntelligentFallback(message, conversationId);
      }

      // Check cache for common questions
      const cacheKey = this.generateCacheKey(message);
      const cachedResponse = this.cache.get(cacheKey);
      
      if (cachedResponse) {
        console.log('💾 Returning cached response');
        return {
          ...cachedResponse,
          conversationId,
          cached: true
        };
      }

      // Get or create conversation history
      const conversationData = this.conversations.get(conversationId);
      let conversation = conversationData ? conversationData.messages : [];
      
      // Add user message to conversation
      conversation.push({ role: 'user', content: message });

      // Prepare messages for OpenAI with token management
      const messages = [
        { role: 'system', content: this.getSystemPrompt() },
        ...this.trimConversationHistory(conversation)
      ];

      console.log('🤖 Calling OpenAI API...');

      // Call OpenAI API with error handling
      const completion = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages,
        max_tokens: config.openai.maxTokens,
        temperature: config.openai.temperature,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
        user: conversationId // For abuse monitoring
      });

      const botResponse = completion.choices[0].message.content;
      console.log('✅ OpenAI response received');
      
      // Add bot response to conversation
      conversation.push({ role: 'assistant', content: botResponse });
      this.conversations.set(conversationId, {
        messages: conversation,
        lastActivity: Date.now()
      });

      // Analyze response for type and actions
      const responseAnalysis = this.analyzeResponse(botResponse, message);
      
      const response = {
        message: botResponse,
        type: responseAnalysis.type,
        suggestedAction: responseAnalysis.suggestedAction,
        conversationId,
        timestamp: new Date().toISOString(),
        tokensUsed: completion.usage?.total_tokens || 0
      };

      // Cache common responses
      if (this.isCommonQuestion(message)) {
        this.cache.set(cacheKey, response, 1800); // 30 minutes for common questions
      }

      return response;

    } catch (error) {
      console.error('❌ Chat Service Error:', error);
      
      // Handle specific error types
      if (error.code === 'insufficient_quota') {
        return this.getErrorResponse(conversationId, 'quota_exceeded');
      } else if (error.code === 'rate_limit_exceeded') {
        return this.getErrorResponse(conversationId, 'rate_limited');
      } else if (error.message.includes('Rate limit exceeded')) {
        return this.getErrorResponse(conversationId, 'user_rate_limited');
      }
      
      return this.getErrorResponse(conversationId, 'general_error');
    }
  }

  getIntelligentFallback(message, conversationId) {
    const lowerMessage = message.toLowerCase();
    
    // Pattern matching for common queries
    if (lowerMessage.includes('service') || lowerMessage.includes('what do you do')) {
      return {
        message: "Hey, I'm Brandi. How can I help you today?",
        type: 'discovery',
        suggestedAction: 'learn_more',
        conversationId,
        timestamp: new Date().toISOString()
      };
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
      return {
        message: "Great question about investment levels! Our services are customized based on your specific needs and goals. To give you accurate information, I'd love to understand more about your business first. What type of services are you most interested in - marketing, website development, or branding?",
        type: 'service_inquiry',
        suggestedAction: 'book_call',
        conversationId,
        timestamp: new Date().toISOString()
      };
    }
    
    if (lowerMessage.includes('website') || lowerMessage.includes('web design')) {
      return {
        message: "We create custom websites that drive results! Do you currently have a website? What's the main goal you want to achieve - generate leads, sell products, or build credibility? Understanding your situation helps me explain how we can help.",
        type: 'discovery',
        suggestedAction: 'learn_more',
        conversationId,
        timestamp: new Date().toISOString()
      };
    }
    
    if (lowerMessage.includes('marketing') || lowerMessage.includes('advertising')) {
      return {
        message: "Our digital marketing services help businesses attract and convert more customers. What's your biggest challenge in attracting new customers right now? Are you currently doing any marketing, or would this be a fresh start?",
        type: 'discovery',
        suggestedAction: 'learn_more',
        conversationId,
        timestamp: new Date().toISOString()
      };
    }
    
    // Default fallback
    return {
      message: "Hey, I'm Brandi. How can I help you?",
      type: 'discovery',
      suggestedAction: 'learn_more',
      conversationId,
      timestamp: new Date().toISOString()
    };
  }

  getErrorResponse(conversationId, errorType) {
    const responses = {
      quota_exceeded: "I'm temporarily unable to access my AI capabilities due to usage limits, but I'd love to help! Let's schedule a call with our team to discuss your needs directly.",
      rate_limited: "I'm getting a lot of requests right now. Let's schedule a call with our team so we can give you the attention you deserve!",
      user_rate_limited: "You've been very active! Let's schedule a call with our team to continue our conversation and dive deeper into your needs.",
      general_error: "I'm having a technical hiccup, but I'd love to help! Let's schedule a call with our team to discuss your needs directly."
    };
    
    return {
      message: responses[errorType] || responses.general_error,
      type: 'error',
      suggestedAction: 'book_call',
      conversationId,
      timestamp: new Date().toISOString()
    };
  }

  trimConversationHistory(conversation) {
    // Keep last 8 messages to stay within token limits
    return conversation.slice(-8);
  }

  cleanupOldConversations() {
    const oneHourAgo = Date.now() - 3600000;
    let cleaned = 0;
    
    for (const [id, data] of this.conversations.entries()) {
      if (data.lastActivity < oneHourAgo) {
        this.conversations.delete(id);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} old conversations`);
    }
  }

  getSystemPrompt() {
    return `You are Brandi, the AI assistant for Brandastic, a leading digital marketing and web design agency. You represent the Brandastic team with a warm, professional personality.

ABOUT BRANDASTIC:
${brandkDb.services}

YOUR ROLE AS BRANDI - CONSULTATIVE ASSISTANT:
- Act as a discovery consultant, not a price quoter
- Ask thoughtful questions to understand their business and needs
- Focus on understanding their challenges, goals, and timeline
- Only mention specific pricing when directly pressed after understanding their needs
- Always prioritize booking consultation calls for detailed discussions
- Use a professional yet friendly, conversational tone
- Be warm and personable while maintaining professionalism

DISCOVERY-FIRST APPROACH:
1. Understand their business type and industry
2. Learn about their current challenges or goals
3. Identify what's driving their need for services right now
4. Understand their timeline and decision-making process
5. THEN discuss how we can help and suggest a consultation

RESPONSE GUIDELINES:
- Keep responses under 150 words when possible
- Ask 1-2 thoughtful follow-up questions in each response
- Focus on understanding before selling
- When asked about pricing: "Great question! Investment levels vary based on your specific needs. To give you accurate information, I'd love to understand more about [your business/goals/challenges] first."
- Use "we" when referring to Brandastic
- Mention our team when suggesting consultations
- Be conversational and warm - you're Brandi, not a robot!

BOOKING CALLS:
When users show interest or after discovery questions, say: "This sounds like something our team would love to discuss with you. Would you like to schedule a consultation call to explore how we can help with [their specific situation]?"

Remember: You're Brandi - a consultative assistant who genuinely cares about understanding their business before presenting solutions. Focus on their world first!`;
  }

  analyzeResponse(botResponse, userMessage) {
    const lowerResponse = botResponse.toLowerCase();
    const lowerMessage = userMessage.toLowerCase();
    
    // Check if response suggests booking a call
    const bookingKeywords = ['book', 'call', 'schedule', 'consultation', 'discuss'];
    const suggestsBooking = bookingKeywords.some(keyword => lowerResponse.includes(keyword));
    
    // Check if user is asking about pricing
    const pricingKeywords = ['cost', 'price', 'pricing', 'expensive', 'budget', 'fee', 'how much', 'investment'];
    const askingAboutPricing = pricingKeywords.some(keyword => lowerMessage.includes(keyword));
    
    // Check if asking about specific services
    const serviceKeywords = ['website', 'seo', 'ppc', 'social media', 'marketing', 'design', 'ecommerce', 'branding', 'shopify', 'wordpress'];
    const askingAboutServices = serviceKeywords.some(keyword => lowerMessage.includes(keyword));
    
    // Check if response is asking discovery questions
    const discoveryKeywords = ['what type', 'what kind', 'tell me about', 'what\'s your', 'how are you', 'what does'];
    const isDiscovery = discoveryKeywords.some(keyword => lowerResponse.includes(keyword));
    
    if (suggestsBooking || (askingAboutPricing && isDiscovery)) {
      return {
        type: 'service_inquiry',
        suggestedAction: 'book_call'
      };
    }
    
    if (isDiscovery || askingAboutServices) {
      return {
        type: 'discovery',
        suggestedAction: 'learn_more'
      };
    }
    
    return {
      type: 'general',
      suggestedAction: null
    };
  }

  generateCacheKey(message) {
    return message.toLowerCase().replace(/[^\w\s]/gi, '').substring(0, 50);
  }

  isCommonQuestion(message) {
    const commonPhrases = [
      'what services',
      'what do you do',
      'about brandastic',
      'digital marketing',
      'website',
      'branding',
      'help me',
      'tell me about',
      'what type',
      'how can you help',
      'pricing',
      'cost',
      'budget'
    ];
    
    const lowerMessage = message.toLowerCase();
    return commonPhrases.some(phrase => lowerMessage.includes(phrase));
  }

  clearConversation(conversationId) {
    this.conversations.delete(conversationId);
  }

  // Health check method
  async healthCheck() {
    return {
      openaiConfigured: !this.fallbackMode,
      conversationsActive: this.conversations.size,
      cacheSize: this.cache.keys().length,
      timestamp: new Date().toISOString()
    };
  }
}