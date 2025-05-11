"use client";

import { useState, useRef, useCallback, memo, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
// Import utility function
import { cn } from "../lib/utils";

// Directly import the most critical icons for header
import { Award, Download, ExternalLink } from 'lucide-react';

// Non-critical icons that appear in timeline items are deferred
const Briefcase = dynamic(() => import('lucide-react').then(mod => mod.Briefcase), { ssr: false });
const GraduationCap = dynamic(() => import('lucide-react').then(mod => mod.GraduationCap), { ssr: false });
const Calendar = dynamic(() => import('lucide-react').then(mod => mod.Calendar), { ssr: false });
const MapPin = dynamic(() => import('lucide-react').then(mod => mod.MapPin), { ssr: false });
const ChevronDown = dynamic(() => import('lucide-react').then(mod => mod.ChevronDown), { ssr: false });
const ChevronUp = dynamic(() => import('lucide-react').then(mod => mod.ChevronUp), { ssr: false });

interface TimelineItemProps {
  title: string;
  organization: string;
  period?: string;
  description: string[];
  type: "education" | "work" | "achievement";
  location?: string;
  isLast?: boolean;
}

// Extremely simplified TimelineItem with no animations for maximum performance
const TimelineItem = memo(({ 
  title, 
  organization, 
  period, 
  location, 
  description,
  type,
  isLast = false
}: TimelineItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Determine icon based on type
  const IconComponent = useMemo(() => {
    return type === 'work' 
      ? Briefcase 
      : type === 'education' 
        ? GraduationCap 
        : Award;
  }, [type]);

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);
  
  // Ultra simple render with no animations
  return (
    <div className="relative">
      <div
        className={cn(
          "relative z-10 p-6 rounded-lg border border-[#2e334a]",
          "bg-[#1c2133]",
          isExpanded ? "shadow-md" : ""
        )}
      >
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">              
              <div className="h-5 w-5 text-[#3b82f6]">
                {IconComponent && <IconComponent className="h-5 w-5" />}
              </div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>

            <p className="text-gray-300 mb-2">{organization}</p>
            <div className="flex flex-wrap gap-3 mt-3">
              {period && (
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{period}</span>
                </div>
              )}

              {location && (
                <div className="flex items-center text-sm text-gray-400">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{location}</span>
                </div>
              )}
            </div>
          </div>          <motion.button
            onClick={toggleExpand}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center p-2 rounded-full bg-[#252a3d] hover:bg-[#2e334a]"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center w-5 h-5"
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-300" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-300" />
              )}
            </motion.div>
          </motion.button></div>        {/* Add animation for details while preserving performance */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ 
            duration: 0.3,
            ease: "easeInOut"
          }}
          className="overflow-hidden"
        >
          <div className="mt-4">
            <div className="pt-4 border-t border-[#2e334a]">
              <h4 className="font-medium mb-2 text-white">Details:</h4>
              <ul className="space-y-2 list-disc list-inside text-gray-300">
                {description.map((item, index) => (
                  <li key={index} className="text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

const CategoryButton = memo(({ 
  label, 
  isActive, 
  onClick
}: { 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    className={cn(
      "px-5 py-2 mx-1 text-sm font-medium transition-all duration-150 will-change-transform rounded-full",      
      isActive
        ? "bg-[rgb(38,43,61)] text-white shadow-md" 
        : "text-gray-400 hover:text-gray-200"
    )}
    whileTap={{ scale: 0.95 }}
    animate={{ 
      y: isActive ? -1 : 0,
      backgroundColor: isActive ? "rgb(38,43,61)" : "transparent" 
    }}
    transition={{ duration: 0.2 }}
  >
    <span>{label}</span>
  </motion.button>
));

// Add display names to memoized components
TimelineItem.displayName = 'TimelineItem';
CategoryButton.displayName = 'CategoryButton';

// Custom hook for progressive loading based on visibility with performance optimizations
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef(null);
  
  // More efficient options with type safety
  const observerOptions = useMemo(() => ({
    rootMargin: '300px', // Increased margin for earlier loading
    threshold: 0.1,
    ...options
  }), [options]);

  useEffect(() => {
    // Skip if already been visible once (prevent unnecessary re-renders)
    if (hasBeenVisible) return;
    if (!ref.current) return;
    
    // Check for IntersectionObserver support
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback for browsers without support
      setIsIntersecting(true);
      setHasBeenVisible(true);
      return;
    }
    
    const observer = new IntersectionObserver(([entry]) => {
      // Only update state if the visibility changes
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        setHasBeenVisible(true);
        
        // Once it's been visible, we can disconnect the observer
        // This reduces the number of active observers for better performance
        observer.disconnect();
      }
    }, observerOptions);
    
    observer.observe(ref.current);
    
    return () => {
      observer.disconnect();
    };
  }, [observerOptions, hasBeenVisible]);

  return [ref, isIntersecting || hasBeenVisible];
}

// Optimized timeline item wrapper with progressive loading and deferred rendering
const ProgressiveTimelineItem = memo(({ item, index, totalItems }: { item: TimelineItemProps; index: number; totalItems: number }) => {
  // Use intersection observer to conditionally render items
  const [ref, isVisible] = useIntersectionObserver();
  
  // Use state to defer hydration until after first render for non-critical items
  const [isHydrated, setIsHydrated] = useState(index < 3);
  
  // Determine if this item is on the left or right side of the timeline
  const isEvenIndex = index % 2 === 0;
  
  // Only hydrate components that are not initially visible when they become visible
  useEffect(() => {
    if (isVisible && !isHydrated) {
      // Small timeout to prevent all items hydrating at once
      const timer = setTimeout(() => {
        setIsHydrated(true);
      }, index * 50); // Stagger hydration based on index
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, isHydrated, index]);
  
  return (
    <div
      ref={typeof ref === 'object' && ref !== null ? ref : undefined}
      key={`${item.type}-${index}`}
      className={cn(
        "relative md:w-[calc(50%-20px)]", 
        isEvenIndex ? "md:mr-auto" : "md:ml-auto"
      )}
    >
      {/* Only render the full component if it's visible and hydrated */}
      {(isHydrated) ? (
        <>
          {/* Timeline connector dot */}
          <div
            className="absolute top-6 right-0 w-4 h-4 rounded-full bg-[#3b82f6] hidden md:block"
            style={{
              right: isEvenIndex ? "-42px" : "auto",
              left: isEvenIndex ? "auto" : "-42px",
            }}
          />
          
          {/* Timeline connector line */}
          <div
            className="absolute top-6 w-[20px] h-0.5 bg-[#2e334a] hidden md:block"
            style={{
              right: isEvenIndex ? "-20px" : "auto",
              left: isEvenIndex ? "auto" : "-20px",
            }}
          />
        
          <TimelineItem
            {...item}
            isLast={index === totalItems - 1}
          />
        </>
      ) : (
        // Render a lightweight skeleton loader when item is not yet hydrated
        <TimelineItemSkeleton />
      )}
    </div>
  );
});

ProgressiveTimelineItem.displayName = 'ProgressiveTimelineItem';

// Skeleton loader for timeline items
const TimelineItemSkeleton = memo(() => (
  <div className="relative p-6 rounded-lg border border-[#2e334a] bg-[rgb(38,43,61)]/50">
    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-5 w-5 bg-blue-500/20 rounded-sm animate-pulse" />
          <div className="h-6 w-40 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="h-5 w-36 bg-gray-500/20 rounded animate-pulse mb-2" />
        <div className="flex gap-3 mt-3">
          <div className="h-5 w-24 bg-gray-500/20 rounded animate-pulse" />
        </div>
      </div>
    </div>
  </div>
));

TimelineItemSkeleton.displayName = 'TimelineItemSkeleton';



// Main Resume Section Component with aggressive performance optimizations
const ResumeSection = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'work' | 'education' | 'achievements' | 'skills'>('all');
  const [visibleItemCount, setVisibleItemCount] = useState(3); // Start with just 3 items for much faster initial load
  
  // Reset visible items when category changes
  useEffect(() => {
    setVisibleItemCount(3);
  }, [activeCategory]);
  
  // Memoized category handlers for better performance
  const handleAllCategory = useCallback(() => setActiveCategory('all'), []);
  const handleWorkCategory = useCallback(() => setActiveCategory('work'), []);
  const handleEducationCategory = useCallback(() => setActiveCategory('education'), []);
  const handleAchievementsCategory = useCallback(() => setActiveCategory('achievements'), []);
  const handleSkillsCategory = useCallback(() => setActiveCategory('skills'), []);
  
  // Resume Data
  const resumeData = {
    work: [
      {
        title: "Administrative Intern",
        organization: "Vriddhi Agency",
        period: "Feb 2025 - Apr 2025",
        location: "Malang, East Java, Indonesia",
        description: [
          "Researched 10+ companies daily to update spreadsheets, prioritizing prospects needing web development services",
          "Executed email campaigns using promotional materials to pitch web solutions and conducted daily follow-ups",
          "Maintained detailed outreach records and delivered tasks within strict 3-hour deadlines"
        ],
        type: 'work' as const,
      },
      {
        title: "Co-Facilitator  Intern",
        organization: "BTPN Syariah",
        period: "Oct 2024 - Jan 2025",
        location: "Pacitan, East Java, Indonesia",
        description: [
          "Empowered 10+ SMEs via workshops and field mentoring, achieving a 71.3/100 competency score",
          "Trained entrepreneurs in problem-solving, Microsoft Office, and e-learning systems",
          "Awarded internship certificate for impactful facilitation"
        ],
        type: 'work' as const,
      },
      {
        title: "Digital Marketing Intern",
        organization: "GAOTek Inc",
        period: "Apr 2024 - Aug 2024",
        location: "New York, USA (Remote)",
        description: [
          "Conducted SEO-driven market research, organized data in Excel, and delivered 15+ monthly reports",
          "Collaborated in weekly virtual meetings to align strategies and share insights"
        ],
        type: 'work' as const,
      },
    ],
    education: [
      {
        title: "Undergraduate Student  of Computer Science",
        organization: "Muhammadiyah Siber University",
        period: "2022 - present",
        location: "Special Region of Yogyakarta, Indonesia",
        description: [
          "GPA: 3.46/4.00 (5th Semester)",
          "Coursework: 2023 Red Hat Academy - Program Learner, Blue Team Junior Analyst Training, AWS Academy Cloud Foundations Learner"
        ],
        type: 'education' as const,
      },
      {
        title: "Senior High School",
        organization: "Madrasah Aliyah Negeri 1 Pacitan",
        period: "2018 - 2021",
        location: "Pacitan, East Java, Indonesia",
        description: [
          "Graduated Social Sciences major with focus on communications and public policy"
        ],
        type: 'education' as const,
      }
    ],
    achievements: [
      {
        title: "IT Program for UI/UX Designer",
        organization: "Job Connector - Belajar Bekerja",
        period: "Jan 2024",
        location: "Indonesia",
        description: [
          "Participated in a 4-day intensive training program focused on solving real-world UI/UX challenges",
          "Acquired hands-on experience in user research, wireframing, and prototyping using industry tools like Figma",
          "Collaborated with peers to design user-centric interfaces and present solutions"
        ],
        type: 'achievement' as const,
      },
      {
        title: "Responsive Web Design Certification",
        organization: "freeCodeCamp",
        period: "Dec 2024",
        location: "Online",
        description: [
          "Completed 300+ hours of coursework on HTML, CSS, and responsive design principles",
          "Built five project challenges: tribute page, survey form, product landing page, technical documentation page, and personal portfolio"
        ],
        type: 'achievement' as const,
      },
      {
        title: "Data Engineering Certification",
        organization: "Dibimbing.id - Data Series 11.0",
        period: "Nov 2024",
        location: "Online",
        description: [
          "Completed hands-on data engineering project using SQL and BigQuery",
          "Analyzed Chicago Taxi Trips dataset to extract meaningful insights and create visualizations"
        ],
        type: 'achievement' as const,
      },
      {
        title: "UI/UX Design Certification",
        organization: "Dibimbing.id - Product Series 3.0",
        period: "Oct 2024",
        location: "Online",
        description: [
          "Designed a restaurant menu ordering app prototype implementing user research methodologies",
          "Conducted usability testing and iterated on designs based on user feedback"
        ],
        type: 'achievement' as const,
      },
      {
        title: "Full Stack Developer Path",
        organization: "Dicoding Indonesia",
        period: "2024",
        location: "Online",
        description: [
          "Completed comprehensive courses in Front-End Web Development, Back-End Basics, and Responsive Design",
          "Developed multiple projects including interactive websites and web applications"
        ],
        type: 'achievement' as const,
      }
    ],
  };
    // Skills data based on CV
  const skillsData = [
    {
      title: "Languages",
      organization: "Communication Skills",
      period: "",
      location: "",
      description: [
        "Bahasa Indonesia (Native)",
        "English (Professional working proficiency)"
      ],
      type: 'achievement' as const
    },
    {
      title: "Technical Skills",
      organization: "Web Development & Design",
      period: "",
      location: "",
      description: [
        "HTML5, CSS3, JavaScript",
        "Figma for UI/UX Design",
        "Copywriting",
        "Microsoft Office (Word, Excel, PowerPoint)",
        "Data Entry & Analysis"
      ],
      type: 'achievement' as const
    },
    {
      title: "Soft Skills",
      organization: "Professional Abilities",
      period: "",
      location: "",
      description: [
        "Communication",
        "Teamwork", 
        "Problem-solving",
        "Adaptability",
        "Time Management",
        "Critical Thinking"
      ],
      type: 'achievement' as const
    },
    {
      title: "Areas of Interest",
      organization: "Professional Focus",
      period: "",
      location: "",
      description: [
        "UI/UX Design",
        "Front-End Development",
        "Data Analysis",
        "Project Management",
        "Social Impact",
        "Digital Marketing"
      ],
      type: 'achievement' as const
    }
  ];
    // Make sure the data is properly extracted and formatted
  const educationItems = resumeData.education || [];
  const workItems = resumeData.work || [];
  const achievementItems = resumeData.achievements || [];
    // Get all items for the active category
  const allCategoryItems = useMemo(() => {
    return activeCategory === 'all'
      ? [...educationItems, ...workItems, ...achievementItems, ...skillsData]
      : activeCategory === 'work'
        ? workItems
        : activeCategory === 'education'
        ? educationItems
        : activeCategory === 'achievements'
        ? achievementItems
        : skillsData;
  }, [activeCategory, educationItems, workItems, achievementItems, skillsData]);
  
  // Only show limited items based on visibleItemCount - Super important for performance
  const visibleItems = useMemo(() => {
    return allCategoryItems.slice(0, visibleItemCount);
  }, [allCategoryItems, visibleItemCount]);
  
  // Track if there are more items to load
  const hasMoreItems = visibleItemCount < allCategoryItems.length;
  
  // Load more handler
  const handleLoadMore = useCallback(() => {
    setVisibleItemCount(prev => prev + 3); // Load just 3 more items at a time
  }, []);
  
  return (
    <section id="resume" className="py-16 px-4 bg-[rgb(38,43,61)]">
      <div className="max-w-5xl mx-auto">        <h2 className="text-4xl font-bold text-center mb-3 text-white">
          Resume
        </h2>
        
        <div className="flex items-center justify-center mb-8">
          <Award className="text-[#3b82f6] mr-2" />
          <span className="text-gray-400">My Professional Journey</span>
        </div>          {/* Personal info card at the top - no animations */}
          <div className="mb-8">
            <div className="bg-[#1c2133] border border-[#2e334a] rounded-lg p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Rasendriya Khansa Jolankarfyan</h3>
                  <p className="text-gray-400 text-sm mb-4">Computer Science Student | UI/UX Designer | Web Developer</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-300">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#3b82f6] mr-2"></span>
                      <span>Pacitan, East Java, Indonesia</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#3b82f6] mr-2"></span>
                      <span>+62 881 0261 38014</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#3b82f6] mr-2"></span>
                      <span>rasuen27@gmail.com</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4 md:mt-0">                  
                  <a
                    href="/Resume/Rasendriya Khansa Jolankarfyan - Resume.pdf" 
                    className="px-6 py-2 bg-[#3b82f6] text-white rounded-full font-medium flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download CV</span>
                  </a>
                  <a
                    href="https://linkedin.com/in/rasendriya-khansa"
                    className="px-6 py-2 bg-[#1c2133] border border-[#2e334a] text-gray-300 rounded-full font-medium flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>          {/* Category Filters - Match dark theme from screenshot */}
        <div className="flex justify-center mb-8 overflow-x-auto pb-2">
          <div className="inline-flex rounded-full bg-[#191c26] px-2 py-1.5">
            <CategoryButton 
              label="All" 
              isActive={activeCategory === 'all'} 
              onClick={handleAllCategory} 
            />
            <CategoryButton 
              label="Education" 
              isActive={activeCategory === 'education'} 
              onClick={handleEducationCategory} 
            />
            <CategoryButton 
              label="Experience" 
              isActive={activeCategory === 'work'} 
              onClick={handleWorkCategory} 
            />
            <CategoryButton 
              label="Certifications" 
              isActive={activeCategory === 'achievements'} 
              onClick={handleAchievementsCategory} 
            />
            <CategoryButton 
              label="Skills" 
              isActive={activeCategory === 'skills'} 
              onClick={handleSkillsCategory} 
            />
          </div>
        </div>
          {/* Timeline with simplified layout for better performance */}
        <div className="space-y-6 relative">
          {/* Center timeline line */}
          <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-[#2e334a] hidden md:block" />
              {/* Add animation for content when switching categories */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            key={activeCategory} // This forces re-render and animation when category changes
          >
            {visibleItems.length > 0 ? (
              visibleItems.map((item, index) => (
                <motion.div
                  key={`${item.type}-${index}`}
                  className={cn(
                    "relative md:w-[calc(50%-20px)]", 
                    index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }} // Stagger the animations
                >
                  {/* Timeline connector dot */}
                  <div
                    className="absolute top-6 right-0 w-4 h-4 rounded-full bg-[#3b82f6] hidden md:block"
                    style={{
                      right: index % 2 === 0 ? "-42px" : "auto",
                      left: index % 2 === 0 ? "auto" : "-42px",
                    }}
                  />
                  
                  {/* Timeline connector line */}
                  <div
                    className="absolute top-6 w-[20px] h-0.5 bg-[#2e334a] hidden md:block"
                    style={{
                      right: index % 2 === 0 ? "-20px" : "auto",
                      left: index % 2 === 0 ? "auto" : "-20px",
                    }}
                  />
                
                  <TimelineItem
                    {...item}
                    isLast={index === visibleItems.length - 1}
                  />
                </motion.div>
              ))
            ) : (              <div className="py-8 text-center">
                <p className="text-gray-400">No items to display for this category.</p>
              </div>            )}
          </motion.div>
              
          {/* Load more button */}          {hasMoreItems && (
            <div className="flex justify-center mt-8">              <motion.button 
                onClick={handleLoadMore}
                className="px-6 py-2 bg-[#2e334a] text-gray-300 rounded-full hover:bg-[#3b4154]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Load More
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// Optimize for better performance with explicit display name and memo
ResumeSection.displayName = 'ResumeSection';
export default memo(ResumeSection);