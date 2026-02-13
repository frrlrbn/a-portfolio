'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiInstagram, FiLinkedin, FiMail, FiArrowUp } from 'react-icons/fi';
import { FaTiktok } from "react-icons/fa";
import { useState, useEffect } from 'react';

const socialLinks = [
  { icon: <FiInstagram />, url: 'https://instagram.com/azelyneazr', label: 'Instagram' },
  { icon: <FiInstagram />, url: 'https://instagram.com/designsocietyy', label: 'Instagrams' },
  { icon: <FaTiktok />, url: 'https://www.tiktok.com/@azelyneazz', label: 'Tiktok' },
  { icon: <FaTiktok />, url: 'https://www.tiktok.com/@designsocietyy', label: 'Tiktoks' },
  { icon: <FiLinkedin />, url: 'https://www.linkedin.com/in/azelin-azzahra-6bba45333/', label: 'LinkedIn' },
  { icon: <FiMail />, url: 'mailto:azelinazzahra@gmail.com', label: 'Email' }
];

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled down more than 300px from top
      // This typically means user has scrolled past the home section
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Show button only after scrolling past the first viewport (home section)
      setShowBackToTop(scrollPosition > windowHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1c1c84] via-[#2525a8] to-[#1c1c84]" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {/* Brand Section */}
          <div className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <h3 className="text-3xl font-bold bg-white bg-clip-text text-transparent">
                Azelin Azzahra
              </h3>
            </motion.div>
            <p className="text-gray-400 leading-relaxed">
            Welcome to my portfolio — i'm a passionate student in Industrial Automation who loves robotics, design, and creative innovation.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-xl"
                >
                  <span className="sr-only">{link.label}</span>
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'About', 'Projects', 'Contact'].map((link) => (
                <motion.li
                  key={link}
                  whileHover={{ x: 5 }}
                  className="group"
                >
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-gray-400 group-hover:text-white transition-colors duration-300 flex items-center"
                  >
                    <span className="w-2 h-2 bg-white rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Get in Touch</h4>
            <div className="space-y-4">
              <p className="text-gray-400">
                Interested in working together? Let's connect!
              </p>
              <motion.a
                href="mailto:azelinazzahra@gmail.com"
                whileHover={{ scale: 1.05 }}
                className="inline-block cartoon-outline bg-[#1c1c84] hover:bg-[#151560] px-6 py-3 rounded-full text-white font-medium transition-colors duration-300"
              >
                Contact Me
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Back to Top Button with Animation */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              onClick={scrollToTop}
              initial={{ 
                opacity: 0, 
                scale: 0,
                y: 20,
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: 0,
              }}
              exit={{ 
                opacity: 0, 
                scale: 0,
                y: 20,
              }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
              }}
              whileHover={{ 
                scale: 1.1,
                transition: { duration: 0.4 }
              }}
              whileTap={{ scale: 0.9 }}
              className="cartoon-outline fixed bottom-6 right-6 bg-[#1c1c84] text-white p-3 rounded-full shadow-lg hover:bg-[#151560] transition-colors duration-300 z-[999]"
              aria-label="Back to top"
            >
              <FiArrowUp className="text-xl" />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                &copy; {new Date().getFullYear()} frrlrbn. All rights reserved.
              </p>
            </div>
            
            {/* Credits */}
            <div className="text-center md:text-right">
              <p className="text-gray-400">
              This website was developed through collaboration between <a href="https://farrel.id" target="_blank" rel="noopener noreferrer" className="text-[#8787f8] hover:underline">frrlrbn</a> and <a href="/" className="text-[#8787f8] hover:underline">azelin</a>
              </p>
              <br></br>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 