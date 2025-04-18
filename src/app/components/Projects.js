'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const projects = [
  {
    title: 'Assembly Project 1',
    image: '/project1.jpg',
    category: 'Assembly',
    size: 'large',
  },
  {
    title: 'Design Project 1',
    image: '/project2.jpg',
    category: 'Design',
    size: 'medium',
  },
  {
    title: 'Writing Project 1',
    image: '/project3.jpg',
    category: 'Writing',
    size: 'medium',
  },
  {
    title: 'Assembly Project 2',
    image: '/project4.jpg',
    category: 'Assembly',
    size: 'medium',
  },
  {
    title: 'Design Project 2',
    image: '/project5.jpg',
    category: 'Design',
    size: 'medium',
  },
  {
    title: 'Writing Project 2',
    image: '/project6.jpg',
    category: 'Writing',
    size: 'medium',
  },
  {
    title: 'Assembly Project 3',
    image: '/project7.jpg',
    category: 'Assembly',
    size: 'medium',
  },
  {
    title: 'Design Project 3',
    image: '/project8.jpg',
    category: 'Design',
    size: 'medium',
  },
  {
    title: 'Writing Project 3',
    image: '/project9.jpg',
    category: 'Writing',
    size: 'medium',
  },
  {
    title: 'Assembly Project 4',
    image: '/project10.jpg',
    category: 'Assembly',
    size: 'medium',
  },
];

export default function Projects() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [visibleProjects, setVisibleProjects] = useState(2);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
          <h2 className="text-3xl sm:text-4xl font-bold text-black text-center">
            Projects
          </h2>

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
                <div className="cartoon-outline bg-white p-3 h-full w-full">
                  <div className={`w-full ${
                    project.size === 'large' 
                      ? 'aspect-[16/9] sm:aspect-[16/9]' 
                      : 'aspect-square'
                  } bg-gray-200 rounded-lg`} />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: hoveredProject === project.title ? 1 : 0,
                  }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg"
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
    </section>
  );
} 