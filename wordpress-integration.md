# WordPress Integration Guide for Brandastic Chatbot

## 📁 Files to Upload to GitHub

Upload these files to your GitHub repository:

```
your-repo/
├── public/
│   ├── brandastic-chatbot.css
│   ├── brandastic-chatbot.js
│   └── README.md
└── wordpress-integration.md
```

## 🚀 WordPress Integration Methods

### Method 1: Theme Files (Recommended)

Add to your theme's `functions.php`:

```php
function add_brandastic_chatbot() {
    // Enqueue CSS
    wp_enqueue_style(
        'brandastic-chatbot-css',
        'https://your-github-username.github.io/your-repo/public/brandastic-chatbot.css',
        array(),
        '1.0.0'
    );
    
    // Enqueue JavaScript
    wp_enqueue_script(
        'brandastic-chatbot-js',
        'https://your-github-username.github.io/your-repo/public/brandastic-chatbot.js',
        array(),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'add_brandastic_chatbot');
```

### Method 2: Direct HTML in Footer

Add to your theme's `footer.php` before `</body>`:

```html
<!-- Brandastic Chatbot -->
<link rel="stylesheet" href="https://your-github-username.github.io/your-repo/public/brandastic-chatbot.css">
<script src="https://your-github-username.github.io/your-repo/public/brandastic-chatbot.js" async></script>
```

### Method 3: WordPress Plugin

Create a simple plugin file `brandastic-chatbot.php`:

```php
<?php
/*
Plugin Name: Brandastic Chatbot
Description: Adds the Brandastic AI chatbot to your website
Version: 1.0.0
*/

function brandastic_chatbot_enqueue_scripts() {
    wp_enqueue_style(
        'brandastic-chatbot-css',
        'https://your-github-username.github.io/your-repo/public/brandastic-chatbot.css',
        array(),
        '1.0.0'
    );
    
    wp_enqueue_script(
        'brandastic-chatbot-js',
        'https://your-github-username.github.io/your-repo/public/brandastic-chatbot.js',
        array(),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'brandastic_chatbot_enqueue_scripts');

// Optional: Add admin settings page
function brandastic_chatbot_admin_menu() {
    add_options_page(
        'Brandastic Chatbot Settings',
        'Chatbot Settings',
        'manage_options',
        'brandastic-chatbot',
        'brandastic_chatbot_settings_page'
    );
}
add_action('admin_menu', 'brandastic_chatbot_admin_menu');

function brandastic_chatbot_settings_page() {
    ?>
    <div class="wrap">
        <h1>Brandastic Chatbot Settings</h1>
        <p>The chatbot is active on your website. You can customize it by modifying the configuration in your theme files.</p>
        <h3>Current Status:</h3>
        <ul>
            <li>✅ CSS Loaded</li>
            <li>✅ JavaScript Loaded</li>
            <li>✅ API Connected to brandastic.com</li>
        </ul>
    </div>
    <?php
}
?>
```

## 🔧 GitHub Pages Setup

1. **Push files to GitHub**
2. **Enable GitHub Pages** in repository settings
3. **Use the URLs** in your WordPress integration:
   - CSS: `https://your-username.github.io/your-repo/public/brandastic-chatbot.css`
   - JS: `https://your-username.github.io/your-repo/public/brandastic-chatbot.js`

## 🎨 Customization Options

You can customize the chatbot by adding this before loading the script:

```html
<script>
window.BrandasticChatbotConfig = {
    primaryColor: '#2563eb',
    accentColor: '#0d9488',
    apiUrl: 'https://your-custom-api-url.com', // Override default API URL
    googleCalendarUrl: 'https://your-custom-calendar-url.com' // Override calendar URL
};
</script>
```

## ✅ Testing Checklist

- [ ] Files uploaded to GitHub
- [ ] GitHub Pages enabled
- [ ] CSS and JS files accessible via URLs
- [ ] WordPress integration added
- [ ] Chatbot appears on website
- [ ] Chat functionality works
- [ ] Booking calendar opens
- [ ] Mobile responsive design works
- [ ] No console errors

## 📱 Features Included

- ✅ Professional chat widget
- ✅ AI-powered conversations with Brandi
- ✅ Google Calendar booking integration
- ✅ Email notifications to info@brandastic.com
- ✅ Mobile responsive design
- ✅ Quick action buttons
- ✅ Typing indicators
- ✅ Accessibility features
- ✅ Error handling

## 🛠️ Backend Requirements

Make sure your backend server is running at:
- **Development**: `http://localhost:3001`
- **Production**: `https://brandastic.com/chatbot-api`

The JavaScript file is configured to use `https://brandastic.com/chatbot-api` as the API endpoint.

## 📞 Support

If you need help:
1. Check browser console for errors
2. Verify GitHub Pages URLs are accessible
3. Ensure backend API is running
4. Test on different devices and browsers