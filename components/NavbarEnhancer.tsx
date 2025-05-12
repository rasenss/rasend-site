"use client";
import { useEffect, useRef } from 'react';

// Extend Window interface to define custom global properties
declare global {
  interface Window {
    __updateActiveSection: (section: string) => void;
    __forceUpdateSectionRefs: () => void;
    __toggleNavbarForCertificatePreview: (hide: boolean) => void;
  }
}

/**
 * NavbarEnhancer Component
 * 
 * This component enhances the navbar section tracking by improving the scroll detection
 * logic to better identify the current section being viewed.
 * 
 * No visual elements are rendered - it works purely through JavaScript.
 */
export default function NavbarEnhancer() {
  // Track if we've already enhanced the navbar
  const enhancedRef = useRef(false);
  
  useEffect(() => {
    // Skip if already enhanced or window is not available (SSR)
    if (enhancedRef.current || typeof window === 'undefined') return;
    
    // Mark as enhanced to prevent duplicate enhancements
    enhancedRef.current = true;
    
    // Verify required global functions exist
    const canEnhance = 
      typeof window.__updateActiveSection === 'function' &&
      typeof window.__forceUpdateSectionRefs === 'function';
      
    if (!canEnhance) {
      console.log('Navbar enhancer: Required global functions not available yet, will retry');
      
      // If functions aren't available yet, try again after a delay
      const retryInterval = setInterval(() => {
        if (typeof window.__updateActiveSection === 'function' &&
            typeof window.__forceUpdateSectionRefs === 'function') {
          clearInterval(retryInterval);
          enhanceNavbarTracking();
        }
      }, 500);
      
      // Clean up interval if component unmounts
      return () => clearInterval(retryInterval);
    }
    
    enhanceNavbarTracking();
    
    // Cleanup function
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
  // Track if scroll handler is ticking
  const ticking = useRef(false);
  // Track current scroll position
  const lastScrollY = useRef(0);
  // Track if scroll updates are locked
  const scrollLockTimeout = useRef<NodeJS.Timeout | null>(null);
  // Track current active section
  const activeSection = useRef('home');
    /**
   * Main scroll event handler with optimized performance
   * Uses debounced requestAnimationFrame for smoother execution
   */  // Debounce timer reference
  const debounceTimer = useRef<number | null>(null);
  
  function handleScroll() {
    if (ticking.current) return;
    
    ticking.current = true;
    
    // Use a more efficient approach - cancel previous timeout if it exists
    if (debounceTimer.current !== null) {
      cancelAnimationFrame(debounceTimer.current);
    }
    
    // Schedule the update using requestAnimationFrame for better performance
    debounceTimer.current = requestAnimationFrame(() => {
      // Skip if scroll lock is active
      if (!scrollLockTimeout.current) {
        detectCurrentSection();
      }
      lastScrollY.current = window.scrollY;
      ticking.current = false;
      debounceTimer.current = null;
    });
  }
  
  /**
   * Enhanced section detection algorithm
   */
  function detectCurrentSection() {
    const viewportHeight = window.innerHeight;
    const currentScrollY = window.scrollY;
    
    // Handle special case for top of page
    if (currentScrollY < 50) {
      if (activeSection.current !== 'home') {
        activeSection.current = 'home';
        window.__updateActiveSection('home');
      }
      return;
    }
    
    // Get all section elements
    const navItems = [
      'home', 'about', 'skills', 'certifications', 
      'resume', 'portfolio', 'contact'
    ];
    
    let bestSection = activeSection.current;
    let maxScore = -1;
    const navHeight = 80; // Approximate navbar height
    
    // Calculate scores for each section
    navItems.forEach(id => {
      const section = document.getElementById(id);
      if (!section) return;
      
      const rect = section.getBoundingClientRect();
      
      // Skip if section is completely out of view or too far down
      if (rect.bottom < 0 || rect.top > viewportHeight + 100) return;
      
      // Base visibility score - how much of section is in viewport
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(viewportHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      
      // Various scoring factors
      
      // 1. Section position relative to viewport (highest priority)
      let positionScore;
      if (rect.top <= navHeight + 10) {
        // Section is at or just below navbar - highest priority
        positionScore = 2000 - Math.max(0, Math.abs(rect.top - navHeight));
      } else if (rect.top <= viewportHeight * 0.4) {
        // Section is in upper part of viewport - high priority
        positionScore = 1000 - (rect.top - navHeight);
      } else {
        // Section is lower in viewport - lower priority
        positionScore = 500;
      }
      
      // 2. Visibility percentage
      const totalHeight = rect.height;
      const visibilityPercentage = totalHeight > 0 ? visibleHeight / totalHeight : 0;
      const visibilityScore = visibilityPercentage * 500;
      
      // 3. Section occupies center of viewport
      const centerScore = (rect.top <= viewportHeight * 0.6 && 
                         rect.bottom >= viewportHeight * 0.4) ? 300 : 0;
      
      // Calculate final score
      const totalScore = 
        (positionScore * 3) +     // Position is most important
        (visibilityScore * 1.5) + // Visibility is important
        (centerScore * 0.8);      // Center position is somewhat important
      
      // Update best section if score is higher
      if (totalScore > maxScore) {
        maxScore = totalScore;
        bestSection = id;
      }
    });
    
    // Update active section if changed
    if (bestSection !== activeSection.current) {
      activeSection.current = bestSection;
      window.__updateActiveSection(bestSection);
    }
  }
  
  /**
   * Updates scroll lock status when navigation items are clicked
   */
  function enhanceNavLinks() {
    ['home', 'about', 'skills', 'certifications', 'resume', 'portfolio', 'contact'].forEach(id => {
      const links = document.querySelectorAll(`a[href="#${id}"]`);
      
      links.forEach(link => {
        // Only add listener if not already enhanced
        if (!(link as any).__enhanced) {
          link.addEventListener('click', () => {
            // Set scroll lock
            if (scrollLockTimeout.current) {
              clearTimeout(scrollLockTimeout.current);
            }
            
            scrollLockTimeout.current = setTimeout(() => {
              scrollLockTimeout.current = null;
            }, 2500); // Longer lock to prevent flickering during scroll
            
            // Update active section immediately
            activeSection.current = id;
            if (window.__updateActiveSection) {
              window.__updateActiveSection(id);
            }
          });
          
          // Mark link as enhanced
          (link as any).__enhanced = true;
        }
      });
    });
  }
  
  /**
   * Main function to set up all navbar enhancements
   */  /**
   * Provides a self-healing function to fix navbar glitches
   */
  function setupNavbarGlitchRecovery() {
    // Create a recovery function on the window object
    (window as any).__fixNavbarGlitches = () => {
      console.log('Fixing navbar glitches...');
      
      // Force update section refs
      if (window.__forceUpdateSectionRefs) {
        window.__forceUpdateSectionRefs();
      }
      
      // Re-detect current section
      detectCurrentSection();
      
      // Re-enhance nav links
      enhanceNavLinks();
      
      console.log('Navbar glitch recovery complete.');
      return true;
    };
    
    // Set up auto-recovery every 15 seconds
    const recoveryInterval = setInterval(() => {
      // Only run recovery if document has focus to avoid unnecessary work
      if (document.hasFocus() && window.__forceUpdateSectionRefs) {
        window.__forceUpdateSectionRefs();
        detectCurrentSection();
      }
    }, 15000);
    
    // Cleanup function
    return () => clearInterval(recoveryInterval);
  }
    function enhanceNavbarTracking() {
    console.log('Enhancing navbar tracking');
      // Add global function to toggle navbar visibility for certificate previews
      window.__toggleNavbarForCertificatePreview = (hide: boolean) => {
      // Find the navbar element
      const navbar = document.querySelector('nav');
      
      if (navbar && navbar instanceof HTMLElement) {
        // Add transition styles if they don't exist
        if (!navbar.style.transition) {
          navbar.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        }
        
        if (hide) {
          // Hide navbar with a smooth transition
          navbar.style.transform = 'translateY(-100%)';
          navbar.style.opacity = '0';
          navbar.style.pointerEvents = 'none';
          
          // Add class for better styling with CSS
          navbar.classList.add('navbar-hidden');
        } else {
          // Show navbar with a smooth transition
          navbar.style.transform = 'translateY(0)';
          navbar.style.opacity = '1';
          navbar.style.pointerEvents = 'auto';
          
          // Remove hidden class
          navbar.classList.remove('navbar-hidden');
        }
      }
    };
    
    // Force update section references
    if (window.__forceUpdateSectionRefs) {
      window.__forceUpdateSectionRefs();
    }
    
    // Set up scroll listener with improved options for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Enhance navigation links
    enhanceNavLinks();
    
    // Run initial detection
    detectCurrentSection();
    
    // Set up self-healing for glitches
    const cleanupGlitchRecovery = setupNavbarGlitchRecovery();
    
    // Set up a mutation observer to watch for DOM changes that might affect sections
    const observer = new MutationObserver(() => {
      if (window.__forceUpdateSectionRefs) {
        window.__forceUpdateSectionRefs();
      }
      enhanceNavLinks();
    });
      // Start observing the document body for changes
    observer.observe(document.body, { 
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });
    
    // Return cleanup function to clean up observers and intervals
    return () => {
      observer.disconnect();
      if (typeof cleanupGlitchRecovery === 'function') {
        cleanupGlitchRecovery();
      }
      
      // Remove global function
      if ((window as any).__fixNavbarGlitches) {
        delete (window as any).__fixNavbarGlitches;
      }
    };
  }
  
  // Return null since this component doesn't render anything
  return null;
}
