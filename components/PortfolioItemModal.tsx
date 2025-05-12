import { useEffect, useState } from 'react';

// Define the PortfolioItem type
type PortfolioItem = {
  title: string;
  category: string;
  description: string;
  technologies: string[];
  links?: {
    live?: string;
  };
  detailImages?: string[];
  coverImage?: string;
  image?: string;
};
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ExternalLink } from 'lucide-react';

// Performance optimized image slider component
const ImageSlider = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
    // Auto-advance disabled by default to prevent performance issues
  useEffect(() => {
    if (images.length <= 1) return;
    
    // We completely disable auto-rotation to improve performance
    // This significantly reduces CPU usage and prevents lag spikes
    
    // Uncomment this block to re-enable auto-rotation if needed
    /*
    let interval: NodeJS.Timeout | null = null;
    let rafId: number | null = null;
    
    const startRotation = () => {
      if (interval) return;
      
      interval = setInterval(() => {
        if (rafId === null) {
          rafId = requestAnimationFrame(() => {
            setIsAnimating(true);
            setCurrentIndex((prev) => (prev + 1) % images.length);
            rafId = null;
          });
        }
      }, 15000); // Even longer interval to minimize impact
    };
    */
      // No-op function since auto-rotation is disabled
    const stopRotation = () => {
      // Empty function
    };
    
    // We don't start any rotation
    
    // We don't need to handle visibility changes since we're not auto-rotating
    
    return () => {
      // Nothing to clean up
    };
  }, [images.length]);
  // Handle manual navigation with debounce to prevent rapid firing
  // We're using local state to track if navigation is in progress
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Optimized navigation with animation locking to prevent rapid clicks
  const goToSlide = (index: number) => {
    if (isNavigating || index === currentIndex) return;
    
    setIsNavigating(true);
    setCurrentIndex(index);
    
    // Release navigation lock after transition completes
    setTimeout(() => {
      setIsNavigating(false);
    }, 300);
  };

  const goToNextSlide = () => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    
    // Release navigation lock after transition completes
    setTimeout(() => {
      setIsNavigating(false);
    }, 300);
  };

  const goToPrevSlide = () => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    
    // Release navigation lock after transition completes
    setTimeout(() => {
      setIsNavigating(false);
    }, 300);
  };
  // State to track computed aspect ratio
  const [computedAspectRatio, setComputedAspectRatio] = useState<string | null>(null);
  return (
    <div 
      className="portfolio-image-container rounded-lg bg-gray-900"
      style={{
        paddingBottom: computedAspectRatio || "56.25%" // Default to 16:9 aspect ratio if no computed value yet
      }}
    >
      {/* Loading indicator */}
      <div className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none">
        <div className="w-12 h-12 border-2 border-t-transparent border-white/20 rounded-full animate-spin"></div>
      </div>      {/* Images - performance optimized with reduced motion */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`image-${currentIndex}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ willChange: "opacity", zIndex: 10 }}
        >
          <div className="relative h-full w-full">
            <Image
              src={images[currentIndex]}
              alt={`Project image ${currentIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
              className="portfolio-image object-contain opacity-0 transition-opacity duration-300"
              priority={currentIndex === 0}
              loading="eager"
              quality={70} // Further reduced quality for better performance
              onLoadingComplete={(e) => {
                // Use requestAnimationFrame to batch DOM updates
                requestAnimationFrame(() => {
                  e.classList.remove('opacity-0');
                  
                  // Compute aspect ratio only when needed
                  if (e.naturalWidth && e.naturalHeight) {
                    const aspectRatio = e.naturalWidth / e.naturalHeight;
                    // Limit extreme aspect ratios
                    const maxAspectRatio = 2.5;
                    const finalAspectRatio = Math.min(aspectRatio, maxAspectRatio);
                    setComputedAspectRatio(`${(1 / finalAspectRatio) * 100}%`);
                  }
                });
              }}
            />
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Preload adjacent images for smoother navigation */}
      {images.length > 1 && (
        <div className="hidden">
          <Image
            src={images[(currentIndex + 1) % images.length]}
            alt="Preload next"
            width={1}
            height={1}
            priority={false}
          />
        </div>
      )}
        {/* Navigation arrows - optimized with visual feedback for navigation state */}
      {images.length > 1 && (
        <>
          <button 
            onClick={goToPrevSlide}
            disabled={isNavigating}
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white/90 hover:bg-black/70 focus:bg-black/80 transition-colors z-20 ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Previous image"
            style={{ transform: "translateZ(0)" }} // Force GPU acceleration
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button 
            onClick={goToNextSlide}
            disabled={isNavigating}
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white/90 hover:bg-black/70 focus:bg-black/80 transition-colors z-20 ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Next image"
            style={{ transform: "translateZ(0)" }} // Force GPU acceleration
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          
          {/* Image indicators - simplified for better performance */}
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
            {/* Only render a reasonable number of indicators */}
            {images.length <= 10 ? (
              images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  disabled={isNavigating}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === index 
                      ? 'bg-white w-6' 
                      : 'bg-white/40 w-2 hover:bg-white/60'
                  } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))
            ) : (
              // For many images, show simplified indicator
              <div className="text-xs text-white font-medium bg-black/50 px-2 py-1 rounded-full">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Main modal component
export default function PortfolioItemModal({ 
  item, 
  onClose 
}: { 
  item: PortfolioItem, 
  onClose: () => void 
}) {
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prepare images for the slider
  const images = item.detailImages || [];
  if (item.coverImage && !images.includes(item.coverImage)) {
    images.unshift(item.coverImage);
  }
  if (item.image && !images.includes(item.image)) {
    images.push(item.image);
  }  // Performance optimized modal rendering
  const [isRendered, setIsRendered] = useState(false);
  
  // Defer heavy rendering operations to avoid blocking the main thread
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setIsRendered(true);
    });
    
    return () => cancelAnimationFrame(timer);
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      style={{ 
        willChange: "opacity",
        isolation: 'isolate' // Optimize compositing layers
      }}
    >
      {/* Modal content with reduced animation complexity */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 10 }}
        transition={{ 
          duration: 0.22,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="bg-[#111] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          willChange: "transform, opacity",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden"
        }}
      >
        {/* Modal header */}
        <div className="sticky top-0 z-20 bg-[#111] px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.category}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-800 p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
          {/* Modal body - performance optimized to defer non-critical rendering */}
        <div className="p-6">
          {/* Image slider with dynamic aspect ratio */}
          {images.length > 0 && (
            <div className="mb-6">
              <ImageSlider images={images} />
            </div>
          )}
          
          {/* Only render full content when modal is fully visible to improve performance */}
          {isRendered && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-lg font-medium text-white">Overview</h4>
                <p className="text-gray-300">{item.description}</p>
              </div>
              
              <div className="space-y-4">
                {/* Technologies - render efficiently with memo */}
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.slice(0, 20).map((tech: string) => (
                      <span 
                        key={tech}
                        className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Links - only render when needed */}
                {item.links && item.links.live && (
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">Links</h4>
                    <div className="flex flex-col gap-2">
                      <a
                        href={item.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-md transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={14} />
                        <span>View Live Project</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}