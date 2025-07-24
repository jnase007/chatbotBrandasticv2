import nodemailer from 'nodemailer';
import config from '../config/environment.js';

export class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    // For development, use a test account or console logging
    if (config.nodeEnv === 'development') {
      console.log('📧 Email Service: Development mode - emails will be logged to console');
      return null;
    }

    // For production, configure with your email service
    // This example uses Gmail SMTP, but you can use any email service
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendBookingNotification(bookingData) {
    const { name, email, phone, company, message, preferredTime } = bookingData;
    
    const emailContent = {
      from: process.env.EMAIL_FROM || 'noreply@brandastic.com',
      to: 'info@brandastic.com',
      subject: `New Consultation Request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Consultation Request</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            <p><strong>Preferred Time:</strong> ${this.formatPreferredTime(preferredTime)}</p>
          </div>

          ${message ? `
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Project Details</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
          ` : ''}

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Next Steps</h3>
            <ul>
              <li>Contact the lead within 24 hours</li>
              <li>Schedule consultation call</li>
              <li>Add to CRM system</li>
              <li>Send calendar invite</li>
            </ul>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; color: #6b7280; font-size: 14px;">
            <p><strong>Source:</strong> Brandastic Chatbot</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Lead ID:</strong> ${this.generateLeadId()}</p>
          </div>
        </div>
      `,
      text: `
New Consultation Request

Contact Information:
Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
${company ? `Company: ${company}` : ''}
Preferred Time: ${this.formatPreferredTime(preferredTime)}

${message ? `Project Details:\n${message}\n` : ''}

Source: Brandastic Chatbot
Submitted: ${new Date().toLocaleString()}
      `
    };

    try {
      if (config.nodeEnv === 'development') {
        // In development, log the email content
        console.log('📧 Email would be sent to info@brandastic.com:');
        console.log('Subject:', emailContent.subject);
        console.log('Content:', emailContent.text);
        return { success: true, messageId: 'dev-mode' };
      }

      // In production, send the actual email
      const result = await this.transporter.sendMail(emailContent);
      console.log('📧 Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };

    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw new Error('Failed to send notification email');
    }
  }

  formatPreferredTime(preferredTime) {
    const timeMap = {
      'morning': 'Morning (9 AM - 12 PM)',
      'afternoon': 'Afternoon (12 PM - 5 PM)',
      'evening': 'Evening (5 PM - 7 PM)',
      'flexible': 'Flexible'
    };
    return timeMap[preferredTime] || preferredTime;
  }

  generateLeadId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6);
    return `LEAD_${timestamp}_${random}`.toUpperCase();
  }

  // Test email configuration
  async testEmailConfiguration() {
    try {
      if (!this.transporter) {
        return { success: false, message: 'Email service not configured for development' };
      }

      await this.transporter.verify();
      return { success: true, message: 'Email configuration is valid' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}