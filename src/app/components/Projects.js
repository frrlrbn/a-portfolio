'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';

const projects = [
  {
    title: 'Poster Jumat Bersih Stembayo',
    image: '/images/projects-poster-1.png',
    category: 'Poster',
    size: 'medium',
  },
  {
    title: 'Struktur Pengurus Organisasi',
    image: '/images/projects-poster-2.jpg',
    category: 'Instagram Grid Design',
    size: 'medium',
  },
  {
    title: 'Poster Gerakan Sekolah Sehat Stembayo',
    image: '/images/projects-poster-3.png',
    category: 'Poster',
    size: 'medium',
  },
  {
    title: 'Poster Event',
    image: '/images/projects-poster-4.png',
    category: 'Poster',
    size: 'medium',
  },
  {
    title: 'Design Template Instagram 2025',
    image: '/images/projects-poster-5.png',
    category: 'Design',
    size: 'medium',
  },
  {
    title: 'Design Polaroid',
    image: '/images/projects-poster-6.jpg',
    category: 'Design',
    size: 'medium',
  },
  {
    title: 'Poster Imlek 2025',
    image: '/images/projects-poster-7.jpg',
    category: 'Poster',
    size: 'medium',
  },
  {
    title: 'Design Template Instagram Christmas 2024',
    image: '/images/projects-poster-8.jpg',
    category: 'Design',
    size: 'medium',
  },
  {
    title: 'Daniel Caesar Album Cover Edit',
    image: '/images/projects-poster-9.jpg',
    category: 'Editing',
    size: 'medium',
  },
  {
    title: 'Outline Object Photo Editing',
    image: '/images/projects-poster-10.jpg',
    category: 'Editing',
    size: 'medium',
  },
];

export default function Projects() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [visibleProjects, setVisibleProjects] = useState(2);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setVisibleProjects(projects.length);
      } else {
        setVisibleProjects(isExpanded ? projects.length : 2);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isExpanded]);

  const toggleProjects = () => {
    setIsExpanded(!isExpanded);
    setVisibleProjects(isExpanded ? 2 : projects.length);
  };

  const openModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotate: -5
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      rotate: 5,
      transition: {
        duration: 0.2
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <section id="projects" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex justify-center">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-black mb-4 relative inline-block text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Projects
              <motion.span
                className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1]
                }}
              />
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {projects.slice(0, visibleProjects).map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative ${
                  project.size === 'large' 
                    ? 'sm:col-span-2 lg:col-span-2' 
                    : ''
                }`}
                onHoverStart={() => setHoveredProject(project.title)}
                onHoverEnd={() => setHoveredProject(null)}
              >
                <div 
                  className="cartoon-outline bg-white p-3 h-full w-full cursor-pointer"
                  onClick={() => openModal(project)}
                >
                  <div className={`w-full ${
                    project.size === 'large' 
                      ? 'aspect-[16/9] sm:aspect-[16/9]' 
                      : 'aspect-square'
                  } rounded-lg overflow-hidden`}>
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: hoveredProject === project.title ? 1 : 0,
                  }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg cursor-pointer"
                  onClick={() => openModal(project)}
                >
                  <div className="text-center p-3">
                    <h3 className="text-white text-lg font-semibold mb-1">
                      {project.title}
                    </h3>
                    <span className="text-yellow-500 text-sm font-medium">
                      {project.category}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* View More Button - Mobile Only */}
          {isMobile && (
            <div className="flex justify-center mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleProjects}
                className="cartoon-outline bg-white px-6 py-3 rounded-full flex items-center space-x-2"
              >
                <span className="font-medium">
                  {isExpanded ? 'Show Less' : 'View More'}
                </span>
                {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden cartoon-outline"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={closeModal}
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 text-black rounded-full p-2 hover:bg-gray-100 transition-colors z-10"
              >
                <FiX size={24} />
              </motion.button>
              <motion.img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-auto max-h-[90vh] object-contain"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
} 