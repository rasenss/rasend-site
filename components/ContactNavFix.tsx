"use client";

import React, { useEffect } from 'react';

// This is a script component that fixes the contact navigation issues
export default function ContactNavFix() {
  useEffect(() => {
    // Function to get precise contact section position
    const getContactScrollPosition = () => {
      const contactSection = document.getElementById('contact');
      if (!contactSection) return 0;
      
      // Get navbar height for offset calculation
      const navbarHeight = document.querySelector('nav')?.getBoundingClientRect().height || 80;
      
      // Get the absolute position in the document
      const sectionRect = contactSection.getBoundingClientRect();
      const scrollPosition = window.scrollY + sectionRect.top - navbarHeight - 50; // Extra buffer for spacing
      
      return scrollPosition;
    };    // Make a global function that any component can use
    (window as any).__goToContact = () => {
      const contactSection = document.getElementById('contact');
      if (!contactSection) return;
      
      // Get the contact anchor or fallback to the section
      const contactAnchor = document.getElementById('contact-anchor') || contactSection;
      
      // Update navbar active section
      if (typeof (window as any).__updateActiveSection === 'function') {
        (window as any).__updateActiveSection('contact');
      }
      
      // Close mobile menu if open
      const menuButton = document.querySelector('button[aria-label="Toggle menu"]');
      const menuXIcon = document.querySelector('svg.lucide-x');
      if (menuButton && menuXIcon) {
        (menuButton as HTMLButtonElement).click();
      }
      
      // Calculate position
      const navbarHeight = document.querySelector('nav')?.getBoundingClientRect().height || 80;
      const offset = navbarHeight + 20; // Additional offset to ensure visibility
      
      // Simple, effective scroll with the contactAnchor
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
    const fixContactNavigation = () => {
      // Get all links to the contact section
      const contactLinks = document.querySelectorAll('a[href="#contact"]');
      
      // Remove and replace links to clear all existing event handlers
      contactLinks.forEach(link => {
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
            window.removeEventListener('scroll', (window as any).scrollEndCallback);
          }
          
          // Call our global navigation function
          if (typeof (window as any).__goToContact === 'function') {
            (window as any).__goToContact();
          }
          
          return false;
        }, { capture: true, passive: false });
      });
    };
    
    // Run immediately and also set up a mutation observer to handle dynamically added links
    setTimeout(fixContactNavigation, 500); // Delay to ensure DOM is fully loaded
    
    // Also watch for any new links added to the DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          fixContactNavigation();
        }
      });
    });
    
    observer.observe(document.body, { 
      childList: true,
      subtree: true
    });
    
    return () => {
      observer.disconnect();
      delete (window as any).__goToContact;
    };
  }, []);
  
  return null; // This component doesn't render anything
}
