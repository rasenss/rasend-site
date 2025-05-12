"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AnimatedSectionTitleProps {
  title: string;
  subtitle?: string;
  subtitles?: string[];
  icon?: LucideIcon;
  rotationInterval?: number; // Time in ms between subtitle rotations
  hideSubtitle?: boolean; // New prop to hide subtitle section
}

const AnimatedSectionTitle = ({ 
  title, 
  subtitle,
  subtitles,
  icon: Icon,
  rotationInterval = 3000, // Default to 3 seconds
  hideSubtitle = false // Default to showing subtitle
}: AnimatedSectionTitleProps) => {
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const hasMultipleSubtitles = subtitles && subtitles.length > 0;  // Rotate through subtitles if multiple are provided - performance optimized
  useEffect(() => {
    if (!hasMultipleSubtitles || hideSubtitle) return;
    
    // Only run rotation when document has focus, is visible, and element is in viewport
    let intervalId: NodeJS.Timeout | null = null;
    let observer: IntersectionObserver | null = null;
    let isInViewport = false;
    let frameId: number | null = null;
    
    const titleRef = document.querySelector('.section-title-component');
    
    const startRotation = () => {
      if (intervalId) return; // Already running
      
      // Use memory-efficient approach with less frequent updates
      intervalId = setInterval(() => {
        // Only update when tab is active AND element is in viewport
        if (document.visibilityState === 'visible' && isInViewport) {
          // Use a single animation frame for smoother transitions
          if (frameId) cancelAnimationFrame(frameId);
          
          frameId = requestAnimationFrame(() => {
            setCurrentSubtitleIndex(prevIndex => 
              prevIndex === subtitles.length - 1 ? 0 : prevIndex + 1
            );
            frameId = null;
          });
        }
      }, rotationInterval);
    };
      const stopRotation = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
      // Use intersection observer to detect when element is in viewport
    if (typeof IntersectionObserver !== 'undefined' && titleRef) {
      observer = new IntersectionObserver((entries) => {
        isInViewport = entries[0]?.isIntersecting || false;
        
        if (isInViewport && document.visibilityState === 'visible') {
          startRotation();
        } else {
          stopRotation();
        }
      }, { threshold: 0.2 }); // Only needs to be 20% visible
      
      observer.observe(titleRef);
    } else {
      // Fallback if IntersectionObserver is not available
      isInViewport = true;
      startRotation();
    }
    
    // Pause rotation when tab is not visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isInViewport) {
        startRotation();
      } else {
        stopRotation();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      if (observer) observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopRotation();
    };
  }, [subtitles, rotationInterval, hasMultipleSubtitles, hideSubtitle]);

  // Get current subtitle to display
  const currentSubtitle = hasMultipleSubtitles 
    ? subtitles[currentSubtitleIndex]
    : subtitle;
  return (
    <div className="mb-8 section-title-component motion-reduce"><motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.3, 
          type: "tween", 
          ease: "easeOut" 
        }}
        viewport={{ 
          once: true, 
          margin: "-10% 0px -10% 0px", 
          amount: "some" 
        }}
        style={{ 
          willChange: "opacity, transform",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
          WebkitFontSmoothing: "subpixel-antialiased"
        }}
        className="flex items-center gap-3"
      >
        {Icon && (
          <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
            <Icon size={22} />
          </div>
        )}
        
        <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
          {title}          <motion.span 
            className="absolute -bottom-1 left-0 w-full h-1 bg-blue-500"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ 
              delay: 0.15, 
              duration: 0.2, 
              ease: "easeOut" 
            }}
            viewport={{ once: true }}
            style={{ 
              willChange: "transform",
              transform: "translateZ(0) scaleX(0)",
              transformOrigin: "left",
              backfaceVisibility: "hidden"
            }}
          />
        </h2>
      </motion.div>      {!hideSubtitle && (
        <div className="min-h-[3.5rem] mt-4 subtitle-rotation animate-gpu">
          <AnimatePresence mode="wait" initial={false}>
            {currentSubtitle && (
              <motion.p 
                key={currentSubtitle}
                className="text-lg text-gray-400 max-w-2xl"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ 
                  duration: 0.2, 
                  ease: "easeOut"
                }}
                style={{ 
                  willChange: "opacity, transform",
                  backfaceVisibility: "hidden",
                  transform: "translateZ(0)",
                  position: "absolute"
                }}
              >
                {currentSubtitle}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AnimatedSectionTitle;