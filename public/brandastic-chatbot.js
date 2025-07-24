(function() {
  'use strict';
  
  // Configuration
  const CHATBOT_CONFIG = {
    apiUrl: 'https://brandastic.com/chatbot-api',
    containerId: 'brandastic-chatbot-container',
    version: '1.0.0',
    googleCalendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3p_NsSPhRdrtKfXdzbe4Rx2wLyLmAgpRDg-QNcXIdg-91YlzqF7gF-_zuUKmppHexFZzsGvoyy'
  };

  // Prevent multiple initializations
  if (window.BrandasticChatbot) {
    console.warn('Brandastic Chatbot already initialized');
    return;
  }

  // Create chatbot namespace
  window.BrandasticChatbot = {
    version: CHATBOT_CONFIG.version,
    initialized: false,
    isOpen: false,
    conversationId: 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    
    init: function() {
      if (this.initialized) return;
      
      this.createChatWidget();
      this.bindEvents();
      this.initialized = true;
      console.log('Brandastic Chatbot initialized v' + this.version);
    },
    
    createChatWidget: function() {
      // Create container
      const container = document.createElement('div');
      container.id = CHATBOT_CONFIG.containerId;
      container.innerHTML = `
        <button class="brandastic-chat-button" id="brandastic-chat-toggle" aria-label="Open chat">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <div class="brandastic-notification-badge"></div>
        </button>
        
        <div class="brandastic-chat-window" id="brandastic-chat-window">
          <div class="brandastic-chat-header">
            <div class="brandastic-chat-avatar">
              <img src="https://vnoqmswsvpzqztvpmmlq.supabase.co/storage/v1/object/public/images/brandbot.png" alt="Brandi" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div class="brandastic-chat-info">
              <h3>Brandi</h3>
              <p>Brandastic Assistant</p>
            </div>
          </div>
          
          <div class="brandastic-chat-messages" id="brandastic-chat-messages">
            <div class="brandastic-message bot">
              <div class="brandastic-message-content">
                Hi! I'm Brandi, and I'm here to help you explore how Brandastic can help grow your business. What type of business do you have, and what's your biggest challenge in attracting new customers right now?
              </div>
            </div>
          </div>
          
          <div class="brandastic-chat-input">
            <div class="brandastic-input-container">
              <input type="text" id="brandastic-message-input" placeholder="Type your message..." />
              <button class="brandastic-send-button" id="brandastic-send-button" aria-label="Send message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22,2 15,22 11,13 2,9"></polygon>
                </svg>
              </button>
            </div>
            <div class="brandastic-quick-actions">
              <button class="brandastic-quick-action" data-message="I need help with digital marketing">Marketing</button>
              <button class="brandastic-quick-action" data-message="I need a new website">Website</button>
              <button class="brandastic-quick-action" data-message="Tell me about your branding services">Branding</button>
              <button class="brandastic-quick-action" data-book="true">📅 Book Call</button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(container);
    },
    
    bindEvents: function() {
      const toggleButton = document.getElementById('brandastic-chat-toggle');
      const chatWindow = document.getElementById('brandastic-chat-window');
      const messageInput = document.getElementById('brandastic-message-input');
      const sendButton = document.getElementById('brandastic-send-button');
      const quickActions = document.querySelectorAll('.brandastic-quick-action');
      
      // Toggle chat
      toggleButton.addEventListener('click', () => {
        this.toggleChat();
      });
      
      // Send message
      const sendMessage = () => {
        this.sendMessage();
      };
      
      sendButton.addEventListener('click', sendMessage);
      
      messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendMessage();
        }
      });
      
      // Quick actions
      quickActions.forEach(action => {
        action.addEventListener('click', (e) => {
          if (e.target.dataset.book) {
            this.openBookingCalendar();
          } else {
            const message = e.target.dataset.message;
            messageInput.value = message;
            sendMessage();
          }
        });
      });
    },
    
    toggleChat: function() {
      const toggleButton = document.getElementById('brandastic-chat-toggle');
      const chatWindow = document.getElementById('brandastic-chat-window');
      const messageInput = document.getElementById('brandastic-message-input');
      const badge = document.querySelector('.brandastic-notification-badge');
      
      this.isOpen = !this.isOpen;
      toggleButton.classList.toggle('open', this.isOpen);
      chatWindow.classList.toggle('open', this.isOpen);
      
      if (this.isOpen) {
        messageInput.focus();
        if (badge) badge.style.display = 'none';
      }
    },
    
    sendMessage: async function() {
      const messageInput = document.getElementById('brandastic-message-input');
      const sendButton = document.getElementById('brandastic-send-button');
      const message = messageInput.value.trim();
      
      if (!message) return;
      
      // Add user message
      this.addMessage(message, false);
      messageInput.value = '';
      sendButton.disabled = true;
      
      // Show typing indicator
      this.showTyping();
      
      try {
        const response = await fetch(CHATBOT_CONFIG.apiUrl + '/api/chat/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            conversationId: this.conversationId,
            context: {
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              source: 'embed'
            }
          }),
        });
        
        const data = await response.json();
        this.hideTyping();
        this.addMessage(data.message, true, data.suggestedAction);
        
      } catch (error) {
        console.error('Chat error:', error);
        this.hideTyping();
        this.addMessage("I'm having trouble connecting right now, but I'd love to help! Please call us at (555) 123-4567 or email info@brandastic.com", true, 'book_call');
      } finally {
        sendButton.disabled = false;
      }
    },
    
    addMessage: function(text, isBot, suggestedAction) {
      const messagesContainer = document.getElementById('brandastic-chat-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = 'brandastic-message ' + (isBot ? 'bot' : 'user');
      
      let content = `<div class="brandastic-message-content">${this.escapeHtml(text)}`;
      
      if (isBot && suggestedAction === 'book_call') {
        content += `<br><button class="brandastic-book-button" onclick="window.BrandasticChatbot.openBookingCalendar()">📅 Book a Call</button>`;
      }
      
      content += '</div>';
      messageDiv.innerHTML = content;
      
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },
    
    showTyping: function() {
      const messagesContainer = document.getElementById('brandastic-chat-messages');
      const typingDiv = document.createElement('div');
      typingDiv.id = 'brandastic-typing-indicator';
      typingDiv.className = 'brandastic-message bot';
      typingDiv.innerHTML = `
        <div class="brandastic-message-content">
          <div class="brandastic-typing">
            <div class="brandastic-typing-dot"></div>
            <div class="brandastic-typing-dot"></div>
            <div class="brandastic-typing-dot"></div>
          </div>
        </div>
      `;
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },
    
    hideTyping: function() {
      const typingIndicator = document.getElementById('brandastic-typing-indicator');
      if (typingIndicator) {
        typingIndicator.remove();
      }
    },
    
    openBookingCalendar: function() {
      window.open(CHATBOT_CONFIG.googleCalendarUrl, '_blank');
      this.addMessage("Perfect! I've opened our booking calendar for you. Choose a time that works best, and we'll be in touch soon!", true);
    },
    
    escapeHtml: function(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },
    
    showNotification: function() {
      const badge = document.querySelector('.brandastic-notification-badge');
      if (badge && !this.isOpen) {
        badge.style.display = 'block';
      }
    },
    
    hideNotification: function() {
      const badge = document.querySelector('.brandastic-notification-badge');
      if (badge) {
        badge.style.display = 'none';
      }
    },
    
    // Public API methods
    open: function() {
      if (!this.isOpen) {
        this.toggleChat();
      }
    },
    
    close: function() {
      if (this.isOpen) {
        this.toggleChat();
      }
    },
    
    sendCustomMessage: function(message) {
      const messageInput = document.getElementById('brandastic-message-input');
      if (messageInput) {
        messageInput.value = message;
        this.sendMessage();
      }
    },
    
    // Configuration override
    configure: function(options) {
      if (options.apiUrl) CHATBOT_CONFIG.apiUrl = options.apiUrl;
      if (options.googleCalendarUrl) CHATBOT_CONFIG.googleCalendarUrl = options.googleCalendarUrl;
      if (options.primaryColor) {
        document.documentElement.style.setProperty('--brandastic-primary', options.primaryColor);
      }
      if (options.accentColor) {
        document.documentElement.style.setProperty('--brandastic-accent', options.accentColor);
      }
    }
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // Check for configuration
      if (window.BrandasticChatbotConfig) {
        window.BrandasticChatbot.configure(window.BrandasticChatbotConfig);
      }
      window.BrandasticChatbot.init();
    });
  } else {
    // Check for configuration
    if (window.BrandasticChatbotConfig) {
      window.BrandasticChatbot.configure(window.BrandasticChatbotConfig);
    }
    window.BrandasticChatbot.init();
  }
})();