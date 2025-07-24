import React, { useState } from 'react';
import { X, Calendar, ExternalLink, CheckCircle } from 'lucide-react';

interface BookingFormProps {
  onClose: () => void;
  onComplete: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ onClose, onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    preferredTime: 'morning'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, send data to your booking service
      console.log('Booking request:', formData);
      
      setShowSuccess(true);
      
      // Auto-close after success
      setTimeout(() => {
        onComplete();
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Booking error:', error);
      alert('Sorry, there was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openGoogleCalendar = () => {
    window.open('https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3p_NsSPhRdrtKfXdzbe4Rx2wLyLmAgpRDg-QNcXIdg-91YlzqF7gF-_zuUKmppHexFZzsGvoyy', '_blank');
    onComplete();
  };

  if (showSuccess) {
    return (
      <div className="absolute inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center p-6">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Request Submitted!
          </h3>
          <p className="text-gray-600">
            We'll be in touch within 24 hours to schedule your consultation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-gray-50">
        <h3 className="font-semibold text-gray-900">Schedule Consultation</h3>
        <button
          onClick={onClose}
          className="hover:bg-gray-200 p-1 rounded"
          aria-label="Close booking form"
        >
          <X size={18} />
        </button>
      </div>

      {/* Calendar Integration Option */}
      <div className="p-4 bg-blue-50 border-b">
        <button
          onClick={openGoogleCalendar}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors"
        >
          <Calendar size={16} />
          <span>Book Directly on Calendar</span>
          <ExternalLink size={14} />
        </button>
        <p className="text-xs text-gray-600 mt-2 text-center">
          Or fill out the form below and we'll contact you
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your company"
            />
          </div>

          <div>
            <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Call Time
            </label>
            <select
              id="preferredTime"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="morning">Morning (9 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
              <option value="evening">Evening (5 PM - 7 PM)</option>
              <option value="flexible">I'm flexible</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Tell us about your project
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="What services are you interested in? What are your goals?"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !formData.name || !formData.email}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md font-medium transition-all"
          >
            {isSubmitting ? 'Submitting...' : 'Request Consultation'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            We'll contact you within 24 hours to schedule your free consultation
          </p>
        </form>
      </div>
    </div>
  );
};