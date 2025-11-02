'use client';

import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-9xl font-bold text-black mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2
            }}
          >
            404
          </motion.h1>
          
          <motion.div
            className="cartoon-outline bg-white p-6 rounded-lg mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-4">Oops! Page Not Found</h2>
            <p className="text-gray-600 mb-6">
              The page you are looking for might have been removed, had its name changed, 
              or is temporarily unavailable.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cartoon-outline bg-[#1c1c84] text-white px-6 py-3 rounded-full flex items-center gap-2"
                onClick={() => router.push('/')}
              >
                <FiHome size={20} />
                <span>Go to Home</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cartoon-outline bg-white text-black px-6 py-3 rounded-full flex items-center gap-2"
                onClick={() => router.back()}
              >
                <FiArrowLeft size={20} />
                <span>Go Back</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 