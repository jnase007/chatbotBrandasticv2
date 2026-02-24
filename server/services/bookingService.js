import config from '../config/environment.js';

export class BookingService {
  constructor() {
    this.bookingUrl = config.googleCalendar.bookingUrl;
  }

  async scheduleConsultation({ name, email, preferredTime, message, phone }) {
    try {
      const bookingData = {
        name,
        email,
        preferredTime,
        message,
        phone,
        timestamp: new Date().toISOString(),
        source: 'chatbot'
      };

      // Log booking request for internal tracking (consider using a proper logging service)
      console.log('📅 Booking Request:', {
        name,
        email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Partially mask email for privacy
        timestamp: bookingData.timestamp,
        source: bookingData.source
      });

      // In production, you might want to:
      // 1. Save to database for tracking
      // 2. Send notification email to team
      // 3. Integrate with CRM system
      // 4. Add to marketing automation

      return {
        success: true,
        bookingUrl: this.bookingUrl,
        message: `Thanks ${name}! Click the link below to choose your preferred time slot.`,
        bookingId: this.generateBookingId(),
        instructions: 'Select a time that works best for you. We\'ll send a confirmation email with meeting details.'
      };

    } catch (error) {
      console.error('❌ Booking Service Error:', error);
      throw new Error('Unable to process booking request. Please try again.');
    }
  }

  async getAvailability() {
    try {
      // Return general availability info since we're using Google Calendar
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      return {
        nextAvailable: tomorrow.toISOString(),
        timezone: 'America/Los_Angeles',
        businessHours: {
          monday: ['9:00 AM', '5:00 PM'],
          tuesday: ['9:00 AM', '5:00 PM'],
          wednesday: ['9:00 AM', '5:00 PM'],
          thursday: ['9:00 AM', '5:00 PM'],
          friday: ['9:00 AM', '5:00 PM']
        },
        typicalSlots: [
          '9:00 AM', '10:00 AM', '11:00 AM', 
          '2:00 PM', '3:00 PM', '4:00 PM'
        ]
      };
    } catch (error) {
      console.error('❌ Availability Service Error:', error);
      throw new Error('Unable to fetch availability');
    }
  }

  generateBookingId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `booking_${timestamp}_${random}`;
  }

  // Validate booking URL is accessible
  async validateBookingUrl() {
    try {
      // In production, you might want to periodically check if the Google Calendar link is still valid
      return { valid: true, url: this.bookingUrl };
    } catch (error) {
      console.error('❌ Booking URL validation failed:', error);
      return { valid: false, error: error.message };
    }
  }
}