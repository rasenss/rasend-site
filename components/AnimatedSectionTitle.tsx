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
  const hasMultipleSubtitles = subtitles && subtitles.length > 0;
  
  // Rotate through subtitles if multiple are provided
  useEffect(() => {
    if (!hasMultipleSubtitles || hideSubtitle) return;
    
    const intervalId = setInterval(() => {
      setCurrentSubtitleIndex(prevIndex => 
        prevIndex === subtitles.length - 1 ? 0 : prevIndex + 1
      );
    }, rotationInterval);
    
    return () => clearInterval(intervalId);
  }, [subtitles, rotationInterval, hasMultipleSubtitles, hideSubtitle]);

  // Get current subtitle to display
  const currentSubtitle = hasMultipleSubtitles 
    ? subtitles[currentSubtitleIndex]
    : subtitle;

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex items-center gap-3"
      >
        {Icon && (
          <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
            <Icon size={22} />
          </div>
        )}
        
        <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
          {title}
          <motion.span 
            className="absolute -bottom-1 left-0 w-full h-1 bg-blue-500"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          />
        </h2>
      </motion.div>
      
      {!hideSubtitle && (
        <div className="min-h-[3.5rem] mt-4">
          <AnimatePresence mode="wait">
            {currentSubtitle && (
              <motion.p 
                key={currentSubtitle}
                className="text-lg text-gray-400 max-w-2xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
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