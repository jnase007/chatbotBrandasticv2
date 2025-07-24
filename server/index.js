import express from 'express';
import cors from 'cors';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import config from './config/environment.js';
import { chatRouter } from './routes/chat.js';
import { bookingRouter } from './routes/booking.js';
import { errorHandler, setupGlobalErrorHandlers } from './middleware/errorHandler.js';
import { securityMiddleware } from './middleware/security.js';
import { validateEnvironment } from './middleware/validation.js';

const app = express();

// Setup global error handlers
setupGlobalErrorHandlers();

// Validate environment on startup
validateEnvironment();

// Security middleware
securityMiddleware(app);

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  points: config.rateLimit.maxRequests,
  duration: config.rateLimit.windowMs / 1000, // Convert to seconds
});

app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    const retryAfter = Math.round(rejRes.msBeforeNext / 1000);
    res.status(429).json({
      error: 'Too many requests. Please try again later.',
      retryAfter,
      message: 'Rate limit exceeded. Please wait before making another request.'
    });
  }
});

// CORS configuration
app.use(cors(config.cors));

// Body parsing with limits
app.use(express.json({ 
  limit: '1mb',
  verify: (req, res, buf) => {
    // Basic JSON validation
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON format' });
      throw new Error('Invalid JSON');
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // You could add more health checks here (database, external APIs, etc.)
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      features: {
        openaiConfigured: !!config.openai.apiKey && config.openai.apiKey !== 'your_openai_api_key_here',
        conversationLogging: config.features.conversationLogging
      }
    };
    
    res.json(health);
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      message: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// API routes
app.use('/api/chat', chatRouter);
app.use('/api/booking', bookingRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} was not found.`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  
  // Close server
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Start server
const server = app.listen(config.port, () => {
  console.log(`🤖 Brandastic Chatbot Server running on port ${config.port}`);
  console.log(`🔧 Environment: ${config.nodeEnv}`);
  console.log(`🔑 OpenAI API Key configured: ${config.openai.apiKey ? 'Yes' : 'No'}`);
  console.log(`🛡️  Security features enabled`);
  console.log(`📊 Rate limiting: ${config.rateLimit.maxRequests} requests per ${config.rateLimit.windowMs/60000} minutes`);
  
  if (config.nodeEnv === 'development') {
    console.log(`🌐 CORS origin: ${config.cors.origin}`);
    console.log(`📅 Google Calendar URL configured: ${config.googleCalendar.bookingUrl ? 'Yes' : 'No'}`);
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;