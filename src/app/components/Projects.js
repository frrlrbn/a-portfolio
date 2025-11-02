'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiX, FiInfo } from 'react-icons/fi';

const projects = [
  {
    title: 'Poster Jumat Bersih Stembayo',
    image: '/images/projects-poster-1.png',
    category: 'Poster',
    size: 'large',
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
    size: 'tall',
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
    size: 'wide',
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
    size: 'tall',
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
  {
    title: 'Poster Hari Kartini 2025',
    image: '/images/projects-poster-11.png',
    category: 'Poster',
    size: 'medium',
  },
];

export default function Projects() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  useEffect(() => {
    let hideTooltipTimer;
    
    if (isInView) {
      setShowTooltip(true);
      hideTooltipTimer = setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
    } else {
      setShowTooltip(false);
    }

    return () => {
      clearTimeout(hideTooltipTimer);
    };
  }, [isInView]);

  const openModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const getBentoClass = (size) => {
    switch(size) {
      case 'large':
        return 'md:col-span-2 md:row-span-2';
      case 'wide':
        return 'md:col-span-2';
      case 'tall':
        return 'md:row-span-2';
      default:
        return '';
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.85,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 10,
      transition: {
        duration: 0.2
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <section id="projects" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50" ref={sectionRef}>
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
                className="absolute bottom-0 left-0 w-full h-1 bg-[#1c1c84]"
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

          {/* Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-3 md:gap-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1]
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`relative group cursor-pointer ${getBentoClass(project.size)}`}
                onClick={() => openModal(project)}
                onHoverStart={() => setHoveredProject(project.title)}
                onHoverEnd={() => setHoveredProject(null)}
              >
                <div className="cartoon-outline bg-white p-2 h-full w-full rounded-2xl overflow-hidden">
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredProject === project.title ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4"
                    >
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ 
                          y: hoveredProject === project.title ? 0 : 20,
                          opacity: hoveredProject === project.title ? 1 : 0 
                        }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <h3 className="text-white text-sm md:text-base font-bold mb-1 line-clamp-2">
                          {project.title}
                        </h3>
                        <span className="inline-block bg-[#1c1c84] text-white text-xs px-2 py-1 rounded-full font-medium">
                          {project.category}
                        </span>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden cartoon-outline"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-[#1c1c84] p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-bold text-lg md:text-xl">
                    {selectedProject.title}
                  </h3>
                  <span className="inline-block bg-white/20 text-white text-xs md:text-sm px-3 py-1 rounded-full font-medium mt-1">
                    {selectedProject.category}
                  </span>
                </div>
                <motion.button
                  onClick={closeModal}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white text-[#1c1c84] rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <FiX size={24} />
                </motion.button>
              </div>

              {/* Modal Image */}
              <div className="bg-gray-50 p-4 md:p-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="cartoon-outline bg-white p-2 rounded-xl"
                >
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-auto max-h-[70vh] object-contain rounded-xl"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
} 