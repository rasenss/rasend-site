"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type EasterEggProps = {
  type: 'explosion' | 'confetti' | 'matrix' | 'glitch';
};

const EasterEgg: React.FC<EasterEggProps> = ({ type }) => {
  const [visible, setVisible] = useState(true);

  // Auto-hide the easter egg after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, type === 'explosion' ? 2000 : 4000);

    return () => clearTimeout(timer);
  }, [type]);

  const renderEasterEggContent = () => {
    switch (type) {
      case 'explosion':
        return (
          <motion.div 
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: [0.5, 1.2, 0.8],
                opacity: [0, 1, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 1.5,
                times: [0, 0.5, 1],
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="w-60 h-60 md:w-96 md:h-96 relative">
                <div className="absolute inset-0 bg-orange-500 rounded-full blur-3xl opacity-50 animate-ping"></div>
                <div className="absolute inset-0 flex items-center justify-center text-5xl md:text-8xl font-bold">
                  💥 BOOM! 💥
                </div>
              </div>
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: [1, 2],
                  opacity: [1, 0]
                }}
                transition={{ duration: 1.5 }}
              >
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 md:w-4 md:h-4 bg-yellow-500 rounded-full"
                    initial={{ 
                      x: 0, 
                      y: 0, 
                      opacity: 1 
                    }}
                    animate={{ 
                      x: Math.sin(i) * (Math.random() * 300 + 100), 
                      y: Math.cos(i) * (Math.random() * 300 + 100),
                      opacity: 0
                    }}
                    transition={{ 
                      duration: 1.5, 
                      ease: "easeOut" 
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        );
      
      case 'confetti':
        return (
          <motion.div
            className="fixed inset-0 z-[999] pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 100 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 opacity-80"
                style={{
                  backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][i % 6],
                  top: `${Math.random() * -10}%`,
                  left: `${Math.random() * 100}%`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                  rotate: `${Math.random() * 360}deg`,
                }}
                animate={{
                  top: `${100 + Math.random() * 10}%`,
                  rotate: `${Math.random() * 720}deg`,
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  ease: "linear",
                }}
              />
            ))}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl md:text-8xl font-bold text-white text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              SURPRISE!
            </motion.div>
          </motion.div>
        );

      case 'matrix':
        return (
          <motion.div
            className="fixed inset-0 z-[999] bg-black flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 40 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute text-green-500 font-mono whitespace-nowrap"
                  style={{
                    top: -100,
                    left: `${i * 2.5}%`,
                    fontSize: `${Math.random() * 16 + 10}px`,
                    opacity: Math.random() * 0.5 + 0.5,
                    animation: `matrixRain ${Math.random() * 5 + 3}s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                  }}
                >
                  {Array.from({ length: 40 }).map((_, j) => (
                    <span 
                      key={j} 
                      style={{ 
                        animationDelay: `${Math.random() * 5}s`, 
                        animationDuration: `${Math.random() * 5 + 1}s` 
                      }}
                      className="inline-block animate-pulse"
                    >
                      {String.fromCharCode(0x30A0 + Math.random() * 96)}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <motion.div
              className="relative z-10 text-white text-5xl md:text-8xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              WAKE UP...
            </motion.div>
          </motion.div>
        );

      case 'glitch':
        return (
          <motion.div
            className="fixed inset-0 z-[999] bg-black flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-7xl md:text-9xl font-bold text-white relative"
              animate={{ x: [-5, 5, -5], y: [3, -3, 3] }}
              transition={{ repeat: 10, duration: 0.2 }}
            >
              <div className="absolute inset-0 text-red-500 animate-pulse" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}>
                GLITCH
              </div>
              <div className="absolute inset-0 text-blue-500 animate-pulse" style={{ clipPath: 'polygon(0 45%, 100% 45%, 100% 100%, 0 100%)' }}>
                GLITCH
              </div>
              <div className="text-white mix-blend-screen opacity-90">GLITCH</div>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {visible && renderEasterEggContent()}
    </AnimatePresence>
  );
};

export default EasterEgg;