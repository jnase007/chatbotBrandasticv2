import express from 'express';
import { ChatService } from '../services/chatService.js';
import { validateChatInput } from '../middleware/validation.js';
import { logConversation } from '../middleware/logging.js';

const router = express.Router();
const chatService = new ChatService();

router.post('/message', validateChatInput, async (req, res) => {
  try {
    const { message, conversationId, context } = req.body;
    
    const response = await chatService.processMessage({
      message,
      conversationId,
      context,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });

    // Log conversation if enabled
    if (process.env.ENABLE_CONVERSATION_LOGGING === 'true') {
      logConversation({
        conversationId,
        userMessage: message,
        botResponse: response.message,
        timestamp: new Date().toISOString(),
        ip: req.ip
      });
    }

    res.json(response);
  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Fallback response for API failures
    res.status(500).json({
      message: "I'm having trouble right now, but I'd love to help! Let's schedule a call so we can discuss your needs directly.",
      type: 'error',
      suggestedAction: 'book_call',
      conversationId: req.body.conversationId
    });
  }
});

router.post('/reset', (req, res) => {
  const { conversationId } = req.body;
  
  if (conversationId) {
    chatService.clearConversation(conversationId);
  }
  
  res.json({ success: true });
});

export { router as chatRouter };