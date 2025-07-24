# Brandastic Chatbot - GitHub Integration

This repository contains the client-side files for the Brandastic AI chatbot that can be easily integrated into any website.

## 📁 Files

- `brandastic-chatbot.css` - All styles for the chatbot widget
- `brandastic-chatbot.js` - Complete chatbot functionality
- `README.md` - This documentation

## 🚀 Quick Integration

### For WordPress Sites

Add to your theme's `functions.php`:

```php
function add_brandastic_chatbot() {
    wp_enqueue_style(
        'brandastic-chatbot-css',
        'https://your-username.github.io/your-repo/public/brandastic-chatbot.css',
        array(),
        '1.0.0'
    );
    
    wp_enqueue_script(
        'brandastic-chatbot-js',
        'https://your-username.github.io/your-repo/public/brandastic-chatbot.js',
        array(),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'add_brandastic_chatbot');
```

### For Any Website

Add before closing `</body>` tag:

```html
<link rel="stylesheet" href="https://your-username.github.io/your-repo/public/brandastic-chatbot.css">
<script src="https://your-username.github.io/your-repo/public/brandastic-chatbot.js" async></script>
```

## ⚙️ Configuration

The chatbot is pre-configured to work with:
- **API Endpoint**: `https://brandastic.com/chatbot-api`
- **Google Calendar**: Integrated booking system
- **Email**: Form submissions go to info@brandastic.com

## 🎨 Customization

Add before loading the script:

```html
<script>
window.BrandasticChatbotConfig = {
    primaryColor: '#2563eb',
    accentColor: '#0d9488',
    position: 'bottom-right'
};
</script>
```

## 📱 Features

- AI-powered conversations with Brandi
- Google Calendar booking integration
- Mobile responsive design
- Professional styling
- Quick action buttons
- Typing indicators
- Error handling

## 🔧 Backend Requirements

Requires a backend server running at `https://brandastic.com/chatbot-api` with the following endpoints:
- `POST /api/chat/message` - Chat functionality
- `POST /api/booking/schedule` - Booking form submissions

## 📄 License

Proprietary - Brandastic.com