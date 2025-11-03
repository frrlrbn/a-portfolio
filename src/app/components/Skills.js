'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FiCpu, FiPenTool, FiEdit, FiTool, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

const skills = [
  {
    name: 'Digital Writer',
    icon: <FiCpu />,
    level: 90,
    color: 'bg-[#1c1c84]',
  },
  {
    name: 'Graphic Designer',
    icon: <FiPenTool />,
    level: 85,
    color: 'bg-[#1c1c84]',
  },
  {
    name: 'Assembly Technician',
    icon: <FiEdit />,
    level: 80,
    color: 'bg-[#1c1c84]',
  },
];

const additionalSkills = [
  {
    title: 'Basic AutoCAD Design',
    description: 'Proficient in creating and editing engineering designs using AutoCAD software. Experienced in creating detailed layouts and understanding standard engineering symbols for industrial automation projects.',
    icon: <FiTool className="text-2xl" />,
  },
  {
    title: 'PLC, Pneumatic, & Microcontroller Programming',
    description: 'Have expertise in the field of system control using PLC, embedded programming with C++, and pneumatic systems for industry. I am interested in developing efficient and innovative automation solutions.',
    icon: <FiCpu className="text-2xl" />,
  },
  {
    title: 'Design & Content Writing',
    description: 'Has expertise in graphic design using Canva, as well as content writing & content creation, with a focus on creating interesting and quality creative content.',
    icon: <FiEdit className="text-2xl" />,
  },
];

const techStack = [
  { 
    name: 'AutoCAD', 
    icon: 'https://cadmasters.com/wp-content/uploads/2023/04/autodesk-autocad-small_badge-128@2x.png',
    alt: 'AutoCAD Logo'
  },
  { 
    name: 'C++', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/1200px-ISO_C%2B%2B_Logo.svg.png',
    alt: 'C++ Logo'
  },
  { 
    name: 'Canva', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg',
    alt: 'Canva Logo'
  },
  { 
    name: 'Arduino', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Arduino_Logo.svg/1200px-Arduino_Logo.svg.png',
    alt: 'Arduino Logo'
  },
  {
    name: 'Ibis Paint',
    icon: 'https://i.pinimg.com/736x/66/fb/72/66fb72c44a7b547237f7a3bd7159a01c.jpg',
    alt: 'Ibis Paint Logo'
  },
  {
    name: 'Krita',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Calligrakrita-base.svg/330px-Calligrakrita-base.svg.png',
    alt: 'Krita Logo'
  }
];

export default function Skills() {
  const containerRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const autoPlayRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Transform scroll progress to movement
  const x = useTransform(scrollYProgress, [0, 1], [0, -1000]);

  // Duplicate tech stack for seamless loop
  const duplicatedTechStack = [...techStack, ...techStack, ...techStack];

  // Auto-play carousel
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      if (!isDragging) {
        nextSlide();
      }
    }, 5000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [currentSlide, isDragging]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % additionalSkills.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + additionalSkills.length) % additionalSkills.length);
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Reset auto-play on manual interaction
  const resetAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    autoPlayRef.current = setInterval(() => {
      if (!isDragging) {
        nextSlide();
      }
    }, 5000);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (e, { offset, velocity }) => {
    setIsDragging(false);
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      nextSlide();
    } else if (swipe > swipeConfidenceThreshold) {
      prevSlide();
    }
    
    resetAutoPlay();
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
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
              <span className="relative z-10">Skills & Expertise</span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-3 bg-[#1c1c84]/20 -z-10"
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

          {/* Skills Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skills.map((skill) => (
              <motion.div
                key={skill.name}
                whileHover={{ scale: 1.05 }}
                className="cartoon-outline bg-white p-6 rounded-lg"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-2xl">{skill.icon}</div>
                  <h3 className="text-xl font-semibold">{skill.name}</h3>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className={`h-4 rounded-full ${skill.color}`}
                  />
                </div>
                <p className="text-right mt-2 text-sm text-gray-600">
                  {skill.level}%
                </p>
              </motion.div>
            ))}
          </div>

          {/* Additional Skills - Stacked Carousel */}
          <div className="mt-8 overflow-hidden">
            <div className="relative w-full">
              {/* Carousel Container */}
              <div className="relative h-[360px] sm:h-[280px] md:h-[240px] overflow-visible">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  {additionalSkills.map((skill, index) => {
                    if (index !== currentSlide) return null;
                    
                    return (
                      <motion.div
                        key={index}
                        custom={direction}
                        variants={{
                          enter: (direction) => ({
                            x: direction > 0 ? '100%' : '-100%',
                            opacity: 0,
                            scale: 0.9,
                          }),
                          center: {
                            zIndex: 1,
                            x: 0,
                            opacity: 1,
                            scale: 1,
                          },
                          exit: (direction) => ({
                            zIndex: 0,
                            x: direction < 0 ? '100%' : '-100%',
                            opacity: 0,
                            scale: 0.9,
                          }),
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          x: { type: "spring", stiffness: 300, damping: 30 },
                          opacity: { duration: 0.3 },
                          scale: { duration: 0.4 },
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        className="absolute inset-0 px-1 pb-1"
                        style={{ touchAction: 'pan-y' }}
                      >
                        <div className="w-full h-full cursor-grab active:cursor-grabbing">
                          <motion.div
                            className="cartoon-outline bg-gradient-to-br from-white to-gray-50 p-3 sm:p-6 md:p-8 rounded-2xl shadow-lg h-full flex flex-col pointer-events-none"
                          >
                            {/* Icon and Title */}
                            <div className="flex items-start gap-2.5 sm:gap-4 mb-2 sm:mb-4">
                              <motion.div
                                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ duration: 0.5 }}
                                className="bg-gradient-to-br from-[#1c1c84] to-[#2525a8] p-2.5 sm:p-4 rounded-xl cartoon-outline flex-shrink-0"
                              >
                                <div className="text-white text-2xl sm:text-3xl">
                                  {skill.icon}
                                </div>
                              </motion.div>
                              
                              <div className="flex-1 min-w-0">
                                <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1c1c84] mb-1 sm:mb-2 line-clamp-2 leading-tight">
                                  {skill.title}
                                </h4>
                                <motion.div
                                  initial={{ scaleX: 0 }}
                                  animate={{ scaleX: 1 }}
                                  transition={{ duration: 0.6, delay: 0.2 }}
                                  className="h-1 sm:h-1 w-16 sm:w-24 bg-[#1c1c84] rounded-full origin-left"
                                />
                              </div>
                            </div>

                            {/* Description */}
                            <motion.p
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="text-gray-700 leading-relaxed text-base sm:text-base md:text-lg overflow-y-auto flex-1 pointer-events-auto touch-pan-y"
                            >
                              {skill.description}
                            </motion.p>
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Progress Bar (Left) & Dots Indicator (Right) */}
              <div className="flex items-center justify-between gap-3 sm:gap-6 mt-4 sm:mt-6">
                {/* Progress Bar - Left Side */}
                <div className="flex-1 max-w-md">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      key={currentSlide}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 5, ease: 'linear' }}
                      className="h-full bg-gradient-to-r from-[#1c1c84] to-[#2525a8]"
                    />
                  </div>
                </div>

                {/* Dots Indicator - Right Side */}
                <div className="flex gap-2 sm:gap-3">
                  {additionalSkills.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => { goToSlide(index); resetAutoPlay(); }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative flex-shrink-0"
                    >
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-[#1c1c84] w-6 sm:w-8' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`} />
                      {index === currentSlide && (
                        <motion.div
                          layoutId="activeSlide"
                          className="absolute inset-0 border-2 border-[#1c1c84] rounded-full"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack - Infinite Scroll Carousel */}
          <div className="mt-2 overflow-hidden">
            <motion.div 
              className="flex gap-8 py-8"
              style={{ x }}
            >
              {duplicatedTechStack.map((tech, index) => (
                <motion.div
                  key={`${tech.name}-${index}`}
                  whileHover={{ scale: 1.15, y: -5 }}
                  className="flex-shrink-0 w-24 h-24 cartoon-outline bg-white rounded-2xl flex items-center justify-center p-4 cursor-pointer"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="relative w-16 h-16">
                    <Image
                      src={tech.icon}
                      alt={tech.alt}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Gradient Overlays for fade effect */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
} 