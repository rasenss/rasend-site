"use client";

import { useEffect } from 'react';

/**
 * AnimationOptimizer
 * 
 * This component improves animation performance across the site by:
 * 1. Identifying expensive animations and reducing their workload
 * 2. Using Intersection Observer to pause off-screen animations
 * 3. Adjusting animation quality based on device performance
 * 4. Adding hardware acceleration to key elements
 */
export default function AnimationOptimizer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Ensure optimize-animations class is preserved to prevent hydration mismatches
    if (!document.documentElement.classList.contains('optimize-animations')) {
      document.documentElement.classList.add('optimize-animations');
    }
    
    // Measure device performance with a lighter benchmark
    const startTime = performance.now();
    const performChecks = 50; // Reduced benchmark operations
    let counter = 0;
    
    for (let i = 0; i < performChecks; i++) {
      counter += Math.random() * i;
    }
    
    const endTime = performance.now();
    const devicePerformance = endTime - startTime;
    
    // Check if device might be low-end based on several factors
    const checkDeviceCapabilities = () => {
      // Performance score - higher means slower device
      const perfScore = devicePerformance > 5 ? 3 : 
                        devicePerformance > 3 ? 2 : 
                        devicePerformance > 1 ? 1 : 0;
                        
      // CPU capability score                  
      const cpuScore = !navigator.hardwareConcurrency ? 3 :
                      navigator.hardwareConcurrency <= 2 ? 3 :
                      navigator.hardwareConcurrency <= 4 ? 2 : 
                      navigator.hardwareConcurrency <= 6 ? 1 : 0;
                      
      // Device type score                
      const deviceTypeScore = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 2 : 0;
      
      // Memory score (if available)
      const memoryScore = (navigator as any).deviceMemory ? 
                         (navigator as any).deviceMemory < 2 ? 3 :
                         (navigator as any).deviceMemory < 4 ? 2 :
                         (navigator as any).deviceMemory < 8 ? 1 : 0 : 1;
      
      // Screen size score
      const screenScore = window.innerWidth < 768 ? 2 : 
                         window.innerWidth < 1024 ? 1 : 0;
      
      // Calculate total score - higher means more optimization needed
      const totalScore = perfScore + cpuScore + deviceTypeScore + memoryScore + screenScore;
      
      // 0-3: High-end, 4-6: Mid-range, 7+: Low-end
      return { 
        score: totalScore,
        isLow: totalScore >= 7,
        isMid: totalScore >= 4 && totalScore < 7,
        isHigh: totalScore < 4
      };
    };
    
    const deviceCapabilities = checkDeviceCapabilities();
      // Apply tailored performance optimizations based on device capabilities
    const optimizeAnimations = () => {
      // Add appropriate class to document based on device capability - do this once
      const deviceClass = deviceCapabilities.isLow ? 'low-end-device' : 
                          deviceCapabilities.isMid ? 'mid-range-device' : 
                          'high-end-device';
      
      if (!document.documentElement.classList.contains(deviceClass)) {
        document.documentElement.classList.add(deviceClass);
      }
      
      // Use more efficient selector targeting and batch DOM operations
      const elementSelector = 'motion, .motion-nav, .framer-motion, .portfolio-image-container, nav, .animate-gpu, .section-title-component';
      
      // Use requestIdleCallback if available, otherwise use setTimeout
      const scheduleWork = window.requestIdleCallback || 
        ((cb: () => void) => setTimeout(cb, 1));
      
      scheduleWork(() => {
        // Process elements in small batches to avoid UI freezing
        const elements = document.querySelectorAll(elementSelector);
        const processElements = (startIdx: number, chunkSize: number) => {
          const endIdx = Math.min(startIdx + chunkSize, elements.length);
          
          for (let i = startIdx; i < endIdx; i++) {
            const el = elements[i];
            if (el instanceof HTMLElement) {
              el.style.transform = 'translateZ(0)';
              el.style.backfaceVisibility = 'hidden';
              
              // Only set willChange on higher-end devices - can cause issues on low-end
              if (!deviceCapabilities.isLow) {
                el.style.willChange = 'transform, opacity';
              }
            }
          }
          
          // If there are more elements to process, schedule next batch
          if (endIdx < elements.length) {
            setTimeout(() => processElements(endIdx, chunkSize), 0);
          }
        };
        
        // Start processing elements in small batches (10 at a time)
        processElements(0, 10);
      });

      // Reduce particles and motion effects on low-end devices
      if (deviceCapabilities.isLow || deviceCapabilities.isMid) {
        document.documentElement.classList.add('reduce-motion');
        document.documentElement.style.setProperty('--reduce-motion', '1');
      }
      
      // Apply targeted optimizations with a focus on performance
      const style = document.createElement('style');
      style.setAttribute('data-optimizer', 'true');
      style.textContent = `
        /* Hide heavy particles */
        .particles-container {
          display: none !important;
        }
        
        /* Optimize transitions - make them shorter and simpler */
        .transition-all {
          transition-property: opacity, color, background-color !important;
          transition-duration: 0.15s !important;
          transition-timing-function: ease-out !important;
        }
        
        /* Optimize animations - slow down repetitive animations to reduce CPU usage */
        .animate-ping {
          animation-duration: 3s !important;
        }
        
        .animate-pulse {
          animation-duration: 3s !important;
        }
        
        .animate-bounce {
          animation-duration: 1.5s !important;
        }
        
        /* Make subtitle rotations less frequent */
        .subtitle-rotation {
          transition-duration: 0.2s !important;
        }
        
        /* Remove backdrop blur which is extremely performance-heavy */
        .backdrop-blur-sm,
        .backdrop-blur-md,
        .backdrop-blur-lg {
          backdrop-filter: none !important;
          background-color: rgba(17, 24, 39, 0.95) !important;
        }
        
        /* Speed up Framer Motion animations */
        [data-framer-component-type] {
          transition-duration: 0.2s !important;
        }
        
        /* Optimize navbar animations specifically */
        nav {
          transition-duration: 0.2s !important;
        }
        
        /* Force hardware acceleration on key components */
        .section-title-component,
        .portfolio-grid,
        nav,
        .animate-gpu {
          transform: translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
        }
      `;
      document.head.appendChild(style);
    };
    
    // Run optimization
    optimizeAnimations();    // Set up Intersection Observer to pause off-screen animations - with significant performance optimizations
    if ('IntersectionObserver' in window) {
      // Use a single processing queue for all intersection changes to avoid overwork
      const pendingEntries: IntersectionObserverEntry[] = [];
      let processingScheduled = false;
      
      // Process entries in batches with proper throttling
      const processEntryQueue = () => {
        processingScheduled = false;
        
        const entriesToProcess = [...pendingEntries];
        pendingEntries.length = 0; // Clear the queue
        
        // Process in smaller batches to avoid UI freezing
        const batchSize = 10;
        const processBatch = (startIndex: number) => {
          const endIndex = Math.min(startIndex + batchSize, entriesToProcess.length);
          
          for (let i = startIndex; i < endIndex; i++) {
            const entry = entriesToProcess[i];
            const target = entry.target;
            
            if (!entry.isIntersecting && target.classList.contains('motion-pausable')) {
              if (!target.classList.contains('motion-paused')) {
                target.classList.add('motion-paused');
                
                if (target instanceof HTMLElement) {
                  target.style.visibility = 'hidden';
                }
              }
            } else if (target.classList.contains('motion-paused')) {
              target.classList.remove('motion-paused');
              
              if (target instanceof HTMLElement) {
                target.style.visibility = '';
              }
            }
          }
          
          // If there are more entries to process, schedule next batch
          if (endIndex < entriesToProcess.length) {
            setTimeout(() => processBatch(endIndex), 0);
          }
        };
        
        if (entriesToProcess.length > 0) {
          processBatch(0);
        }
      };        // Create an observer with a small buffer and more selective targeting
      const observer = new IntersectionObserver(
        (entries) => {
          // Add new entries to the queue
          pendingEntries.push(...entries);
          
          // Schedule processing if not already scheduled
          if (!processingScheduled) {
            processingScheduled = true;
            // Use requestIdleCallback if available for better performance
            (window.requestIdleCallback || ((cb) => setTimeout(cb, 50)))(processEntryQueue);
          }
        },
        { 
          rootMargin: '150px', // Reduced margin to limit the number of elements being monitored
          threshold: 0.01 // Trigger with minimal visibility
        }
      );
      
      // Observe only the most important animation elements to reduce overhead
      // Use a more specific selector to reduce the element count
      const elementsToObserve = document.querySelectorAll(
        '.animate-ping, .animate-pulse, .animate-bounce, .portfolio-image-container'
      );
        // Ultra-optimized observation process with batching and delays
      const totalElements = elementsToObserve.length;
      const batchSize = 3; // Even smaller batches
      const timeouts: number[] = []; // Track timeouts for cleanup
      
      // Process in a staggered way to prevent UI freezing
      const processElementBatches = (startIndex: number) => {
        if (startIndex >= totalElements) return;
        
        const endIndex = Math.min(startIndex + batchSize, totalElements);
        
        // Process a small batch
        for (let j = startIndex; j < endIndex; j++) {
          if (elementsToObserve[j]) {
            elementsToObserve[j].classList.add('motion-pausable');
            observer.observe(elementsToObserve[j]);
          }
        }
        
        // Schedule next batch with increasing delays to prevent lag spikes
        if (endIndex < totalElements) {
          const delay = 25 + Math.floor(startIndex / 10) * 10; // Progressive delay
          const timeoutId = window.setTimeout(() => {
            processElementBatches(endIndex);
          }, delay);
          timeouts.push(timeoutId);
        }
      };
      
      // Start the batched observation process
      processElementBatches(0);
      
      // Return a cleanup function that properly clears all timeouts
      return () => {
        // Disconnect observer
        observer.disconnect();
        
        // Clear all timeouts we created
        timeouts.forEach(id => clearTimeout(id));
        
        // Clear pending entries
        pendingEntries.length = 0;
        
        // Remove any style elements we created
        document.querySelectorAll('style[data-optimizer]').forEach(el => {
          if (el.parentNode) el.parentNode.removeChild(el);
        });
      };
    }
  }, []);
  // This is a non-rendering component
  return null;
}
