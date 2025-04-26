'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiSun, FiSunrise, FiSunset, FiMoon, FiCpu, FiSettings, FiTool, FiCode, FiLayers, FiCpu as FiChip } from 'react-icons/fi';

const roles = [
  'Automation Engineer',
  'Graphic Designer',
  'Digital Writer',
  'Robotics Enthusiast'
];

const floatingIcons = [
  // Top Row
  { icon: <FiCpu className="text-3xl" />, initialX: -150, initialY: -150, range: 20 },
  { icon: <FiSettings className="text-3xl" />, initialX: -50, initialY: -150, range: 15 },
  { icon: <FiTool className="text-3xl" />, initialX: 50, initialY: -150, range: 18 },
  { icon: <FiCode className="text-3xl" />, initialX: 150, initialY: -150, range: 15 },
  
  // Middle Top Row
  { icon: <FiLayers className="text-3xl" />, initialX: -180, initialY: -80, range: 15 },
  { icon: <FiChip className="text-3xl" />, initialX: -90, initialY: -80, range: 20 },
  { icon: <FiCpu className="text-3xl" />, initialX: 0, initialY: -80, range: 18 },
  { icon: <FiSettings className="text-3xl" />, initialX: 90, initialY: -80, range: 15 },
  { icon: <FiTool className="text-3xl" />, initialX: 180, initialY: -80, range: 20 },
  
  // Middle Row
  { icon: <FiCode className="text-3xl" />, initialX: -150, initialY: 0, range: 18 },
  { icon: <FiLayers className="text-3xl" />, initialX: -75, initialY: 0, range: 15 },
  { icon: <FiChip className="text-3xl" />, initialX: 75, initialY: 0, range: 20 },
  { icon: <FiCpu className="text-3xl" />, initialX: 150, initialY: 0, range: 15 },
  
  // Middle Bottom Row
  { icon: <FiSettings className="text-3xl" />, initialX: -180, initialY: 80, range: 20 },
  { icon: <FiTool className="text-3xl" />, initialX: -90, initialY: 80, range: 15 },
  { icon: <FiCode className="text-3xl" />, initialX: 0, initialY: 80, range: 18 },
  { icon: <FiLayers className="text-3xl" />, initialX: 90, initialY: 80, range: 15 },
  { icon: <FiChip className="text-3xl" />, initialX: 180, initialY: 80, range: 20 },
  
  // Bottom Row
  { icon: <FiCpu className="text-3xl" />, initialX: -150, initialY: 150, range: 15 },
  { icon: <FiSettings className="text-3xl" />, initialX: -50, initialY: 150, range: 18 },
  { icon: <FiTool className="text-3xl" />, initialX: 50, initialY: 150, range: 15 },
  { icon: <FiCode className="text-3xl" />, initialX: 150, initialY: 150, range: 20 },
];

export default function Home({ currentTime, weather, weatherError }) {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="home-section">
      <div className="home-content pt-24 md:pt-0">
        <div className="home-grid">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="home-text relative"
          >
            {/* Floating Icons Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {floatingIcons.map((icon, index) => (
                <motion.div
                  key={index}
                  initial={{ 
                    x: icon.initialX,
                    y: icon.initialY,
                    opacity: 0,
                    scale: 0.8
                  }}
                  animate={{ 
                    x: [icon.initialX, icon.initialX + icon.range, icon.initialX],
                    y: [icon.initialY, icon.initialY + icon.range, icon.initialY],
                    opacity: [0.15, 0.3, 0.15],
                    scale: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 6 + index,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2
                  }}
                  className="absolute text-yellow-500/60"
                >
                  {icon.icon}
                </motion.div>
              ))}
            </div>

            <div className="space-y-8 relative z-10">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black leading-tight">
                Hi, I'm{' '}
                <motion.span 
                  className="text-yellow-500 relative inline-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Azelin.
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ 
                      duration: 0.8,
                      delay: 0.5,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  />
                </motion.span>
              </h1>
              <div className="h-20">
                <motion.div
                  key={currentRoleIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl sm:text-4xl text-yellow-500 font-semibold"
                >
                  {roles[currentRoleIndex]}
                </motion.div>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed">
              Welcome to my portfolio — i'm a passionate student in Industrial Automation who loves robotics, design, and creative innovation.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Widgets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="home-widgets lg:translate-x-3 lg:translate-y-3"
          >
            {/* Photo Widgets */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="widget cartoon-outline rounded-full"
            >
              <div className="widget-content">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img 
                    src="/images/widget1.png" 
                    alt="Widget 1" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="widget cartoon-outline"
            >
              <div className="widget-content">
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <img 
                    src="/images/widget2.jpg" 
                    alt="Widget 2" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="widget cartoon-outline"
            >
              <div className="widget-content">
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <img 
                    src="/images/widget3.jpg" 
                    alt="Widget 3" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="widget cartoon-outline rounded-full"
            >
              <div className="widget-content">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img 
                    src="/images/widget4.png" 
                    alt="Widget 4" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Clock Widget */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="widget cartoon-outline col-span-2"
            >
              <div className="widget-content">
                <div className="flex items-center space-x-4">
                  <FiClock className="text-yellow-500" size={28} />
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold tracking-wider">
                      {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                      {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Weather Widget */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="widget cartoon-outline col-span-2"
            >
              <div className="widget-content">
                <div className="flex items-center space-x-4">
                  {(() => {
                    const hour = currentTime.getHours();
                    if (hour >= 5 && hour < 11) {
                      return <FiSunrise className="text-yellow-500" size={28} />;
                    } else if (hour >= 11 && hour < 15) {
                      return <FiSun className="text-yellow-500" size={28} />;
                    } else if (hour >= 15 && hour < 18) {
                      return <FiSunset className="text-yellow-500" size={28} />;
                    } else {
                      return <FiMoon className="text-yellow-500" size={28} />;
                    }
                  })()}
                  <div>
                    {weatherError ? (
                      <p className="text-red-500 text-lg font-medium">Error loading weather</p>
                    ) : weather ? (
                      <>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-2xl font-bold tracking-wider">
                            {Math.round(weather.main.temp)}°
                          </span>
                          <span className="text-lg text-gray-500 font-medium">C</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 font-medium capitalize">
                            {weather.weather[0].description}
                          </span>
                          <span className="text-xs text-gray-400">
                            Sleman • Indonesia
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-lg font-medium text-gray-600">Loading weather...</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 