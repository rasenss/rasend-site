/**
 * Animation Performance Optimizer
 * 
 * This script automatically optimizes animations based on device capabilities
 * and monitors performance to make real-time adjustments.
 */

(function() {
  // Ensure optimize-animations class is preserved to prevent hydration mismatches
  if (!document.documentElement.classList.contains('optimize-animations')) {
    document.documentElement.classList.add('optimize-animations');
  }
  
  // Performance state tracking
  const perfState = {
    fpsHistory: [],
    longFrames: 0,
    optimizationLevel: 0,
    isMonitoring: false
  };

  // Feature detection
  const deviceCapabilities = {
    supportsIntersectionObserver: 'IntersectionObserver' in window,
    supportsRequestIdleCallback: 'requestIdleCallback' in window,
    isLowEndDevice: checkIfLowEndDevice(),
    isReduceMotionPreferred: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  // Check if device is likely a low-end device
  function checkIfLowEndDevice() {
    const navigatorInfo = navigator || {};
    return (
      // CPU cores check
      (navigatorInfo.hardwareConcurrency && navigatorInfo.hardwareConcurrency <= 4) ||
      // Mobile device detection
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      // Memory check (Chrome-only)
      (navigatorInfo.deviceMemory && navigatorInfo.deviceMemory < 4) ||
      // Small screen likely means mobile device
      window.innerWidth < 768
    );
  }
  
  // Wait for document to be ready
  window.addEventListener('load', function() {
    // Wait a bit for initial rendering to complete
    setTimeout(function() {
      console.log('Starting performance monitoring and optimization');
      
      // Track FPS with adaptability
      let frameCount = 0;
      let lastTime = performance.now();
      let slowFrames = 0;
      
      function optimizeAnimations() {
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
            transition-duration: 0.2s !important;
            animation-duration: 0.8s !important;
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
      
      // Call the optimization function
      optimizeAnimations();
    }, 2000);
  });
})();
