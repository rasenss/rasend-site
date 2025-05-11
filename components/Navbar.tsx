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
const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

// Defined mobile menu animation variants
const menuVariants = {
  closed: { 
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" }
  },
  open: { 
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to track if the menu is open
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [easterEggType, setEasterEggType] = useState<'explosion' | 'confetti' | 'matrix' | 'glitch' | null>(null);
  const [clickCount, setClickCount] = useState(0);  const [isClicking, setIsClicking] = useState(false);
  
  // Use breakpoint hook for responsive behavior
  const { isSm, isMd } = useBreakpoint();
  const isMobile = !isMd; // Consider anything below md as mobile

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
    };

    updateSectionRefs();
    
    // Update on resize to account for layout changes
    window.addEventListener('resize', updateSectionRefs);
    return () => {
      window.removeEventListener('resize', updateSectionRefs);
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
  }, []);
  
  // Single consolidated scroll handler for all scroll-related effects
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Handle navbar background color change
          setIsScrolled(currentScrollY > 10);
          
          // Handle navbar visibility based on scroll direction
          if (Math.abs(currentScrollY - lastScrollY.current) > 10) {
            setIsVisible(!isMenuOpen && (
              currentScrollY < 100 || 
              currentScrollY < lastScrollY.current
            ));
          }
          
          // Update active section based on scroll position
          if (navRef.current) {
            const navHeight = navRef.current.offsetHeight;
            const viewportHeight = window.innerHeight;
            const scrollOffset = navHeight + 50;

            // Skip updating active section if scroll lock is active
            if (!scrollLockTimeout.current) {
              // Handle default case for home section
              if (currentScrollY < 100) {
                setActiveSection('home');
              } else {
                // Find the most visible section
                let maxVisibility = 0;
                let currentSection = activeSection;
            
                Object.entries(sectionRefs.current).forEach(([id, element]) => {
                  const rect = element.getBoundingClientRect();
                  
                  // Skip if section is not visible
                  if (rect.bottom < 0 || rect.top > viewportHeight) return;
                  
                  // Calculate visible height
                  const visibleTop = Math.max(0, rect.top);
                  const visibleBottom = Math.min(viewportHeight, rect.bottom);
                  const visibleHeight = visibleBottom - visibleTop;
                  
                  // Boost visibility score for section in viewport center
                  const midpointBonus = (rect.top <= viewportHeight / 2 && 
                                        rect.bottom >= viewportHeight / 2) ? 
                                        viewportHeight * 0.2 : 0;
                  
                  const visibility = visibleHeight + midpointBonus;
                  
                  if (visibility > maxVisibility) {
                    maxVisibility = visibility;
                    currentSection = id;
                  }
                });
                
                if (currentSection !== activeSection) {
                  setActiveSection(currentSection);
                }
              }
            }
          }
          
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initialize
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection, isMenuOpen]);

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
  }, [animationFrameId, navRef, setActiveSection]);
  // Helper function to handle smooth scrolling to sections
  const scrollToSection = useCallback((id: string) => {
    const section = document.getElementById(id);
    if (section) {
      // Set the active section immediately
      setActiveSection(id);
      
      // Set a scroll lock to prevent the scroll handler from updating active section during animation
      if (scrollLockTimeout.current) {
        clearTimeout(scrollLockTimeout.current);
      }
      
      // Lock for 1.5 seconds, which should cover most scroll animations
      scrollLockTimeout.current = setTimeout(() => {
        scrollLockTimeout.current = null;
      }, 1500);
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
  }, [setActiveSection, navRef, animationFrameId, isMenuOpen]);  // Special dedicated function for navigating to contact section
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

  // Expose functions to window so DirectContactLink can access them
  useEffect(() => {
    (window as any).__updateActiveSection = (section: string) => {
      setActiveSection(section);
    };
    
    (window as any).__closeMobileMenu = () => {
      setIsMenuOpen(false);
    };
    
    return () => {
      delete (window as any).__updateActiveSection;
      delete (window as any).__closeMobileMenu;
    };
  }, []);

  return (
    <>
      {/* Only render Easter Egg component when needed */}
      {easterEggType && <EasterEgg type={easterEggType} />}
      
      {/* Main navigation */}
      <motion.nav
        ref={navRef}
        initial="hidden"
        animate="visible" // Always keep visible now instead of conditional visibility
        variants={navVariants}
        className={`${poppins.className} fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl 
          ${isScrolled 
            ? 'bg-gray-900/95 text-white' 
            : 'bg-gray-800/90 text-white'} 
          backdrop-blur-lg shadow-xl rounded-full transition-all duration-300 
          border-[2px] ${isScrolled ? 'border-gray-700' : 'border-blue-900/70'}
          transform translate-y-4 opacity-100`}
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
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ 
                duration: 0.25, 
                ease: "easeOut",
              }}
              className="lg:hidden overflow-hidden bg-gray-900/95 rounded-2xl mt-2 
                border border-gray-700 shadow-xl"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                WebkitFontSmoothing: 'subpixel-antialiased'
              }}
            >
              <motion.div 
                className="px-4 py-3 space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.05 }}
              >                {navItems.map((item, index) => {
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
                        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl 
                          transition-colors duration-150 active:scale-98 ${
                          activeSection === item.id
                            ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-md border border-blue-500/20'
                            : 'text-gray-300 hover:bg-gray-800/70 border border-transparent hover:border-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}