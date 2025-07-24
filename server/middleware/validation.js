import { sanitizeInput } from './security.js';

export const validateChatInput = (req, res, next) => {
  const { message, conversationId } = req.body;
  
  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      error: 'Message is required and must be a string'
    });
  }
  
  if (message.length > 1000) {
    return res.status(400).json({
      error: 'Message too long. Please keep it under 1000 characters.'
    });
  }
  
  if (!conversationId || typeof conversationId !== 'string') {
    return res.status(400).json({
      error: 'Conversation ID is required'
    });
  }
  
  // Sanitize message input
  req.body.message = sanitizeInput(message);
  
  next();
};

export const validateBookingInput = (req, res, next) => {
  const { name, email } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      error: 'Valid name is required (minimum 2 characters)'
    });
  }
  
  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).json({
      error: 'Valid email address is required'
    });
  }
  
  // Sanitize inputs
  req.body.name = sanitizeInput(name.trim());
  req.body.email = email.trim().toLowerCase();
  req.body.phone = req.body.phone ? sanitizeInput(req.body.phone.trim()) : '';
  req.body.company = req.body.company ? sanitizeInput(req.body.company.trim()) : '';
  req.body.message = req.body.message ? sanitizeInput(req.body.message.trim()) : '';
  
  next();
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
};

export const validateEnvironment = () => {
  const errors = [];
  
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    errors.push('OPENAI_API_KEY is not properly configured');
  }
  
  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    errors.push('OPENAI_API_KEY should start with "sk-"');
  }
  
  if (errors.length > 0) {
    console.warn('⚠️  Environment validation warnings:');
    errors.forEach(error => console.warn(`   - ${error}`));
  }
  
  return errors.length === 0;
};