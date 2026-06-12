import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaLocationDot, FaPaperPlane } from 'react-icons/fa6';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-white min-h-screen pt-20">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-gray-900 mb-4"
          >
            Get In <span className="text-red-500">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto"
          >
            Have a question or feedback? We'd love to hear from you. Our team typically responds within 24 hours.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-8"
          >
            <div className="bg-gray-50 p-8 rounded-3xl space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center shrink-0">
                  <FaPhone className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Call Us</p>
                  <p className="text-lg font-medium text-gray-900">+1 (555) 000-0000</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center shrink-0">
                  <FaEnvelope className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Email Us</p>
                  <p className="text-lg font-medium text-gray-900">support@shopper.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center shrink-0">
                  <FaLocationDot className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Visit Us</p>
                  <p className="text-lg font-medium text-gray-900">123 Fashion Ave, Suite 456<br />New York, NY 10001</p>
                </div>
              </div>
            </div>

            <div className="h-64 rounded-3xl overflow-hidden shadow-sm border border-gray-100">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1715694200000!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="bg-white p-8 lg:p-12 border border-gray-100 rounded-3xl shadow-xl shadow-gray-100">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Your Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe" 
                    required
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com" 
                    required
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 transition-all outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2 mb-8">
                <label className="text-sm font-bold text-gray-700">Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?" 
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 transition-all outline-none"
                />
              </div>
              <div className="space-y-2 mb-8">
                <label className="text-sm font-bold text-gray-700">Message</label>
                <textarea 
                  rows="6" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..." 
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 transition-all outline-none resize-none"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full md:w-auto px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-red-500 transition-all transform hover:scale-105 flex items-center justify-center gap-3"
              >
                Send Message <FaPaperPlane className="text-sm" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
