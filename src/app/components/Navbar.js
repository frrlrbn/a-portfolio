'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiUser, FiCode, FiBriefcase, FiAward, FiMail } from 'react-icons/fi';
import Link from 'next/link';

const navItems = [
  { name: 'Home', icon: <FiHome />, href: '#home' },
  { name: 'About', icon: <FiUser />, href: '#about' },
  { name: 'Skills', icon: <FiCode />, href: '#skills' },
  { name: 'Projects', icon: <FiBriefcase />, href: '#projects' },
  { name: 'Certificates', icon: <FiAward />, href: '#certificates' },
  { name: 'Contact', icon: <FiMail />, href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Update active section based on scroll position
      const sections = navItems.map(item => item.href.substring(1));
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0"
          >
            <Link href="#home" className="flex items-center">
              <div className="cartoon-outline bg-white px-6 py-2 rounded-full">
                <span className="text-2xl font-bold text-black">Azelin</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.href.substring(1);
                const isHovered = hoveredItem === item.href;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="relative group"
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className={`cartoon-outline bg-white p-3 rounded-full transition-all duration-300 ${
                        isActive ? 'bg-yellow-500 text-white' : 'hover:bg-yellow-500 hover:text-white'
                      }`}>
                        <div className="flex items-center">
                          <span className="text-xl">{item.icon}</span>
                          <AnimatePresence>
                            {(isActive || isHovered) && (
                              <motion.span
                                initial={{ width: 0, opacity: 0, x: -10 }}
                                animate={{ width: 'auto', opacity: 1, x: 0 }}
                                exit={{ width: 0, opacity: 0, x: -10 }}
                                transition={{ duration: 0.3 }}
                                className="ml-3 font-medium whitespace-nowrap overflow-hidden"
                              >
                                {item.name}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <motion.div
                        className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="cartoon-outline bg-white p-2 rounded-full text-black hover:bg-yellow-500 hover:text-white transition-colors duration-300"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t-4 border-black"
          >
            <div className="px-2 pt-2 pb-3 space-y-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    <div className={`cartoon-outline bg-white px-4 py-3 rounded-lg transition-colors duration-300 ${
                      activeSection === item.href.substring(1) ? 'bg-yellow-500 text-white' : 'hover:bg-yellow-500 hover:text-white'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-lg font-medium">{item.name}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
} 