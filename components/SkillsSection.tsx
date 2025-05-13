"use client";

import { useState, useRef, useEffect, memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Figma, FileCode, Grid, Layout, Globe, Shield, Database, Cloud, Smartphone, Zap, Server, TrendingUp, Circle } from 'lucide-react';
import AnimatedSectionTitle from './AnimatedSectionTitle';

// Enhanced skills data based on certifications and portfolio
const skillsData = {
  frontendSkills: [
    {
      name: "React",
      level: 75,
      color: "#61dafb",
      icon: Layout,
      description: "Certified in building interactive applications with React hooks, component architecture, and Redux state management. Experienced in Next.js framework best practices.",
      years: 3
    },
    {
      name: "JavaScript",
      level: 72,
      color: "#f7df1e",
      icon: Terminal,
      description: "Certified in ES6+ features, DOM manipulation, and asynchronous programming. Building interactive web components and maintaining complex client-side logic.",
      years: 3
    },
    {
      name: "HTML5/CSS3",
      level: 83,
      color: "#e34c26",
      icon: FileCode,
      description: "freeCodeCamp certified in responsive web design with expertise in semantic markup, accessibility standards, advanced CSS selectors, and animations.",
      years: 4
    },
    {
      name: "Responsive Design",
      level: 78,
      color: "#38bdf8",
      icon: Smartphone,
      description: "Trained in mobile-first methodologies and adaptive layouts. Implementing media queries, fluid grids, and flexible images across various projects.",
      years: 3
    },
    {
      name: "Tailwind CSS",
      level: 70,
      color: "#38b2ac",
      icon: Zap,
      description: "Implementing utility-first approaches for rapid UI development with custom configurations, theme extensions, and component abstractions.",
      years: 2
    }
  ],  backendSkills: [
    {
      name: "Node.js",
      level: 60,
      color: "#68a063",
      icon: Server,
      description: "Developing server-side applications with Express.js, building REST APIs, implementing authentication systems, and integrating middleware solutions.",
      years: 2
    },
    {
      name: "SQL",
      level: 58,
      color: "#336791",
      icon: Database,
      description: "Certified in Structured Query Language with practical experience in database design, complex queries, joins, transactions, and stored procedures.",
      years: 2
    },
    {
      name: "AWS",
      level: 55,
      color: "#ff9900",
      icon: Cloud,
      description: "AWS Academy certified in cloud foundations, with hands-on experience in S3, EC2, Lambda, and CloudFormation for scalable infrastructure deployment.",
      years: 1
    },
    {
      name: "Red Hat",
      level: 50,
      color: "#ee0000",
      icon: Server,
      description: "Red Hat certified with fundamental knowledge of Linux administration, package management, networking configuration, and system monitoring.",
      years: 1
    }
  ],  securitySkills: [
    {
      name: "Cybersecurity",
      level: 55,
      color: "#4c51bf",
      icon: Shield,
      description: "Blue Team Junior Analyst certified with training in threat detection, security monitoring, incident response protocols, and basic defense strategies.",
      years: 1
    },
    {
      name: "Network Security",
      level: 50,
      color: "#3182ce",
      icon: Globe,
      description: "Understanding network protocols, implementing security measures, conducting vulnerability assessments, and configuring basic security infrastructure.",
      years: 1
    }
  ],
  designSkills: [
    {
      name: "UI/UX Design",
      level: 85,
      color: "#0acf83",
      icon: Grid,
      description: "Creating user-centered interfaces with focus on information architecture, interaction design, usability testing, and visual hierarchy principles.",
      years: 3
    },
    {
      name: "Logo Design",
      level: 83,
      color: "#ff7262",
      icon: Circle,
      description: "Certified in designing brand identities and logos for marketing purposes, with expertise in vector illustration, typography, and brand guidelines creation.",
      years: 2
    }
  ],  businessSkills: [
    {
      name: "Project Management",
      level: 63,
      color: "#0073b7",
      icon: TrendingUp,
      description: "Certified in project management fundamentals with practice in planning, executing, monitoring, and closing projects to achieve efficiency and quality outcomes.",
      years: 2
    },
    {
      name: "B2B Sales",
      level: 60,
      color: "#64748b",
      icon: TrendingUp,
      description: "IT Product Sales Specialist certified with training in business-to-business sales strategies, client relationship management, and solution-based selling approaches.",
      years: 1
    }
  ]
};

// Enhanced categories data
const categories = [
  {
    id: "frontend",
    name: "Frontend Development",
    gradient: "linear-gradient(90deg, rgba(37, 99, 235, 0.85) 0%, rgba(29, 78, 216, 0.95) 100%)",
    icon: Layout,
    skills: skillsData.frontendSkills,
    description: "Certified front-end developer specializing in React, JavaScript, and responsive design with freeCodeCamp validation."
  },
  {
    id: "backend",
    name: "Backend & Cloud",
    gradient: "linear-gradient(90deg, rgba(59, 130, 246, 0.85) 0%, rgba(37, 99, 235, 0.95) 100%)",
    icon: Server,
    skills: skillsData.backendSkills,
    description: "AWS Academy certified with expertise in server-side development, SQL databases, and cloud infrastructure deployment."
  },
  {
    id: "security",
    name: "Cybersecurity",
    gradient: "linear-gradient(90deg, rgba(76, 29, 149, 0.85) 0%, rgba(91, 33, 182, 0.95) 100%)",
    icon: Shield,
    skills: skillsData.securitySkills,
    description: "Blue Team Junior Analyst certified with training in threat monitoring, detection, and implementing security protocols."
  },
  {
    id: "design",
    name: "Design & UI/UX",
    gradient: "linear-gradient(90deg, rgba(219, 39, 119, 0.85) 0%, rgba(190, 24, 93, 0.95) 100%)",
    icon: Figma,
    skills: skillsData.designSkills,
    description: "Certified in brand and logo design with focus on creating intuitive, accessible, and visually appealing user experiences."
  },
  {
    id: "business",
    name: "Business & Marketing",
    gradient: "linear-gradient(90deg, rgba(217, 119, 6, 0.85) 0%, rgba(180, 83, 9, 0.95) 100%)",
    icon: TrendingUp,
    skills: skillsData.businessSkills,
    description: "Formally trained in project management methodologies and B2B sales strategies with IT product specialization."
  }
];

// Types
type ViewType = 'grid' | 'list';

interface Skill {
  name: string;
  level: number;
  color: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  description: string;
  years?: number;
}

interface Category {
  id: string;
  name: string;
  gradient: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  skills: Skill[];
  description: string;
}

interface CategoryShowcaseProps {
  category: Category;
  isActive: boolean;
  onToggle: () => void;
  viewType: ViewType;
}

// Optimized skill card component with smoother animations
const SkillCard = memo(({ 
  skill, 
  index, 
  isSelected,
  onClick
}: { 
  skill: Skill; 
  index: number;
  isSelected?: boolean;
  onClick?: () => void;
}) => {
  return (    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.2, 
        delay: Math.min(index * 0.015, 0.3), // Cap total delay to avoid slow rendering
        type: "tween",
        ease: "easeOut"
      }}
      onClick={onClick}      className={`relative p-5 rounded-[20px] border backdrop-blur-lg group hover:-translate-y-1 hover:shadow-xl transform-gpu transition-all duration-300 cursor-pointer
                ${isSelected 
                  ? 'bg-[rgb(38,43,61)]/95 border-blue-600/70 shadow-lg shadow-blue-900/20' 
                  : `bg-gradient-to-br from-[rgb(38,43,61)]/95 to-[rgb(38,43,61)]/90 border-blue-900/50 hover:border-blue-800/60`}`}
      style={{
        borderColor: isSelected ? undefined : 'transparent',
        willChange: 'transform, opacity',
        transform: 'translateZ(0)' // Force GPU acceleration
      }}
      whileHover={{ 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >      {/* Static gradient effect instead of animated particles for better performance */}
      <div className="absolute -z-10 inset-0 rounded-[20px] opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none overflow-hidden">
        <div 
          className="w-full h-full" 
          style={{ 
            background: `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, ${skill.color}50 0%, transparent 70%)` 
          }}
        />
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br opacity-0 group-hover:opacity-10 rounded-[20px] transition-opacity duration-500" 
           style={{ background: `radial-gradient(circle at 30% 30%, ${skill.color}30 0%, transparent 70%)` }} />
      
      {/* Subtle 3D lighting effect */}
      <div className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-15 transition-all duration-400" 
           style={{ background: `linear-gradient(225deg, ${skill.color}20 0%, transparent 70%)` }} />
      
      <div className="flex items-center gap-3 mb-4">        <motion.div 
          initial={{ scale: 0.95, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.3, 
            delay: Math.min(index * 0.02, 0.2), 
            type: "tween", 
            ease: "easeOut" 
          }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden"
          style={{ 
            backgroundColor: `${skill.color}15`,
            willChange: "transform, opacity",
            transform: "translateZ(0)"
          }}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.15 } 
          }}
        >
          <div className="absolute inset-0 opacity-20" style={{ 
            background: `linear-gradient(135deg, transparent 30%, ${skill.color} 150%)` 
          }} />
          {skill.icon && <skill.icon size={24} className="text-white relative z-10" />}
          <div className="absolute -top-10 -left-10 w-20 h-20 opacity-15 group-hover:opacity-25 blur-xl transition-all duration-700"
               style={{ 
                 background: `radial-gradient(circle, ${skill.color} 0%, transparent 70%)`,
                 transform: 'translateZ(0)' 
               }} />
        </motion.div>
        
        <div>
          <h4 className="text-lg font-medium text-white group-hover:text-[#fafafa]">{skill.name}</h4>
          {skill.years && (
            <div className="text-xs text-slate-300 group-hover:text-white transition-all duration-300">
              <span className="font-medium">{skill.years}</span> {skill.years === 1 ? 'year' : 'years'} experience
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <div className="relative">
          <div className="text-xs text-slate-300 mb-2 flex justify-between">
            <span>Proficiency</span>
            <span className="font-medium text-white">{skill.level}%</span>
          </div>          <div className="bg-[rgb(38,43,61)]/80 h-2.5 rounded-full w-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ duration: 0.7, delay: index * 0.03 + 0.2, ease: "easeOut" }}
              className="h-full rounded-full relative"
              style={{ 
                backgroundColor: skill.color,
                boxShadow: `0 0 10px ${skill.color}40`
              }}
            >
              <div className="absolute top-0 left-0 h-full w-full bg-white opacity-20 overflow-hidden">
                <div className="animate-[pulse_2.5s_ease-in-out_infinite] h-full w-6 bg-white/40 blur-md transform -skew-x-30 -translate-x-10"></div>
              </div>
            </motion.div>
          </div>
        </div>        <div className="mt-4 text-sm text-slate-300 overflow-hidden transition-all duration-300 opacity-90 group-hover:opacity-100">
          {skill.description}
        </div>
      </div>
      
      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 rounded-full bg-blue-600/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  );
});

SkillCard.displayName = 'SkillCard';

// Improved SkillListItem component with better contrast and click handler
const SkillListItem = memo(({ 
  skill,
  isSelected,
  onClick 
}: { 
  skill: Skill;
  isSelected?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div 
      className={`flex items-center p-3.5 border-b border-blue-900/30 last:border-b-0 hover:bg-blue-900/10 transition-colors duration-200 rounded-md cursor-pointer
                ${isSelected ? 'bg-blue-900/20' : ''}`}
      onClick={onClick}
    >
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shrink-0"
        style={{ backgroundColor: `${skill.color}20` }}
      >
        {skill.icon && <skill.icon size={16} className="text-white" />}
      </div>
      
      <div className="flex-grow min-w-0 mr-4">
        <div className="flex justify-between">
          <h4 className="text-sm font-medium text-white truncate">{skill.name}</h4>
          <span className="text-xs text-white font-medium">{skill.level}%</span>
        </div>
          <div className="mt-1.5 bg-[rgb(38,43,61)]/90 h-1.5 rounded-full w-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${skill.level}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${skill.level}%`, 
              backgroundColor: skill.color,
              boxShadow: `0 0 6px ${skill.color}60`
            }}
          />
        </div>
      </div>
      
      {skill.years && (
        <div className="text-xs text-slate-300 whitespace-nowrap ml-auto font-medium">
          {skill.years}y
        </div>
      )}
      
      {isSelected && (
        <div className="ml-2">
          <div className="w-5 h-5 rounded-full bg-blue-600/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
});

SkillListItem.displayName = 'SkillListItem';

// View toggle (simplified for performance)
const ViewToggle = memo(({ activeView, setActiveView }: { activeView: ViewType; setActiveView: (view: ViewType) => void }) => {
  return (
    <div className="flex w-full sm:w-auto bg-[rgb(28,33,51)] skills-mobile-bg p-1 rounded-full border border-blue-900/60 shadow-inner shadow-black/20">
      {(['grid', 'list'] as ViewType[]).map(view => (
        <button
          key={view}          className={`relative flex-1 sm:flex-auto px-4 py-1.5 text-sm rounded-full transition-all duration-200 ${
            activeView === view ? 'text-white' : 'text-gray-300 hover:text-white'
          }`}
          onClick={() => setActiveView(view)}
        >
          {activeView === view && (
            <span className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90 rounded-full -z-10 shadow-sm shadow-black/10"></span>
          )}
          <span className="relative font-medium">{view === 'grid' ? 'Card View' : 'List View'}</span>
        </button>
      ))}
    </div>
  );
});

ViewToggle.displayName = 'ViewToggle';

// Completely rewritten SkillComparison component with optimized animations
const SkillComparison = memo(({ selectedSkills, toggleSkill }: { 
  selectedSkills: Skill[],
  toggleSkill: (skill: Skill) => void
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fade-in effect with minimal delay
  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  // Radar chart axis labels with descriptive names and specific angles
  const axisLabels = ['Expertise', 'Experience', 'Usage', 'Learning', 'Passion'];
  
  // Define specific angles for each axis label to ensure proper distribution
  // This ensures equal spacing between each point on the radar chart
  const axisAngles = [0, 72, 144, 216, 288]; // Angles in degrees, evenly distributed

  // Empty state with clearer call to action
  if (selectedSkills.length === 0) {
  return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.2 }} // Very quick animation
        className="bg-[rgb(38,43,61)]/95 rounded-[20px] p-6 border border-blue-900/60 backdrop-blur-sm text-center shadow-lg"
      >
        <div className="py-6">
          <div className="relative w-16 h-16 bg-[rgb(38,43,61)] rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner shadow-black/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 12h8"></path>
              <path d="M12 8v8"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Compare Skills</h3>
          <p className="text-slate-300 mb-5 max-w-md mx-auto">Select up to 5 skills from the categories below to visualize and compare their proficiency levels.</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/20 rounded-full text-sm text-blue-200 shadow-inner shadow-black/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 8-9.04 9.06a10.07 10.07 0 1 0 .34-16.24"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>Click on any skill below to start comparing</span>
          </div>
        </div>
      </motion.div>
    );
  }
  return (
    <div 
      ref={containerRef}
      className="bg-[rgb(38,43,61)]/95 rounded-[20px] p-5 border border-blue-900/60 backdrop-blur-sm shadow-lg"
      style={{ 
        opacity: isVisible ? 1 : 0, 
        transition: 'opacity 0.2s ease-out',
        willChange: 'opacity',
        transform: 'translateZ(0)'
      }}
    >
      <h3 className="text-lg font-semibold text-white mb-4">Skill Comparison</h3>
      
      <div className="relative h-72 md:h-[22rem] mb-8">
        {/* Simplified radar chart background with enhanced visibility and animations */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Concentric circles with improved visibility */}
          {[1, 2, 3, 4, 5].map((level) => (
            <div 
              key={`circle-${level}`}
              className="absolute border border-blue-700/40 rounded-full opacity-60"
              style={{
                width: `${level * 20}%`,
                height: `${level * 20}%`,
                animation: `pulse${level} 4s ease-in-out infinite`,
                animationDelay: `${level * 0.2}s`
              }}
            />
          ))}
          
          {/* Static radar lines using exact angles for even distribution with improved visibility */}
          {axisAngles.map((angle, i) => (
            <div 
              key={`line-${i}`}
              className="absolute top-1/2 left-1/2 h-1/2 w-[1.5px] origin-bottom opacity-60"
              style={{ 
                background: "linear-gradient(to top, rgba(37, 99, 235, 0.5), rgba(29, 78, 216, 0.2))",
                transform: `translateX(-50%) rotate(${angle}deg)`,
                transformOrigin: 'bottom center',
                animation: `glow 3s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.6}s`
              }}
            />
          ))}
        </div>
        
        {/* Correctly positioned axis labels to avoid overlapping */}
        <div className="absolute inset-0 pointer-events-none">
          {axisLabels.map((label, i) => {
            // Calculate angles for positioning using the specific angles
            const angle = (axisAngles[i] - 90) * (Math.PI / 180);
            
            // Use consistent distance to keep labels inside the box
            let distance = 0.58; // Default base distance from center (reduced)
            
            // Apply only slight adjustments for specific labels to maintain visibility
            if (label === "Passion") {
              distance = 0.54; // Reduced for Passion to stay inside box
            } else if (label === "Experience") {
              distance = 0.54; // Reduced for Experience to stay inside box
            }
            
            // Calculate position with adjusted distance
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            return (
              <div
                key={`label-${label}`}
                className="absolute text-xs font-medium text-white transform -translate-x-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-lg bg-[rgb(38,43,61)]/90 border border-blue-900/60 shadow-md"
                style={{
                  left: `${(x * 90) + 50}%`, 
                  top: `${(y * 90) + 50}%`,
                  textAlign: 'center',
                  backdropFilter: 'blur(4px)',
                  zIndex: 50, // Ensure labels are above everything
                }}
              >
                {label}
              </div>
            );
          })}
        </div>
        
        {/* Optimized skill radar chart with consistent angles */}
        <div className="absolute inset-0">
          {selectedSkills.map((skill) => {
            // Pre-calculate all points using the fixed angles for consistency
            const points = axisAngles.map((angle) => {
              const radian = (angle - 90) * (Math.PI / 180);
              const distance = skill.level / 100;
              return {
                x: Math.cos(radian) * distance * 45 + 50,
                y: Math.sin(radian) * distance * 45 + 50
              };
            });
            
            // Generate polygon points string
            const polygonPoints = points.map(p => `${p.x}% ${p.y}%`).join(', ');
            
            return (              <div key={`radar-${skill.name}`} className="absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polygon 
                    points={polygonPoints}
                    fill={`${skill.color}30`} 
                    stroke={skill.color}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
                
                {/* Static points with improved positioning */}
                {points.map((point, pointIndex) => (
                  <div
                    key={`point-${skill.name}-${pointIndex}`}
                    className="absolute w-3 h-3 rounded-full border border-white/70"
                    style={{
                      left: `calc(${point.x}% - 6px)`, 
                      top: `calc(${point.y}% - 6px)`,
                      backgroundColor: `${skill.color}80`,
                      boxShadow: `0 0 8px ${skill.color}70`,
                      opacity: skill.level > 80 ? 1 : skill.level > 65 ? 0.85 : 0.7, // Adjust opacity based on skill level
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>
        
        {/* Completely replacing blue square with a proper radar center point */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full border border-blue-500/40 transform -translate-x-1/2 -translate-y-1/2 animate-ping opacity-60"></div>
          <div className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full border border-blue-400/20 transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slow opacity-30"></div>
        </div>
      </div>
        
      {/* Skill legend moved below radar chart - now with more space */}
      <div className="mt-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {selectedSkills.map((skill) => (              <div 
                key={`legend-${skill.name}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-[rgb(28,33,51)] border border-blue-900/60 shadow-lg"
              >
                <div 
                  className="w-3.5 h-3.5 rounded-full" 
                  style={{ backgroundColor: skill.color, boxShadow: `0 0 6px ${skill.color}60` }}
                />
              <span className="text-white font-medium">{skill.name}</span>              <button
                onClick={() => toggleSkill(skill)}
                className="w-6 h-6 rounded-lg bg-[rgb(28,33,51)]/90 flex items-center justify-center hover:bg-[rgb(38,43,61)] transition-colors ml-1 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                aria-label={`Remove ${skill.name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>        {/* Skill selection with simplified animations */}
      <div className="mt-4 pt-4 border-t border-blue-900/40">
        <div className="flex flex-wrap justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-white mb-2 sm:mb-0">Selected Skills</h4>
          <span className="text-xs text-blue-300 bg-[rgb(28,33,51)] px-2.5 py-1 rounded-lg border border-blue-900/40">
            {selectedSkills.length}/5 selected
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedSkills.map((skill) => (
            <button
              key={`button-${skill.name}`}
              onClick={() => toggleSkill(skill)}              className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-150
                bg-[rgb(28,33,51)] text-white border border-blue-800/50 shadow-sm hover:bg-[rgb(38,43,61)]"
            >
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ 
                  backgroundColor: skill.color,
                  boxShadow: `0 0 5px ${skill.color}70`
                }}
              />
              {skill.name}
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/80">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          ))}

          {selectedSkills.length === 0 && (
            <p className="text-sm text-slate-400 py-1">Click any skill below to add it to comparison</p>
          )}
        </div>
      </div>
    </div>
  );
});

SkillComparison.displayName = 'SkillComparison';

// Enhanced CategoryShowcase with performance optimizations
const CategoryShowcase = memo(function CategoryShowcase({ 
  category, 
  isActive, 
  onToggle, 
  viewType,
  selectedSkills,
  onSkillClick
}: CategoryShowcaseProps & {
  selectedSkills: Skill[];
  onSkillClick: (skill: Skill) => void;
}) {
  // Use ref for accessing DOM element height
  const contentRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  
  // Update content height when active state changes or on window resize
  useEffect(() => {
    // Add timeout to ensure DOM has updated
    const updateContentHeight = () => {
      if (contentWrapperRef.current && isActive) {
        // Add extra padding to prevent cutoff with animations
        const height = contentWrapperRef.current.scrollHeight + 20;
        setContentHeight(height);
      } else {
        setContentHeight(0);
      }
    };

    // Initial update - make it immediate for faster response
    updateContentHeight();
    
    // Handle resize to ensure proper height calculation
    const handleResize = debounce(updateContentHeight, 50); // Reduced debounce delay
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive, category.skills.length, viewType, selectedSkills]);
  
  // Add direct style injection for faster animations
  useEffect(() => {
    if (!isActive) return;
    
    // Force hardware acceleration for smoother animations
    if (contentRef.current) {
      contentRef.current.style.transform = 'translateZ(0)';
    }
    
    // Immediate height calculation for smoother open/close
    if (contentWrapperRef.current) {
      const height = contentWrapperRef.current.scrollHeight;
      setContentHeight(height);
    }
  }, [isActive]);
  
  // Simple debounce function for resize handler
  function debounce(fn: (...args: unknown[]) => void, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function(...args: unknown[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }
  
  return (
    <div 
      className="bg-[rgb(38,43,61)]/90 rounded-[20px] border border-blue-900/60 backdrop-blur-sm overflow-hidden shadow-lg shadow-black/5"
    >
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left focus:outline-none focus:ring-1 focus:ring-blue-800/50 focus:ring-offset-0 rounded-[20px]"
        aria-expanded={isActive}
      >
        <div className="flex items-center gap-3">
          <div className="bg-[rgb(38,43,61)] p-2.5 rounded-full shadow-inner shadow-black/10">
            <category.icon size={20} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{category.name}</h3>
            <p className="text-sm text-slate-300">{category.skills.length} skills</p>
          </div>
        </div>
        <div
          className={`bg-[rgb(38,43,61)]/90 p-1.5 rounded-full shadow-inner shadow-black/10 transform transition-transform duration-300 ${isActive ? 'rotate-180' : 'rotate-0'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </button>

      {/* Properly animated content with faster transitions */}
      <div 
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-out will-change-[height,opacity]"
        style={{ 
          height: contentHeight, 
          opacity: contentHeight > 0 ? 1 : 0,
        }}
      >
        <div ref={contentWrapperRef} className="p-4 pt-0">
          <p className="text-slate-300 text-sm mb-4 leading-relaxed">{category.description}</p>
          
          {viewType === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {category.skills.map((skill: Skill, index: number) => (
                <OptimizedSkillCard 
                  key={`${skill.name}-${category.id}`} 
                  skill={skill} 
                  index={index} 
                  isSelected={selectedSkills.some(s => s.name === skill.name)}
                  onClick={() => onSkillClick(skill)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {category.skills.map((skill: Skill) => (
                <SkillListItem 
                  key={`${skill.name}-${category.id}`}
                  skill={skill}
                  isSelected={selectedSkills.some(s => s.name === skill.name)}
                  onClick={() => onSkillClick(skill)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

CategoryShowcase.displayName = 'CategoryShowcase';

// Optimized skill card component with minimal animations to prevent freezing
const OptimizedSkillCard = memo(({ 
  skill, 
  index, 
  isSelected,
  onClick
}: { 
  skill: Skill; 
  index: number;
  isSelected?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-[20px] border backdrop-blur-lg group cursor-pointer
                ${isSelected 
                  ? 'bg-[rgb(38,43,61)]/95 border-blue-600/70 shadow-lg' 
                  : `bg-[rgb(38,43,61)]/90 border-blue-900/50 hover:border-blue-800/60`}`}
      style={{
        borderColor: isSelected ? undefined : 'transparent',
        willChange: 'opacity',
        opacity: 1, // Start visible immediately to avoid animation cost
        transition: 'border-color 0.2s ease', // Use CSS transition instead of animation
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden"
          style={{ backgroundColor: `${skill.color}15` }}
        >
          <div className="absolute inset-0 opacity-20" style={{ 
            background: `linear-gradient(135deg, transparent 30%, ${skill.color} 150%)` 
          }} />
          {skill.icon && <skill.icon size={24} className="text-white relative z-10" />}
        </div>
        
        <div>
          <h4 className="text-lg font-medium text-white">{skill.name}</h4>
          {skill.years && (
            <div className="text-xs text-slate-300">
              <span className="font-medium">{skill.years}</span> {skill.years === 1 ? 'year' : 'years'} experience
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <div className="relative">
          <div className="text-xs text-slate-300 mb-2 flex justify-between">
            <span>Proficiency</span>
            <span className="font-medium text-white">{skill.level}%</span>
          </div>          <div className="bg-[rgb(38,43,61)]/80 h-2.5 rounded-full w-full overflow-hidden">
            <div 
              className="h-full rounded-full relative"
              style={{ 
                backgroundColor: skill.color,
                width: `${skill.level}%`,
                animation: `growWidth 0.3s ease-out forwards` // Faster width animation
              }}
            >
              <div className="absolute top-0 left-0 h-full w-full bg-white opacity-20 overflow-hidden"></div>
            </div>
          </div>
        </div>        <div className="mt-4 text-sm text-slate-300 overflow-hidden">
          {skill.description}
        </div>
      </div>
      
      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 rounded-full bg-blue-600/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
});

OptimizedSkillCard.displayName = 'OptimizedSkillCard';

// Main SkillsSection component - optimized for performance
export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null); // No default active category - user must click to expand
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [filterTerm, setFilterTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  
  // Toggle category with improved performance
  const toggleCategory = useCallback((categoryId: string) => {
    setActiveCategory(prev => prev === categoryId ? null : categoryId);
  }, []);
  
  // Enhanced skill selection handler
  const toggleSkill = useCallback((skill: Skill) => {
    setSelectedSkills(prev => {
      const exists = prev.some(s => s.name === skill.name);
      if (exists) {
        return prev.filter(s => s.name !== skill.name);
      } else if (prev.length >= 5) {
        // If we already have 5 skills, replace the oldest one
        return [...prev.slice(1), skill];
      } else {
        return [...prev, skill];
      }
    });
  }, []);
  
  // Subtitles for the section header
  const skillsSubtitles = [
    "My technical skills and areas of expertise",
    "Capabilities developed through projects and continuous learning",
    "Technologies and tools I work with regularly"
  ];
  
  // Memoize and optimize component rendering
  const skillStats = useMemo(() => {
    const allSkills = categories.flatMap(cat => cat.skills);
    const totalCount = allSkills.length;
    const avgProficiency = Math.round(allSkills.reduce((sum, skill) => sum + skill.level, 0) / totalCount);
    const topSkills = [...allSkills].sort((a, b) => b.level - a.level).slice(0, 3);
    
    return { totalCount, avgProficiency, topSkills };
  }, []);
  // Handle filter toggle with debouncing to prevent UI freezing
  const toggleFilter = useCallback((filter: string) => {
    // Use requestAnimationFrame to debounce the state update
    requestAnimationFrame(() => {
      setActiveFilters(prev => 
        prev.includes(filter) 
          ? prev.filter(f => f !== filter) 
          : [...prev, filter]
      );
    });
  }, []);

  // Get filtered categories based on active filters
  const filteredCategories = useMemo(() => {
    if (activeFilters.length === 0 && !filterTerm) {
      return categories;
    }
    
    return categories.map(category => {
      // Filter skills within category
      const filteredSkills = category.skills.filter(skill => {
        // Text filter
        const matchesText = !filterTerm || 
          skill.name.toLowerCase().includes(filterTerm.toLowerCase()) || 
          skill.description.toLowerCase().includes(filterTerm.toLowerCase());
          
        // Category filter
        const matchesCategory = activeFilters.length === 0 || 
          activeFilters.includes(category.id);
            
        return matchesText && matchesCategory;
      });
      
      return {
        ...category,
        skills: filteredSkills
      };
    }).filter(category => category.skills.length > 0);
  }, [categories, activeFilters, filterTerm]);
  
  // Add CSS animations directly to the head for better performance
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translate3d(0, 5px, 0); }
        to { opacity: 1; transform: translate3d(0, 0, 0); }
      }
      @keyframes growWidth {
        from { width: 0; }
      }
      @keyframes glow {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.6; }
      }
      @keyframes pulse1 {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 0.65; }
      }
      @keyframes pulse2 {
        0%, 100% { opacity: 0.55; }
        50% { opacity: 0.7; }
      }
      @keyframes pulse3 {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 0.75; }
      }
      @keyframes pulse4 {
        0%, 100% { opacity: 0.65; }
        50% { opacity: 0.75; }
      }
      @keyframes pulse5 {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 0.8; }
      }
      @keyframes ping-slow {
        0%, 100% { transform: scale(1); opacity: 0.75; }
        50% { transform: scale(1.05); opacity: 1; }
      }
      @keyframes pulse-slow {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.02); opacity: 0.75; }
      }
      * {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <section 
      id="skills" 
      className="py-16 bg-[rgb(38,43,61)] overflow-x-hidden"
      style={{ 
        willChange: 'transform', // Performance optimization
        overflowX: 'hidden', // Prevent horizontal scroll
        contain: 'paint layout', // Additional performance optimization
      }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <AnimatedSectionTitle 
          title="Technical Skills" 
          subtitles={skillsSubtitles}
          rotationInterval={4000}
        />
        
        {/* Stats - improved visuals and microinteractions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true, margin: "-20px" }}            className="bg-[rgb(38,43,61)]/95 rounded-[20px] p-4 border border-blue-900/60 backdrop-blur-sm hover:border-blue-700/50 transition-all duration-300 group shadow-lg shadow-black/5"
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{skillStats.totalCount}</h3>
            <p className="text-slate-300">Technical Skills</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            viewport={{ once: true, margin: "-20px" }}            className="bg-[rgb(38,43,61)]/95 rounded-[20px] p-4 border border-blue-900/60 backdrop-blur-sm hover:border-blue-700/50 transition-all duration-300 group shadow-lg shadow-black/5"
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{skillStats.avgProficiency}%</h3>
            <p className="text-slate-300">Average Proficiency</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true, margin: "-20px" }}
            className="bg-[rgb(38,43,61)]/95 rounded-[20px] p-4 border border-blue-900/60 backdrop-blur-sm hover:border-blue-700/50 transition-all duration-300 group shadow-lg shadow-black/5"
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{categories.length}</h3>
            <p className="text-slate-300">Skill Categories</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            viewport={{ once: true, margin: "-20px" }}            className="bg-[rgb(38,43,61)]/95 rounded-[20px] p-4 border border-blue-900/60 backdrop-blur-sm hover:border-blue-700/50 transition-all duration-300 group shadow-lg shadow-black/5"
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {skillStats.topSkills[0]?.name}
            </h3>
            <p className="text-slate-300">Top Skill</p>              <div className="mt-2 bg-[rgb(38,43,61)]/80 h-2 rounded-full w-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${skillStats.topSkills[0]?.level || 0}%` }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="h-full rounded-full"
                style={{ 
                  backgroundColor: skillStats.topSkills[0]?.color || '#3b82f6',
                  boxShadow: `0 0 10px ${skillStats.topSkills[0]?.color}40`
                }}
              />
            </div>
          </motion.div>
        </div>
        
        {/* Skill comparison with improved functionality */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <SkillComparison 
            selectedSkills={selectedSkills}
            toggleSkill={toggleSkill}
          />
        </motion.div>
        
        {/* Filter and search bar with higher contrast */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 bg-[rgb(38,43,61)]/95 rounded-[20px] p-5 border border-blue-900/60 backdrop-blur-sm shadow-lg"
        >          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-grow w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input
                type="text"
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
                placeholder="Search skills..."
                className="bg-[rgb(28,33,51)] skills-mobile-bg text-white border border-blue-900/60 rounded-lg pl-10 pr-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-700 transition-all"
              />
              {filterTerm && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setFilterTerm('')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 hover:text-white">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
            
            <div className="w-full sm:w-auto skills-mobile-bg">
              <ViewToggle activeView={viewType} setActiveView={setViewType} />
            </div>
          </div>
            {/* Category filter tags with better contrast */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <motion.button
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
                key={category.id}
                onClick={() => toggleFilter(category.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all skills-mobile-bg ${
                  activeFilters.includes(category.id)                    ? 'bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-md'
                    : 'bg-[rgb(28,33,51)] border border-blue-900/60 text-slate-300 hover:text-white hover:border-blue-800/70'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {<category.icon size={14} className={activeFilters.includes(category.id) ? "text-white" : "text-blue-400"} />}
                  <span>{category.name}</span>
                </div>
              </motion.button>
            ))}
            {activeFilters.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setActiveFilters([])}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-red-900/20 text-red-200 hover:bg-red-900/30 transition-all border border-red-900/40"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  <span>Clear filters</span>
                </div>
              </motion.button>
            )}
          </div>
        </motion.div>
        
        {/* Title with elegant animation */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex items-center gap-3"
        >
          <motion.h2 
            initial={{ x: -15 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3, type: "spring", stiffness: 100, damping: 15 }}
            className="text-xl font-bold text-white"
          >
            Skill Breakdown
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="h-px flex-grow bg-gradient-to-r from-blue-800/60 via-blue-900/20 to-transparent"
            style={{ transformOrigin: "left" }}
          />
        </motion.div>
        
        {/* Skills categories with improved animation handling */}
        <div className="mt-6 space-y-4">
          {filteredCategories.length > 0 ? (
            <div className="space-y-4">
              {filteredCategories.map((category, index) => (
                <div
                  key={category.id}
                  style={{
                    opacity: 0,
                    animation: `fadeIn 0.15s ease-out ${0.03 + (index * 0.02)}s forwards`, // Ultra-fast animation
                    transform: 'translateZ(0)', // Force GPU acceleration
                    willChange: 'transform, opacity'
                  }}
                >
                  <CategoryShowcase
                    category={category}
                    isActive={activeCategory === category.id || filteredCategories.length === 1}
                    onToggle={() => toggleCategory(category.id)}
                    viewType={viewType}
                    selectedSkills={selectedSkills}
                    onSkillClick={toggleSkill}
                  />
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center bg-[rgb(38,43,61)]/95 rounded-[20px] border border-blue-900/50 shadow-lg"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgb(38,43,61)]/90 flex items-center justify-center shadow-inner shadow-black/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                  <path d="M8 11h6"></path>
                </svg>
              </div>
              <p className="text-slate-300 text-lg mb-4">No skills match your search criteria.</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setFilterTerm('');
                  setActiveFilters([]);
                }}
                className="mt-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-900/30 hover:bg-blue-800/40 text-white transition-colors border border-blue-800/50 hover:border-blue-700/70 shadow-md"
              >
                Reset Filters
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}