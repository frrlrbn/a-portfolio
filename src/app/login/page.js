'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiLock, FiArrowRight, FiArrowLeft, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/blog';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background pattern (inherited from body) */}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >

        {/* Login Card */}
        <motion.form
          onSubmit={handleSubmit}
          className="cartoon-outline bg-white rounded-2xl p-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3"
            >
              <FiAlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {/* Username */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-semibold text-[#333333] flex items-center gap-2">
              <FiUser size={14} />
              Username
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl border-2 border-black bg-gray-50 focus:bg-white focus:border-[#1c1c84] focus:ring-2 focus:ring-[#1c1c84]/20 outline-none transition-all duration-300 text-[#333333] font-medium placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold text-[#333333] flex items-center gap-2">
              <FiLock size={14} />
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-black bg-gray-50 focus:bg-white focus:border-[#1c1c84] focus:ring-2 focus:ring-[#1c1c84]/20 outline-none transition-all duration-300 text-[#333333] font-medium placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1c1c84] transition-colors"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className={`w-full cartoon-outline py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
              loading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-[#1c1c84] text-white hover:bg-[#151560]'
            }`}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <FiArrowRight size={20} />
              </>
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
