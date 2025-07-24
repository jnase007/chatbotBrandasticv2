export class ChatService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || '';
  }

  async sendMessage(message: string, conversationId: string) {
    const response = await fetch(`${this.apiUrl}/api/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationId,
        context: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async resetConversation(conversationId: string) {
    const response = await fetch(`${this.apiUrl}/api/chat/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversationId }),
    });

    return response.json();
  }
}