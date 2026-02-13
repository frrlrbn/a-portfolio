'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BlogNavbar from '../components/BlogNavbar';
import { FiEdit3, FiTrash2, FiArrowLeft, FiClock, FiCalendar, FiSend, FiFileText, FiEye } from 'react-icons/fi';

export default function DraftsPageClient() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [deleteSlug, setDeleteSlug] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login?redirect=/blog/drafts');
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
    const fetchDrafts = async () => {
      try {
        const res = await fetch('/api/blog/drafts');
        if (res.ok) {
          const data = await res.json();
          setDrafts(data.drafts || []);
        }
      } catch (err) {
        console.error('Failed to fetch drafts:', err);
      }
      setLoading(false);
    };
    fetchDrafts();
  }, [user]);

  const handleDelete = async (slug) => {
    try {
      const res = await fetch(`/api/blog/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setDrafts(drafts.filter((d) => d.slug !== slug));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
    setDeleteSlug(null);
  };

  const handlePublish = async (slug) => {
    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: true }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/blog/${data.post.slug}`);
      }
    } catch (err) {
      console.error('Publish error:', err);
    }
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
            <h1 className="text-3xl font-bold text-[#333333]">Your Drafts</h1>
            <p className="text-gray-500 mt-1">Unpublished posts waiting for your finishing touch</p>
          </motion.div>

          {/* Drafts List */}
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
          ) : drafts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="cartoon-outline bg-white rounded-2xl p-12 max-w-md mx-auto">
                <FiFileText className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-xl font-bold text-[#333333] mb-2">No drafts</h3>
                <p className="text-gray-400 mb-6">
                  You don't have any unpublished posts. Start writing something!
                </p>
                <Link href="/blog/create">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 cartoon-outline bg-[#1c1c84] text-white px-6 py-3 rounded-full font-semibold"
                  >
                    <FiEdit3 size={16} /> Write New Post
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {drafts.map((draft, index) => {
                  const date = new Date(draft.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  });
                  const time = new Date(draft.updatedAt).toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit',
                  });

                  return (
                    <motion.div
                      key={draft._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="cartoon-outline bg-white rounded-2xl p-6 hover:shadow-[6px_6px_0px_0px_rgba(28,28,132,0.15)] transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {/* Cover thumbnail */}
                        {draft.coverImage && (
                          <div className="w-full sm:w-24 h-32 sm:h-20 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0">
                            <img src={draft.coverImage} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-[#333333] line-clamp-2 mb-1">
                            {draft.title}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                            {draft.excerpt}
                          </p>

                          {/* Tags */}
                          {draft.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {draft.tags.map((tag) => (
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
                              <FiClock size={12} /> {time}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiEye size={12} /> {draft.readTime} min read
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-3 sm:grid-cols-1 gap-2 w-full sm:w-auto sm:flex-shrink-0">
                          <Link href={`/blog/edit/${draft.slug}`}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="cartoon-outline bg-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 sm:gap-1.5 hover:bg-[#1c1c84] hover:text-white transition-colors"
                            >
                              <FiEdit3 size={14} /> Edit
                            </motion.div>
                          </Link>
                          <motion.button
                            onClick={() => handlePublish(draft.slug)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="cartoon-outline bg-[#1c1c84] text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 sm:gap-1.5 hover:bg-[#151560] transition-colors"
                          >
                            <FiSend size={14} /> Publish
                          </motion.button>
                          <motion.button
                            onClick={() => setDeleteSlug(draft.slug)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="cartoon-outline bg-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 sm:gap-1.5 hover:bg-red-500 hover:text-white transition-colors text-gray-400"
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

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteSlug && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setDeleteSlug(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="cartoon-outline bg-white rounded-2xl p-8 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-[#333333] mb-2">Delete Draft?</h3>
              <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteSlug(null)}
                  className="flex-1 cartoon-outline bg-white py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteSlug)}
                  className="flex-1 cartoon-outline bg-red-500 text-white py-3 rounded-full font-semibold hover:bg-red-600 transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
