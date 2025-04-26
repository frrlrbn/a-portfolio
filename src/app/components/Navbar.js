'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiUser, FiCode, FiBriefcase, FiAward, FiMail } from 'react-icons/fi';
import Link from 'next/link';

const navItems = [
  { name: 'Home', icon: <FiHome />, href: 'home' },
  { name: 'About', icon: <FiUser />, href: 'about' },
  { name: 'Skills', icon: <FiCode />, href: 'skills' },
  { name: 'Projects', icon: <FiBriefcase />, href: 'projects' },
  { name: 'Certificates', icon: <FiAward />, href: 'certificates' },
  { name: 'Contact', icon: <FiMail />, href: 'contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [hoveredItem, setHoveredItem] = useState(null);

  // Custom navigation function
  const handleNavigation = (sectionId, e) => {
    e.preventDefault();
    
    const element = document.getElementById(sectionId);
    if (element) {
      // Update URL without hash
      window.history.pushState({}, '', `/${sectionId}`);
      
      // Scroll to element
      element.scrollIntoView({ behavior: 'smooth' });
      
      // Update active section
      setActiveSection(sectionId);
      
      // Close mobile menu if open
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Update active section based on scroll position
      const sections = navItems.map(item => item.href);
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            // Update URL without hash
            window.history.replaceState({}, '', `/${section}`);
            break;
          }
        }
      }
    };
    
    // Handle browser back/forward buttons
    const handlePopState = () => {
      const path = window.location.pathname.substring(1);
      if (path && navItems.some(item => item.href === path)) {
        const element = document.getElementById(path);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(path);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('popstate', handlePopState);
    
    // Check if there's a section in the URL on initial load
    const path = window.location.pathname.substring(1);
    if (path && navItems.some(item => item.href === path)) {
      const element = document.getElementById(path);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(path);
        }, 100);
      }
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handlePopState);
    };
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
            <a 
              href="#" 
              onClick={(e) => handleNavigation('home', e)} 
              className="flex items-center"
            >
              <div className="cartoon-outline bg-white px-6 py-2 rounded-full">
                <span className="text-2xl font-bold text-black">Azelin</span>
              </div>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.href;
                const isHovered = hoveredItem === item.href;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <a
                      href="#"
                      onClick={(e) => handleNavigation(item.href, e)}
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
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="cartoon-outline bg-white p-2 rounded-full"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/90 backdrop-blur-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <a
                    key={item.name}
                    href="#"
                    onClick={(e) => handleNavigation(item.href, e)}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive ? 'bg-yellow-500 text-white' : 'text-gray-700 hover:bg-yellow-500 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </div>
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
} 