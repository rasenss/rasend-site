import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { X, ExternalLink } from 'lucide-react';

// Clean, minimalist image slider component
const ImageSlider = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance images every 6 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  // Handle manual navigation
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToNextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
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
      </div>
      
      {/* Images */}
      {images.map((image, index) => (
        <motion.div
          key={image}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 10 : 0
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="relative h-full w-full">            <Image
              src={image}
              alt={`Project image ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
              className="portfolio-image object-contain opacity-0 transition-opacity duration-300"
              priority={true}
              loading="eager"
              quality={90}
              onLoadingComplete={(e) => {
                e.classList.remove('opacity-0');
                // Compute and set aspect ratio when the current image loads
                if (index === currentIndex && e.naturalWidth && e.naturalHeight) {
                  const aspectRatio = e.naturalWidth / e.naturalHeight;
                  setComputedAspectRatio(`${(1 / aspectRatio) * 100}%`);
                }
              }}
            />
          </div>
        </motion.div>
      ))}
      
      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button 
            onClick={goToPrevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white/90 hover:bg-black/70 transition-colors z-20"
            aria-label="Previous image"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button 
            onClick={goToNextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white/90 hover:bg-black/70 transition-colors z-20"
            aria-label="Next image"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          
          {/* Image indicators */}
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === index ? 'bg-white w-4' : 'bg-white/40'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
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
  item: any, 
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
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal content */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-[#111] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar modal-content"
        onClick={(e) => e.stopPropagation()}
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
        
        {/* Modal body */}
        <div className="p-6">          {/* Image slider with dynamic aspect ratio */}
          {images.length > 0 && (
            <div className="mb-6">
              <ImageSlider images={images} />
            </div>
          )}
          
          {/* Project details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-lg font-medium text-white">Overview</h4>
              <p className="text-gray-300">{item.description}</p>
            </div>
            
            <div className="space-y-4">
              {/* Technologies */}
              <div>
                <h4 className="text-lg font-medium text-white mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech: string) => (
                    <span 
                      key={tech}
                      className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Links */}
              {item.links && Object.keys(item.links).length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Links</h4>
                  <div className="flex flex-col gap-2">
                    {item.links.live && (
                      <a
                        href={item.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-md transition-colors"
                      >
                        <ExternalLink size={14} />
                        <span>View Live Project</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}