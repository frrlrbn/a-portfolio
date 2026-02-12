'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BlogNavbar from '../components/BlogNavbar';
import { FiArchive, FiArrowLeft, FiClock, FiCalendar, FiEye, FiRotateCcw, FiTrash2 } from 'react-icons/fi';

export default function ArchivePageClient() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [actionSlug, setActionSlug] = useState(null);
  const [actionType, setActionType] = useState(null); // 'unarchive' | 'delete'
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login?redirect=/blog/archive');
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const fetchArchived = async () => {
      try {
        const res = await fetch('/api/blog/archive');
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } catch (err) {
        console.error('Failed to fetch archived posts:', err);
      }
      setLoading(false);
    };
    fetchArchived();
  }, [user]);

  const handleUnarchive = async (slug) => {
    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: false }),
      });
      if (res.ok) {
        setPosts(posts.filter((p) => p.slug !== slug));
      }
    } catch (err) {
      console.error('Unarchive error:', err);
    }
    setActionSlug(null);
    setActionType(null);
  };

  const handleDelete = async (slug) => {
    try {
      const res = await fetch(`/api/blog/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(posts.filter((p) => p.slug !== slug));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
    setActionSlug(null);
    setActionType(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <BlogNavbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link href="/blog">
              <motion.div whileHover={{ x: -4 }} className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1c1c84] font-semibold text-sm transition-colors mb-4">
                <FiArrowLeft size={16} /> Back to Blog
              </motion.div>
            </Link>
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold text-[#333333]">Archived Posts</h1>
                <p className="text-gray-500 mt-1">Posts hidden from public view</p>
              </div>
            </div>
          </motion.div>

          {/* Archived List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="cartoon-outline bg-white rounded-2xl p-6 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded-full w-3/4 mb-3" />
                  <div className="h-3 bg-gray-100 rounded-full w-full mb-2" />
                  <div className="h-3 bg-gray-100 rounded-full w-2/3" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="cartoon-outline bg-white rounded-2xl p-12 max-w-md mx-auto">
                <FiArchive className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-xl font-bold text-[#333333] mb-2">No archived posts</h3>
                <p className="text-gray-400">
                  You haven&apos;t archived any posts yet. Archived posts will appear here.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {posts.map((post, index) => {
                  const date = new Date(post.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  });

                  return (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="cartoon-outline bg-white rounded-2xl p-6 hover:shadow-[6px_6px_0px_0px_rgba(28,28,132,0.15)] transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {/* Cover thumbnail */}
                        {post.coverImage && (
                          <div className="w-full sm:w-24 h-32 sm:h-20 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0">
                            <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-[#333333] line-clamp-2">
                              {post.title}
                            </h3>
                            <span className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
                              <FiArchive size={9} />
                              Archived
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                            {post.excerpt}
                          </p>

                          {/* Tags */}
                          {post.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {post.tags.map((tag) => (
                                <span key={tag} className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#1c1c84]/10 text-[#1c1c84]">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Meta */}
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <FiCalendar size={12} /> {date}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiClock size={12} /> {post.readTime} min read
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex sm:flex-col gap-2 flex-shrink-0">
                          <Link href={`/blog/${post.slug}`} className="flex-1 sm:flex-initial">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="cartoon-outline bg-white px-4 py-2 rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-[#1c1c84] hover:text-white transition-colors"
                            >
                              <FiEye size={14} /> View
                            </motion.div>
                          </Link>
                          <motion.button
                            onClick={() => { setActionSlug(post.slug); setActionType('unarchive'); }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 sm:flex-initial cartoon-outline bg-[#1c1c84] text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-[#151560] transition-colors"
                          >
                            <FiRotateCcw size={14} /> Unarchive
                          </motion.button>
                          <motion.button
                            onClick={() => { setActionSlug(post.slug); setActionType('delete'); }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 sm:flex-initial cartoon-outline bg-white px-4 py-2 rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-red-500 hover:text-white transition-colors text-gray-400"
                          >
                            <FiTrash2 size={14} /> Delete
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {actionSlug && actionType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => { setActionSlug(null); setActionType(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="cartoon-outline bg-white rounded-2xl p-8 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-[#333333] mb-2">
                {actionType === 'unarchive' ? 'Unarchive Post?' : 'Delete Post?'}
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                {actionType === 'unarchive'
                  ? 'This post will be visible to everyone again.'
                  : 'This action cannot be undone. This post will be permanently deleted.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setActionSlug(null); setActionType(null); }}
                  className="flex-1 cartoon-outline bg-white py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => actionType === 'unarchive' ? handleUnarchive(actionSlug) : handleDelete(actionSlug)}
                  className={`flex-1 cartoon-outline py-3 rounded-full font-semibold text-white transition-colors ${
                    actionType === 'unarchive'
                      ? 'bg-[#1c1c84] hover:bg-[#151560]'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {actionType === 'unarchive' ? 'Unarchive' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
