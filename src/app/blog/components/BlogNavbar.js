'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiHome, FiEdit3, FiLogOut, FiUser, FiMenu, FiX, FiBookOpen, FiFileText, FiSettings, FiChevronDown, FiArchive } from 'react-icons/fi';

export default function BlogNavbar() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        // Not logged in
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/blog');
    router.refresh();
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`fixed w-full z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b-4 border-black' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/blog">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cartoon-outline bg-white px-5 py-1.5 rounded-full flex items-center gap-2"
            >
              <span className="text-xl font-bold text-black">Azelin</span>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cartoon-outline bg-white p-2.5 rounded-full hover:bg-[#1c1c84] hover:text-white transition-colors duration-300"
              >
                <FiHome size={18} />
              </motion.div>
            </Link>

            {user && (
              <>
                <Link href="/blog/create">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cartoon-outline px-4 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 transition-colors duration-300 ${
                      pathname === '/blog/create'
                        ? 'bg-[#1c1c84] text-white'
                        : 'bg-white hover:bg-[#1c1c84] hover:text-white'
                    }`}
                  >
                    <FiEdit3 size={16} />
                    Write
                  </motion.div>
                </Link>
                
                <Link href="/blog/drafts">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cartoon-outline px-4 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 transition-colors duration-300 ${
                      pathname === '/blog/drafts'
                        ? 'bg-[#1c1c84] text-white'
                        : 'bg-white hover:bg-[#1c1c84] hover:text-white'
                    }`}
                  >
                    <FiFileText size={16} />
                    Drafts
                  </motion.div>
                </Link>

                <Link href="/blog/archive">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cartoon-outline px-4 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 transition-colors duration-300 ${
                      pathname === '/blog/archive'
                        ? 'bg-[#1c1c84] text-white'
                        : 'bg-white hover:bg-[#1c1c84] hover:text-white'
                    }`}
                  >
                    <FiArchive size={16} />
                    Archive
                  </motion.div>
                </Link>

                <div className="relative ml-2 pl-2 border-l-2 border-gray-200">
                  <motion.button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 cartoon-outline bg-white px-3 py-1.5 rounded-full"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#1c1c84] flex items-center justify-center overflow-hidden">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt={user.displayName} className="w-full h-full object-cover" />
                      ) : (
                        <FiUser size={14} className="text-white" />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-[#333333]">{user.displayName}</span>
                    <FiChevronDown size={14} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 cartoon-outline bg-white rounded-xl overflow-hidden z-50"
                      >
                        <Link href="/blog/profile" onClick={() => setUserMenuOpen(false)}>
                          <div className="px-4 py-3 flex items-center gap-2.5 text-[#333333] hover:bg-[#1c1c84] hover:text-white transition-colors text-sm font-semibold">
                            <FiSettings size={15} /> Edit Profile
                          </div>
                        </Link>
                        <button
                          onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                          className="w-full px-4 py-3 flex items-center gap-2.5 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm font-semibold border-t-2 border-gray-100"
                        >
                          <FiLogOut size={15} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setMobileOpen(!mobileOpen)}
              whileTap={{ scale: 0.95 }}
              className="cartoon-outline bg-white p-2 rounded-full"
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <FiX size={22} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <FiMenu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b-4 border-black"
          >
            <div className="px-4 py-4 space-y-3">
              <Link href="/blog" onClick={() => setMobileOpen(false)}>
                <div className="cartoon-outline px-4 py-3 rounded-xl flex items-center gap-3 text-[#333333] hover:bg-[#1c1c84] hover:text-white transition-colors mt-3">
                  <FiBookOpen size={18} />
                  <span className="font-semibold">All Posts</span>
                </div>
              </Link>
              {user && (
                <>
                  <Link href="/blog/create" onClick={() => setMobileOpen(false)}>
                    <div className="cartoon-outline px-4 py-3 rounded-xl flex items-center gap-3 bg-[#1c1c84] text-white mt-3">
                      <FiEdit3 size={18} />
                      <span className="font-semibold">Write New Post</span>
                    </div>
                  </Link>
                  <Link href="/blog/drafts" onClick={() => setMobileOpen(false)}>
                    <div className="cartoon-outline px-4 py-3 rounded-xl flex items-center gap-3 text-[#333333] hover:bg-[#1c1c84] hover:text-white transition-colors mt-3">
                      <FiFileText size={18} />
                      <span className="font-semibold">Drafts</span>
                    </div>
                  </Link>
                  <Link href="/blog/archive" onClick={() => setMobileOpen(false)}>
                    <div className="cartoon-outline px-4 py-3 rounded-xl flex items-center gap-3 text-[#333333] hover:bg-[#1c1c84] hover:text-white transition-colors mt-3">
                      <FiArchive size={18} />
                      <span className="font-semibold">Archive</span>
                    </div>
                  </Link>
                  <Link href="/blog/profile" onClick={() => setMobileOpen(false)}>
                    <div className="cartoon-outline px-4 py-3 mb-3 rounded-xl flex items-center gap-3 text-[#333333] hover:bg-[#1c1c84] hover:text-white transition-colors mt-3">
                      <FiSettings size={18} />
                      <span className="font-semibold">Edit Profile</span>
                    </div>
                  </Link>
                  <div className="flex items-center justify-between pt-3 border-t-2 border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-[#1c1c84] flex items-center justify-center overflow-hidden">
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt={user.displayName} className="w-full h-full object-cover" />
                        ) : (
                          <FiUser size={16} className="text-white" />
                        )}
                      </div>
                      <span className="text-sm font-semibold">{user.displayName}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="cartoon-outline bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                </>

              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
