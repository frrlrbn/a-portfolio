'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin } from 'react-icons/fi';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create email content
    const subject = `Message from ${formData.name}`;
    const body = `
Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}
    `;
    
    // Encode the subject and body for URL
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    // Create Gmail URL with pre-filled content
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=azelinazzahra@gmail.com&su=${encodedSubject}&body=${encodedBody}`;
    
    // Open Gmail in a new tab
    window.open(gmailUrl, '_blank');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      message: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          {/* Contact Information */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-black mb-4 relative inline-block"
              variants={itemVariants}
            >
              Get in Touch
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
            <motion.p className="text-lg text-gray-600" variants={itemVariants}>
              Feel free to reach out to me for any inquiries or opportunities.
            </motion.p>

            <motion.div className="space-y-4" variants={itemVariants}>
              <motion.div className="flex items-center space-x-4" variants={itemVariants}>
                <div className="cartoon-outline bg-white p-4 rounded-full">
                  <FiMail className="text-[#1c1c84]" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">azelinazzahra@gmail.com</p>
                </div>
              </motion.div>

              <motion.div className="flex items-center space-x-4" variants={itemVariants}>
                <div className="cartoon-outline bg-white p-4 rounded-full">
                  <FiMapPin className="text-[#1c1c84]" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-gray-600">Yogyakarta, Indonesia</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={itemVariants}
          >
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="cartoon-outline w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#1c1c84] focus:border-transparent"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="cartoon-outline w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#1c1c84] focus:border-transparent"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="cartoon-outline w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#1c1c84] focus:border-transparent"
                required
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="cartoon-outline w-full bg-[#1c1c84] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#151560] transition-colors duration-300"
              variants={itemVariants}
            >
              Send Message
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
} 