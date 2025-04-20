'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const certificates = [
  {
    title: 'Sertifikat Finalis ICT Business Development',
    image: '/images/sertifikat-1.jpg',
    description: 'Certificate of Achievement',
    date: '2024',
  },
  {
    title: 'Certificate 2',
    image: '/images/sertifikat-2.jpg',
    description: 'Certificate of Achievement',
    date: '2023',
  },
  {
    title: 'Certificate 3',
    image: '/images/sertifikat-3.jpg',
    description: 'Certificate of Achievement',
    date: '2023',
  },
  {
    title: 'Certificate 4',
    image: '/images/sertifikat-4.jpg',
    description: 'Certificate of Achievement',
    date: '2023',
  },
  {
    title: 'Certificate 5',
    image: '/images/sertifikat-5.jpg',
    description: 'Certificate of Achievement',
    date: '2023',
  },
  {
    title: 'Certificate 6',
    image: '/images/sertifikat-6.jpg',
    description: 'Certificate of Achievement',
    date: '2023',
  },
  {
    title: 'Certificate 7',
    image: '/images/sertifikat-7.jpg',
    description: 'Certificate of Achievement',
    date: '2023',
  },
  {
    title: 'Certificate 8',
    image: '/images/sertifikat-8.jpg',
    description: 'Certificate of Achievement',
    date: '2023',
  },
  {
    title: 'Certificate 9',
    image: '/images/sertifikat-9.jpg',
    description: 'Certificate of Achievement',
    date: '2023',
  },
  {
    title: 'Certificate 10',
    image: '/images/sertifikat-10.jpg',
    description: 'Certificate of Achievement',
    date: '2023',
  },
  {
    title: 'Certificate 11',
    image: '/images/sertifikat-11.jpg',
    description: 'Certificate of Achievement',
    date: '2023',
  },
];

export default function Certificates() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextCertificate = () => {
    setCurrentIndex((prev) => (prev + 1) % certificates.length);
  };

  const prevCertificate = () => {
    setCurrentIndex((prev) => (prev - 1 + certificates.length) % certificates.length);
  };

  const mobileVariants = {
    enter: {
      scale: 0.8,
      opacity: 0,
      rotateY: 90,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    center: {
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      rotateY: -90,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const desktopVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    })
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

  return (
    <section id="certificates" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="flex justify-center">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-black mb-4 relative inline-block text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="relative z-10">Certificates</span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-3 bg-yellow-500/20 -z-10"
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

          <div className="relative">
            <div className="aspect-video mx-auto max-w-2xl relative">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={currentIndex}
                  variants={isMobile ? mobileVariants : desktopVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 cartoon-outline bg-white p-4 cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  onClick={() => setIsModalOpen(true)}
                >
                  <motion.img 
                    src={certificates[currentIndex].image} 
                    alt={certificates[currentIndex].title}
                    className="w-full h-full object-contain rounded-lg"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.button
              onClick={prevCertificate}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white cartoon-outline shadow-lg"
            >
              <FiChevronLeft size={24} />
            </motion.button>
            <motion.button
              onClick={nextCertificate}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white cartoon-outline shadow-lg"
            >
              <FiChevronRight size={24} />
            </motion.button>
          </div>

          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={() => setIsModalOpen(false)}
              >
                <motion.div
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="cartoon-outline bg-white p-4 sm:p-6 max-w-2xl w-full mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-start mb-4">
                    <motion.h3 
                      className="text-xl sm:text-2xl font-bold"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {certificates[currentIndex].title}
                    </motion.h3>
                    <motion.button
                      onClick={() => setIsModalOpen(false)}
                      whileHover={{ rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <FiX size={24} />
                    </motion.button>
                  </div>
                  <motion.img 
                    src={certificates[currentIndex].image} 
                    alt={certificates[currentIndex].title}
                    className="w-full h-auto max-h-[60vh] sm:max-h-[70vh] object-contain rounded-lg"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  />
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-gray-600 mb-2 mt-4 text-sm sm:text-base">
                      {certificates[currentIndex].description}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Date: {certificates[currentIndex].date}
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
} 