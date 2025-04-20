'use client';

import { motion } from 'framer-motion';
import { FiInstagram, FiLinkedin, FiMail } from 'react-icons/fi';

const socialLinks = [
  { icon: <FiInstagram />, url: 'https://instagram.com/azelyneazara', label: 'Instagram' },
  { icon: <FiInstagram />, url: 'https://instagram.com/designsocietyy', label: 'Instagrams' },
  { icon: <FiLinkedin />, url: 'https://www.linkedin.com/in/azelin-azzahra-6bba45333/', label: 'LinkedIn' },
  { icon: <FiMail />, url: 'mailto:azelinazzahra@gmail.com', label: 'Email' },
];

export default function About() {
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
                src="/images/hero.jpeg"
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
                <motion.a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="cartoon-outline bg-white p-4 rounded-full hover:bg-yellow-500 hover:text-white transition-colors duration-300"
                >
                  <span className="sr-only">{link.label}</span>
                  {link.icon}
                </motion.a>
              ))}
              <motion.a
                href="/files/CV-AZELIN.pdf"
                download
                whileHover={{ scale: 1.1 }}
                className="cartoon-outline bg-yellow-500 text-white p-4 rounded-full hover:bg-yellow-600 transition-colors duration-300 flex items-center gap-2"
              >
                <span className="sr-only">Download CV</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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