"use client";

import Script from 'next/script';

/**
 * Component to include the navbar debug script on the page
 * This helps improve section detection for the navbar
 */
export default function NavbarDebugScript() {
  return (
    <Script
      id="navbar-debug"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', () => {
            // Inject navbar debug helper functions
            const navbarSectionDetector = {
              // Track current section and state
              activeSection: 'home',
              isTicking: false,
              scrollLockTimeout: null,
              lastScrollY: window.scrollY,
              
              // Main initialization function
              init() {
                console.log('Navbar section detector initialized');
                
                // Check if navbar functions exist
                if (typeof window.__updateActiveSection !== 'function') {
                  console.warn('Navbar section detector: Required global functions not found');
                  
                  // Try again in 1 second
                  setTimeout(() => this.init(), 1000);
                  return;
                }
                
                // Set up scroll listener
                window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
                
                // Initial detection
                setTimeout(() => this.detectCurrentSection(), 500);
              },
              
              // Optimized scroll handler
              handleScroll() {
                if (this.isTicking) return;
                
                this.isTicking = true;
                requestAnimationFrame(() => {
                  // Skip if scroll is locked
                  if (!this.scrollLockTimeout) {
                    this.detectCurrentSection();
                  }
                  
                  this.lastScrollY = window.scrollY;
                  this.isTicking = false;
                });
              },
              
              // Set scroll lock when clicking navigation items
              setScrollLock() {
                if (this.scrollLockTimeout) {
                  clearTimeout(this.scrollLockTimeout);
                }
                
                this.scrollLockTimeout = setTimeout(() => {
                  this.scrollLockTimeout = null;
                }, 2500);
              },
              
              // Enhanced section detection algorithm
              detectCurrentSection() {
                const viewportHeight = window.innerHeight;
                const currentScrollY = window.scrollY;
                const navHeight = 80; // Approximate navbar height
                
                // Special case for top of page
                if (currentScrollY < 50) {
                  if (this.activeSection !== 'home') {
                    this.activeSection = 'home';
                    window.__updateActiveSection('home');
                  }
                  return;
                }
                
                // Get all section elements
                const navItems = [
                  'home', 'about', 'skills', 'certifications', 
                  'resume', 'portfolio', 'contact'
                ];
                
                let bestSection = this.activeSection;
                let maxScore = -1;
                
                // Calculate scores for each section
                navItems.forEach(id => {
                  const section = document.getElementById(id);
                  if (!section) return;
                  
                  const rect = section.getBoundingClientRect();
                  
                  // Skip if section is completely out of view
                  if (rect.bottom < 0 || rect.top > viewportHeight + 100) return;
                  
                  // Calculate various scores
                  
                  // 1. Position score - highest for sections near the top
                  let positionScore = 0;
                  if (rect.top <= navHeight + 20) {
                    // Section is at or just below navbar - highest priority
                    positionScore = 2000 - Math.abs(rect.top - navHeight);
                  } else if (rect.top <= viewportHeight * 0.3) {
                    // Section is in upper part of viewport - high priority
                    positionScore = 1500 - (rect.top - navHeight);
                  } else if (rect.top <= viewportHeight * 0.6) {
                    // Section is in middle of viewport - medium priority
                    positionScore = 1000;
                  } else {
                    // Section is in lower part of viewport - lower priority
                    positionScore = 500;
                  }
                  
                  // 2. Visibility score - how much of section is visible
                  const visibleTop = Math.max(0, rect.top);
                  const visibleBottom = Math.min(viewportHeight, rect.bottom);
                  const visibleHeight = Math.max(0, visibleBottom - visibleTop);
                  const visibilityScore = visibleHeight * 2;
                  
                  // 3. Scrolling direction bonus - when scrolling down, favor sections at top
                  const directionBonus = (currentScrollY > this.lastScrollY && rect.top <= navHeight + 100) ? 500 : 0;
                  
                  // Calculate final score
                  const totalScore = positionScore + visibilityScore + directionBonus;
                  
                  // Update best section if score is higher
                  if (totalScore > maxScore) {
                    maxScore = totalScore;
                    bestSection = id;
                  }
                });
                
                // Update active section if changed
                if (bestSection && bestSection !== this.activeSection) {
                  this.activeSection = bestSection;
                  window.__updateActiveSection(bestSection);
                }
              }
            };
            
            // Initialize detector
            setTimeout(() => navbarSectionDetector.init(), 1000);
            
            // Make detector available globally for debugging
            window.__navbarSectionDetector = navbarSectionDetector;
          });
        `
      }}
    />
  );
}
