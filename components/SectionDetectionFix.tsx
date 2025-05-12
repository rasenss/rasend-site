"use client";

import { useEffect } from 'react';

/**
 * This component improves navbar section detection by adding
 * scroll event listeners and better detection algorithms.
 */
export default function SectionDetectionFix() {
  useEffect(() => {
    // Don't run on the server
    if (typeof window === 'undefined') return;
    
    let activeSection = 'home';
    let ticking = false;
    let scrollLockTimeout: NodeJS.Timeout | null = null;
    let observerActive = false;
    
    // Observer to check for DOM changes that might affect section positions
    const observer = new MutationObserver(() => {
      if (!observerActive) return;
      
      // Update section detection on DOM changes
      setTimeout(detectCurrentSection, 300);
    });
    
    function detectCurrentSection() {
      // Skip if scroll is locked
      if (scrollLockTimeout) return;
      
      // Access the global function
      if (typeof (window as any).__updateActiveSection !== 'function') return;
      
      const viewportHeight = window.innerHeight;
      const currentScrollY = window.scrollY;
      const navHeight = 80; // Approximate navbar height
      
      // Special case for top of page
      if (currentScrollY < 50) {
        if (activeSection !== 'home') {
          activeSection = 'home';
          (window as any).__updateActiveSection('home');
        }
        return;
      }
      
      // Get all section IDs
      const sectionIds = ['home', 'about', 'skills', 'certifications', 'resume', 'portfolio', 'contact'];
      let bestSection = activeSection;
      let maxScore = -1;
      
      // Check each section
      sectionIds.forEach(id => {
        const section = document.getElementById(id);
        if (!section) return;
        
        const rect = section.getBoundingClientRect();
        
        // Skip if section is completely out of view
        if (rect.bottom < 0 || rect.top > viewportHeight + 100) return;
        
        // Calculate score based on position and visibility
        let score = 0;
        
        // Priority 1: Sections near the top get highest score
        if (rect.top <= navHeight + 50) {
          score += 2000 - Math.abs(rect.top - navHeight);
        } else if (rect.top <= viewportHeight * 0.3) {
          score += 1500 - (rect.top - navHeight);
        } else {
          score += 500;
        }
        
        // Priority 2: Visible percentage
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        score += visibleHeight * 1.5;
        
        // Update best section if score is higher
        if (score > maxScore) {
          maxScore = score;
          bestSection = id;
        }
      });
      
      // Update active section if changed
      if (bestSection && bestSection !== activeSection) {
        activeSection = bestSection;
        (window as any).__updateActiveSection(bestSection);
      }
    }
    
    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          detectCurrentSection();
          ticking = false;
        });
        ticking = true;
      }
    }
    
    // Enhance nav links to set scroll lock
    function enhanceNavLinks() {
      const sectionIds = ['home', 'about', 'skills', 'certifications', 'resume', 'portfolio', 'contact'];
      
      sectionIds.forEach(id => {
        const links = document.querySelectorAll(`a[href="#${id}"]`);
        
        links.forEach(link => {
          if (!(link as any).__enhanced) {
            link.addEventListener('click', () => {
              // Clear existing timeout
              if (scrollLockTimeout) {
                clearTimeout(scrollLockTimeout);
              }
              
              // Set new timeout
              scrollLockTimeout = setTimeout(() => {
                scrollLockTimeout = null;
              }, 2500);
              
              // Update active section immediately
              activeSection = id;
              if ((window as any).__updateActiveSection) {
                (window as any).__updateActiveSection(id);
              }
            });
            
            // Mark as enhanced
            (link as any).__enhanced = true;
          }
        });
      });
    }
    
    // Initialize with a delay
    setTimeout(() => {
      // Do initial section detection
      detectCurrentSection();
      
      // Set up scroll listener
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Enhance nav links
      enhanceNavLinks();
      
      // Start observing DOM changes
      observer.observe(document.body, { childList: true, subtree: true });
      observerActive = true;
      
      // Check for sections periodically
      const intervalId = setInterval(() => {
        detectCurrentSection();
        enhanceNavLinks();
      }, 2000);
      
      // Clean up
      return () => {
        window.removeEventListener('scroll', handleScroll);
        observer.disconnect();
        clearInterval(intervalId);
        if (scrollLockTimeout) {
          clearTimeout(scrollLockTimeout);
        }
      };
    }, 1000);
  }, []);
  
  // This component doesn't render anything
  return null;
}
