import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['OPENAI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar] || process.env[envVar] === 'your_openai_api_key_here');

if (missingEnvVars.length > 0) {
  console.warn(`⚠️  Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.warn('Please check your .env file and ensure all required variables are set.');
}

export const config = {
  // Server configuration
  port: parseInt(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // OpenAI configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-3.5-turbo',
    maxTokens: 400,
    temperature: 0.7
  },
  
  // Security configuration
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'https://brandastic.com', 'https://www.brandastic.com'],
    credentials: true
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 50
  },
  
  // Google Calendar
  googleCalendar: {
    bookingUrl: process.env.GOOGLE_CALENDAR_URL || 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3p_NsSPhRdrtKfXdzbe4Rx2wLyLmAgpRDg-QNcXIdg-91YlzqF7gF-_zuUKmppHexFZzsGvoyy'
  },
  
  // Feature flags
  features: {
    conversationLogging: process.env.ENABLE_CONVERSATION_LOGGING === 'true',
    errorReporting: process.env.ENABLE_ERROR_REPORTING === 'true'
  }
};

// Validate OpenAI API key format
if (config.openai.apiKey && !config.openai.apiKey.startsWith('sk-')) {
  console.warn('⚠️  OpenAI API key should start with "sk-". Please verify your API key.');
}

export default config;