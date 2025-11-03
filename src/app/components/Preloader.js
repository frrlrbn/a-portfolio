'use client';

import { motion } from 'framer-motion';
import { FiCode, FiLayers, FiCpu, FiLoader } from 'react-icons/fi';

export default function Preloader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white flex items-center justify-center z-50"
    >
      <div className="relative w-40 h-40">
        {/* Main Bouncing Circle */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className=" bg-white p-4 rounded-full absolute inset-0"
          >
            {/* Inner Rotating Elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-4"
            >
              {/* Decorative Dots */}
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1c1c84] rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1c1c84] rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1c1c84] rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1c1c84] rounded-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Floating Tech Icons */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0"
        >
          <motion.div
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 left-1/2 -translate-x-1/2"
          >
            <FiCode className="text-[#1c1c84] text-2xl" />
          </motion.div>
          
          <motion.div
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2"
          >
            <FiLayers className="text-[#1c1c84] text-2xl" />
          </motion.div>
          
          <motion.div
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6
            }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
          >
            <FiCpu className="text-[#1c1c84] text-2xl" />
          </motion.div>
          
          <motion.div
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.9
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2"
          >
            <FiLoader className="text-[#1c1c84] text-2xl" />
          </motion.div>
        </motion.div>

        {/* Decorative Lines */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0"
        >
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#1c1c84]/30" />
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#1c1c84]/30" />
        </motion.div>
      </div>
    </motion.div>
  );
} 