# Deployment Guide

This guide covers deploying the Brandastic chatbot to production environments.

## Quick Deployment Options

### Option 1: Railway (Recommended for Backend)

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Initial chatbot setup"
   git push origin main
   ```

2. **Deploy on Railway**
   - Go to [Railway.app](https://railway.app)
   - Click "Deploy from GitHub"
   - Select your repository
   - Railway auto-detects Node.js and deploys

3. **Set Environment Variables**
   ```
   OPENAI_API_KEY=your_api_key
   NODE_ENV=production
   PORT=3001
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

### Option 2: Netlify (For Frontend)

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to Netlify
   - Or connect your GitHub repository

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-railway-url.com
   ```

## Complete Production Setup

### 1. Backend Deployment (Railway)

```bash
# Railway CLI (optional)
npm install -g @railway/cli
railway login
railway init
railway up
```

**Manual Deployment:**
1. Create Railway account
2. New Project → Deploy from GitHub
3. Select repository
4. Set environment variables:
   - `OPENAI_API_KEY`
   - `NODE_ENV=production`
   - `CORS_ORIGIN=https://brandastic.com`

### 2. Frontend Deployment (Netlify)

**Build Configuration:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_API_URL = "https://your-railway-app.railway.app"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Domain Configuration

**Backend (Railway):**
- Custom domain: `api.brandastic.com`
- SSL automatically provided

**Frontend (Netlify):**
- Custom domain: `chat.brandastic.com` or embed on main site

### 4. Environment Variables Setup

**Production `.env`:**
```bash
OPENAI_API_KEY=sk-your-production-key
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://brandastic.com,https://www.brandastic.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ENABLE_CONVERSATION_LOGGING=true
```

## Embedding on Brandastic.com

### Method 1: Direct Integration

Add to your main website's HTML:

```html
<!-- In <head> -->
<link rel="stylesheet" href="https://chat.brandastic.com/assets/index.css">

<!-- Before closing </body> -->
<script type="module" src="https://chat.brandastic.com/assets/index.js"></script>
```

### Method 2: WordPress Plugin

Create a simple WordPress plugin:

```php
<?php
/*
Plugin Name: Brandastic Chatbot
Description: Adds the Brandastic AI chatbot to your site
Version: 1.0
*/

function brandastic_chatbot_scripts() {
    wp_enqueue_script('brandastic-chatbot', 'https://chat.brandastic.com/embed.js', array(), '1.0', true);
    wp_enqueue_style('brandastic-chatbot', 'https://chat.brandastic.com/embed.css', array(), '1.0');
}
add_action('wp_enqueue_scripts', 'brandastic_chatbot_scripts');

function brandastic_chatbot_widget() {
    echo '<div id="brandastic-chatbot-root"></div>';
}
add_action('wp_footer', 'brandastic_chatbot_widget');
?>
```

### Method 3: Google Tag Manager

```javascript
// Custom HTML Tag
<script>
(function() {
  var chatbot = document.createElement('script');
  chatbot.src = 'https://chat.brandastic.com/embed.js';
  chatbot.async = true;
  document.head.appendChild(chatbot);
  
  var styles = document.createElement('link');
  styles.rel = 'stylesheet';
  styles.href = 'https://chat.brandastic.com/embed.css';
  document.head.appendChild(styles);
})();
</script>
```

## Performance Optimization

### 1. CDN Setup

**Cloudflare (Free):**
1. Add your domain to Cloudflare
2. Enable caching for static assets
3. Enable minification

### 2. Backend Optimization

```javascript
// server/index.js additions
import compression from 'compression';

app.use(compression());
```

### 3. Frontend Optimization

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          lucide: ['lucide-react']
        }
      }
    }
  }
});
```

## Monitoring Setup

### 1. Error Tracking (Sentry)

```bash
npm install @sentry/node @sentry/react
```

**Backend:**
```javascript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### 2. Analytics

**Google Analytics 4:**
```html
<!-- Add to your main site -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 3. Uptime Monitoring

**UptimeRobot (Free):**
- Monitor: `https://your-api-domain.com/health`
- Check every 5 minutes
- Email alerts on downtime

## Security Checklist

- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS configured for production domains only
- [ ] Rate limiting enabled
- [ ] API keys stored securely in environment variables
- [ ] Input validation implemented
- [ ] Error messages don't leak sensitive information
- [ ] Security headers configured (helmet.js)
- [ ] Dependencies updated and scanned for vulnerabilities

## Scaling Considerations

### Database Integration

For high volume, consider adding:

```javascript
// MongoDB for conversation storage
import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  conversationId: String,
  messages: Array,
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: Date.now, expires: 86400 } // 24 hours
});
```

### Redis Caching

```javascript
import redis from 'redis';

const client = redis.createClient(process.env.REDIS_URL);
```

### Load Balancing

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3001-3004:3001"
    deploy:
      replicas: 4
  nginx:
    image: nginx
    ports:
      - "80:80"
```

## Backup and Recovery

### 1. Code Backup
- Repository hosted on GitHub
- Automated backups via Railway/Netlify

### 2. Configuration Backup
```bash
# Export environment variables
railway variables > production.env
```

### 3. Data Backup
```javascript
// Conversation logs backup
const backupConversations = async () => {
  const conversations = await getConversations();
  await uploadToS3(conversations);
};
```

## Rollback Plan

1. **Keep previous deployment URL active**
2. **Environment variable rollback:**
   ```bash
   railway variables set OPENAI_API_KEY=previous_key
   ```
3. **DNS quick switch for emergencies**

## Cost Management

### OpenAI API Costs
- Set monthly spending limits in OpenAI dashboard
- Monitor usage via API
- Implement cost alerts

### Infrastructure Costs
- Railway: ~$5-20/month depending on usage
- Netlify: Free for basic usage
- Domain: ~$12-15/year

## Support and Maintenance

### Weekly Tasks
- [ ] Check error logs
- [ ] Review API usage and costs
- [ ] Update dependencies if needed
- [ ] Monitor performance metrics

### Monthly Tasks
- [ ] Review and update knowledge base
- [ ] Analyze conversation logs for improvements
- [ ] Update FAQ responses
- [ ] Performance optimization review

---

**Emergency Contacts:**
- Railway Support: [help@railway.app](mailto:help@railway.app)
- Netlify Support: [support@netlify.com](mailto:support@netlify.com)
- OpenAI Support: [help@openai.com](mailto:help@openai.com)