/**
 * Navbar Section Detection Enhancement Script
 * 
 * This script adds helpers to improve navbar section highlighting
 * as users scroll through the page.
 * 
 * Add this script via a script tag in your HTML, or import it in your JavaScript bundle.
 */

// Wait for document to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for React to initialize
  setTimeout(() => {
    enhanceNavbarSectionDetection();
  }, 1000); // Longer delay to ensure React has fully initialized

function enhanceNavbarSectionDetection() {
  console.log("🚀 Enhancing navbar section detection");
  
  // Constants for tuning
  const SCROLL_THRESHOLD = 2; // Even more sensitive scroll detection
  const TOP_SECTION_PRIORITY = true; // Prioritize sections at top of viewport
  const SECTION_SNAP_DISTANCE = 120; // How close a section top needs to be to navbar to snap to it

  // Check if the navbar functions exist
  if (typeof window.__updateActiveSection !== 'function' || 
      typeof window.__forceUpdateSectionRefs !== 'function') {
    console.warn('Navbar enhancement: Required global functions not found!');
    return;
  }
  
  // Force refresh section references
  if (window.__forceUpdateSectionRefs) {
    window.__forceUpdateSectionRefs();
  }
  
  // Get all section IDs from the navbar items
  const navItems = Array.from(document.querySelectorAll('nav a[href^="#"]'))
    .map(link => {
      const href = link.getAttribute('href');
      return href ? href.substring(1) : null;
    })
    .filter(Boolean);
  
  // Set up enhanced scroll detection
  let ticking = false;
  let lastScrollY = window.scrollY;
  let scrollLockTimeout = null;
  let activeSection = '';
  
  function detectCurrentSection() {
    // Skip if scroll is locked
    if (scrollLockTimeout) return;
    
    const currentScrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    let maxScore = -1;
    let bestSection = null;
    const navHeight = 80; // Approximate navbar height
    
    // Special case for top of page
    if (currentScrollY < 50) {
      bestSection = 'home';
    } else {
      // Check each section
      navItems.forEach(id => {
        const section = document.getElementById(id);
        if (!section) return;
        
        const rect = section.getBoundingClientRect();
        
        // Skip if section is not visible
        if (rect.bottom < 0 || rect.top > viewportHeight + 100) return;
        
        // Calculate various scores
        let score = 0;
        
        // Priority 1: Section near the top gets highest priority
        if (rect.top <= SECTION_SNAP_DISTANCE && rect.top >= -SECTION_SNAP_DISTANCE) {
          score += 1000;
        }
        
        // Priority 2: Sections at top of viewport get high priority when scrolling down
        if (TOP_SECTION_PRIORITY && currentScrollY > lastScrollY) {
          score += Math.max(0, 500 - rect.top);
        }
        
        // Priority 3: Visible height in viewport
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        score += visibleHeight * 0.8;
        
        // Priority 4: Bonus for sections occupying center of viewport
        if (rect.top <= viewportHeight * 0.6 && rect.bottom >= viewportHeight * 0.4) {
          score += 200;
        }
        
        // If this section has the highest score, it's our best candidate
        if (score > maxScore) {
          maxScore = score;
          bestSection = id;
        }
      });
    }
    
    // Update active section if changed
    if (bestSection && bestSection !== activeSection) {
      activeSection = bestSection;
      window.__updateActiveSection(bestSection);
    }
    
    lastScrollY = currentScrollY;
  }
  
  // Handle scroll events
  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        detectCurrentSection();
        ticking = false;
      });
      ticking = true;
    }
  }
  
  // Replace click handlers on navigation items
  navItems.forEach(id => {
    const links = document.querySelectorAll(`a[href="#${id}"]`);
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Set active section immediately
        window.__updateActiveSection(id);
        
        // Get the target section
        const section = document.getElementById(id);
        if (!section) return;
        
        // Set scroll lock
        if (scrollLockTimeout) {
          clearTimeout(scrollLockTimeout);
        }
        
        scrollLockTimeout = setTimeout(() => {
          scrollLockTimeout = null;
        }, 2500);
        
        // Scroll to section
        const navHeight = 80; // Approximate navbar height
        const sectionPosition = section.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = sectionPosition - navHeight - 16;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      });
    });
  });
  
  // Set up scroll listener
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Initial detection
  detectCurrentSection();
  
  console.log('Navbar section detection enhancement initialized');
}
