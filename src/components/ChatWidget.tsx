import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Calendar, ExternalLink } from 'lucide-react';
import { ChatService } from '../services/chatService';
import { BookingForm } from './BookingForm';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'text' | 'booking_prompt' | 'error' | 'service_inquiry' | 'service_info' | 'general' | 'discovery';
  suggestedAction?: 'book_call' | 'learn_more' | null;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [conversationId] = useState(() => `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatService = new ChatService();

  // Initial bot message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: "Hi! I'm Brandi, and I'm here to help you explore how Brandastic can help grow your business. What type of business do you have, and what's your biggest challenge in attracting new customers right now?",
        isBot: true,
        timestamp: new Date(),
        type: 'discovery'
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !showBookingForm) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, showBookingForm]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(inputValue, conversationId);
      
      // Determine if this is actually an error or just a fallback response
      const isActualError = response.type === 'error' && response.message.includes('trouble connecting');
      
      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        text: response.message,
        isBot: true,
        timestamp: new Date(),
        type: isActualError ? 'error' : (response.type || 'text'),
        suggestedAction: response.suggestedAction
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        text: "I'm having trouble connecting right now, but I'd love to help! Let's schedule a call so we can discuss your needs directly.",
        isBot: true,
        timestamp: new Date(),
        type: 'error',
        suggestedAction: 'book_call'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBookingClick = () => {
    setShowBookingForm(true);
  };

  const handleBookingComplete = () => {
    setShowBookingForm(false);
    
    const confirmationMessage: Message = {
      id: `booking_${Date.now()}`,
      text: "Perfect! I've opened our booking calendar for you. Choose a time that works best, and we'll be in touch soon!",
      isBot: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, confirmationMessage]);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Widget Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className={`
            w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110
            ${isOpen 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700'
            }
            flex items-center justify-center text-white
          `}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>

        {/* Unread indicator */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border z-40 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
                <img 
                  src="https://vnoqmswsvpzqztvpmmlq.supabase.co/storage/v1/object/public/images//brandbot.png" 
                  alt="Brandi - Brandastic Assistant"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-white/20 rounded-full hidden items-center justify-center">
                  <MessageCircle size={16} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Brandi</h3>
                <p className="text-xs opacity-90">Brandastic Assistant</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="hover:bg-white/20 p-1 rounded"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Booking Form Overlay */}
          {showBookingForm && (
            <BookingForm
              onClose={() => setShowBookingForm(false)}
              onComplete={handleBookingComplete}
            />
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`
                    max-w-[80%] rounded-lg px-4 py-2 text-sm
                    ${message.isBot
                      ? message.type === 'error'
                        ? 'bg-orange-50 text-orange-800 border border-orange-200'
                        : 'bg-white text-gray-800 shadow-sm border'
                      : 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                    }
                  `}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  
                  {/* Action Buttons */}
                  {message.isBot && message.suggestedAction === 'book_call' && (
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={handleBookingClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs flex items-center space-x-1 transition-colors"
                      >
                        <Calendar size={12} />
                        <span>Book a Call</span>
                      </button>
                    </div>
                  )}
                  
                  <p className="text-xs opacity-60 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-lg px-4 py-2 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-md transition-all"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => setInputValue("I need help with digital marketing")}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md text-gray-600 transition-colors"
              >
                Marketing
              </button>
              <button
                onClick={() => setInputValue("I need a new website")}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md text-gray-600 transition-colors"
              >
                Website
              </button>
              <button
                onClick={handleBookingClick}
                className="text-xs bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded-md text-blue-600 transition-colors"
              >
                Book Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 640px) {
          .fixed.bottom-24.right-6 {
            width: calc(100vw - 2rem);
            height: calc(100vh - 6rem);
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
          }
        }
      `}</style>
    </>
  );
};