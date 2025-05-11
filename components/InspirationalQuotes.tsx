"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// List of 10 inspirational quotes
const quotes = [
  "Carpe Diem - Seize the day.",
  "The journey of a thousand miles begins with a single step.",
  "Be the change you wish to see in the world.",
  "What you seek is seeking you.",
  "All our dreams can come true, if we have the courage to pursue them.",
  "Believe you can and you're halfway there.",
  "The only way to do great work is to love what you do.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Life is what happens when you're busy making other plans."
];

const InspirationalQuotes = () => {
  // State to track the current quote index
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  // State for fade animation
  const [isVisible, setIsVisible] = useState(true);

  // Effect to cycle through quotes at regular intervals
  useEffect(() => {
    // First fade out the current quote
    const fadeOutTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 5000); // Show each quote for 5 seconds before starting to fade out
    
    // Then change the quote and fade in the new one
    const changeQuoteTimeout = setTimeout(() => {
      // Go to the next quote, or back to the first after the 10th
      setQuoteIndex(prevIndex => {
        if (prevIndex === quotes.length - 1) {
          return 0; // Loop back to the first quote after the 10th
        }
        return prevIndex + 1;
      });
      
      // Make the new quote visible
      setIsVisible(true);
    }, 5500); // Change quote and fade in 0.5 seconds after fade out starts
    
    // Cleanup timeouts on component unmount or before next effect run
    return () => {
      clearTimeout(fadeOutTimeout);
      clearTimeout(changeQuoteTimeout);
    };
  }, [quoteIndex]);

  return (
    <div className="py-10 bg-gradient-to-br from-blue-900/20 to-indigo-900/30 rounded-xl border border-blue-500/20 shadow-lg">
      <div className="max-w-2xl mx-auto text-center px-4">
        {/* Decorative elements */}
        <div className="relative mb-6">
          <div className="flex items-center justify-center">
            <div className="h-[1px] w-16 bg-blue-500/40"></div>
            <div className="mx-3">
              <div className="text-blue-400 text-xl">✦</div>
            </div>
            <div className="h-[1px] w-16 bg-blue-500/40"></div>
          </div>
        </div>
        
        {/* Animated quote display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={quoteIndex} // Important: This ensures AnimatePresence treats it as a new element
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isVisible ? 1 : 0,
              y: isVisible ? 0 : -10
            }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="min-h-[120px] flex items-center justify-center"
          >            <h3 className="text-2xl md:text-3xl font-serif text-white italic tracking-wide leading-relaxed">
              &ldquo;{quotes[quoteIndex]}&rdquo;
            </h3>
          </motion.div>
        </AnimatePresence>
        
        {/* Quote indicators - showing which quote is active */}
        <div className="flex justify-center space-x-2 mt-8">
          {quotes.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === quoteIndex 
                  ? 'bg-blue-400 scale-125' 
                  : 'bg-blue-900/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InspirationalQuotes;
