'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const certificates = [
  {
    title: 'Assembly Technician Certification',
    image: '/cert1.jpg',
    description: 'Certified Assembly Technician with expertise in electronic components and mechanical assembly.',
    date: '2023',
  },
  {
    title: 'Graphic Design Masterclass',
    image: '/cert2.jpg',
    description: 'Advanced certification in graphic design principles and digital media creation.',
    date: '2022',
  },
  {
    title: 'Digital Writing Excellence',
    image: '/cert3.jpg',
    description: 'Certification in professional digital content creation and copywriting.',
    date: '2021',
  },
];

export default function Certificates() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextCertificate = () => {
    setCurrentIndex((prev) => (prev + 1) % certificates.length);
  };

  const prevCertificate = () => {
    setCurrentIndex((prev) => (prev - 1 + certificates.length) % certificates.length);
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
          <h2 className="text-3xl sm:text-4xl font-bold text-black text-center">
            Certificates
          </h2>

          <div className="relative">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="cartoon-outline bg-white p-4 aspect-video mx-auto max-w-2xl"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="w-full h-full bg-gray-200 rounded-lg" />
            </motion.div>

            <button
              onClick={prevCertificate}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white cartoon-outline"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={nextCertificate}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white cartoon-outline"
            >
              <FiChevronRight size={24} />
            </button>
          </div>

          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={() => setIsModalOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="cartoon-outline bg-white p-6 max-w-2xl w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold">
                      {certificates[currentIndex].title}
                    </h3>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
                  <p className="text-gray-600 mb-2">
                    {certificates[currentIndex].description}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {certificates[currentIndex].date}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
} 