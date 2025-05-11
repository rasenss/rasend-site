"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Bot, Instagram, Linkedin, Mail, ArrowRight, ArrowUpRight } from "lucide-react";
import { ThemeProvider } from "../components/ThemeProvider";
import SkillsSection from "../components/SkillsSection";
import CertificationsSection from "../components/CertificationsSection";
import ResumeSection from "../components/ResumeSection";
import PortfolioSection from "../components/PortfolioSection";
import ContactSection from "../components/ContactSection"; 

// TypeWriter animation component
const TypewriterText = ({ text, delay = 40, className = "" }: { text: string; delay?: number; className?: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, delay, text]);

  return (
    <span className={`${className} ${isComplete ? "after:animate-blink" : ""}`}>
      {displayedText}
      {!isComplete && <span className="inline-block w-1 h-4 bg-blue-400 ml-0.5 animate-blink"></span>}
    </span>
  );
};

export default function Home() {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; width: string; height: string; duration: number; delay: number }[]>([]);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [activeDescriptionIndex, setActiveDescriptionIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false); // Added state for personal info visibility
  
  const descriptions = [
    "Project Management Enthusiast",
    "Student College",
    "Design & Programming Enthusiast",
    "Freelancer"
  ];

  // Client-side detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate stars on client-side only
  useEffect(() => {
    const generatedStars = Array(50).fill(0).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 4 + 1}px`,
      height: `${Math.random() * 4 + 1}px`,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }));
    setStars(generatedStars);
  }, []);

  // Switch between descriptions
  useEffect(() => {
    if (!animationComplete) return;
    
    const interval = setInterval(() => {
      setActiveDescriptionIndex(prev => (prev + 1) % descriptions.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [animationComplete, descriptions.length]);

  // Trigger animation complete after initial animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/rasendriya-khansa/", label: "LinkedIn", color: "#0077B5" },
    { icon: Github, href: "https://github.com/rasenss", label: "GitHub", color: "#333" },
    { icon: Bot, href: "https://discord.com/users/_.rasend", label: "Bot", color: "#5865F2" },
    { icon: Instagram, href: "https://www.instagram.com/rasendkhansa", label: "Instagram", color: "#E4405F" },
    { icon: Mail, href: "mailto:rasuen27@gmail.com", label: "Email", color: "#D44638" },
  ];

  // Floating animation for profile image
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut",
    }
  };

  // Glowing effect animation
  const glowAnimation = {
    boxShadow: [
      "0 0 15px rgba(59, 130, 246, 0.4)",
      "0 0 25px rgba(59, 130, 246, 0.6)",
      "0 0 15px rgba(59, 130, 246, 0.4)",
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "mirror" as const,
    }
  };

  // Calculate positions for the animated dots
  const dotPositions = [0, 1, 2].map((i) => ({
    top: `${50 + 45 * Math.cos(i * (Math.PI * 2) / 3)}%`,
    left: `${50 + 45 * Math.sin(i * (Math.PI * 2) / 3)}%`,
  }));

  return (
    <ThemeProvider>
      <div>
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center relative bg-[rgb(38,43,61)] overflow-hidden">
          {/* Background elements - animated dots/stars */}
          <div className="absolute inset-0 z-0">
            {isClient && stars.map((star) => (
              <motion.div 
                key={star.id}
                className="absolute rounded-full bg-blue-500/30"
                style={{
                  top: star.top,
                  left: star.left,
                  width: star.width,
                  height: star.height,
                }}
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: star.duration,
                  repeat: Infinity,
                  delay: star.delay,
                }}
              />
            ))}
          </div>
          
          {/* Main gradient background */}
          <div className="absolute inset-0 bg-[rgb(38,43,61)] z-0"></div>
          
          <div className="container mx-auto px-4 md:px-8 lg:px-12 z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <motion.div 
              className="w-full md:w-1/2 space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-5xl md:text-7xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.7, 
                  delay: 0.2,
                  type: "spring",
                  stiffness: 100 
                }}
              >
                <motion.span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 inline-block"
                  animate={{ 
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    repeatType: "mirror" 
                  }}
                >
                  Rasendriya
                </motion.span>
                <br />
                <motion.span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 inline-block"
                  animate={{ 
                    backgroundPosition: ["100% 100%", "0% 0%"],
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 0.5
                  }}
                >
                  Khansa
                </motion.span>
                <br />
                <motion.span 
                  className="text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                >
                  Jolankarfyan
                </motion.span>
              </motion.h1>
              
              <motion.div 
                className="text-gray-300 h-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDescriptionIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center flex-wrap"
                  >
                    {animationComplete ? (
                      <>
                        <span className={activeDescriptionIndex === 0 ? "text-blue-400" : ""}>{descriptions[activeDescriptionIndex]}</span>
                        {activeDescriptionIndex < descriptions.length - 1 && (
                          <>
                            <span className="mx-2 text-gray-500">•</span>
                          </>
                        )}
                      </>
                    ) : (
                      <TypewriterText 
                        text="Project Management Enthusiast • Student College • Design & Programming Enthusiast • Freelancer " 
                        className="text-blue-400"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
              
              <motion.div
                className="pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100, 
                  delay: 1.2
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="#portfolio"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all duration-300 group relative overflow-hidden"
                  >
                    <span className="relative z-10">Wanna See My Stuff ?</span>
                    <motion.span
                      className="relative z-10"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        repeatType: "loop",
                        ease: "easeInOut"
                      }}
                    >
                      <ArrowRight size={18} />
                    </motion.span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.div
                className="flex items-center gap-4 pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        transition: {
                          delay: 1.5 + index * 0.1,
                          type: "spring",
                          stiffness: 260,
                          damping: 20
                        }
                      }}
                      whileHover={{ 
                        y: -5, 
                        color: social.color,
                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 text-gray-400 hover:text-blue-500 bg-[rgb(38,43,61)] rounded-full transition-all duration-300"
                    >
                      <Icon size={20} />
                    </motion.a>
                  );
                })}
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="w-full md:w-1/2 flex justify-center relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                delay: 0.6
              }}
            >
              {/* Animated circle patterns around profile */}
              {isClient && (
                <>
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-[420px] h-[420px] rounded-full border border-blue-500/30 absolute"></div>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-[480px] h-[480px] rounded-full border border-blue-500/20 absolute"></div>
                  </motion.div>
                </>
              )}
              
              {/* Profile image container with animations */}
              <motion.div
                className="relative w-64 h-64 md:w-[320px] md:h-[320px] rounded-full z-10"
                animate={isClient ? floatingAnimation : {}}
              >
                {/* Glowing border */}
                {isClient && (
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-blue-500/50"
                    animate={glowAnimation}
                  ></motion.div>
                )}
                
                {/* Main profile image */}
                <motion.div 
                  className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-600/90 to-indigo-800/90 p-1 overflow-hidden"
                >
                  <div className="w-full h-full rounded-full bg-[rgb(38,43,61)] overflow-hidden relative">
                    {isClient ? (
                      <motion.div
                        animate={{ scale: [1, 1.02, 1], opacity: [0.9, 1, 0.9] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-full h-full relative"
                      >
                        <Image 
                          src="/me.jpg" 
                          alt="Rasendriya Khansa"
                          fill
                          className="object-cover w-full h-full rounded-full"
                          priority
                          sizes="(max-width: 768px) 256px, 320px"
                          loading="eager"
                        />
                      </motion.div>
                    ) : (
                      <div className="w-full h-full relative">
                        <Image 
                          src="/me.jpg" 
                          alt="Rasendriya Khansa"
                          fill
                          className="object-cover w-full h-full rounded-full"
                          priority
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
                
                {/* Animated dots around the image - only rendered client-side */}
                {isClient && dotPositions.map((position, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full bg-blue-500"
                    style={{
                      top: position.top,
                      left: position.left,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* About Section with enhanced animations */}
        <section id="about" className="min-h-screen pt-24 bg-[rgb(38,43,61)] text-white relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 z-0">
            {isClient && Array(20).fill(0).map((_, i) => (
              <motion.div 
                key={`about-particle-${i}`}
                className="absolute rounded-full bg-blue-500/10"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                }}
                animate={{
                  y: [0, Math.random() * 100 - 50, 0],
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, Math.random() * 0.5 + 1, 1],
                }}
                transition={{
                  duration: Math.random() * 15 + 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Decorative gradient circles */}
          <div className="absolute top-40 -left-64 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl"></div>
          <div className="absolute bottom-20 -right-64 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-3xl"></div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="mb-16 relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <motion.span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
                  animate={{ 
                    backgroundPosition: ["0% center", "100% center", "0% center"],
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                >
                  About Me
                </motion.span>
              </motion.h2>
              
              {/* Animated underline */}
              <motion.div 
                className="h-1 w-24 bg-blue-500/50 rounded-full mx-auto mt-4"
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: 100, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              />
            </motion.div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left side - Personal introduction with enhanced animations */}
              <motion.div 
                className="w-full lg:w-1/2 border border-blue-500/30 rounded-2xl p-8 bg-[rgb(38,43,61)]/60 backdrop-blur-md relative overflow-hidden group"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                whileHover={{ boxShadow: "0 0 30px rgba(59, 130, 246, 0.15)" }}
                viewport={{ once: true }}
              >
                {/* Animated gradient border */}
                <motion.div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                  style={{ 
                    background: "linear-gradient(90deg, rgba(59,130,246,0) 0%, rgba(59,130,246,0.3) 50%, rgba(59,130,246,0) 100%)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{
                    backgroundPosition: ["0% center", "100% center"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />

                <motion.div 
                  className="flex items-center space-x-2 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <motion.h3 
                    className="text-2xl md:text-3xl font-bold"
                    initial={{ backgroundPosition: "0% 0%" }}
                    animate={{ backgroundPosition: "100% 100%" }}
                    style={{
                      backgroundImage: "linear-gradient(90deg, #fff, #e0f0ff, #fff)",
                      backgroundSize: "200% 100%",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                  >
                    Rasendriya Khansa
                  </motion.h3>
                </motion.div>

                <motion.div 
                  className="text-gray-300 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <p>Student College | Designer & Developer</p>
                </motion.div>
                
                <motion.div 
                  className="text-gray-300 mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <p>
                    I am a high school graduate currently pursuing a degree in Computer Science, driven 
                    by a deep passion for web design, programming, and UI/UX design within the field of 
                    information technology. Alongside honing my technical skills, I am also exploring 
                    project management, aiming to develop innovative and visually captivating websites 
                    while effectively leading and organizing projects.
                  </p>
                </motion.div>

                {/* Experience and education cards */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="p-4 border border-blue-500/20 rounded-lg bg-[rgb(38,43,61)]/70"
                    whileHover={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.15)" }}
                  >
                    <div className="flex items-center mb-2">
                      <motion.div 
                        className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-2"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <span className="text-blue-400 text-sm">⏱</span>
                      </motion.div>
                      <h4 className="font-medium">Experience</h4>
                    </div>
                    <p className="text-sm text-gray-400">
                      2+ years of design & development experience
                    </p>
                  </motion.div>

                  <motion.div 
                    className="p-4 border border-blue-500/20 rounded-lg bg-[rgb(38,43,61)]/70"
                    whileHover={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.15)" }}
                  >
                    <div className="flex items-center mb-2">
                      <motion.div 
                        className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-2"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                      >
                        <span className="text-blue-400 text-sm">🎓</span>
                      </motion.div>
                      <h4 className="font-medium">Education</h4>
                    </div>
                    <p className="text-sm text-gray-400">
                      Computer Science Major, GPA: 3.46/4.00 (5th Semester)
                    </p>
                  </motion.div>

                  <motion.div 
                    className="p-4 border border-blue-500/20 rounded-lg bg-[rgb(38,43,61)]/70"
                    whileHover={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.15)" }}
                  >
                    <div className="flex items-center mb-2">
                      <motion.div 
                        className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-2"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                      >
                        <span className="text-blue-400 text-sm">📍</span>
                      </motion.div>
                      <h4 className="font-medium">Location</h4>
                    </div>
                    <p className="text-sm text-gray-400">
                      East Java, Indonesia
                    </p>
                  </motion.div>

                  <motion.div 
                    className="p-4 border border-blue-500/20 rounded-lg bg-[rgb(38,43,61)]/70"
                    whileHover={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.15)" }}
                  >
                    <div className="flex items-center mb-2">
                      <motion.div 
                        className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-2"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                      >
                        <span className="text-blue-400 text-sm">💼</span>
                      </motion.div>
                      <h4 className="font-medium">Freelance</h4>
                    </div>
                    <p className="text-sm text-gray-400">
                      Available for new projects
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
              
              {/* Right side - Personal info */}
              <motion.div 
                className="w-full lg:w-1/2 border border-blue-500/30 rounded-2xl p-8 bg-[rgb(38,43,61)]/60 backdrop-blur-md relative overflow-hidden group"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                whileHover={{ boxShadow: "0 0 30px rgba(59, 130, 246, 0.15)" }}
                viewport={{ once: true }}
                onClick={() => setShowPersonalInfo(!showPersonalInfo)} // Added click functionality
              >
                {/* Animated gradient border */}
                <motion.div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                  style={{ 
                    background: "linear-gradient(90deg, rgba(59,130,246,0) 0%, rgba(59,130,246,0.3) 50%, rgba(59,130,246,0) 100%)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{
                    backgroundPosition: ["0% center", "100% center"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />

                <motion.div 
                  className="flex items-center space-x-2 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <motion.h3 
                    className="text-2xl md:text-3xl font-bold"
                    initial={{ backgroundPosition: "0% 0%" }}
                    animate={{ backgroundPosition: "100% 100%" }}
                    style={{
                      backgroundImage: "linear-gradient(90deg, #fff, #e0f0ff, #fff)",
                      backgroundSize: "200% 100%",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                  >
                    Personal Info
                  </motion.h3>
                </motion.div>
                
                {/* Personal information grid with animation */}
                {showPersonalInfo && ( // Conditional rendering based on state
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {/* Left column of personal info */}
                    <div className="space-y-6">
                      <div>
                        <p className="text-gray-400 mb-1">Birthday:</p>
                        <p className="text-white">19 March 2003</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Phone:</p>
                        <p className="text-white">+62-881-0261-38014</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Email:</p>
                        <p className="text-white">rasuen27@gmail.com</p>
                      </div>
                    </div>
                    
                    {/* Right column of personal info */}
                    <div className="space-y-6">
                      <div>
                        <p className="text-gray-400 mb-1">Age:</p>
                        <p className="text-white">22</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">City:</p>
                        <p className="text-white">Pacitan,East Java, Indonesia</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Personal quote/philosophy with animation */}
                <motion.div 
                  className="mt-8 p-4 border border-blue-500/20 rounded-lg bg-[rgb(38,43,61)]/50"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <p className="text-gray-300 italic">
                    "I believe in creating designs that are not only visually appealing but also functional 
                    and user-friendly. My goal is to blend aesthetics with practicality to deliver 
                    exceptional digital experiences."
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Skills Section */}
        <section id="skills" className="min-h-screen pt-24 bg-[rgb(38,43,61)] text-white">
          <div className="container mx-auto px-4">
            <motion.div 
              className="mb-16 relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <motion.span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
                  animate={{ 
                    backgroundPosition: ["0% center", "100% center", "0% center"],
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                >
                  Skills & Expertise
                </motion.span>
              </motion.h2>
              
              {/* Animated underline */}
              <motion.div 
                className="h-1 w-24 bg-blue-500/50 rounded-full mx-auto mt-4"
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: 100, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              />
            </motion.div>
            
            <SkillsSection />
          </div>
        </section>
        
        {/* Certifications Section */}
        <section id="certifications" className="min-h-screen pt-24 bg-[rgb(38,43,61)] text-white relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            {isClient && Array(20).fill(0).map((_, i) => (
              <motion.div 
                key={`cert-particle-${i}`}
                className="absolute rounded-full bg-blue-500/10"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                }}
                animate={{
                  y: [0, Math.random() * 100 - 50, 0],
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, Math.random() * 0.5 + 1, 1],
                }}
                transition={{
                  duration: Math.random() * 15 + 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          
          {/* Decorative gradient circles */}
          <div className="absolute top-40 -left-64 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl"></div>
          <div className="absolute bottom-20 -right-64 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-3xl"></div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="mb-16 relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <motion.span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
                  animate={{ 
                    backgroundPosition: ["0% center", "100% center", "0% center"],
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                >
                  Certifications
                </motion.span>
              </motion.h2>
              
              {/* Animated underline */}
              <motion.div 
                className="h-1 w-24 bg-blue-500/50 rounded-full mx-auto mt-4"
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: 100, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              />
            </motion.div>
            
            <CertificationsSection />
          </div>
        </section>
        
        {/* Resume Section */}
        <ResumeSection />
        
        {/* Portfolio Section */}
        <PortfolioSection />
        
        {/* Contact Section */}
        <ContactSection />
      </div>
    </ThemeProvider>
  )
}