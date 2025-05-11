"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Inspirational quotes to cycle through (exactly 10)
const quotes = [
  { text: "Carpe Diem", meaning: "Seize the day" },
  { text: "Be the change you wish to see in the world", meaning: "Gandhi" },
  { text: "Every moment is a fresh beginning", meaning: "T.S. Eliot" },
  { text: "Everything you can imagine is real", meaning: "Pablo Picasso" },
  { text: "Whatever you do, do it well", meaning: "Walt Disney" },
  { text: "What we think, we become", meaning: "Buddha" },
  { text: "All limitations are self-imposed", meaning: "Oliver Wendell Holmes" },
  { text: "Problems are not stop signs, they are guidelines", meaning: "Robert H. Schuller" },
  { text: "One day or day one. You decide", meaning: "Paulo Coelho" },
  { text: "Impossible is just an opinion", meaning: "Paulo Coelho" },
];

const QuotesCarousel = () => {
  // State to track the current quote index
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quote = quotes[quoteIndex];
  
  // State for running text animation
  const [displayText, setDisplayText] = useState("");
  const [displayMeaning, setDisplayMeaning] = useState("");
  const [isTypingQuote, setIsTypingQuote] = useState(true);
  const [isTypingMeaning, setIsTypingMeaning] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [meaningCharIndex, setMeaningCharIndex] = useState(0);
  
  // Text animation effect for quote typing
  useEffect(() => {
    if (!quote) return;

    // Animation for the main quote
    if (isTypingQuote && charIndex < quote.text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + quote.text[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 80); // Slightly faster typing than footer (100ms)
      
      return () => clearTimeout(timeout);
    } 
    else if (isTypingQuote && charIndex >= quote.text.length) {
      setIsTypingQuote(false);
      setIsTypingMeaning(true);
    }

    // Animation for the meaning/author
    if (isTypingMeaning && meaningCharIndex < quote.meaning.length) {
      const timeout = setTimeout(() => {
        setDisplayMeaning(prev => prev + quote.meaning[meaningCharIndex]);
        setMeaningCharIndex(prev => prev + 1);
      }, 40); // Faster typing for meaning (40ms)
      
      return () => clearTimeout(timeout);
    }
  }, [quote, charIndex, isTypingQuote, isTypingMeaning, meaningCharIndex]);

  // Reset animation when quote changes
  useEffect(() => {
    setDisplayText("");
    setDisplayMeaning("");
    setCharIndex(0);
    setMeaningCharIndex(0);
    setIsTypingQuote(true);
    setIsTypingMeaning(false);
  }, [quoteIndex]);
  
  // Cycle through quotes at a regular interval, only after completing all 10 before repeating
  useEffect(() => {
    // Wait until current animation is complete before cycling
    if (isTypingQuote || isTypingMeaning) return;
    
    // Wait for 4 seconds after animation completes before cycling to next quote
    const cycleTimeout = setTimeout(() => {
      // Move to next quote, completing all 10 before looping back to first
      setQuoteIndex((prevIndex) => {
        // If we've reached the last quote (index 9), go back to the first quote (index 0)
        if (prevIndex >= quotes.length - 1) {
          return 0;
        }
        // Otherwise move to the next quote
        return prevIndex + 1;
      });
    }, 4000); // 4 seconds delay after animation completes
    
    return () => clearTimeout(cycleTimeout);
  }, [isTypingQuote, isTypingMeaning]);

  return (
    <div className="py-12 px-4 bg-gradient-to-br from-blue-900/10 to-indigo-900/20 rounded-xl border border-blue-500/20 shadow-lg">
      <div className="max-w-3xl mx-auto">
        {/* Modern decorative element */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center">
            <div className="h-[2px] w-10 bg-gradient-to-r from-blue-500/0 to-blue-500/70"></div>
            <div className="mx-2">
              <div className="text-blue-400 text-sm">✧</div>
            </div>
            <div className="h-[2px] w-20 bg-gradient-to-r from-blue-500/70 to-blue-500/100"></div>
            <div className="mx-2">
              <div className="text-blue-400 text-base">✦</div>
            </div>
            <div className="h-[2px] w-20 bg-gradient-to-r from-blue-500/100 to-blue-500/70"></div>
            <div className="mx-2">
              <div className="text-blue-400 text-sm">✧</div>
            </div>
            <div className="h-[2px] w-10 bg-gradient-to-r from-blue-500/70 to-blue-500/0"></div>
          </div>
        </div>
        
        {/* Animated Quote Display with typing effect */}
        <div className="text-center">          <h3 className="text-2xl md:text-3xl font-serif text-white mb-4 italic tracking-wide leading-relaxed min-h-[80px] flex items-center justify-center">
            &ldquo;{displayText}
            <span className={isTypingQuote ? "inline-block w-1 h-6 bg-blue-500 ml-1 animate-pulse" : "hidden"}></span>&rdquo;
          </h3>
          <p className="text-blue-300 text-lg font-serif tracking-wider mb-8 min-h-[40px] flex items-center justify-center">
            {displayMeaning}
            <span className={isTypingMeaning ? "inline-block w-1 h-4 bg-blue-400 ml-1 animate-pulse" : "hidden"}></span>
          </p>
        </div>
        
        {/* Quote position indicators */}
        <div className="flex justify-center space-x-3 mt-10">
          {quotes.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === quoteIndex ? 'bg-blue-400' : 'bg-blue-500/30'
              }`}
              animate={{
                scale: index === quoteIndex ? 1.2 : 1,
                opacity: index === quoteIndex ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuotesCarousel;
