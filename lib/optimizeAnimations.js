"use client";

// This file is used to inject a small performance monitor and optimizer into the page
// It helps identify performance bottlenecks and automatically optimize animations

(function() {
  // Only run in production
  if (process.env.NODE_ENV !== 'production') return;
  
  // Ensure optimize-animations class is preserved to prevent hydration mismatches
  if (typeof window !== 'undefined' && document && document.documentElement && 
      !document.documentElement.classList.contains('optimize-animations')) {
    document.documentElement.classList.add('optimize-animations');
  }

  // Wait for document to be ready
  if (typeof window === 'undefined') return;
  
  window.addEventListener('load', function() {
    // Wait a bit for initial rendering to complete
    setTimeout(function() {
      // Measure FPS
      let frameCount = 0;
      let lastTime = performance.now();
      let fps = 60;
      let slowFrames = 0;
      
      // Track FPS
      function measureFps() {
        frameCount++;
        const now = performance.now();
        
        if (now - lastTime > 1000) { // Update every second
          fps = frameCount;
          frameCount = 0;
          lastTime = now;
          
          // Check if we have slow animations
          if (fps < 40) {
            slowFrames++;
            
            // If we've had multiple slow frame periods, apply fixes
            if (slowFrames >= 2) {
              applyPerformanceFixes();
              // Stop measuring after applying fixes
              cancelAnimationFrame(animationFrameId);
            }
          } else {
            slowFrames = Math.max(0, slowFrames - 1);
          }
        }
        
        animationFrameId = requestAnimationFrame(measureFps);
      }
      
      // Start measuring
      let animationFrameId = requestAnimationFrame(measureFps);
      
      // Apply fixes for slow animations
      function applyPerformanceFixes() {
        console.log('Applying performance optimizations for animations');
        
        // 1. Reduce particle effects
        document.querySelectorAll('.particles-container').forEach(el => {
          el.remove();
        });
        
        // 2. Apply GPU acceleration to key elements
        document.querySelectorAll('.motion-nav, .motion-div, motion, nav, .portfolio-image-container').forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.transform = 'translateZ(0)';
            el.style.backfaceVisibility = 'hidden';
          }
        });
        
        // 3. Reduce animation duration globally
        const style = document.createElement('style');
        style.textContent = `
          * {
            transition-duration: 80% !important;
            animation-duration: 80% !important;
          }
          
          .animate-ping {
            animation-duration: 2s !important;
          }
          
          .backdrop-blur-sm,
          .backdrop-blur,
          .backdrop-blur-md,
          .backdrop-blur-lg {
            backdrop-filter: none !important;
            background-color: rgba(0,0,0,0.85) !important;
          }
        `;
        document.head.appendChild(style);
      }
    }, 2000);
  });
})();
