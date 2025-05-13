"use client";

import { useEffect } from 'react';

// This component is responsible for fixing mobile compatibility issues
// by applying additional CSS rules and classes to specific elements
export default function MobileCompatFix() {  useEffect(() => {
    // Apply mobile fixes when the component mounts
    const applyMobileFixes = () => {
      // Ensure the mobile menu closes when clicking outside of it
      const handleOutsideClick = (e: MouseEvent) => {
        const mobileMenu = document.querySelector('.navbar-mobile-menu');
        const mobileMenuButton = document.querySelector('button[aria-label="Toggle menu"]');
        
        if (mobileMenu && !mobileMenu.contains(e.target as Node) && 
            mobileMenuButton && !mobileMenuButton.contains(e.target as Node)) {
          // Call the close menu function if it exists
          if (typeof (window as any).__closeMobileMenu === 'function') {
            (window as any).__closeMobileMenu();
          }
        }
      };
      
      // Add click handler to document
      document.addEventListener('click', handleOutsideClick);
      
      // Check if we're on a mobile device or low-end device using the data attribute
      const isMobileOrLowEnd = 
        document.documentElement.dataset.lowEndDevice === 'true' || 
        window.innerWidth <= 640;
      
      // Apply mobile optimizations based on device capability
      if (isMobileOrLowEnd) {
        // Fix white background in skills section on mobile
        const skillsElements = document.querySelectorAll('.skills-search-container, .skills-view-toggle, .skills-filter-tag');
        skillsElements.forEach(element => {
          if (element) {
            (element as HTMLElement).style.backgroundColor = 'rgb(28, 33, 51)';
            (element as HTMLElement).classList.add('skills-mobile-bg');
          }
        });
          // Fix navbar menu styling and touch behavior
        const navbarItems = document.querySelectorAll('.navbar-menu-item');
        navbarItems.forEach(item => {
          if (item) {
            (item as HTMLElement).classList.add('navbar-mobile-menu-item');
            
            // Fix touch behavior on mobile
            item.addEventListener('touchstart', (e) => {
              // Prevent default touch behavior that might interfere with our custom handling
              e.stopPropagation();
            }, { passive: true });
          }
        });
        
        // Apply specific styling to search and view toggle areas
        document.querySelectorAll('input[placeholder="Search skills..."]').forEach(input => {
          const parent = input.parentElement?.parentElement;
          if (parent) {
            parent.classList.add('skills-mobile-bg');
            (parent as HTMLElement).style.backgroundColor = 'rgb(28, 33, 51)';
          }
        });
        
        // Additional fixes for skills section card/list view toggle
        document.querySelectorAll('.flex.bg-\\[rgb\\(38\\,43\\,61\\)\\]\\/90').forEach(element => {
          (element as HTMLElement).classList.add('skills-mobile-bg');
          (element as HTMLElement).style.backgroundColor = 'rgb(28, 33, 51)';
        });
      }
    };
    
    // Handle device detection
    const detectDeviceCapabilities = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isLowEndDevice = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || window.innerWidth < 768;
      
      // Set data attribute instead of class to avoid hydration issues
      document.documentElement.dataset.lowEndDevice = (isMobileDevice || isLowEndDevice).toString();
    };
    
    // Run detection and apply fixes
    detectDeviceCapabilities();
    applyMobileFixes();
    
    // Set up event listeners
    window.addEventListener('resize', applyMobileFixes);
      // Reference to the outside click handler for cleanup
    const handleOutsideClick = (e: MouseEvent) => {
      const mobileMenu = document.querySelector('.navbar-mobile-menu');
      const mobileMenuButton = document.querySelector('button[aria-label="Toggle menu"]');
      
      if (mobileMenu && !mobileMenu.contains(e.target as Node) && 
          mobileMenuButton && !mobileMenuButton.contains(e.target as Node)) {
        // Call the close menu function if it exists
        if (typeof (window as any).__closeMobileMenu === 'function') {
          (window as any).__closeMobileMenu();
        }
      }
    };
    
    // Add document click handler
    document.addEventListener('click', handleOutsideClick);
    
    // Clean up on unmount
    return () => {
      window.removeEventListener('resize', applyMobileFixes);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}
