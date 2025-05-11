"use client";

import { useEffect, useState } from 'react';

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);
    
    if (document.readyState === 'complete') {
      setIsLoading(false);
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-blue-monte z-[9999] flex items-center justify-center overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <div 
          key={i}
          className="absolute h-2 w-2 bg-blue-drop rounded-full animate-drop"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.15}s`,
            transform: `scale(${0.8 + Math.random() * 0.7})`,
          }}
        />
      ))}
    </div>
  );
}