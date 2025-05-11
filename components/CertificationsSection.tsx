"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, File, X, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import AnimatedSectionTitle from './AnimatedSectionTitle';

// Define certification data structure
interface Skill {
  name: string;
}

interface Certification {
  id: string;
  name: string;
  organization: string;
  year: string;
  skills: Skill[];
  featured?: boolean;
  image: string;
  pdfLink?: string;
  credentialId?: string;
  credentialUrl?: string;
  expiryDate?: string;
}

// PDF Thumbnail component - with improved styling
const PDFThumbnail = ({ pdfUrl, alt }: { pdfUrl: string; alt: string }) => {
  // Extract certificate name for better display
  const fileName = pdfUrl.split('/').pop() || '';
  const certType = fileName.split('.')[0].toLowerCase();
    // Determine which icon/color to use based on certificate name
  let iconColor = "text-blue-400";
  
  if (certType.includes('aws') || certType.includes('cloud')) {
    iconColor = "text-blue-300";
  } else if (certType.includes('red') || certType.includes('team')) {
    iconColor = "text-red-400";
  } else if (certType.includes('google')) {
    iconColor = "text-green-400";
  }
  return (
    <div className={`relative h-full w-full flex items-center justify-center bg-[rgb(38,43,61)]`}>
      <div className={`${iconColor} transform scale-[2.5] opacity-80`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
      <span className="sr-only">{alt}</span>
    </div>
  );
};

// Sample certifications data
const certifications: Certification[] = [
  {
    id: "red-hat",
    name: "Red Hat Academy - Program Learner",
    organization: "Red Hat",
    year: "2024",
    skills: [
      { name: "Linux Administration" },
      { name: "System Management" },
      { name: "Cloud Infrastructure" }
    ],
    image: "/Certifications/img/RedHatCertificate.png",
    pdfLink: "/Certifications/RedHatCertificate.pdf",
    credentialId: "Red Hat Academy",
    credentialUrl: "https://www.credly.com/badges/b02f1f65-d245-424f-a0c3-44b9470ea5d3/linked_in_profile"
  },
  {
    id: "Security-Blue-Team",
    name: "Blue Team Junior Analyst Training",
    organization: "Security Blue Team",
    year: "2024",
    skills: [
      { name: "Threat Detection" },
      { name: "Incident Response" },
      { name: "Security Monitoring" }
    ],
    image: "/Certifications/img/Blue Team Junior Analyst Pathway.png",
    pdfLink: "/Certifications/Blue Team Junior Analyst Pathway.pdf",
    credentialId: "298711304"
  },
  {
    id: "aws-cloud",
    name: "AWS Academy Graduate - AWS Academy Cloud Foundations",
    organization: "Amazon Web Services (AWS)",
    year: "2025",
    skills: [
      { name: "Cloud Computing" },
      { name: "AWS Services" },
      { name: "Cloud Security" }
    ],
    image: "/Certifications/img/AWS_Academy_Graduate___AWS_Academy_Cloud_Foundations_Badge.png",
    pdfLink: "/Certifications/AWS_Academy_Graduate___AWS_Academy_Cloud_Foundations_Badge20250508-27-6tn2kv.pdf",
    credentialId: "AWS Academy Cloud Foundations",
    credentialUrl: "https://www.credly.com/badges/a89faf73-7775-432d-be7c-bff1417f4f2e/public_url"
  },
  {
    id: "web-dev",
    name: "Front-End Web Development for Beginners",
    organization: "Dicoding Indonesia",
    year: "2024",
    skills: [
      { name: "HTML" },
      { name: "CSS" },
      { name: "JavaScript" },
      { name: "Responsive Design" }
    ],
    image: "/Certifications/img/Front-End Web Development for Beginners.png",
    pdfLink: "/Certifications/Front-End Web Development for Beginners.pdf",
    credentialId: "RVZKRE6DMPD5",
    credentialUrl: "https://www.dicoding.com/certificates/RVZKRE6DMPD5",
    expiryDate: "Jun 2027"
  },
  {
    id: "responsive-design",
    name: "Responsive Web Design",
    organization: "freeCodeCamp",
    year: "2024",
    skills: [
      { name: "HTML5" },
      { name: "CSS3" },
      { name: "Responsive Design" },
      { name: "Accessibility" }
    ],
    image: "/Certifications/img/Responsive Web Design freeCodeCamp.png",
    pdfLink: "/Certifications/Responsive Web Design freeCodeCamp.pdf",
    credentialId: "rasend-rwd",
    credentialUrl: "https://freecodecamp.org/certification/rasend/responsive-web-design"
  },
  {
    id: "cloud-technical",
    name: "Google Cloud Technical Series Attendee Badge & Certificate",
    organization: "Google Cloud Asia Pacific",
    year: "2025",
    skills: [
      { name: "Cloud Services" },
      { name: "Google Cloud" },
      { name: "Cloud Security" }
    ],
    image: "/Certifications/img/Cloud Technical Series.png",
    pdfLink: "/Certifications/Cloud Technical Series.pdf",
    credentialId: "Google Cloud Technical Series",
    credentialUrl: "https://www.credential.net/01dc9d67-b5a3-4029-a6d4-a38587897c5d#acc.09FEAiZ6"
  },
  {
    id: "javascript",
    name: "Basic JavaScript Programming",
    organization: "Dicoding Indonesia",
    year: "2024",
    skills: [
      { name: "JavaScript" },
      { name: "ES6+" },
      { name: "DOM Manipulation" }
    ],
    image: "/Certifications/img/Learn Basic JavaScript Programming.png",
    pdfLink: "/Certifications/Learn Basic JavaScript Programming.pdf",
    credentialId: "07Z64OVORPQR",
    credentialUrl: "https://www.dicoding.com/certificates/07Z64OVORPQR",
    expiryDate: "Dec 2027"
  },
  {
    id: "react",
    name: "Building Web Applications with React",
    organization: "Dicoding Indonesia",
    year: "2024",
    skills: [
      { name: "React.js" },
      { name: "Component Design" },
      { name: "State Management" },
      { name: "Hooks" }
    ],
    image: "/Certifications/img/Learn to Build Apps with React.png",
    pdfLink: "/Certifications/Learn to Build Apps with React.pdf",
    credentialId: "53XEQV61VXRN",
    credentialUrl: "https://www.dicoding.com/certificates/53XEQV61VXRN",
    expiryDate: "Dec 2027"
  },
  {
    id: "python",
    name: "Procedural Programming with Python",
    organization: "Dicoding Indonesia",
    year: "2024",
    skills: [
      { name: "Python" },
      { name: "Algorithms" },
      { name: "Data Structures" }
    ],
    image: "/Certifications/img/Procedural Programming with Python.png",
    pdfLink: "/Certifications/Procedural Programming with Python.pdf",
    credentialId: "2VX3Q526QZYQ",
    credentialUrl: "https://www.dicoding.com/certificates/2VX3O526QZYQ",
    expiryDate: "Feb 2027"
  },
  {
    id: "project-management",
    name: "Project Management Fundamentals",
    organization: "Dicoding Indonesia",
    year: "2023",
    skills: [
      { name: "Project Planning" },
      { name: "Risk Management" },
      { name: "Resource Allocation" }
    ],
    image: "/Certifications/img/Learn the Basics of Project Management.png",
    pdfLink: "/Certifications/Learn the Basics of Project Management.pdf",
    credentialId: "4EXGK6EKDZRL",
    credentialUrl: "https://www.dicoding.com/certificates/4EXGK6EKDZRL",
    expiryDate: "Jul 2026"
  },
  {
    id: "sql",
    name: "Structured Query Language (SQL) Fundamentals",
    organization: "Dicoding Indonesia",
    year: "2023",
    skills: [
      { name: "Database Design" },
      { name: "SQL Queries" },
      { name: "Data Manipulation" }
    ],
    image: "/Certifications/img/Structured Query Language (SQL).png",
    pdfLink: "/Certifications/Structured Query Language (SQL).pdf",
    credentialId: "EYX4008JOPDL",
    credentialUrl: "https://www.dicoding.com/certificates/EYX4008JOPDL",
    expiryDate: "Aug 2026"
  },
  {
    id: "Google-Next25",
    name: "Google Cloud Best of Next '25",
    organization: "Google Cloud Asia Pacific",
    year: "2025",
    skills: [
      { name: "Cloud Computing" },
      { name: "Google Cloud" },
      { name: "Cloud Infrastructure" },
      { name: "Cloud Security" }
    ],
    image: "/Certifications/img/Best Of Next'25.png",
    pdfLink: "/Certifications/Best Of Next'25.pdf",
    credentialId: "Google Cloud Best of Next",
    credentialUrl: "https://www.credential.net/22a4eba3-b7e6-4d25-9a94-5eb790b152bc#acc.BEJKkszy"
  },
  {
    id: "basic-ai",
    name: "Foundations of AI",
    organization: "Dicoding Indonesia",
    year: "2024",
    skills: [
      { name: "AI Concepts" },
      { name: "Machine Learning" }
    ],
    image: "/Certifications/img/Learn Basic of AI.png",
    pdfLink: "/Certifications/Learn Basic of AI.pdf",
    credentialId: "L4PQ5NJ7ZZO1",
    credentialUrl: "https://www.dicoding.com/certificates/L4PQ5NJ77ZO1",
    expiryDate: "Dec 2027"
  },
  {
    id: "basic-web",
    name: "Basic Web Programming",
    organization: "Dicoding Indonesia",
    year: "2024",
    skills: [
      { name: "HTML" },
      { name: "CSS" },
      { name: "JavaScript" },
      { name: "Web Development" }
    ],
    image: "/Certifications/img/Learn Basic Web Programming.png",
    pdfLink: "/Certifications/Learn Basic Web Programming.pdf",
    credentialId: "L4PQ16967XO1",
    credentialUrl: "https://www.dicoding.com/certificates/L4PQ16967XO1",
    expiryDate: "May 2027"
  },
  {
    id: "software-dev",
    name: "Introduction to Software Development Programming",
    organization: "Dicoding Indonesia",
    year: "2023",
    skills: [
      { name: "Programming Fundamentals" },
      { name: "GitHub" },
      { name: "Software Development" }
    ],
    image: "/Certifications/img/Getting Started with Basic Programming to Become a Software Developer.png",
    pdfLink: "/Certifications/Getting Started with Basic Programming to Become a Software Developer.pdf",
    credentialId: "0LZ09EW20Z65",
    credentialUrl: "https://www.dicoding.com/certificates/0LZ09EW20Z65",
    expiryDate: "Aug 2026"
  },
  {
    id: "marketing",
    name: "Designing & Marketing Brand Logos",
    organization: "Skill Academy by Ruangguru",
    year: "2023",
    skills: [
      { name: "Brand Strategy" },
      { name: "Logo Design" },
      { name: "Marketing" },
      { name: "Design" }
    ],
    image: "/Certifications/img/Designing & Marketing Brands and Logos for Marketing Managers.png",
    pdfLink: "/Certifications/Designing & Marketing Brands and Logos for Marketing Managers.pdf",
    credentialId: "J6R8V86C",
    credentialUrl: "https://skillacademy.com/sertifikat/ULATC21CQ5Y4R7"
  },
  {
    id: "it-sales",
    name: "IT Product Sales Specialist in B2b",
    organization: "Tomoru",
    year: "2023",
    skills: [
      { name: "Sales Management" },
      { name: "B2B Sales" },
      { name: "IT Products" }
    ],
    image: "/Certifications/img/IT Product Sales Specialist in B2b.png",
    pdfLink: "/Certifications/IT Product Sales Specialist in B2b .pdf",
    credentialId: "Tomoru Certificate"
  }
];

/* CertificationCard component is defined here */
const CertificationCard = ({ certification, index }: { certification: Certification, index: number }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}      className="relative bg-[rgb(38,43,61)] border border-blue-500/20 rounded-xl overflow-hidden mb-6 
                group hover:border-blue-400/40 transition-all duration-500"
      whileHover={{ 
        y: -4, 
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3), 0 6px 12px rgba(59, 130, 246, 0.15)"
      }}
      layout
    >
      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Certificate image with elegant hover effect */}
        <div 
          className="relative h-[160px] md:h-auto overflow-hidden md:col-span-1 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Zoom icon overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <div className="bg-blue-500/80 p-2 rounded-full">
              <ZoomIn className="text-white" size={20} />
            </div>
          </div>
          
          {certification.image.endsWith('.pdf') ? (
            <div className="relative h-full w-full">
              <PDFThumbnail pdfUrl={certification.image} alt={certification.name} />
            </div>
          ) : (
            <Image
              src={certification.image}
              alt={certification.name}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-contain object-center p-3 transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
              priority={false}
              loading="lazy"
              quality={80}
            />
          )}
        </div>
        
        {/* Certificate details with glass effect */}
        <div className="p-5 md:col-span-4 bg-blue-900/5 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between w-full gap-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
                {certification.name}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                <span className="font-medium">{certification.organization}</span> 
                <span className="text-blue-500">•</span> 
                <span>{certification.year}</span>
                {certification.expiryDate && (
                  <>
                    <span className="text-blue-500">•</span>
                    <span>Expires {certification.expiryDate}</span>
                  </>
                )}
              </div>
              
              {/* Skills tags with animation */}
              <div className="flex flex-wrap gap-2 mt-3">
                {certification.skills.map((skill, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 0.2 + (idx * 0.05),
                      duration: 0.4
                    }}
                    className="bg-gradient-to-r from-blue-900/40 to-blue-800/30 text-blue-300 text-xs px-3 py-1.5 rounded-full border border-blue-500/20
                              hover:border-blue-400/40 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              {/* Certificate viewing button */}
              <a 
                href={certification.pdfLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 
                          text-white text-sm py-2 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-blue-900/30
                          hover:shadow-blue-800/40 hover:-translate-y-0.5 active:translate-y-0 group/btn"
              >
                View Certificate 
                <motion.span 
                  className="inline-block"
                  animate={{ x: [0, 2, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 1,
                    repeatDelay: 1
                  }}
                >
                  <ArrowUpRight size={14} />
                </motion.span>
              </a>
              
              {/* Credential button */}
              {certification.credentialId && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center justify-center gap-1.5 bg-[rgb(38,43,61)] border border-blue-500/30 hover:border-blue-400/60
                            text-blue-400 hover:text-blue-300 text-sm py-2 px-4 rounded-lg transition-all duration-300"
                  aria-expanded={showDetails}
                >
                  {showDetails ? 'Hide Credential' : 'Show Credential'}
                </button>
              )}
            </div>
          </div>
          
          {/* Credential details panel with animation */}
          <AnimatePresence>
            {showDetails && certification.credentialId && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: 1, 
                  height: 'auto',
                  transition: { duration: 0.3, ease: 'easeOut' }
                }}
                exit={{ 
                  opacity: 0, 
                  height: 0,
                  transition: { duration: 0.2, ease: 'easeIn' }
                }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-blue-900/10 backdrop-blur-sm rounded-lg border border-blue-500/20">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-300 mb-1">
                        <span className="text-gray-400">Credential ID:</span>{" "}
                        <span className="font-medium text-white">{certification.credentialId}</span>
                      </p>
                      <p className="text-sm text-gray-300">
                        <span className="text-gray-400">Issuing Organization:</span>{" "}
                        <span className="font-medium text-white">{certification.organization}</span>
                      </p>
                    </div>
                    <a 
                      href={certification.credentialUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-transparent text-blue-400 hover:text-blue-300 text-sm py-1.5 px-3 
                              border border-blue-500/30 hover:border-blue-400/60 rounded-lg transition-all duration-300"
                    >
                      Credential URL → <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Modal for certificate preview */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              transition={{ duration: 0.3, type: "spring", damping: 25 }}
              className="bg-[rgb(38,43,61)] rounded-xl overflow-hidden shadow-xl max-w-4xl w-full max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              <div className="p-6 flex flex-col items-center">
                <h3 className="text-xl font-bold text-white mb-4 text-center">{certification.name}</h3>
                
                {/* Modal content - image with proper sizing */}
                <div className="relative w-full h-[60vh] bg-[rgb(38,43,61)] rounded-lg overflow-hidden">
                  <Image
                    src={certification.image}
                    alt={certification.name}
                    fill
                    sizes="(max-width: 1200px) 90vw, 70vw"
                    className="object-contain p-2"
                    priority={true}
                    quality={100}
                  />
                </div>

                {/* Modal footer with info */}
                <div className="w-full mt-4 flex flex-wrap justify-between items-center">
                  <div className="text-gray-300 text-sm">
                    <p><span className="text-gray-400">Organization:</span> {certification.organization}</p>
                    <p><span className="text-gray-400">Issued:</span> {certification.year}</p>
                  </div>
                  
                  <a 
                    href={certification.pdfLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 
                              text-white text-sm py-2 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-blue-900/30
                              hover:shadow-blue-800/40"
                  >
                    <File size={16} />
                    Download PDF
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Certificate Modal Component - Optimized for performance
const CertificateModal = ({ 
  isOpen, 
  onClose, 
  certificate 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  certificate: Certification | null 
}) => {
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!certificate) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }} // Faster transition to reduce lag
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
          style={{ 
            position: 'fixed',
            isolation: 'isolate' // Optimize compositing
          }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.2, type: "spring", damping: 30 }}
            className="bg-[rgb(38,43,61)] rounded-xl overflow-hidden shadow-xl w-full max-w-3xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              willChange: 'transform', // Optimize GPU rendering
              contain: 'content' // Improve performance
            }}
          >
            {/* Close button - larger for better usability */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-[110] p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="p-6 flex flex-col items-center">
              <h3 className="text-lg font-bold text-white mb-4 text-center">{certificate.name}</h3>
              
              {/* Modal content - image with optimized loading */}
              <div 
                className="relative w-full bg-[rgb(38,43,61)] rounded-lg overflow-hidden"
                style={{
                  height: 'min(60vh, 600px)', // Optimize fixed height
                  minHeight: '300px',
                  containIntrinsicSize: 'auto 500px', // Hint to browser for layout
                }}
              >
                <Image
                  src={certificate.image}
                  alt={certificate.name}
                  fill
                  sizes="(max-width: 1200px) 85vw, 800px"
                  className="object-contain p-2"
                  priority
                  quality={80} // Slightly lower quality for better performance
                  loading="eager"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNcvWrVfwAG8gLMxzRoTwAAAABJRU5ErkJggg=="
                />
              </div>

              {/* Modal footer with info */}
              <div className="w-full mt-4 flex flex-wrap justify-between items-center">
                <div className="text-gray-300 text-sm">
                  <p><span className="text-gray-400">Organization:</span> {certificate.organization}</p>
                  <p><span className="text-gray-400">Issued:</span> {certificate.year}</p>
                </div>
                
                <a 
                  href={certificate.pdfLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 
                            text-white text-sm py-2 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-blue-900/30
                            hover:shadow-blue-800/40"
                >
                  <File size={16} />
                  Download PDF
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Memory-optimized Certificate Card component
const CertCard = React.memo(function CertCard({ certification, index }: { certification: Certification; index: number }) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Calculate delay based on index but cap it to avoid long delays for many certificates
  const animationDelay = Math.min(index * 0.05, 0.8);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.4, // Faster duration
        delay: animationDelay,
        ease: [0.22, 1, 0.36, 1]
      }}      className="relative bg-[rgb(38,43,61)] border border-blue-500/20 rounded-xl overflow-hidden mb-6 
                group hover:border-blue-400/40 transition-all duration-300"
      whileHover={{ 
        y: -4, 
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3), 0 6px 12px rgba(59, 130, 246, 0.15)"
      }}
      layout="position"
    >
      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Certificate image with elegant hover effect */}
        <div 
          className="relative h-[160px] md:h-auto overflow-hidden md:col-span-1 cursor-pointer"
          onClick={() => {
            // Using a global context or parent component prop would be better
            // but for now we'll use it as is
            const parentOpenModal = (window as Window & { __openCertificateModal?: (cert: Certification) => void }).__openCertificateModal;
            if (typeof parentOpenModal === 'function') {
              parentOpenModal(certification);
            }
          }}
          style={{ backfaceVisibility: 'hidden' }} /* Prevents flickering */
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Zoom icon overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <div className="bg-blue-500/80 p-2 rounded-full">
              <ZoomIn className="text-white" size={20} />
            </div>
          </div>
          
          <Image
            src={certification.image}
            alt={certification.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-contain object-center p-3 transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            quality={70} // Further reduced quality to improve performance
          />
        </div>
        
        {/* Certificate details */}
        <div className="p-5 md:col-span-4 bg-blue-900/5 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between w-full gap-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
                {certification.name}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                <span className="font-medium">{certification.organization}</span> 
                <span className="text-blue-500">•</span> 
                <span>{certification.year}</span>
                {certification.expiryDate && (
                  <>
                    <span className="text-blue-500">•</span>
                    <span>Expires {certification.expiryDate}</span>
                  </>
                )}
              </div>
              
              {/* Skills tags with reduced animations */}
              <div className="flex flex-wrap gap-2 mt-3">
                {certification.skills.slice(0, 4).map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-gradient-to-r from-blue-900/40 to-blue-800/30 text-blue-300 text-xs px-3 py-1.5 rounded-full border border-blue-500/20
                              hover:border-blue-400/40 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              {/* Certificate viewing button */}
              <a 
                href={certification.pdfLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 
                          text-white text-sm py-2 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-blue-900/30
                          hover:shadow-blue-800/40 hover:-translate-y-0.5 active:translate-y-0 group/btn"
              >
                View Certificate 
                <motion.span 
                  className="inline-block"
                  animate={{ x: [0, 2, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 1,
                    repeatDelay: 1
                  }}
                >
                  <ArrowUpRight size={14} />
                </motion.span>
              </a>
              
              {/* Credential button */}
              {certification.credentialId && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center justify-center gap-1.5 bg-[rgb(38,43,61)] border border-blue-500/30 hover:border-blue-400/60
                            text-blue-400 hover:text-blue-300 text-sm py-2 px-4 rounded-lg transition-all duration-300"
                  aria-expanded={showDetails}
                >
                  {showDetails ? 'Hide Credential' : 'Show Credential'}
                </button>
              )}
            </div>
          </div>
          
          {/* Credential details panel with animation */}
          <AnimatePresence>
            {showDetails && certification.credentialId && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: 1, 
                  height: 'auto',
                  transition: { duration: 0.3, ease: 'easeOut' }
                }}
                exit={{ 
                  opacity: 0, 
                  height: 0,
                  transition: { duration: 0.2, ease: 'easeIn' }
                }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-blue-900/10 backdrop-blur-sm rounded-lg border border-blue-500/20">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-300 mb-1">
                        <span className="text-gray-400">Credential ID:</span>{" "}
                        <span className="font-medium text-white">{certification.credentialId}</span>
                      </p>
                      <p className="text-sm text-gray-300">
                        <span className="text-gray-400">Issuing Organization:</span>{" "}
                        <span className="font-medium text-white">{certification.organization}</span>
                      </p>
                    </div>
                    {certification.credentialUrl && (
                      <a 
                        href={certification.credentialUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-transparent text-blue-400 hover:text-blue-300 text-sm py-1.5 px-3 
                                border border-blue-500/30 hover:border-blue-400/60 rounded-lg transition-all duration-300"
                      >
                        Credential URL → <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
});

// Avoid re-renders by using displayName
CertCard.displayName = 'CertCard';

// Main CertificationsSection component
const CertificationsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6); // Initially show only 6 certifications
  const [modalState, setModalState] = useState({
    isOpen: false,
    certificate: null as Certification | null
  });
  
  // Global modal control functions
  const openModal = (certificate: Certification) => {
    // Close any existing modal first
    setModalState({
      isOpen: true,
      certificate
    });
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
  };
  
  // Make openModal globally accessible for the CertCard component
  useEffect(() => {    (window as Window & { __openCertificateModal?: (cert: Certification) => void }).__openCertificateModal = openModal;
    return () => {
      delete (window as Window & { __openCertificateModal?: (cert: Certification) => void }).__openCertificateModal;
    };
  }, []);
  
  const closeModal = () => {
    setModalState({
      isOpen: false,
      certificate: null
    });
    
    // Re-enable scrolling
    document.body.style.overflow = '';
  };
  
  // Memoize organizations list to prevent recalculation
  const organizations = useMemo(() => {
    return Array.from(new Set(certifications.map(cert => cert.organization)));
  }, []);
    // Memoize filtered certifications for better performance
  const filteredCertifications = useMemo(() => {
    return certifications.filter(cert => {
      const matchesSearch = searchTerm === '' || 
        cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.skills.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = !filter || cert.organization === filter;
      
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filter]);
  
  // Get visible certifications based on the current visibleCount limit
  const visibleCertifications = useMemo(() => {
    return filteredCertifications.slice(0, visibleCount);
  }, [filteredCertifications, visibleCount]);
  
  // Handle loading more certifications
  const loadMore = () => {
    // Increase by 6 or show all if almost at the end
    const remaining = filteredCertifications.length - visibleCount;
    if (remaining <= 3) {
      setVisibleCount(filteredCertifications.length);
    } else {
      setVisibleCount(visibleCount + 6);
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Handle cleanup and reset for section navigation
  useEffect(() => {
    // Reset initial load state after component mounts
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 50); // Reduced from 100ms to 50ms for faster initialization
    
    // Intersection Observer to detect when section is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When section comes into view, pre-warm component
        if (entry.isIntersecting) {
          // No need for heavy operations here, the presence of the observer
          // helps prevent component from cold starts when navigating
        }
      },
      { threshold: 0.1 } // Only need 10% visibility to start warming up
    );
    
    // Observe the section element
    const section = document.getElementById('certifications');
    if (section) {
      observer.observe(section);
    }
    
    return () => {
      clearTimeout(timer);
      if (section) {
        observer.unobserve(section);
      }
      observer.disconnect();
    };
  }, []);

  // Handle escape key for the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalState.isOpen) {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalState.isOpen]);
  
  // Rotating subtitles for certifications section
  const certificationSubtitles = [
    "Industry recognized credentials that showcase my expertise and commitment to professional development",
    "Professional certifications that validate my skills and knowledge in various domains",
    "Continuously expanding my qualifications through specialized training and certification",
    "Credentials that demonstrate my dedication to excellence in professional growth"
  ];
  
  return (
    <section id="certifications" className="py-20 bg-[rgb(38,43,61)]">
      <div className="container mx-auto px-4">
        <AnimatedSectionTitle 
          title="Certifications"
          subtitles={certificationSubtitles}
          rotationInterval={4500}
        />
        
        <div className="mb-8 flex flex-col md:flex-row gap-4 md:items-center justify-between">
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center">          <div className="relative">
              <input
                type="text"
                placeholder="Search certifications..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(6); // Reset visible count on search
                }}
                className="bg-[rgb(38,43,61)] border border-blue-500/30 text-white px-4 py-2 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            
            <select
              value={filter || ''}
              onChange={(e) => {
                setFilter(e.target.value || null);
                setVisibleCount(6); // Reset visible count on filter change
              }}
              className="bg-[rgb(38,43,61)] border border-blue-500/30 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="">All Organizations</option>
              {organizations.map((org) => (
                <option key={org} value={org}>{org}</option>
              ))}
            </select>
          </div>
        </div>
          {/* Optimized list rendering with virtualization hints */}
        <div 
          className="content-visibility-auto" 
          style={{ 
            containIntrinsicSize: `0 ${visibleCertifications.length * 200}px`
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`list-${searchTerm}-${filter}-${visibleCount}`} // Unique key based on filters and visible count
              initial={isInitialLoad ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {visibleCertifications.map((cert, index) => (
                <CertCard key={cert.id} certification={cert} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* No results message */}
        {filteredCertifications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No certifications found matching your search criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilter(null);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
        
        {/* Load more button */}
        {filteredCertifications.length > visibleCount && (
          <div className="flex justify-center mt-10">
            <motion.button
              onClick={loadMore}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 
                        text-white font-medium rounded-lg shadow-lg shadow-blue-900/30
                        hover:shadow-blue-800/40 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Load More Certifications
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                animate={{ y: [0, 3, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  duration: 1.5,
                  ease: "easeInOut" 
                }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </motion.svg>
            </motion.button>
          </div>
        )}
        
        {/* Show count info */}
        {filteredCertifications.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Showing {visibleCertifications.length} of {filteredCertifications.length} certifications {filteredCertifications.length !== certifications.length && `(filtered from ${certifications.length} total)`}
          </div>
        )}
        
        {/* Centralized modal for certificate viewing */}
        <CertificateModal 
          isOpen={modalState.isOpen}
          onClose={closeModal}
          certificate={modalState.certificate}
        />
      </div>
    </section>
  );
};

export default CertificationsSection;