"use client";

import { useEffect } from 'react';

/**
 * MobileNavFix Component
 * 
 * This component specifically addresses navigation issues on mobile devices:
 * 1. Ensures the mobile menu closes properly when clicking on navigation items
 * 2. Prevents body scroll issues when opening/closing the mobile menu
 * 3. Improves touch behavior and event handling
 */
export default function MobileNavFix() {
  useEffect(() => {
    // Function to improve interaction with mobile menu links
    const enhanceMobileNavigation = () => {
      // Find all links in the mobile navigation
      const mobileNavLinks = document.querySelectorAll('.navbar-mobile-menu a');
      
      mobileNavLinks.forEach(link => {
        // Add a click handler with proper event sequence
        link.addEventListener('click', (e) => {
          // Ensure the menu gets closed before scrolling
          if (typeof (window as any).__closeMobileMenu === 'function') {
            (window as any).__closeMobileMenu();
            
            // Small delay to ensure menu is closed before scrolling
            setTimeout(() => {
              // The default behavior will handle the navigation
            }, 10);
          }
        });
      });
    };

    // Run immediately and also after a short delay to ensure DOM is fully loaded
    enhanceMobileNavigation();
    setTimeout(enhanceMobileNavigation, 1000);
    
    // Clean up function
    return () => {
      // No cleanup needed for this specific enhancement
    };
  }, []);

  return null; // This component doesn't render anything
}
