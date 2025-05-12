"use client";

import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';
import ContactGameSection from './ContactGameSection';

type FormState = {
  name: string;
  email: string;
  message: string;
};

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactSection() {
  // Use ref for focus management and scrolling
  const sectionRef = useRef<HTMLElement>(null);
  
  // Ensure section stays in view when focused
  useEffect(() => {
    const handleFocus = () => {
      // Prevent any automatic scrolling when the section receives focus
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    
    const section = sectionRef.current;
    if (section) {
      section.addEventListener('focus', handleFocus);
      return () => section.removeEventListener('focus', handleFocus);
    }
  }, []);

  // Form state
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    message: ''
  });
  
  // Form status for showing feedback to user
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };    // Handle form submission with improved error handling and feedback
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    // Ensure the section is in focus/view
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill out all fields');
      
      // Reset error status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
      return;
    }
    
    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      
      // Reset error status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
      return;
    }
    
    // Set status to submitting to show loading state
    setStatus('submitting');
    
    try {
      // Submit the form data to the API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      // Parse the response
      let data;      try {
        data = await response.json();
      } catch (_error) {
        throw new Error('Invalid response from server');
      }
      
      // Handle non-successful responses
      if (!response.ok) {
        throw new Error(data?.error || 'Something went wrong! Please try again later.');
      }
      
      // Success - clear form and show success message
      setFormData({ name: '', email: '', message: '' });
      setStatus('success');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
      
      // Reset error status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    }
  };
  
  // Status indicator component
  const StatusIndicator = () => {
    switch (status) {
      case 'submitting':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center bg-blue-500/10 text-blue-400 p-4 rounded-lg mb-4"
          >
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending your message...
          </motion.div>
        );
        
      case 'success':
        return (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-green-500/10 text-green-400 p-4 rounded-lg mb-4"
          >
            <Check className="shrink-0" />
            <span>Your message has been sent! I&apos;ll get back to you soon.</span>
          </motion.div>
        );
        
      case 'error':
        return (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-red-500/10 text-red-400 p-4 rounded-lg mb-4"
          >
            <AlertCircle className="shrink-0" />
            <span>{errorMessage || 'Failed to send message. Please try again.'}</span>
          </motion.div>
        );
        
      default:
        return null;    }
  };
    // Component continues
  
  return (    <section 
      ref={sectionRef}
      id="contact" 
      className="py-20 bg-[rgb(38,43,61)] relative isolate z-10 overflow-visible border-0" 
      style={{ 
        scrollMarginTop: '8rem', // Single consistent value for better positioning
        contain: 'paint' // Improves rendering performance and isolation
      }}
      data-section-id="contact"
      tabIndex={-1} // Makes the section focusable
    >
      {/* Single anchor at a fixed position for reliable navigation */}
      <div id="contact-anchor" className="absolute top-[-100px] left-0 right-0 h-1 w-full pointer-events-none"></div>
      <div className="container mx-auto px-4">
        <div className="w-full">
          {/* Section title - simplified animation */}
          <div className="mb-16 relative">
            <h2 className="text-4xl md:text-5xl font-bold text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                Contact Me
              </span>
            </h2>
            
            <div className="h-1 w-24 bg-blue-500/50 rounded-full mx-auto mt-4" />
          </div>
          
          <motion.p 
            className="text-gray-400 text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Got a question or proposal, or just want to say hello?
            <br className="hidden sm:block" />
            Feel free to reach out to me through the form below.
          </motion.p>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Contact Information */}            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >              <div className="bg-[rgb(30,35,50)]/95 backdrop-blur-sm p-8 rounded-2xl border-0 h-full min-h-[600px] overflow-y-auto">
                {/* Game section with improved container background */}
                <ContactGameSection />
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div 
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-[rgb(38,43,61)]/80 backdrop-blur-sm p-8 rounded-2xl border-0">
                <h3 className="text-2xl font-semibold text-white mb-6">Send me a message</h3>
                
                {/* Status message */}
                <StatusIndicator />
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>                      <label htmlFor="name" className="block text-sm text-gray-400 mb-1">Name</label>
                      <input 
                        id="name" 
                        name="name" 
                        type="text" 
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={status === 'submitting'}
                        className="w-full p-3 bg-[rgb(38,43,61)] border-0 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none text-white"
                      />
                    </div>
                    
                    <div>                      <label htmlFor="email" className="block text-sm text-gray-400 mb-1">Email</label>
                      <input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={status === 'submitting'}
                        className="w-full p-3 bg-[rgb(38,43,61)] border-0 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none text-white"
                      />
                    </div>
                  </div>
                  
                  <div>                    <label htmlFor="message" className="block text-sm text-gray-400 mb-1">Message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={status === 'submitting'}
                      className="w-full p-3 bg-[rgb(38,43,61)] border-0 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none text-white resize-none"
                    ></textarea>
                  </div>
                  
                  <div>
                    <button 
                      type="submit"
                      disabled={status === 'submitting'}
                      className={`w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${status === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <span>{status === 'submitting' ? 'Sending...' : 'Send Message'}</span>
                      {status !== 'submitting' && <ArrowRight size={18} />}
                    </button>
                  </div>
                </form>
              </div>            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}