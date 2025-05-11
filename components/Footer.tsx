"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBreakpoint } from '@/lib/responsive';
import ResponsiveText from './ResponsiveText';

// Roman quotes that cycle through
const quotes = [
  { text: "Carpe Diem", translation: "Seize the day" },
  { text: "Veni, Vidi, Vici", translation: "I came, I saw, I conquered" },
  { text: "Per Aspera Ad Astra", translation: "Through hardships to the stars" },
  { text: "Ars Longa, Vita Brevis", translation: "Art is long, life is short" },
  { text: "Cogito, Ergo Sum", translation: "I think, therefore I am" },
  { text: "Memento Vivere", translation: "Remember to live" },
  { text: "Alea Iacta Est", translation: "The die is cast" },
  { text: "Amor Vincit Omnia", translation: "Love conquers all" },
  { text: "Audentes Fortuna Iuvat", translation: "Fortune favors the bold" },
  { text: "Non Ducor, Duco", translation: "I am not led, I lead" },
  { text: "Dum Spiro, Spero", translation: "While I breathe, I hope" },
  { text: "Fortis Fortuna Adiuvat", translation: "Fortune favors the brave" },
  { text: "Acta Non Verba", translation: "Actions, not words" },
  { text: "Tempus Fugit", translation: "Time flies" }
];

const Footer = () => {
  // State to track the current quote index
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quote = quotes[quoteIndex];
    // State for running text animation
  const [displayText, setDisplayText] = useState("");
  const [displayTranslation, setDisplayTranslation] = useState("");
  const [isTypingQuote, setIsTypingQuote] = useState(true);
  const [isTypingTranslation, setIsTypingTranslation] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [translationCharIndex, setTranslationCharIndex] = useState(0);
    // Text animation effect
  useEffect(() => {
    if (!quote) return;

    // Animation for the main quote
    if (isTypingQuote && charIndex < quote.text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + quote.text[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 100);
      
      return () => clearTimeout(timeout);
    } 
    else if (isTypingQuote && charIndex >= quote.text.length) {
      setIsTypingQuote(false);
      setIsTypingTranslation(true);
    }

    // Animation for the translation
    if (isTypingTranslation && translationCharIndex < quote.translation.length) {
      const timeout = setTimeout(() => {
        setDisplayTranslation(prev => prev + quote.translation[translationCharIndex]);
        setTranslationCharIndex(prev => prev + 1);
      }, 50);
      
      return () => clearTimeout(timeout);
    } 
    // Check if all animations are complete
    else if (isTypingTranslation && translationCharIndex >= quote.translation.length) {
      setIsTypingTranslation(false);
      setAnimationComplete(true);
    }
  }, [quote, charIndex, isTypingQuote, isTypingTranslation, translationCharIndex]);  // Reset animation when quote changes
  useEffect(() => {
    setDisplayText("");
    setDisplayTranslation("");
    setCharIndex(0);
    setTranslationCharIndex(0);
    setIsTypingQuote(true);
    setIsTypingTranslation(false);
    setAnimationComplete(false);
  }, [quoteIndex]);  // Cycle through quotes at a regular interval, ensuring all quotes are shown before repeating
  useEffect(() => {
    // Only proceed if both animations are complete
    if (!animationComplete) return;
    
    console.log(`Animation complete for quote: ${quote.text}`); // Debug log
    
    // After the animation completes, wait 5 seconds before showing the next quote
    const cycleTimeout = setTimeout(() => {
      console.log(`Cycling to next quote from index: ${quoteIndex}`); // Debug log
      
      // Move to next quote, or back to first quote after showing all quotes
      setQuoteIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        console.log(`Setting new quote index: ${nextIndex >= quotes.length ? 0 : nextIndex}`); // Debug log
        // If we've shown all quotes, go back to the first one
        if (nextIndex >= quotes.length) {
          return 0;
        }
        // Otherwise continue to the next quote
        return nextIndex;
      });
    }, 5000); // 5 seconds delay after animation completes
    
    return () => clearTimeout(cycleTimeout);
  }, [animationComplete, quoteIndex, quote]);
    return (
    <footer className="bg-[var(--background-secondary)] py-10 sm:py-12 md:py-16 border-t border-[rgb(38,43,61)]/80">
      {/* Roman Empire Inspired Quote Section */}
      <div className="container-responsive mb-6 sm:mb-8">
        <div className="max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto text-center">
          {/* Roman decorative borders */}
          <div className="relative mb-6 sm:mb-8 md:mb-10">
            <div className="flex items-center justify-center">
              <div className="h-[1px] w-10 sm:w-16 bg-[#3a4264]/50"></div>
              <div className="mx-2 sm:mx-3">
                <div className="text-[#4f83cc] text-lg sm:text-xl font-serif">⚜</div>
              </div>
              <div className="h-[1px] w-10 sm:w-16 bg-[#3a4264]/50"></div>
            </div>
            
            {/* Decorative corners */}
            <div className="absolute top-0 left-1/4 w-[1px] h-3 sm:h-4 bg-[#3a4264]/40"></div>
            <div className="absolute top-0 right-1/4 w-[1px] h-3 sm:h-4 bg-[#3a4264]/40"></div>
          </div>
          
          {/* Roman Quote with Running Text Animation */}
          <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-serif text-white mb-2 sm:mb-3 md:mb-4 italic tracking-wide leading-relaxed min-h-[40px] sm:min-h-[60px] flex items-center justify-center">
            "{displayText}
            <span className={isTypingQuote ? "inline-block w-1 h-4 sm:h-5 md:h-6 bg-[#4f83cc] ml-1 animate-pulse" : "hidden"}></span>"
          </h3>
          <p className="text-[var(--text-secondary)] text-sm xs:text-base sm:text-lg font-serif tracking-wider mb-6 sm:mb-8 md:mb-10 min-h-[20px] sm:min-h-[30px] flex items-center justify-center">
            {displayTranslation}
            <span className={isTypingTranslation ? "inline-block w-1 h-3 sm:h-4 bg-[#4f83cc] ml-1 animate-pulse" : "hidden"}></span>
          </p>
          
          {/* Roman Seal */}
          <div className="mb-5 sm:mb-6 md:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto relative">
              <div className="absolute inset-0 rounded-full border-2 border-[#3a4264]/50"></div>
              <div className="absolute inset-[4px] sm:inset-[5px] md:inset-[6px] rounded-full border border-[#4f83cc]/30"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[#4f83cc] text-xs sm:text-sm font-serif tracking-[0.15em] sm:tracking-[0.2em]">SPQR</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About & Copyright */}
      <div className="container-responsive text-center">
        <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
          <p className="text-[var(--text-secondary)] text-sm sm:text-base mb-4 sm:mb-6">
            GOD WITH US.
          </p>
          <p className="text-[#4f83cc]/80 text-xs sm:text-sm font-serif tracking-wide sm:tracking-widest">
            © MMXXV · RASENDRIYA KHANSA · OMNIA OPERA
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;