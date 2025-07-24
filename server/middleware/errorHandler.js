export const errorHandler = (err, req, res, next) => {
  // Log error details for debugging
  console.error('Server Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Determine error type and appropriate response
  let statusCode = err.status || 500;
  let message = 'Internal server error';
  
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Invalid input data';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized access';
  } else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Service temporarily unavailable';
  } else if (isDevelopment) {
    message = err.message;
  }
  
  res.status(statusCode).json({
    error: message,
    ...(isDevelopment && { 
      stack: err.stack,
      details: err 
    })
  });
};

// Global error handlers
export const setupGlobalErrorHandlers = () => {
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // In production, you might want to restart the process
    if (process.env.NODE_ENV === 'production') {
      console.error('Shutting down due to uncaught exception');
      process.exit(1);
    }
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // In production, you might want to restart the process
    if (process.env.NODE_ENV === 'production') {
      console.error('Shutting down due to unhandled rejection');
      process.exit(1);
    }
  });
};