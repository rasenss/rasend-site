"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronRight, Filter } from 'lucide-react';

// Portfolio items data
interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  detailImages?: string[];
  technologies: string[];
  links?: {
    live?: string;
  };
}

const portfolioItems: PortfolioItem[] = [
  {
    id: "mobile-app-1",
    title: "Mobile App Design",
    category: "Mobile Design",
    description: "A sophisticated mobile application design focusing on user experience and modern interface elements.",
    coverImage: "/portfolio/Mobile-Design/HealtyApp-Design/COVER.png",
    detailImages: ["/portfolio/Mobile-Design/HealtyApp-Design/DASHBOARD PAGE.png"],
    technologies: ["UI/UX", "Mobile", "Design System"],
    links: {
      live: "https://www.figma.com/community/file/1347842363347325628/healty-apps-mobile-apps"
    }
  },
  {
    id: "mobile-app-2",
    title: "Login Page Design",
    category: "Mobile Design",
    description: "UI/UX design for a login application focused on seamless user experience.",
    coverImage: "/portfolio/Mobile-Design/Login-Page-Design/cover-login.png",
    detailImages: ["/portfolio/Mobile-Design/Login-Page-Design/preview-login.png"],
    technologies: ["UI/UX", "Mobile", "Design System"],
    links: {
      live: "https://www.figma.com/community/file/1352653945260305149/login-page"
    }
  },
  {
    id: "minimalist-poster",
    title: "Minimalist Poster Design",
    category: "Simple Design",
    description: "Minimalist poster design with focus on typography and visual hierarchy.",
    coverImage: "/portfolio/Poster-Design/instagram-poster.png",
    technologies: ["Print", "Typography", "Minimalism"],
  },
  {
    id: "social-media-1",
    title: "Professional Social Media",
    category: "Social Media",
    description: "Professional social media designs optimized for engagement and brand visibility.",
    coverImage: "/portfolio/Linkedin-Post/Data-Series-11.0.png",
    technologies: ["Social Media", "Branding", "Content Strategy"],
    links: {
      live: "https://www.linkedin.com/posts/rasendriya-khansa_data-series-dibimbing-activity-7232003209798541312-iYpo?utm_source=share&utm_medium=member_desktop"
    }
  },  
  {
    id: "menu-design-1",
    title: "Menu Design",
    category: "Simple Design",
    description: "simple Menu Design.",
    coverImage: "/portfolio/Simple-Design/Menu.png",
    technologies: ["Branding"],
  },    
  {
    id: "social-media-3",
    title: "LinkedIn Post Product Series",
    category: "Social Media",
    description: "LinkedIn post design for a product series.",
    coverImage: "/portfolio/Linkedin-Post/Product-Series-Fair-3.0.png",
    technologies: ["Social Media", "Branding"],
    links: {
      live: "https://www.linkedin.com/posts/rasendriya-khansa_product-series-30-activity-7179470267490992129-XuLa?utm_source=share&utm_medium=member_desktop"
    }
  },
  {
    id: "social-media-4",
    title: "LinkedIn Digital Skill Fair Post",
    category: "Social Media",
    description: "LinkedIn promotional post design for Digital Skill Fair event.",
    coverImage: "/portfolio/Linkedin-Post/Digital-Skill-fair-23.0.png",
    technologies: ["Social Media", "Branding"],
    links: {
      live: "https://www.linkedin.com/posts/rasendriya-khansa_digital-skill-fair-230-activity-7157749829702504448-W4Tv?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEAlFlQBirN7t4_xc06vAv208Lpn81Qi_nU"
    }
  },
  {
    id: "health-app",
    title: "Poster Design",
    category: "Simple Design",
    description: "Poster Design for a Tech Events.",
    coverImage: "/portfolio/Poster-Design/event-poster.png",
    technologies: ["Canva"],
  },
  {
    id: "Logo-1",
    title: "Tech logo",
    category: "Logo",
    description: "Tech logo design for a personal project.",
    coverImage: "/portfolio/Logo/TechXperience-Logo.png",
    technologies: ["Branding", "Logo Design"]
  },
  {
    id: "Logo-2",
    title: "Simple Logo",
    category: "Logo",
    description: "Simple logo design for a personal brand.",
    coverImage: "/portfolio/Logo/BnW-Logo.png",
    technologies: ["Branding", "Minimalism"]
  },
  {
    id: "Logo-3",
    title: "Hiking logo",
    category: "Logo",
    description: "Tech logo design for a personal project.",
    coverImage: "/portfolio/Logo/logo2.jpg",
    technologies: ["Branding", "Logo Design"]
  }
];

// Modal component for displaying project details
const PortfolioModal = ({ project, isOpen, onClose }: { project: PortfolioItem | null; isOpen: boolean; onClose: () => void }) => {
  if (!project) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div
            className="bg-[rgb(38,43,61)] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto modal-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="portfolio-image-container rounded-t-xl"
                style={{
                  paddingBottom: "40%" // Default to 2.5:1 aspect ratio if image hasn't loaded yet
                }}
              >
                <Image 
                  src={project.coverImage} 
                  alt={project.title}
                  fill
                  className="portfolio-image object-contain"
                  sizes="(max-width: 768px) 100vw, 1200px"
                  onLoad={(e) => {
                    // Dynamically update aspect ratio when the image loads
                    const target = e.target as HTMLImageElement;
                    if (target.naturalWidth && target.naturalHeight) {
                      // Get the parent element
                      const parentDiv = target.parentElement;
                      if (parentDiv) {
                        // Calculate and set the correct aspect ratio with a maximum height factor
                        const aspectRatio = target.naturalWidth / target.naturalHeight;
                        // Limit very tall images by setting a maximum padding percentage
                        const paddingPercent = Math.min((1 / aspectRatio) * 100, 40);
                        parentDiv.style.paddingBottom = `${paddingPercent}%`;
                      }
                    }
                  }}
                />
              </div>
              
              <button 
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="p-4"> <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-300">
                  {project.category}
                </span>
                {project.links?.live && (
                  <a 
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 px-3 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
                  >
                    <span>View Live</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">
                {project.title}
              </h3>
              
              <p className="text-xs text-gray-300 mb-3">
                {project.description}
              </p>
              
              <div className="mb-3">
                <h4 className="text-sm font-medium text-white/90 mb-1.5">Technologies</h4>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              {project.detailImages && project.detailImages.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-white/90 mb-1.5">Gallery</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {project.detailImages.map((image, index) => (
                      <div key={index} className="portfolio-image-container rounded-lg"
                        style={{
                          paddingBottom: "35%" // More compact 2.86:1 aspect ratio if image hasn't loaded yet
                        }}
                      >
                        <Image
                          src={image}
                          alt={`${project.title} - Image ${index + 1}`}
                          fill
                          className="portfolio-image object-contain"
                          sizes="(max-width: 768px) 100vw, 1200px"
                          onLoad={(e) => {
                            // Dynamically update aspect ratio when the image loads
                            const target = e.target as HTMLImageElement;
                            if (target.naturalWidth && target.naturalHeight) {
                              // Get the parent element
                              const parentDiv = target.parentElement;
                              if (parentDiv) {
                                // Calculate and set the correct aspect ratio with a maximum height factor
                                const aspectRatio = target.naturalWidth / target.naturalHeight;
                                // Limit very tall images by setting a maximum padding percentage
                                const paddingPercent = Math.min((1 / aspectRatio) * 100, 35);
                                parentDiv.style.paddingBottom = `${paddingPercent}%`;
                              }
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<PortfolioItem[]>([]);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imageAspectRatios, setImageAspectRatios] = useState<Record<string, number>>({});

  // Extract unique categories
  const categories = ["All", ...new Set(portfolioItems.map(item => item.category))];  // Filter items based on active category
  useEffect(() => {
    if (activeCategory === "All") {
      setVisibleItems(portfolioItems);
    } else {
      setVisibleItems(portfolioItems.filter(item => item.category === activeCategory));
    }
  }, [activeCategory]);
  // Function to detect image aspect ratios
  const detectImageAspectRatio = (imagePath: string): Promise<number> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(4/3); // Default fallback for SSR
        return;
      }
      
      const img = document.createElement('img');
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        resolve(aspectRatio);
      };
      img.onerror = () => {
        resolve(4/3); // Default fallback if image fails to load
      };
      img.src = imagePath;
    });
  };
  // Load aspect ratios for all portfolio items
  useEffect(() => {
    const loadAspectRatios = async () => {
      const ratios: Record<string, number> = {};
      
      for (const item of portfolioItems) {
        if (!imageAspectRatios[item.id]) {
          const ratio = await detectImageAspectRatio(item.coverImage);
          ratios[item.id] = ratio;
        }
      }
      
      if (Object.keys(ratios).length > 0) {
        setImageAspectRatios(prev => ({...prev, ...ratios}));
      }
    };
    
    loadAspectRatios();
  }, [portfolioItems]); 
  
  // Intersection observer to trigger animations when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const openProjectModal = (project: PortfolioItem) => {
      setSelectedProject(project);
      setIsModalOpen(true);
      document.body.style.overflow = 'hidden';
    };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (    <section id="portfolio" ref={sectionRef} className="min-h-screen pt-28 pb-20 bg-[rgb(38,43,61)] text-white relative overflow-hidden">

      <div className="container mx-auto px-4 relative z-10">
        {/* Section heading with elegant styling */}        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">My Portfolio</h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Explore my recent projects showcasing creative design solutions across various platforms and mediums.
          </p>
        </div>        {/* Category filter - Desktop */}
        <div className="hidden md:block mb-10">
          <div className="flex justify-center flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-1.5 rounded-md text-sm font-medium ${
                  activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/15'
                }`}
                style={{ minWidth: '90px' }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
          {/* Category filter - Mobile */}
        <div className="md:hidden mb-6">
          <button
            className="flex items-center justify-between w-full px-4 py-2 bg-white/10 rounded-md"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <div className="flex items-center gap-2">
              <Filter size={16} />
              <span>{activeCategory}</span>
            </div>
            <div className={`transition-transform duration-200 ${mobileFilterOpen ? 'rotate-90' : ''}`}>
              <ChevronRight size={18} />
            </div>
          </button>
          
          {mobileFilterOpen && (
            <div className="mt-1 bg-[rgb(45,50,68)] rounded-md overflow-hidden shadow-lg">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setMobileFilterOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>        {/* Portfolio grid - simplified */}
        <div className="portfolio-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          <AnimatePresence>
            {visibleItems.length > 0 ? (
              visibleItems.map((item, index) => (                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="group"
                >                  <div
                    className="bg-[rgb(45,50,68)] rounded-xl overflow-hidden shadow-md h-full flex flex-col cursor-pointer hover:-translate-y-1 transition-transform duration-200"
                    onClick={() => openProjectModal(item)}
                  >                    <div className="portfolio-image-container"
                      style={{
                        paddingBottom: imageAspectRatios[item.id] ? 
                          `${Math.min((1 / imageAspectRatios[item.id]) * 100, 75)}%` : // Limit very tall images
                          '56.25%' // Default 16:9 aspect ratio if image hasn't loaded yet
                      }}
                    >
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        className="portfolio-image object-cover"
                        priority={index < 6}
                        onLoad={(e) => {
                          // Dynamically update aspect ratio when the image loads
                          const target = e.target as HTMLImageElement;
                          if (target.naturalWidth && target.naturalHeight) {
                            // Get the parent element
                            const parentDiv = target.parentElement;
                            if (parentDiv) {
                              // Calculate and set the correct aspect ratio with a maximum height factor
                              const aspectRatio = target.naturalWidth / target.naturalHeight;
                              // Limit very tall images by setting a maximum padding percentage
                              const paddingPercent = Math.min((1 / aspectRatio) * 100, 75);
                              parentDiv.style.paddingBottom = `${paddingPercent}%`;
                            }
                          }
                        }}
                      />
                      
                      {/* Simple view details overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md font-medium flex items-center gap-1.5">
                          View Details
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Project info - more compact */}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-base font-bold mb-1 text-white">
                        {item.title}
                      </h3>
                      
                      <p className="text-xs text-gray-300 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-1">
                          {item.technologies.slice(0, 2).map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="text-xs px-2 py-0.5 bg-white/5 rounded text-gray-400"
                            >
                              {tech}
                            </span>
                          ))}
                          {item.technologies.length > 2 && (
                            <span className="text-xs px-2 py-0.5 rounded text-gray-400">
                              +{item.technologies.length - 2}
                            </span>
                          )}
                        </div>
                          {item.links?.live && (
                          <a
                            href={item.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1 mt-2 px-3 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>View Live</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (              <div className="col-span-full py-12 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                  <Filter size={20} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
                <p className="text-gray-300 mb-4 max-w-md">
                  No projects match the selected filter. Please try selecting a different category.
                </p>
                <button
                  onClick={() => setActiveCategory("All")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md font-medium"
                >
                  View All Projects
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Project details modal */}
      <PortfolioModal 
        project={selectedProject} 
        isOpen={isModalOpen} 
        onClose={closeProjectModal} 
      />
    </section>
  );
}