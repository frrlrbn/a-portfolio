'use client';

import { motion } from 'framer-motion';
import { FiCpu, FiPenTool, FiEdit, FiTool, FiUsers, FiBook } from 'react-icons/fi';
import Image from 'next/image';

const skills = [
  {
    name: 'Assembly Technician',
    icon: <FiCpu />,
    level: 90,
    color: 'bg-yellow-500',
  },
  {
    name: 'Graphic Designer',
    icon: <FiPenTool />,
    level: 85,
    color: 'bg-yellow-500',
  },
  {
    name: 'Digital Writer',
    icon: <FiEdit />,
    level: 80,
    color: 'bg-yellow-500',
  },
];

const additionalSkills = [
  {
    title: 'Basic AutoCAD Design',
    description: 'Proficient in creating and editing engineering designs.',
    icon: <FiTool className="text-2xl" />,
  },
  {
    title: 'PLC, Pneumatic, & Microcontroller Programming',
    description: 'Have expertise in the field of system control using PLC, embedded programming with C++, and pneumatic systems for industry. I am interested in developing efficient and innovative automation solutions.',
    icon: <FiCpu className="text-2xl" />,
  },
  {
    title: 'Design & Content Writing',
    description: 'Has expertise in graphic design using Canva, as well as content writing & content creation, with a focus on creating interesting and quality creative content.',
    icon: <FiEdit className="text-2xl" />,
  },
];

const techStack = [
  { 
    name: 'AutoCAD', 
    icon: 'https://cadmasters.com/wp-content/uploads/2023/04/autodesk-autocad-small_badge-128@2x.png',
    alt: 'AutoCAD Logo'
  },
  { 
    name: 'C++', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/1200px-ISO_C%2B%2B_Logo.svg.png',
    alt: 'C++ Logo'
  },
  { 
    name: 'Canva', 
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg',
    alt: 'Canva Logo'
  },
  { 
    name: 'Arduino', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Arduino_Logo.svg/1200px-Arduino_Logo.svg.png',
    alt: 'Arduino Logo'
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-black text-center">
            Skills & Expertise
          </h2>

          {/* Skills Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skills.map((skill) => (
              <motion.div
                key={skill.name}
                whileHover={{ scale: 1.05 }}
                className="cartoon-outline bg-white p-6 rounded-lg"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-2xl">{skill.icon}</div>
                  <h3 className="text-xl font-semibold">{skill.name}</h3>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className={`h-4 rounded-full ${skill.color}`}
                  />
                </div>
                <p className="text-right mt-2 text-sm text-gray-600">
                  {skill.level}%
                </p>
              </motion.div>
            ))}
          </div>

          {/* Additional Skills */}
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {additionalSkills.map((skill) => (
                <motion.div
                  key={skill.title}
                  whileHover={{ scale: 1.02 }}
                  className="cartoon-outline bg-white p-6 rounded-lg"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-yellow-500">{skill.icon}</div>
                    <h4 className="text-xl font-semibold">{skill.title}</h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {skill.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {techStack.map((tech) => (
                <motion.div
                  key={tech.name}
                  whileHover={{ scale: 1.1 }}
                  className="cartoon-outline bg-white p-4 rounded-lg text-center"
                >
                  <div className="relative w-12 h-12 mx-auto mb-2">
                    <Image
                      src={tech.icon}
                      alt={tech.alt}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <p className="text-sm font-medium">{tech.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 