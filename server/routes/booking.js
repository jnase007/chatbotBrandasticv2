import express from 'express';
import { BookingService } from '../services/bookingService.js';
import { validateBookingInput } from '../middleware/validation.js';

const router = express.Router();
const bookingService = new BookingService();

router.post('/schedule', validateBookingInput, async (req, res) => {
  try {
    const { name, email, preferredTime, message, phone } = req.body;
    
    const result = await bookingService.scheduleConsultation({
      name,
      email,
      preferredTime,
      message,
      phone
    });

    res.json(result);
  } catch (error) {
    console.error('Booking API Error:', error);
    res.status(500).json({
      error: 'Unable to process booking request. Please try again or contact us directly.',
      contactInfo: {
        email: 'hello@brandastic.com',
        phone: '(555) 123-4567'
      }
    });
  }
});

router.get('/availability', async (req, res) => {
  try {
    const availability = await bookingService.getAvailability();
    res.json(availability);
  } catch (error) {
    console.error('Availability API Error:', error);
    res.status(500).json({
      error: 'Unable to fetch availability',
      fallback: 'Please contact us directly to schedule'
    });
  }
});

export { router as bookingRouter };