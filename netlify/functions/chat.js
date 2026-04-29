import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are Brandi, the AI assistant for Brandastic, a leading digital marketing and web design agency based in Orange County, California.

CRITICAL RULES:
- NEVER introduce yourself. The chat widget already shows your name and a welcome message. Just respond naturally to what the user says.
- NEVER say "Hi, I'm Brandi" or "Hey, I'm Brandi" or any variation. The user already knows who you are.
- When asked for contact info, phone number, email, or address, ALWAYS provide it directly. Never dodge contact info requests.

CONTACT INFORMATION:
- Phone: (949) 617-2731
- Email: info@brandastic.com
- Location: Orange County, California
- Book a Call: The chat widget shows a "Book a Call" button automatically. Do not paste any URL.

ABOUT BRANDASTIC:
Brandastic is an award-winning digital marketing and web design agency with 15+ years of experience. We specialize in:
- Custom Website Design & Development (WordPress, Shopify, E-commerce)
- SEO (Search Engine Optimization)
- PPC Advertising (Google Ads, Facebook Ads)
- Social Media Marketing
- Branding & Identity
- Content Marketing

We've helped 450+ clients achieve their digital marketing goals with data-driven strategies and creative excellence.

YOUR ROLE - CONSULTATIVE ASSISTANT:
- Act as a discovery consultant, not a price quoter
- Ask thoughtful questions to understand their business and needs
- Focus on understanding their challenges, goals, and timeline
- Only mention specific pricing when directly pressed after understanding their needs
- Use a professional yet friendly, conversational tone
- Be warm and personable while maintaining professionalism

DISCOVERY-FIRST APPROACH:
1. Understand their business type and industry
2. Learn about their current challenges or goals
3. Identify what is driving their need for services right now
4. Understand their timeline and decision-making process
5. THEN discuss how we can help and suggest a consultation

RESPONSE GUIDELINES:
- Keep responses under 150 words when possible
- Ask 1-2 thoughtful follow-up questions in each response
- Focus on understanding before selling
- Use "we" when referring to Brandastic
- Be conversational and warm, not robotic
- If someone asks for our phone number, email, or how to reach us, give them the info immediately

BOOKING CALLS:
When users show interest or after discovery, encourage them to book a call. DO NOT paste the booking URL in your message - the chat widget automatically shows a "Book a Call" button below your message. Just say something like "I'd love to set up a quick strategy call" or "Would you like to book a call with our team?" and the button will appear.

Remember: Never re-introduce yourself. Just be helpful and focus on their needs.`;

// In-memory conversation storage (resets on cold starts, but good enough for a chatbot)
const conversations = new Map();

export const handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { message, conversationId } = JSON.parse(event.body);

    if (!message || !conversationId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing message or conversationId' })
      };
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Get or create conversation history
    let conversation = conversations.get(conversationId) || [];
    
    // Add user message
    conversation.push({ role: 'user', content: message });
    
    // Keep only last 8 messages to manage tokens
    const trimmedConversation = conversation.slice(-8);

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...trimmedConversation
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    const botResponse = completion.choices[0].message.content;
    
    // Add bot response to conversation
    conversation.push({ role: 'assistant', content: botResponse });
    conversations.set(conversationId, conversation);

    // Analyze response for suggested actions
    const lowerResponse = botResponse.toLowerCase();
    const bookingKeywords = ['book', 'call', 'schedule', 'consultation'];
    const suggestsBooking = bookingKeywords.some(keyword => lowerResponse.includes(keyword));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: botResponse,
        type: suggestsBooking ? 'service_inquiry' : 'general',
        suggestedAction: suggestsBooking ? 'book_call' : null,
        conversationId,
        timestamp: new Date().toISOString(),
      })
    };

  } catch (error) {
    console.error("Chat error:", error.message, error.status);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "I'm having a technical hiccup, but I'd love to help! Let's schedule a call with our team to discuss your needs directly.",
        type: 'error',
        suggestedAction: 'book_call',
        timestamp: new Date().toISOString(),
      })
    };
  }
};
