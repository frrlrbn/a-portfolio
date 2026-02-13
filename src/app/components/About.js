'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { FiInstagram, FiLinkedin, FiMail } from 'react-icons/fi';
import { FaTiktok } from "react-icons/fa";
import { useState, useEffect, useRef } from 'react';

const socialLinks = [
  { 
    icon: <FiInstagram className="w-6 h-6" />, 
    label: 'Instagram',
    accounts: [
      { url: 'https://instagram.com/azelyneazr', label: '@azelyneazr' },
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
  const cardRef = useRef(null);

  // Spring values for 3D parallax effect - faster and more responsive
  const springConfig = { damping: 15, stiffness: 300, mass: 0.5 };
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);
  
  // Separate motion values for foreground parallax
  const foregroundX = useSpring(0, springConfig);
  const foregroundY = useSpring(0, springConfig);
  
  const [lastY, setLastY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [gyroPermission, setGyroPermission] = useState('pending');

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  // Gyroscope handler for mobile devices
  useEffect(() => {
    if (!isMobile) return;

    const handleOrientation = (event) => {
      if (event.beta !== null && event.gamma !== null) {
        // beta: front-to-back tilt (range: -180 to 180)
        // gamma: left-to-right tilt (range: -90 to 90)
        
        // Normalize and limit the rotation values
        const beta = Math.max(-45, Math.min(45, event.beta || 0));
        const gamma = Math.max(-45, Math.min(45, event.gamma || 0));
        
        // Apply rotation with increased sensitivity for left-right, minimal for up-down
        const rotationX = (beta / 45) * -3; // Minimal vertical rotation (reduced from -15)
        const rotationY = (gamma / 45) * 25; // Increased horizontal sensitivity (from 15)
        
        rotateX.set(rotationX);
        rotateY.set(rotationY);
        
        // Apply parallax effect to foreground with higher sensitivity
        const parallaxX = (gamma / 45) * 15; // Increased parallax (from 8)
        const parallaxY = (beta / 45) * 5; // Minimal vertical parallax (from 8)
        
        foregroundX.set(parallaxX);
        foregroundY.set(parallaxY);
      }
    };

    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          setGyroPermission(permission);
          
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
          }
        } catch (error) {
          console.error('Error requesting gyroscope permission:', error);
          setGyroPermission('denied');
        }
      } else {
        // For Android and other devices that don't require permission
        setGyroPermission('granted');
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isMobile, rotateX, rotateY, foregroundX, foregroundY]);

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

  // 3D Parallax Handlers - optimized for speed and accuracy
  const handleMouseMove = (e) => {
    if (!cardRef.current || isMobile) return; // Disable mouse move on mobile

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const offsetX = e.clientX - centerX;
    const offsetY = e.clientY - centerY;

    // Rotation for desktop
    const rotationMultiplier = 8;
    const rotationX = (offsetY / (rect.height / 2)) * -rotationMultiplier;
    const rotationY = (offsetX / (rect.width / 2)) * rotationMultiplier;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    // Parallax movement for desktop
    const parallaxMultiplier = 10;
    const parallaxX = (offsetX / rect.width) * parallaxMultiplier;
    const parallaxY = (offsetY / rect.height) * parallaxMultiplier;
    
    foregroundX.set(parallaxX);
    foregroundY.set(parallaxY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    setLastY(offsetY);
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      scale.set(1.05);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      scale.set(1);
      rotateX.set(0);
      rotateY.set(0);
      foregroundX.set(0);
      foregroundY.set(0);
    }
  };

  const handleGyroPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        setGyroPermission(permission);
      } catch (error) {
        console.error('Error requesting gyroscope permission:', error);
        setGyroPermission('denied');
      }
    }
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
          {/* Left Column - Profile Image with 3D Parallax */}
          <div className="relative w-full max-w-[300px] h-[300px] sm:max-w-[350px] sm:h-[350px] md:max-w-[400px] md:h-[400px] lg:max-w-[500px] lg:h-[500px] mx-auto">
            {/* Gyroscope Permission Button for iOS */}
            {isMobile && gyroPermission === 'pending' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleGyroPermission}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-[#1c1c84] text-white px-6 py-3 rounded-lg shadow-lg cartoon-outline hover:bg-[#151560] transition-colors duration-300"
              >
                Enable Gyroscope
              </motion.button>
            )}
            
            <div 
              ref={cardRef}
              className="w-full h-full cursor-pointer"
              style={{ perspective: '1200px' }}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <motion.div
                className="cartoon-outline bg-white p-4 w-full h-full rounded-lg relative"
                style={{
                  rotateX,
                  rotateY,
                  scale,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="w-full h-full rounded-lg overflow-hidden relative select-none">
                  {/* Background Layer */}
                  <motion.img 
                    src="/images/profile-background.jpeg"
                    alt="Profile Background" 
                    className="absolute inset-0 w-full h-full object-cover rounded-lg pointer-events-none"
                    draggable="false"
                    style={{
                      transform: 'translateZ(0px)',
                      userSelect: 'none'
                    }}
                  />
                  
                  {/* Foreground Layer with Enhanced Parallax */}
                  <motion.img 
                    src="/images/profile-foreground.png"
                    alt="Profile Foreground" 
                    className="absolute inset-0 w-full h-full object-cover rounded-lg pointer-events-none"
                    draggable="false"
                    style={{
                      x: foregroundX,
                      y: foregroundY,
                      transform: isMobile ? 'translateZ(30px)' : 'translateZ(40px)',
                      transformStyle: 'preserve-3d',
                      willChange: 'transform',
                      userSelect: 'none'
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>

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
              <p className="text-lg text-gray-600 leading-relaxed pb-6">
                Hi, I'm Azelin Azzahra, a student at SMK Negeri 2 Depok, Sleman, majoring in Industrial Automation Engineering. I've been passionate about robotics and design since I was 11, driven by a love for creativity and technology. I also enjoy art, sports, volunteering, and networking, as they help me stay active and connect with others. I'm enthusiastic about robotics competitions and innovation contests, always eager to learn, grow, and collaborate.
              </p>
              <blockquote className="border-l-4 border-[#1c1c84] pl-4 italic text-gray-600">
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
                        className="cartoon-outline bg-white p-4 rounded-full hover:bg-[#1c1c84] hover:text-white transition-colors duration-300 w-14 h-14 flex items-center justify-center"
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
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#1c1c84] hover:text-white transition-colors duration-300 whitespace-nowrap"
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
                      className="cartoon-outline bg-white p-4 rounded-full hover:bg-[#1c1c84] hover:text-white transition-colors duration-300 w-14 h-14 flex items-center justify-center"
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
                className="cartoon-outline bg-[#1c1c84] text-white p-4 rounded-full hover:bg-[#151560] transition-colors duration-300 flex items-center gap-2"
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