# Brandastic ChatGPT Chatbot

A production-ready chatbot system for Brandastic.com that integrates with the ChatGPT API to assist clients with service inquiries and consultation booking.

## Features

- **AI-Powered Conversations**: Uses OpenAI's GPT-3.5-turbo for natural language understanding
- **Service Knowledge Base**: Pre-loaded with Brandastic's service information
- **Booking Integration**: Direct Google Calendar integration for consultation scheduling
- **Professional Design**: Modern, responsive widget matching Brandastic's aesthetic
- **Security & Privacy**: Rate limiting, input validation, and data privacy compliance
- **Mobile Responsive**: Optimized for all device sizes
- **Error Handling**: Graceful fallbacks and error recovery
- **Performance Optimized**: Response caching and API cost optimization

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for build tooling

### Backend
- Node.js with Express
- OpenAI API integration
- Rate limiting and security middleware
- Response caching with node-cache

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- OpenAI API key
- Google Calendar booking link

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# OpenAI Configuration (REQUIRED)
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# Security
CORS_ORIGIN=http://localhost:5173
```

### 2. Installation

```bash
# Install dependencies
npm install
```

### 3. Getting Your OpenAI API Key

1. Go to [OpenAI's website](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to the [API Keys section](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key and add it to your `.env` file

### 4. Google Calendar Setup

Update the Google Calendar booking link in `server/services/bookingService.js` (line 18) with your actual booking URL.

### 5. Running the Application

#### Development Mode

Terminal 1 - Backend Server:
```bash
npm run dev:server
```

Terminal 2 - Frontend:
```bash
npm run dev
```

#### Production Mode

```bash
# Build the frontend
npm run build

# Start the backend server
npm run start:server
```

## Deployment

### Frontend Deployment (Netlify/Vercel)

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your preferred hosting service
3. Update the `VITE_API_URL` environment variable to point to your backend server

### Backend Deployment (Railway/Heroku/DigitalOcean)

1. Deploy the entire project to your server platform
2. Set environment variables in your hosting dashboard
3. Ensure your `CORS_ORIGIN` includes your frontend domain

### Embedding on Brandastic.com

#### Option 1: Direct Integration
Copy the built files from `dist/` to your website and include:

```html
<script type="module" src="/assets/index-[hash].js"></script>
<link rel="stylesheet" href="/assets/index-[hash].css">
```

#### Option 2: Script Tag Integration
Host the chatbot separately and embed via script tag:

```html
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://your-chatbot-domain.com/embed.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>
```

## Configuration

### Customizing the Knowledge Base

Edit `server/data/knowledgeBase.js` to update:
- Service descriptions
- FAQ responses
- Company information
- Discovery questions

### Modifying the System Prompt

Update the system prompt in `server/services/chatService.js` to adjust Brandi's personality and responses.

### Styling Customization

Update colors and styling in:
- `src/components/ChatWidget.tsx` - Main widget styles
- `tailwind.config.js` - Global theme configuration

### Updating Google Calendar Link

Update the booking URL in `server/services/bookingService.js` with your Google Calendar appointment scheduling link.

## API Endpoints

### Chat API
- `POST /api/chat/message` - Send message to chatbot
- `POST /api/chat/reset` - Reset conversation

### Booking API
- `POST /api/booking/schedule` - Schedule consultation
- `GET /api/booking/availability` - Get available time slots

## Monitoring and Analytics

### Conversation Logging

The system logs anonymized conversation data for improvement. Configure in `.env`:

```bash
ENABLE_CONVERSATION_LOGGING=true
```

### API Usage Monitoring

Monitor OpenAI API usage in your [OpenAI dashboard](https://platform.openai.com/usage).

### Error Tracking

Production errors are logged to the console. Consider integrating services like:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage analytics

## Security Features

- **Rate Limiting**: 50 requests per 15 minutes per IP
- **Input Validation**: XSS prevention and input sanitization
- **CORS Protection**: Configurable origin restrictions
- **Environment Variables**: Secure API key storage
- **Data Privacy**: Conversation logging with IP anonymization

## Cost Optimization

- **Response Caching**: Common queries cached for 1 hour
- **Token Limits**: Responses limited to 400 tokens
- **Conversation Pruning**: Only last 10 messages kept in context
- **Smart Fallbacks**: Reduced API calls through intelligent routing

## Troubleshooting

### Common Issues

1. **"OpenAI API Key not configured"**
   - Ensure your `.env` file contains `OPENAI_API_KEY`
   - Restart the server after adding the key

2. **CORS Errors**
   - Check `CORS_ORIGIN` in `.env` matches your frontend URL
   - Ensure both frontend and backend are running

3. **Rate Limit Exceeded**
   - Default: 50 requests per 15 minutes
   - Adjust in `.env`: `RATE_LIMIT_MAX_REQUESTS=100`

4. **Booking Form Not Working**
   - Update Google Calendar URL in `server/services/bookingService.js`
   - Check network requests in browser developer tools

### Performance Issues

- Check OpenAI API response times
- Monitor memory usage with conversation caching
- Consider implementing Redis for production caching

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software for Brandastic.com. All rights reserved.

## Support

For support with setup or customization:
- Email: dev@brandastic.com
- Documentation: [Internal Wiki](https://wiki.brandastic.com/chatbot)

---

**Production Checklist:**
- [ ] OpenAI API key configured
- [ ] CORS origins set for production domains
- [ ] Rate limiting configured appropriately
- [ ] Error monitoring setup
- [ ] Conversation logging configured
- [ ] Google Calendar booking link updated
- [ ] Mobile responsiveness verified
- [ ] Security headers implemented
- [ ] Performance optimization tested
- [ ] Backup and recovery plan in place