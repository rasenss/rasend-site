"use client";

import { useEffect } from 'react';

// This is a script component that fixes the contact navigation issues
export default function ContactNavFix() {
  useEffect(() => {
    // Make a global function that any component can use
    ((window as unknown) as Window & { __goToContact: () => void }).__goToContact = () => {
      const contactSection = document.getElementById('contact');
      if (!contactSection) return;
      
      // Update navbar active section
      if (typeof (window as Window & { __updateActiveSection?: (section: string) => void }).__updateActiveSection === 'function') {
        (window as Window & { __updateActiveSection?: (section: string) => void }).__updateActiveSection?.('contact');
      }
      
      // Close mobile menu if open
      const menuButton = document.querySelector('button[aria-label="Toggle menu"]');
      const menuXIcon = document.querySelector('svg.lucide-x');
      if (menuButton && menuXIcon) {
        (menuButton as HTMLButtonElement).click();
      }
        // Get navbar height for scroll positioning
      const _navHeight = document.querySelector('nav')?.getBoundingClientRect().height || 80;
      
      // Simple, effective scroll with the contact section
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Apply simpler highlight animation
      setTimeout(() => {
        // Reset any previous animation
        contactSection.classList.remove('contact-highlight');
        void contactSection.offsetWidth; // Force reflow
        
        // Apply animation class
        contactSection.classList.add('contact-highlight');
        
        // Focus the first form input for accessibility
        const input = contactSection.querySelector('form input') as HTMLElement;
        if (input) {
          setTimeout(() => input.focus(), 500);
        }
      }, 600);
    };
    
    // Function for reliable contact navigation
    const setupContactNavigation = () => {
      // Get all links to the contact section
      const contactLinks = document.querySelectorAll('a[href="#contact"]');
      
      // Remove and replace links to clear all existing event handlers
      contactLinks.forEach((link: Element) => {
        // Skip DirectContactLink component to avoid duplication
        if (link.closest('.direct-contact-link')) {
          return;
        }
        
        // Don't replace the link, just add a new event listener with capture and passive: false
        // This gives us priority over other handlers without DOM manipulation
        link.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Cancel any ongoing scrolls
          if ('scrollEndCallback' in window) {
            window.removeEventListener('scroll', (window as Window & { scrollEndCallback?: EventListener }).scrollEndCallback as EventListener);
          }
          
          // Call our global navigation function
          if (typeof (window as Window & { __goToContact?: () => void }).__goToContact === 'function') {
            (window as Window & { __goToContact?: () => void }).__goToContact?.();
          }
          
          return false;
        }, { capture: true, passive: false });
      });
    };
    
    // Run immediately and also set up a mutation observer to handle dynamically added links
    setTimeout(setupContactNavigation, 500); // Delay to ensure DOM is fully loaded
    
    // Also watch for any new links added to the DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          setupContactNavigation();
        }
      });
    });
    
    observer.observe(document.body, { 
      childList: true,
      subtree: true
    });
    
    return () => {
      observer.disconnect();
      delete (window as Window & { __goToContact?: () => void }).__goToContact;
    };
  }, []);
  
  // This component doesn't render anything
  return null;
}

