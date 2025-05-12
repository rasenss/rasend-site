"use client";

import { useEffect } from 'react';
import Script from 'next/script';

export default function PerformanceOptimizer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Start monitoring after a short delay to not block initial render
      const timeoutId = setTimeout(() => {
        startPerformanceMonitoring();
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, []);
  
  return null;
}

function startPerformanceMonitoring() {
  // Skip on server
  if (typeof window === 'undefined') return 0;

  // Performance state
  const perfState = {
    fpsHistory: [] as number[],
    dropFrameCount: 0,
    lastOptimizationLevel: 0,
    isInLowPerfMode: false,
    monitoringActive: false
  };

  // Early return if already monitoring
  if (perfState.monitoringActive) return 0;
  perfState.monitoringActive = true;

  // Calculate current FPS average
  const getCurrentFPS = () => {
    if (perfState.fpsHistory.length === 0) return 60;
    return perfState.fpsHistory.reduce((a, b) => a + b, 0) / perfState.fpsHistory.length;
  };

  // Apply performance optimizations
  const applyOptimizations = (level: number) => {
    document.documentElement.classList.add('perf-optimize-' + level);
    if (level >= 1) {
      document.documentElement.style.setProperty('--reduce-motion', '1');
    }
  };
  // Start FPS monitoring loop - optimized with throttling
  let lastTime = performance.now();
  let frames = 0;
  let requestId: number | null = null;
  let throttlePause = false;
  
  // Throttle function to limit execution frequency
  const throttle = (callback: () => void, time: number) => {
    if (throttlePause) return;
    
    throttlePause = true;
    setTimeout(() => {
      callback();
      throttlePause = false;
    }, time);
  };
  
  const updateFPS = () => {
    const now = performance.now();
    frames++;
    
    // Calculate FPS once per second
    if (now - lastTime >= 1000) {
      const currentFPS = Math.min(frames, 60);
      
      // Use throttled updates to reduce CPU load
      throttle(() => {
        perfState.fpsHistory.push(currentFPS);
        
        // Keep history size manageable
        if (perfState.fpsHistory.length > 10) { // Reduced from 30 to 10
          perfState.fpsHistory.shift();
        }
        
        // Apply optimizations if needed
        if (currentFPS < 40 && !perfState.isInLowPerfMode) {
          perfState.isInLowPerfMode = true;
          applyOptimizations(1);
        }
      }, 300); // Throttle to once every 300ms
      
      frames = 0;
      lastTime = now;
    }
    
    requestId = requestAnimationFrame(updateFPS);
  };
  
  requestId = requestAnimationFrame(updateFPS);
  
  // Return cleanup function to prevent memory leaks
  return () => {
    if (requestId) {
      cancelAnimationFrame(requestId);
    }
  };
  return getCurrentFPS();
}

