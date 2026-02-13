'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogNavbar from './components/BlogNavbar';
import BlogCard from './components/BlogCard';
import { FiSearch, FiX, FiChevronLeft, FiChevronRight, FiBookOpen, FiFeather, FiInstagram, FiLinkedin, FiMail } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';

const WELCOME_WORDS = [
  'Welcome', 'Selamat Datang', 'いらっしゃいませ', '환영합니다', '欢迎光临',
  'Bienvenue', 'Willkommen', 'Bienvenido', 'Benvenuto', 'Добро пожаловать',
  'Hoş Geldiniz', 'Välkommen', 'Velkommen', 'Welkom', 'Witamy',
  'Vítejte', 'Bem-vindo', 'Καλώς ήρθατε', 'Aloha', 'Sawubona',
  'مرحبا', 'स्वागतम्', 'Karibu', 'Chào Mừng', 'Tervetuloa',
];

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%!&*?+=<>';

const socialLinks = [
  { 
    icon: <FiInstagram className="w-5 h-5" />, 
    label: 'Instagram',
    accounts: [
      { url: 'https://instagram.com/azelyneazr', label: '@azelyneazr' },
      { url: 'https://instagram.com/designsocietyy', label: '@designsocietyy' }
    ]
  },
  { icon: <FiLinkedin className="w-5 h-5" />, url: 'https://www.linkedin.com/in/azelin-azzahra-6bba45333/', label: 'LinkedIn' },
  { icon: <FiMail className="w-5 h-5" />, url: 'mailto:azelinazzahra@gmail.com', label: 'Email' },
  { 
    icon: <FaTiktok className="w-5 h-5" />, 
    label: 'Tiktok',
    accounts: [
      { url: 'https://www.tiktok.com/@azelyneazz', label: '@azelyneazz' },
      { url: 'https://www.tiktok.com/@designsocietyy', label: '@designsocietyy' }
    ]
  },
];

function useTextScramble(words) {
  const [display, setDisplay] = useState(words[0]);
  const currentRef = useRef(words[0]);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const scrambleTo = (target) => {
      const from = currentRef.current;
      const maxLen = Math.max(from.length, target.length);
      const totalSteps = 25;
      let step = 0;

      const animate = () => {
        if (!mountedRef.current) return;
        step++;
        const progress = step / totalSteps;
        let result = '';

        for (let i = 0; i < maxLen; i++) {
          const charThreshold = 0.3 + (i / maxLen) * 0.6;

          if (i >= target.length) {
            if (progress < 0.6) {
              result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            }
          } else if (progress >= charThreshold) {
            result += target[i];
          } else {
            result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
        }

        setDisplay(result);

        if (step < totalSteps) {
          rafRef.current = setTimeout(animate, 50);
        } else {
          setDisplay(target);
          currentRef.current = target;
          timeoutRef.current = setTimeout(nextWord, 2800);
        }
      };

      animate();
    };

    const nextWord = () => {
      if (!mountedRef.current) return;
      let randomIdx;
      do {
        randomIdx = Math.floor(Math.random() * words.length);
      } while (words[randomIdx] === currentRef.current && words.length > 1);
      scrambleTo(words[randomIdx]);
    };

    timeoutRef.current = setTimeout(nextWord, 2800);

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) clearTimeout(rafRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return display;
}

export default function BlogPageClient() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [allTags, setAllTags] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const scrambledText = useTextScramble(WELCOME_WORDS);

  // Close dropdown when clicking outside
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

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '9' });
      if (search) params.set('search', search);
      if (activeTag) params.set('tag', activeTag);

      const res = await fetch(`/api/blog?${params}`);
      const data = await res.json();

      setPosts(data.posts || []);
      setPagination(data.pagination || { pages: 1, total: 0 });

      if (!activeTag && !search) {
        const tags = new Set();
        (data.posts || []).forEach((post) =>
          (post.tags || []).forEach((tag) => tags.add(tag))
        );
        setAllTags((prev) => {
          const merged = new Set([...prev, ...tags]);
          return [...merged];
        });
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
    setLoading(false);
  }, [page, search, activeTag]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  const clearFilters = () => {
    setSearch('');
    setActiveTag('');
    setPage(1);
  };

  return (
    <div className="min-h-screen">
      <BlogNavbar />

      {/* Hero Section */}
      <section className="pt-28 pb-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#333333] mb-4 h-[1.2em]">
              <span className="text-[#1c1c84] inline-block">{scrambledText}</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              A place to share my thoughts, ideas, and stories.
            </p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap justify-center gap-3 mt-5"
              ref={dropdownRef}
            >
              {socialLinks.map((link) => (
                <div key={link.label} className="relative">
                  {link.accounts ? (
                    <>
                      <motion.button
                        onClick={() => toggleDropdown(link.label)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="cartoon-outline bg-white p-3 rounded-full hover:bg-[#1c1c84] hover:text-white transition-colors duration-300 w-11 h-11 flex items-center justify-center"
                      >
                        <span className="sr-only">{link.label}</span>
                        {link.icon}
                      </motion.button>
                      
                      <AnimatePresence>
                        {activeDropdown === link.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-44 bg-white rounded-lg shadow-lg overflow-hidden z-50 cartoon-outline"
                          >
                            {link.accounts.map((account) => (
                              <a
                                key={account.label}
                                href={account.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#1c1c84] hover:text-white transition-colors duration-300 whitespace-nowrap"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {account.label}
                              </a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <motion.a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="cartoon-outline bg-white p-3 rounded-full hover:bg-[#1c1c84] hover:text-white transition-colors duration-300 w-11 h-11 flex items-center justify-center"
                    >
                      <span className="sr-only">{link.label}</span>
                      {link.icon}
                    </motion.a>
                  )}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-xl mx-auto"
          >
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-12 pr-12 py-4 rounded-full cartoon-outline bg-white focus:border-[#1c1c84] focus:ring-2 focus:ring-[#1c1c84]/20 outline-none transition-all duration-300 text-[#333333] font-medium placeholder:text-gray-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(''); setPage(1); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1c1c84] transition-colors"
                >
                  <FiX size={20} />
                </button>
              )}
            </div>
          </motion.form>

          {/* Tags */}
          {allTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-2 mt-6"
            >
              <button
                onClick={() => { setActiveTag(''); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-300 ${
                  !activeTag
                    ? 'bg-[#1c1c84] text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-[#333333] border-gray-200 hover:border-[#1c1c84] hover:text-[#1c1c84]'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setActiveTag(tag); setPage(1); }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-300 ${
                    activeTag === tag
                      ? 'bg-[#1c1c84] text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-[#333333] border-gray-200 hover:border-[#1c1c84] hover:text-[#1c1c84]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="cartoon-outline bg-white rounded-2xl overflow-hidden"
                >
                  <div className="h-48 bg-gray-100 animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-gray-100 rounded-full w-20 animate-pulse" />
                    <div className="h-5 bg-gray-100 rounded-full w-4/5 animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded-full animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded-full w-3/4 animate-pulse" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="cartoon-outline bg-white rounded-2xl p-12 max-w-md mx-auto">
                <FiBookOpen className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-xl font-bold text-[#333333] mb-2">No posts yet</h3>
                <p className="text-gray-400">
                  {search || activeTag
                    ? 'No posts match your search. Try different keywords.'
                    : 'The blog is empty for now. Come back later!'}
                </p>
                {(search || activeTag) && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 rounded-full bg-[#1c1c84] text-white font-semibold text-sm cartoon-outline hover:bg-[#151560] transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {posts.map((post, index) => (
                    <BlogCard key={post._id} post={post} index={index} />
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-3 mt-12"
                >
                  <motion.button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    whileHover={{ scale: page === 1 ? 1 : 1.05 }}
                    whileTap={{ scale: page === 1 ? 1 : 0.95 }}
                    className={`cartoon-outline p-3 rounded-full transition-colors ${
                      page === 1
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-white hover:bg-[#1c1c84] hover:text-white'
                    }`}
                  >
                    <FiChevronLeft size={20} />
                  </motion.button>

                  <div className="flex items-center gap-2">
                    {[...Array(pagination.pages)].map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 ${
                          page === i + 1
                            ? 'cartoon-outline bg-[#1c1c84] text-white'
                            : 'bg-white text-[#333333] hover:bg-gray-50 border-2 border-gray-200'
                        }`}
                      >
                        {i + 1}
                      </motion.button>
                    ))}
                  </div>

                  <motion.button
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                    whileHover={{ scale: page === pagination.pages ? 1 : 1.05 }}
                    whileTap={{ scale: page === pagination.pages ? 1 : 0.95 }}
                    className={`cartoon-outline p-3 rounded-full transition-colors ${
                      page === pagination.pages
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-white hover:bg-[#1c1c84] hover:text-white'
                    }`}
                  >
                    <FiChevronRight size={20} />
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
