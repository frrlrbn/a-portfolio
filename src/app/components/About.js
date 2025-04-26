'use client';

import { motion } from 'framer-motion';
import { FiInstagram, FiLinkedin, FiMail } from 'react-icons/fi';
import { FaTiktok } from "react-icons/fa";
import { useState, useEffect, useRef } from 'react';

const socialLinks = [
  { 
    icon: <FiInstagram className="w-6 h-6" />, 
    label: 'Instagram',
    accounts: [
      { url: 'https://instagram.com/azelyneazara', label: '@azelyneazara' },
      { url: 'https://instagram.com/designsocietyy', label: '@designsocietyy' }
    ]
  },
  { icon: <FiLinkedin className="w-6 h-6" />, url: 'https://www.linkedin.com/in/azelin-azzahra-6bba45333/', label: 'LinkedIn' },
  { icon: <FiMail className="w-6 h-6" />, url: 'mailto:azelinazzahra@gmail.com', label: 'Email' },
  { 
    icon: <FaTiktok className="w-6 h-6" />, 
    label: 'Tiktok',
    accounts: [
      { url: 'https://www.tiktok.com/@azelyneazz', label: '@azelyneazz' },
      { url: 'https://www.tiktok.com/@designsocietyy', label: '@designsocietyy' }
    ]
  },
];

export default function About() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (label) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <section id="about" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column - Profile Image */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cartoon-outline bg-white p-4 w-full max-w-[300px] h-[300px] sm:max-w-[350px] sm:h-[350px] md:max-w-[400px] md:h-[400px] lg:max-w-[500px] lg:h-[500px] mx-auto rounded-lg"
          >
            <div className="w-full h-full rounded-lg overflow-hidden">
              <img 
                src="/images/profile.jpg"
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            <div>
              <motion.h2 
                className="text-3xl sm:text-4xl font-bold text-black mb-4 relative inline-block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                About Me
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
              <p className="text-lg text-gray-600 leading-relaxed pb-6">
                Hi, I'm Azelin Azzahra, a student at SMK Negeri 2 Depok, Sleman, majoring in Industrial Automation Engineering. I've been passionate about robotics and design since I was 11, driven by a love for creativity and technology. I also enjoy art, sports, volunteering, and networking, as they help me stay active and connect with others. I'm enthusiastic about robotics competitions and innovation contests, always eager to learn, grow, and collaborate.
              </p>
              <blockquote className="border-l-4 border-yellow-500 pl-4 italic text-gray-600">
                "Beauty, Brain, Behavior."
              </blockquote>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link) => (
                <div key={link.label} className="relative">
                  {link.accounts ? (
                    <div ref={dropdownRef} className="relative">
                      <motion.button
                        onClick={() => toggleDropdown(link.label)}
                        whileHover={{ scale: 1.1 }}
                        className="cartoon-outline bg-white p-4 rounded-full hover:bg-yellow-500 hover:text-white transition-colors duration-300 w-14 h-14 flex items-center justify-center"
                      >
                        <span className="sr-only">{link.label}</span>
                        {link.icon}
                      </motion.button>
                      
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className={`absolute top-full mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50 cartoon-outline ${
                            link.label === 'Tiktok' ? 'left-1/2 -translate-x-1/2' : 'left-0'
                          }`}
                        >
                          {link.accounts.map((account) => (
                            <a
                              key={account.label}
                              href={account.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-500 hover:text-white transition-colors duration-300 whitespace-nowrap"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {account.label}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <motion.a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      className="cartoon-outline bg-white p-4 rounded-full hover:bg-yellow-500 hover:text-white transition-colors duration-300 w-14 h-14 flex items-center justify-center"
                    >
                      <span className="sr-only">{link.label}</span>
                      {link.icon}
                    </motion.a>
                  )}
                </div>
              ))}
              <motion.a
                href="/files/CV-AZELIN.pdf"
                download
                whileHover={{ scale: 1.1 }}
                className="cartoon-outline bg-yellow-500 text-white p-4 rounded-full hover:bg-yellow-600 transition-colors duration-300 flex items-center gap-2"
              >
                <span className="sr-only">Download CV</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="font-medium">Download CV</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 