# 🚀 Deploy Brandastic Chatbot to Your Server

## Overview
This guide will help you deploy the chatbot to your brandastic.com server and integrate it into your website.

## 📁 Files to Upload to Your Server

### 1. Backend API Files
Upload the entire `server/` directory to your brandastic.com server:

```
your-server/
├── chatbot-api/
│   ├── index.js
│   ├── package.json
│   ├── config/
│   ├── data/
│   ├── middleware/
│   ├── routes/
│   └── services/
└── public/
    └── embed.js
```

### 2. Recommended Server Structure
```
brandastic.com/
├── public_html/          (your main website)
│   ├── index.html
│   ├── embed.js          (place this here)
│   └── ...
└── chatbot-api/          (backend API - outside public_html for security)
    ├── server files...
    └── .env
```

## 🔧 Server Setup Steps

### Step 1: Upload Files
1. Upload `server/` folder to `/chatbot-api/` on your server
2. Upload `public/embed.js` to your website's public directory
3. Set proper file permissions (755 for directories, 644 for files)

### Step 2: Install Dependencies
SSH into your server and run:
```bash
cd /path/to/chatbot-api
npm install
```

### Step 3: Environment Configuration
Create `.env` file in `/chatbot-api/`:
```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=production

# Security Configuration
CORS_ORIGIN=https://brandastic.com,https://www.brandastic.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50

# Google Calendar
GOOGLE_CALENDAR_URL=https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3p_NsSPhRdrtKfXdzbe4Rx2wLyLmAgpRDg-QNcXIdg-91YlzqF7gF-_zuUKmppHexFZzsGvoyy

# Features
ENABLE_CONVERSATION_LOGGING=true
ENABLE_ERROR_REPORTING=false
```

### Step 4: Start the API Server
```bash
# Using PM2 (recommended for production)
npm install -g pm2
pm2 start index.js --name "brandastic-chatbot"
pm2 save
pm2 startup

# Or using nohup
nohup node index.js > chatbot.log 2>&1 &
```

### Step 5: Configure Reverse Proxy (Apache/Nginx)

#### For Apache (.htaccess in public_html):
```apache
# Chatbot API Proxy
RewriteEngine On
RewriteRule ^chatbot-api/(.*)$ http://localhost:3001/$1 [P,L]
ProxyPreserveHost On
```

#### For Nginx:
```nginx
location /chatbot-api/ {
    proxy_pass http://localhost:3001/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

## 🌐 Website Integration

### Add to Your Website Footer
Add this single line before the closing `</body>` tag:

```html
<script src="https://brandastic.com/embed.js" async></script>
```

### WordPress Integration
Add to your theme's `footer.php`:

```php
<!-- Brandastic Chatbot -->
<script src="<?php echo home_url('/embed.js'); ?>" async></script>
```

### Alternative: Functions.php Method
```php
function add_brandastic_chatbot() {
    wp_enqueue_script(
        'brandastic-chatbot',
        home_url('/embed.js'),
        array(),
        '1.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'add_brandastic_chatbot');
```

## 🔍 Testing Checklist

### 1. API Health Check
Visit: `https://brandastic.com/chatbot-api/health`
Should return: `{"status":"OK",...}`

### 2. Chatbot Widget Test
1. Visit your website
2. Look for chat button in bottom-right corner
3. Click to open chat
4. Send a test message
5. Verify response from Brandi

### 3. Email Integration Test
1. Use the booking form
2. Check that emails arrive at info@brandastic.com
3. Verify all form fields are included

## 🛡️ Security Considerations

### 1. File Permissions
```bash
# Set proper permissions
chmod 755 /path/to/chatbot-api
chmod 644 /path/to/chatbot-api/.env
chmod 644 /path/to/public_html/embed.js
```

### 2. Environment Variables
- Never commit `.env` to version control
- Use strong, unique API keys
- Regularly rotate credentials

### 3. Server Security
- Keep Node.js updated
- Use HTTPS only
- Configure firewall rules
- Monitor server logs

## 📊 Monitoring & Maintenance

### 1. Log Files
Monitor these logs:
- `/chatbot-api/chatbot.log` - Application logs
- Server access logs
- Error logs

### 2. PM2 Monitoring
```bash
pm2 status
pm2 logs brandastic-chatbot
pm2 restart brandastic-chatbot
```

### 3. Health Monitoring
Set up monitoring for:
- API endpoint availability
- Response times
- Error rates
- Email delivery

## 🚨 Troubleshooting

### Common Issues:

1. **Chat button not appearing**
   - Check browser console for JavaScript errors
   - Verify embed.js is loading correctly
   - Check file permissions

2. **API not responding**
   - Check if Node.js process is running
   - Verify port 3001 is available
   - Check firewall settings

3. **CORS errors**
   - Verify CORS_ORIGIN in .env includes your domain
   - Check reverse proxy configuration

4. **Emails not sending**
   - Check server email configuration
   - Verify SMTP settings
   - Check spam folders

### Debug Commands:
```bash
# Check if API is running
curl https://brandastic.com/chatbot-api/health

# Check PM2 status
pm2 status

# View logs
pm2 logs brandastic-chatbot --lines 50

# Restart if needed
pm2 restart brandastic-chatbot
```

## 📞 Support

If you need help with deployment:
1. Check the troubleshooting section above
2. Review server error logs
3. Test API endpoints directly
4. Verify all environment variables are set correctly

The chatbot is now ready to help your visitors learn about Brandastic's services and book consultations!