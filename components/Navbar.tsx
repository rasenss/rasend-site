"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Home, User, FileText, Code, Briefcase, Mail, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Poppins } from 'next/font/google';
import EasterEgg from './EasterEgg';
import DirectContactLink from './DirectContactLink';
import { useBreakpoint } from '../lib/utils';

const poppins = Poppins({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
});  // Pre-defined animation variants for better performance
// Optimized animation variants for better performance
// Optimized animation variants with GPU acceleration and minimized properties
const navVariants = {
  hidden: { 
    opacity: 0, 
    y: -15,
    transition: { 
      duration: 0.12,
      ease: "easeOut"
    }
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.15,
      ease: "easeOut" 
    } 
  }
};

export default function Navbar() {  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to track if the menu is open
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // State to control navbar visibility
  const [easterEggType, setEasterEggType] = useState<'explosion' | 'confetti' | 'matrix' | 'glitch' | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [isClicking, setIsClicking] = useState(false);
  const [isHidden, setIsHidden] = useState(false); // State to track if navbar should be hidden for certificate preview

  // Refs
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickTimestampRef = useRef<number>(0);
  const navRef = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);
  const lastScrollY = useRef(0);
  const sectionRefs = useRef<Record<string, HTMLElement>>({});
  const scrollLockTimeout = useRef<NodeJS.Timeout | null>(null); // Add new ref for scroll lock
  const animationFrameId = useRef<number | null>(null); // Add ref for animation frame ID
  
  const navItems = useMemo(() => [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'about', name: 'About', icon: User },
    { id: 'skills', name: 'Skills', icon: Code },
    { id: 'certifications', name: 'Certifications', icon: FileText },
    { id: 'resume', name: 'Resume', icon: FileText },
    { id: 'portfolio', name: 'Portfolio', icon: Briefcase },
    { id: 'contact', name: 'Contact', icon: Mail },
  ], []);
  // Update section refs on mount and when DOM changes
  useEffect(() => {
    const updateSectionRefs = () => {
      const newSectionRefs: Record<string, HTMLElement> = {};
      navItems.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section) {
          newSectionRefs[id] = section;
        }
      });
      sectionRefs.current = newSectionRefs;
    };    // Initial section refs update
    updateSectionRefs();
    
    // Update on resize to account for layout changes
    window.addEventListener('resize', updateSectionRefs);
    
    // Update on scroll to catch any lazy-loaded elements
    const scrollHandler = () => {
      // Throttle updates to avoid performance issues
      if (!ticking.current) {
        requestAnimationFrame(() => {
          updateSectionRefs();
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    
    // Update every 2 seconds to catch any DOM changes
    const intervalId = setInterval(updateSectionRefs, 2000);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateSectionRefs);
      clearInterval(intervalId);
    };
  }, [navItems]);
  
  // Handle responsive viewport detection using useBreakpoint
  useEffect(() => {
    // This is now a no-op function to ensure backward compatibility
    // We're using the isMobile variable from useBreakpoint instead
    const checkIfMobile = () => {
      // No operation needed - isMobile is now derived from useBreakpoint hook
    };
    
    // These calls are kept for backward compatibility but don't do anything
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);  // Performance optimized scroll handler with throttling
  useEffect(() => {
    const scrollThreshold = 5; // Slightly higher threshold to reduce processing
    let isThrottled = false;
    let pendingUpdate = false;
    
    const handleScroll = () => {
      // Skip if already being processed
      if (isThrottled) {
        pendingUpdate = true;
        return;
      }
      
      isThrottled = true;
      
      // Process scroll event with requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        
        // Handle navbar background color change - simple binary change
        if ((currentScrollY > 10 && !isScrolled) || (currentScrollY <= 10 && isScrolled)) {
          setIsScrolled(currentScrollY > 10);
        }
        
        // Handle navbar visibility based on scroll direction with reduced sensitivity
        if (Math.abs(currentScrollY - lastScrollY.current) > scrollThreshold) {
          const shouldBeVisible = !isMenuOpen && (
            currentScrollY < 100 || 
            currentScrollY < lastScrollY.current
          );
          
          if (shouldBeVisible !== isVisible) {
            setIsVisible(shouldBeVisible);
          }
        }
        
        // Only update active section when not in a scroll lock and not on mobile menu
        if (!scrollLockTimeout.current && !isMenuOpen && navRef.current) {
          // Fast path for home section detection
          if (currentScrollY < 50) {
            if (activeSection !== 'home') {
              setActiveSection('home');
            }
          } 
          // Only run expensive calculations every 3rd frame or after significant scroll
          else if (
            activeSection !== 'home' && 
            (Math.abs(currentScrollY - lastScrollY.current) > 80)
          ) {
            const navHeight = navRef.current.offsetHeight;
            const viewportHeight = window.innerHeight;
            const navBuffer = navHeight + 20;
            
            // Simplified scoring algorithm - just look at top position and visibility
            // Skip loop for sections not likely to be visible
            let bestSection = activeSection;
            let bestScore = -1;
            
            // More efficient loop using cached section refs
            Object.entries(sectionRefs.current).forEach(([id, element]) => {
              const rect = element.getBoundingClientRect();
              
              // Quick exit for elements not in view at all
              if (rect.bottom < 0 || rect.top > viewportHeight + 50) return;
              
              // Simplified scoring - heavily favor position near top of viewport
              let score = 0;
              
              // Section top is near ideal position (just below navbar)
              if (rect.top >= 0 && rect.top <= navBuffer + 100) {
                score = 1000 - Math.abs(rect.top - navBuffer);
              }
              // Section is occupying a significant portion of the viewport
              else if (rect.top < viewportHeight * 0.5 && rect.bottom > viewportHeight * 0.3) {
                score = 800 - (rect.top * 0.8);
              }
              // Section is at least partially visible
              else if (rect.bottom > 0 && rect.top < viewportHeight) {
                score = 500 - Math.abs(rect.top - (viewportHeight * 0.3));
              }
              
              if (score > bestScore) {
                bestScore = score;
                bestSection = id;
              }
            });
            
            // Only update if section changed
            if (bestSection !== activeSection) {
              setActiveSection(bestSection);
            }
          }
        }
        
        // Update scroll position
        lastScrollY.current = currentScrollY;
        
        // Reset throttle after delay
        setTimeout(() => {
          isThrottled = false;
          
          // If updates were requested while throttled, process one more time
          if (pendingUpdate) {
            pendingUpdate = false;
            handleScroll();
          }
        }, 100); // 100ms throttle provides good balance
      });
    };

    // Use passive true for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initialize on mount
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection, isMenuOpen, isScrolled, isVisible]);

  // Handle Easter egg logic with debouncing
  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    const now = Date.now();
    // Prevent rapid clicks (debounce by 200ms)
    if (now - clickTimestampRef.current < 200) return;
    clickTimestampRef.current = now;
    
    // Clear any existing timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    // Update UI state to show click feedback
    setIsClicking(true);
    
    // Reset clicking state after animation completes
    clickTimeoutRef.current = setTimeout(() => {
      setIsClicking(false);
    }, 150);
    
    // Update click counter
    setClickCount(prev => {
      const newCount = prev + 1;
      
      // Handle Easter egg activation based on click count
      if (newCount === 5) {
        setEasterEggType('explosion');
      } else if (newCount === 10) {
        setEasterEggType('confetti');
      } else if (newCount === 15) {
        setEasterEggType('matrix');
      } else if (newCount === 20) {
        setEasterEggType('glitch');
        // Reset counter after glitch animation completes
        setTimeout(() => setClickCount(0), 4000);
        return newCount;
      }
      
      return newCount;
    });
  }, [setActiveSection, navRef, animationFrameId, isMenuOpen]);

  // Reset Easter egg after animation completes
  useEffect(() => {
    if (easterEggType) {
      const timeout = setTimeout(() => {
        setEasterEggType(null);
        // If this isn't the last Easter egg, increment the counter
        if (easterEggType !== 'glitch') {
          setClickCount(prev => prev + 1);
        }
      }, easterEggType === 'explosion' ? 2000 : 4000);
      
      return () => clearTimeout(timeout);
    }
  }, [easterEggType]);
  // Clean up any lingering timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);  // Helper function to handle smooth scrolling to sections
  const scrollToSection = useCallback((id: string) => {
    const section = document.getElementById(id);
    if (section) {
      // Set the active section immediately
      setActiveSection(id);
      
      // Set a scroll lock to prevent the scroll handler from updating active section during animation
      if (scrollLockTimeout.current) {
        clearTimeout(scrollLockTimeout.current);
      }
      
      // Lock for 2.5 seconds, which should cover most scroll animations
      // and give user time to start reading the section before tracking changes again
      scrollLockTimeout.current = setTimeout(() => {
        scrollLockTimeout.current = null;
      }, 2500);
        // Special handling for contact section to ensure it always scrolls properly
      if (id === 'contact') {
        // For contact section, use a slightly different approach with a small delay
        // to ensure all animations and calculations are complete
        setTimeout(() => {
          const contactAnchor = document.getElementById('contact-anchor');
          const contactSection = document.getElementById('contact');
          const targetElement = contactAnchor || contactSection;
          
          if (targetElement) {
            const navHeight = navRef.current ? navRef.current.offsetHeight : 0;
            const rect = targetElement.getBoundingClientRect();
            const offsetPosition = window.scrollY + rect.top - navHeight - 40; // Extra buffer for proper positioning
            
            // Temporarily disable smooth scrolling for precise control
            document.documentElement.style.scrollBehavior = 'auto';
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'auto',
            });
            
            // Add highlight animation to the contact section
            if (contactSection) {
              contactSection.classList.add('contact-highlight');
              
              // Remove class after animation completes
              setTimeout(() => {
                contactSection.classList.remove('contact-highlight');
              }, 1500);
            }
            
            // Re-enable smooth scrolling after a short delay
            setTimeout(() => {
              document.documentElement.style.scrollBehavior = '';
            }, 100);
          }
        }, 50); // Small delay to ensure DOM is ready
      } else {
        // Standard scrolling for other sections
        const navHeight = navRef.current ? navRef.current.offsetHeight : 0;
        const sectionPosition = section.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = sectionPosition - navHeight - 16; // Buffer for other sections
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
      
      setIsMenuOpen(false);
      
      // Prevent default scroll behavior that might be causing overshooting
      return false;
    }
  }, []);// Special dedicated function for navigating to contact section
  const goToContactSection = useCallback(() => {
    // Use the global function from ContactNavFix if available
    if (typeof (window as any).__goToContact === 'function') {
      (window as any).__goToContact();
      return;
    }
    
    // Set active section
    setActiveSection('contact');
    
    // Get contact section element with fallbacks
    const contactAnchor = document.getElementById('contact-anchor');
    const contactSection = document.getElementById('contact');
    const targetElement = contactAnchor || contactSection;
    
    if (targetElement) {
      // Cancel any ongoing animations
      if (typeof animationFrameId.current === 'number') {
        window.cancelAnimationFrame(animationFrameId.current);
      }
      
      // Temporarily disable smooth scrolling in the document
      document.documentElement.style.scrollBehavior = 'auto';
      
      // Calculate position
      const navHeight = navRef.current ? navRef.current.offsetHeight : 0;
      const rect = targetElement.getBoundingClientRect();
      const offset = window.scrollY + rect.top;
      
      // Immediately jump to position
      window.scrollTo(0, offset - navHeight - 80); // Increased offset
      
      // Make a second scroll to ensure we're in the right position
      setTimeout(() => {
        const updatedRect = targetElement.getBoundingClientRect();
        const updatedOffset = window.scrollY + updatedRect.top - navHeight - 80;
        window.scrollTo(0, updatedOffset);
        
        // Apply highlight effect
        if (contactSection && !contactSection.classList.contains('contact-highlight')) {
          contactSection.classList.add('contact-highlight');
          
          setTimeout(() => {
            contactSection.classList.remove('contact-highlight');
          }, 1500);
        }
      }, 50);
      
      // Close mobile menu
      setIsMenuOpen(false);
      
      // Restore smooth scrolling after a short delay
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = '';
      }, 100);
    }
  }, [navRef, setActiveSection, setIsMenuOpen]);
    // Effect to handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);
  
  // Effect to handle transitions when isHidden changes
  useEffect(() => {
    // When showing navbar after being hidden, we want to ensure smooth transition
    if (!isHidden) {
      // Small delay to ensure animations run smoothly
      const timeoutId = setTimeout(() => {
        if (navRef.current) {
          navRef.current.classList.add('navbar-transition-complete');
        }
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      // Remove transition class when hiding
      if (navRef.current) {
        navRef.current.classList.remove('navbar-transition-complete');
      }
    }
  }, [isHidden]);
  // Expose functions to window so DirectContactLink can access them
  useEffect(() => {
    (window as any).__updateActiveSection = (section: string) => {
      setActiveSection(section);
    };
    
    (window as any).__closeMobileMenu = () => {
      setIsMenuOpen(false);
    };    // Add function to toggle navbar visibility for certificate previews
    // Optimized for smoother transitions with better performance
    (window as any).__toggleNavbarForCertificatePreview = (isPreviewOpen: boolean) => {
      if (isPreviewOpen) {
        // Hide immediately to avoid visual glitches
        if (navRef.current) {
          // Use direct DOM manipulation for better performance
          navRef.current.style.opacity = '0';
          navRef.current.style.transform = 'translate(-50%, -10px)';
          navRef.current.style.pointerEvents = 'none';
          
          // Set state after a tiny delay to avoid unnecessary re-renders during animation
          requestAnimationFrame(() => {
            setIsHidden(true);
          });
        } else {
          setIsHidden(true);
        }
      } else {
        // Small delay before showing navbar again to make transition smoother
        setTimeout(() => {
          setIsHidden(false);
          
          if (navRef.current) {
            // Reset styles after state update for smooth reveal
            requestAnimationFrame(() => {
              navRef.current!.style.opacity = '';
              navRef.current!.style.transform = '';
              navRef.current!.style.pointerEvents = '';
            });
          }
        }, 150);
      }
    };
    
    // Add function to force update section refs - useful if DOM changes
    (window as any).__forceUpdateSectionRefs = () => {
      const newSectionRefs: Record<string, HTMLElement> = {};
      navItems.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section) {
          newSectionRefs[id] = section;
        }
      });
      sectionRefs.current = newSectionRefs;
    };
    
    return () => {
      delete (window as any).__updateActiveSection;
      delete (window as any).__closeMobileMenu;
      delete (window as any).__toggleNavbarForCertificatePreview;
      delete (window as any).__forceUpdateSectionRefs;
    };
  }, [navItems]);

  return (
    <>
      {/* Only render Easter Egg component when needed */}
      {easterEggType && <EasterEgg type={easterEggType} />}
      
      {/* Main navigation */}
      <motion.nav
        ref={navRef}
        initial="hidden"
        animate={isHidden ? "hidden" : "visible"} // Hide when certificate preview is active
        variants={navVariants}
        className={`${poppins.className} fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl 
          ${isScrolled 
            ? 'bg-gray-900/95 text-white' 
            : 'bg-gray-800/90 text-white'}          backdrop-blur-lg shadow-xl rounded-full transition-all duration-300 
          border-[2px] ${isScrolled ? 'border-gray-700' : 'border-blue-900/70'}
          transform translate-y-4 ${isHidden ? 'opacity-0 pointer-events-none -translate-y-4' : 'opacity-100'}`}
        style={{
          boxShadow: isScrolled 
            ? '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset' 
            : '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.03) inset'
        }}
      >
        <div className="flex items-center justify-between px-6 py-3 md:px-10">
          {/* Logo with Easter Egg */}
          <div
            onClick={handleLogoClick}
            className={`text-gray-900 text-xl font-bold relative cursor-pointer select-none
              transition-transform duration-150 ${isClicking ? 'scale-95 translate-y-0.5' : 'scale-100'}
              hover:scale-105 hover:text-shadow-sm`}
            style={{
              textShadow: isClicking ? '0 0 8px rgba(59, 130, 246, 0.5)' : 'none',
            }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              Rasendriya
            </span>
            
            {/* Click indicator - shows the number of clicks subtly */}
            {clickCount > 0 && (
              <span 
                className={`absolute -top-3 -right-5 text-xs text-blue-400 transition-opacity duration-300 ${
                  isClicking ? 'opacity-100' : 'opacity-70'
                }`}
              >
                {clickCount}
              </span>
            )}
          </div>          {/* Navigation Items - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => {
              // Use special DirectContactLink for contact section
              if (item.id === 'contact') {
                return (
                  <DirectContactLink 
                    key={item.id} 
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-full transition-all 
                      hover:scale-105 active:scale-95 ${
                      activeSection === 'contact'
                        ? 'text-white bg-gradient-to-r from-indigo-500/90 to-blue-500/90 shadow-md border border-blue-400/20'
                        : 'text-gray-200 hover:bg-[rgb(38,43,61)]/80 hover:border-gray-600 border border-transparent'
                      }`}
                  />
                );
              }
              
              // Regular navigation for other sections
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-full transition-all 
                    hover:scale-105 active:scale-95                    ${activeSection === item.id
                      ? 'text-white bg-gradient-to-r from-indigo-500/90 to-blue-500/90 shadow-md border border-blue-400/20'
                      : 'text-gray-200 hover:bg-[rgb(38,43,61)]/80 hover:border-gray-600 border border-transparent'
                    }`}                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Stop event propagation
                    
                    // Special direct handling for contact section
                    if (item.id === 'contact') {
                      // Use the global contact navigation function if available
                      if (typeof (window as any).__goToContact === 'function') {
                        (window as any).__goToContact();
                        return false;
                      }
                      
                      // Set active section
                      setActiveSection('contact');
                      
                      // Get contact section element - prefer anchor if available
                      const contactAnchor = document.getElementById('contact-anchor');
                      const contactSection = document.getElementById('contact');
                      const targetElement = contactAnchor || contactSection;
                      
                      if (targetElement) {
                        // Temporarily disable smooth scrolling for precise positioning
                        document.documentElement.style.scrollBehavior = 'auto';
                        
                        // Directly set scroll position without animation
                        const navHeight = navRef.current ? navRef.current.offsetHeight : 0;
                        const rect = targetElement.getBoundingClientRect();
                        const offset = window.scrollY + rect.top - navHeight - 80; // Increased offset
                        
                        // Immediately scroll to position
                        window.scrollTo({
                          top: offset, 
                          behavior: 'auto' // No animation
                        });
                        
                        // Second scroll after a tiny delay to ensure correct positioning
                        setTimeout(() => {
                          const updatedRect = targetElement.getBoundingClientRect();
                          const updatedOffset = window.scrollY + updatedRect.top - navHeight - 80;
                          window.scrollTo({
                            top: updatedOffset,
                            behavior: 'auto'
                          });
                          
                          // Add highlight effect to contact section
                          if (contactSection) {
                            contactSection.classList.add('contact-highlight');
                            
                            // Remove class after animation completes
                            setTimeout(() => {
                              contactSection.classList.remove('contact-highlight');
                            }, 1500);
                          }
                        }, 50);
                        
                        // Re-enable smooth scrolling after a short delay
                        setTimeout(() => {
                          document.documentElement.style.scrollBehavior = '';
                        }, 100);
                        
                        // Close mobile menu
                        setIsMenuOpen(false);
                      }
                      return false;
                    }
                    
                    return scrollToSection(item.id);
                  }}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile & Tablet Controls */}
          <div className="flex items-center space-x-3 lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white bg-gray-800/80 
                hover:bg-gray-700 rounded-full transition-colors active:scale-95
                border border-gray-600 shadow-sm"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Compact dropdown for small screens */}
        <AnimatePresence>          {isMenuOpen && (            <motion.div
              initial={{ opacity: 0, height: 0, y: -5 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ 
                duration: 0.15, 
                ease: "easeOut"
              }}
              className="lg:hidden overflow-hidden bg-gray-900/95 rounded-2xl mt-2 
                border border-gray-700 shadow-xl animate-gpu fixed left-4 right-4 z-50 navbar-mobile-menu"
              style={{ 
                willChange: "opacity",
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                maxHeight: 'calc(100vh - 80px)',
                overflowY: 'auto'
              }}
            >
              <div className="px-4 py-3 space-y-2">
                {navItems.map((item, index) => {
                  // Special handling for contact section in mobile menu
                  if (item.id === 'contact') {
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          duration: 0.2,
                          delay: 0.05 + (index * 0.03),
                          ease: "easeOut"
                        }}
                      >
                        <DirectContactLink 
                          className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl 
                            transition-colors duration-150 active:scale-98 ${
                            activeSection === 'contact'
                              ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-md border border-blue-500/20'
                              : 'text-gray-300 hover:bg-gray-800/70 border border-transparent hover:border-gray-700'
                            }`}
                        />
                      </motion.div>
                    );
                  }
                  
                  // Regular items
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.2,
                        delay: 0.05 + (index * 0.03),
                        ease: "easeOut"
                      }}
                    >                      <Link
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation(); // Stop event propagation
                          
                          // Handle navigation for different sections
                          if (item.id === 'contact') {
                            // Set active section
                            setActiveSection('contact');
                            
                            // Get contact section element
                            const contactSection = document.getElementById('contact');
                            if (contactSection) {
                              // Directly set scroll position without animation
                              const navHeight = navRef.current ? navRef.current.offsetHeight : 0;
                              const offset = contactSection.getBoundingClientRect().top + window.scrollY;
                              
                              // Immediately scroll to position
                              window.scrollTo({
                                top: offset - navHeight - 32, // Extra buffer
                                behavior: 'auto' // No animation
                              });
                              
                              // Close mobile menu
                              setIsMenuOpen(false);
                            }
                            return false;
                          }
                          
                          // Regular sections use standard scrolling
                          return scrollToSection(item.id);
                        }}
                        className={`navbar-menu-item flex items-center space-x-3 w-full px-4 py-3 rounded-xl 
                          transition-colors duration-150 active:scale-98 ${
                          activeSection === item.id
                            ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-md border border-blue-500/20 active'
                            : 'text-gray-300 hover:bg-gray-800/70 border border-transparent hover:border-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </motion.div>
                    );
                  })}
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>  );
}
