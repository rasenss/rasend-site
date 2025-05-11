"use client";

import React from 'react';
import { Mail } from 'lucide-react';

export default function DirectContactLink({ className }: { className?: string }) {    const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use global contact navigation if available (from ContactNavFix)
    if (typeof (window as any).__goToContact === 'function') {
      (window as any).__goToContact();
      return false;
    }
    
    // Simple fallback implementation if global function isn't available
    const contactSection = document.getElementById('contact');
    if (!contactSection) return false;
    
    // Update active section in navbar
    if (typeof (window as any).__updateActiveSection === 'function') {
      (window as any).__updateActiveSection('contact');
    }
    
    // Close mobile menu if open
    if (typeof (window as any).__closeMobileMenu === 'function') {
      (window as any).__closeMobileMenu();
    } else {
      const menuButton = document.querySelector('button[aria-label="Toggle menu"]');
      const menuXIcon = document.querySelector('svg.lucide-x');
      if (menuButton && menuXIcon) {
        (menuButton as HTMLButtonElement).click();
      }
    }
    
    // Simple scroll to the contact section
    contactSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    
    setTimeout(() => {
      contactSection.classList.add('contact-highlight');
      
      // Focus the first form input for accessibility
      const input = contactSection.querySelector('form input') as HTMLElement;
      if (input) {
        setTimeout(() => input.focus(), 500);
      }
    }, 500);
    
    return false;
  };
    return (
    <a
      href="#contact"
      className={`direct-contact-link ${className || 
        "flex items-center space-x-1.5 px-4 py-2 rounded-full transition-all hover:scale-105 text-white bg-gradient-to-r from-indigo-500/90 to-blue-500/90 shadow-md border border-blue-400/20"}`}
      onClick={handleContactClick}
      aria-label="Navigate to contact section"
    >
      <Mail className="w-4 h-4 md:w-5 md:h-5" />
      <span>Contact</span>
    </a>
  );
}
