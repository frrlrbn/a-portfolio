'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiSun, FiSunrise, FiSunset, FiMoon, FiCpu, FiSettings, FiTool, FiCode, FiLayers, FiCpu as FiChip, FiArrowRight, FiBookOpen, FiMail } from 'react-icons/fi';

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
                  className="absolute text-[#1c1c84]/60"
                >
                  {icon.icon}
                </motion.div>
              ))}
            </div>

            <div className="space-y-8 relative z-10">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black leading-tight">
                Hi, I'm{' '}
                <motion.span 
                  className="text-[#1c1c84] relative inline-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Azelin.
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-1 bg-[#1c1c84]"
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
                  className="text-3xl sm:text-4xl text-[#1c1c84] font-semibold"
                >
                  {roles[currentRoleIndex]}
                </motion.div>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed">
              Welcome to my portfolio — i'm a passionate student in Industrial Automation who loves robotics, design, and creative innovation.
              </p>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="flex flex-wrap gap-4"
              >
                <motion.a
                  href="#projects"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cartoon-outline bg-[#1c1c84] text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-[#151560] transition-colors duration-300"
                >
                  View My Work
                  <FiArrowRight className="text-xl" />
                </motion.a>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cartoon-outline bg-white text-[#333333] px-8 py-4 rounded-full font-semibold hidden sm:flex items-center gap-2 hover:bg-gray-50 transition-colors duration-300"
                >
                  Get in Touch
                </motion.a>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cartoon-outline bg-white text-[#333333] p-4 rounded-full font-semibold flex sm:hidden items-center justify-center hover:bg-gray-50 transition-colors duration-300"
                >
                  <FiMail className="text-xl" />
                </motion.a>
                <motion.a
                  href="/blog"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cartoon-outline bg-white text-[#333333] px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors duration-300"
                >
                  Read My Blog
                </motion.a>
              </motion.div>

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
                    src="/images/widgets/widget1.webp" 
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
                    src="/images/widgets/widget2.webp" 
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
                    src="/images/widgets/widget3.webp" 
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
                    src="/images/widgets/widget4.webp" 
                    alt="Widget 4" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Clock Widget */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="widget cartoon-outline col-span-2 relative overflow-hidden"
            >
              {/* Subtle Background Glow */}
              <motion.div
                animate={{
                  opacity: [0.05, 0.1, 0.05]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-0 right-0 w-20 h-20 bg-[#1c1c84] rounded-full blur-3xl"
              />

              <div className="widget-content relative z-10">
                <div className="flex items-center gap-4 w-full">
                  {/* Clock Icon */}
                  <motion.div
                    animate={{
                      rotate: [0, 3, 0, -3, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="bg-gradient-to-br from-[#1c1c84] to-[#2525a8] p-3 rounded-2xl cartoon-outline relative"
                  >
                    <FiClock className="text-white" size={28} />
                  </motion.div>

                  {/* Time and Date */}
                  <div className="flex-1">
                    {/* Time */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-0.5"
                    >
                      {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).split(':').map((part, index) => (
                        <span key={index} className="text-2xl font-bold text-[#333333]">
                          {part}
                          {index === 0 && (
                            <motion.span>
                              :
                            </motion.span>
                          )}
                        </span>
                      ))}
                    </motion.div>

                    {/* Date in compact tag style */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-2 mt-1"
                    >
                      <span className="text-xs font-medium text-gray-600">
                        {currentTime.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Weather Widget */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="widget cartoon-outline col-span-2 relative overflow-hidden"
            >
              {/* Subtle Background Glow */}
              <motion.div
                animate={{
                  opacity: [0.05, 0.1, 0.05]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-0 right-0 w-20 h-20 bg-[#1c1c84] rounded-full blur-3xl"
              />

              <div className="widget-content relative z-10">
                <div className="flex items-center gap-3 w-full">
                  {/* Weather Icon */}
                  <motion.div
                    animate={{
                      rotate: [0, 3, 0, -3, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="bg-gradient-to-br from-[#1c1c84] to-[#2525a8] p-3 rounded-2xl cartoon-outline"
                  >
                    {(() => {
                      const hour = currentTime.getHours();
                      if (hour >= 5 && hour < 11) {
                        return <FiSunrise className="text-white" size={28} />;
                      } else if (hour >= 11 && hour < 15) {
                        return <FiSun className="text-white" size={28} />;
                      } else if (hour >= 15 && hour < 18) {
                        return <FiSunset className="text-white" size={28} />;
                      } else {
                        return <FiMoon className="text-white" size={28} />;
                      }
                    })()}
                  </motion.div>

                  {/* Weather Info */}
                  <div className="flex-1">
                    {weatherError ? (
                      <p className="text-red-500 text-sm font-medium">Error loading</p>
                    ) : weather ? (
                      <div className="flex items-center justify-between">
                        {/* Temperature */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          className="flex items-baseline gap-1"
                        >
                          <span className="text-2xl font-bold text-[#333333]">
                            {Math.round(weather.main.temp)}°
                          </span>
                          <span className="text-sm text-gray-500 font-medium">C</span>
                        </motion.div>

                        {/* Description */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-right"
                        >
                          <span className="text-xs text-gray-600 font-medium capitalize block">
                            {weather.weather[0].description}
                          </span>
                          <span className="text-xs text-gray-400">
                            Sleman, ID
                          </span>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-[#1c1c84] border-t-transparent rounded-full"
                        />
                        <p className="text-sm font-medium text-gray-600">Loading...</p>
                      </div>
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