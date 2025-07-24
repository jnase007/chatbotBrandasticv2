import React from 'react';
import { ChatWidget } from './components/ChatWidget';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Demo page content */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Brandastic</h1>
          <p className="text-gray-600 mt-2">Digital Marketing & Web Design Agency</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Grow Your Business Online
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We help businesses succeed with comprehensive digital marketing, 
            web design, and e-commerce solutions. Our AI-powered chatbot is 
            here to answer your questions and help you get started.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Digital Marketing</h3>
            <p className="text-gray-600">
              Drive traffic and conversions with our data-driven PPC, SEO, 
              and social media strategies.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Web Design</h3>
            <p className="text-gray-600">
              Create stunning, mobile-responsive websites that convert 
              visitors into customers.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">E-commerce</h3>
            <p className="text-gray-600">
              Build and optimize online stores that drive sales and 
              provide exceptional user experiences.
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 mb-6">
            Try our AI chatbot below to learn more about our services or 
            schedule a consultation call with our team.
          </p>
          <div className="flex items-center justify-center text-sm text-blue-600">
            <span className="animate-pulse">💬 Chatbot available in bottom-right corner</span>
          </div>
        </div>
      </main>
      
      {/* Chatbot Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;