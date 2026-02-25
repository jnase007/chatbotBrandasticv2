(function() {
  'use strict';
  
  // Configuration
  const CHATBOT_CONFIG = {
    apiUrl: 'https://brandastic.com/chatbot-api', // Your brandastic.com server API endpoint
    containerId: 'brandastic-chatbot-container',
    version: '1.0.0'
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
    
    init: function() {
      if (this.initialized) return;
      
      this.loadStyles();
      this.createChatWidget();
      this.initialized = true;
      console.log('Brandastic Chatbot initialized v' + this.version);
    },
    
    loadStyles: function() {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'data:text/css;base64,' + btoa(`
        /* Brandastic Chatbot Styles */
        #brandastic-chatbot-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .brandastic-chat-button {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb 0%, #0d9488 100%);
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          color: white;
        }
        
        .brandastic-chat-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
        
        .brandastic-chat-button.open {
          background: #ef4444;
        }
        
        .brandastic-chat-window {
          position: absolute;
          bottom: 70px;
          right: 0;
          width: 380px;
          height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          display: none;
          flex-direction: column;
          overflow: hidden;
        }
        
        .brandastic-chat-window.open {
          display: flex;
        }
        
        .brandastic-chat-header {
          background: linear-gradient(135deg, #2563eb 0%, #0d9488 100%);
          color: white;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .brandastic-chat-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .brandastic-chat-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .brandastic-chat-info {
          line-height: 1.2;
        }
        
        .brandastic-chat-info h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          line-height: 1.2;
        }
        
        .brandastic-chat-info p {
          margin: 1px 0 0 0;
          font-size: 12px;
          opacity: 0.9;
          line-height: 1.2;
        }
        
        .brandastic-chat-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #f8fafc;
        }
        
        .brandastic-message {
          margin-bottom: 16px;
          display: flex;
        }
        
        .brandastic-message.user {
          justify-content: flex-end;
        }
        
        .brandastic-message-content {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .brandastic-message.bot .brandastic-message-content {
          background: white;
          color: #374151;
          border: 1px solid #e5e7eb;
        }
        
        .brandastic-message.user .brandastic-message-content {
          background: linear-gradient(135deg, #2563eb 0%, #0d9488 100%);
          color: white;
        }
        
        .brandastic-chat-input {
          padding: 16px;
          border-top: 1px solid #e5e7eb;
          background: white;
        }
        
        .brandastic-input-container {
          display: flex;
          gap: 8px;
        }
        
        .brandastic-input-container input {
          flex: 1;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 24px;
          outline: none;
          font-size: 14px;
        }
        
        .brandastic-input-container input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .brandastic-send-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb 0%, #0d9488 100%);
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .brandastic-send-button:hover {
          transform: scale(1.05);
        }
        
        .brandastic-send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        
        .brandastic-typing {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
        }
        
        .brandastic-typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #9ca3af;
          animation: brandastic-typing 1.4s infinite ease-in-out;
        }
        
        .brandastic-typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .brandastic-typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes brandastic-typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }
        
        .brandastic-book-button {
          background: #2563eb;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.2s ease;
        }
        
        .brandastic-book-button:hover {
          background: #1d4ed8;
        }
        
        /* Mobile Responsive */
        @media (max-width: 640px) {
          .brandastic-chat-window {
            width: calc(100vw - 40px);
            height: calc(100vh - 100px);
            bottom: 70px;
            right: 20px;
            left: 20px;
          }
        }
      `);
      document.head.appendChild(link);
    },
    
    createChatWidget: function() {
      // Create container
      const container = document.createElement('div');
      container.id = CHATBOT_CONFIG.containerId;
      container.innerHTML = `
        <button class="brandastic-chat-button" id="brandastic-chat-toggle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
        
        <div class="brandastic-chat-window" id="brandastic-chat-window">
          <div class="brandastic-chat-header">
            <div class="brandastic-chat-avatar">
              <img src="https://vnoqmswsvpzqztvpmmlq.supabase.co/storage/v1/object/public/images/brandbot.png" alt="Brandi" onerror="this.style.display='none'">
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
                Hey, I'm Brandi. How can I help you?
              </div>
            </div>
          </div>
          
          <div class="brandastic-chat-input">
            <div class="brandastic-input-container">
              <input type="text" id="brandastic-message-input" placeholder="Type your message..." />
              <button class="brandastic-send-button" id="brandastic-send-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22,2 15,22 11,13 2,9"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(container);
      this.bindEvents();
    },
    
    bindEvents: function() {
      const toggleButton = document.getElementById('brandastic-chat-toggle');
      const chatWindow = document.getElementById('brandastic-chat-window');
      const messageInput = document.getElementById('brandastic-message-input');
      const sendButton = document.getElementById('brandastic-send-button');
      
      let isOpen = false;
      let conversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      // Toggle chat
      toggleButton.addEventListener('click', function() {
        isOpen = !isOpen;
        toggleButton.classList.toggle('open', isOpen);
        chatWindow.classList.toggle('open', isOpen);
        
        if (isOpen) {
          messageInput.focus();
        }
      });
      
      // Send message
      const sendMessage = async function() {
        const message = messageInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, false);
        messageInput.value = '';
        sendButton.disabled = true;
        
        // Show typing indicator
        showTyping();
        
        try {
          const response = await fetch(CHATBOT_CONFIG.apiUrl + '/api/chat/message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: message,
              conversationId: conversationId,
              context: {
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                source: 'embed'
              }
            }),
          });
          
          const data = await response.json();
          hideTyping();
          addMessage(data.message, true, data.suggestedAction);
          
        } catch (error) {
          console.error('Chat error:', error);
          hideTyping();
          addMessage("I'm having trouble connecting right now, but I'd love to help! Please call us at (949) 617-2731 or email info@brandastic.com", true, 'book_call');
        } finally {
          sendButton.disabled = false;
        }
      };
      
      sendButton.addEventListener('click', sendMessage);
      
      messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendMessage();
        }
      });
      
      // Helper functions
      function addMessage(text, isBot, suggestedAction) {
        const messagesContainer = document.getElementById('brandastic-chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'brandastic-message ' + (isBot ? 'bot' : 'user');
        
        let content = `<div class="brandastic-message-content">${text}`;
        
        if (isBot && suggestedAction === 'book_call') {
          content += `<br><button class="brandastic-book-button" onclick="window.open('https://calendar.app.google/dEeGiuDU7yuGVQJW8', '_blank')">📅 Book a Call</button>`;
        }
        
        content += '</div>';
        messageDiv.innerHTML = content;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
      
      function showTyping() {
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
      }
      
      function hideTyping() {
        const typingIndicator = document.getElementById('brandastic-typing-indicator');
        if (typingIndicator) {
          typingIndicator.remove();
        }
      }
    }
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      window.BrandasticChatbot.init();
    });
  } else {
    window.BrandasticChatbot.init();
  }
})();