'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import BlogNavbar from '../components/BlogNavbar';
import CommentSection from '../components/CommentSection';
import { FiArrowLeft, FiClock, FiCalendar, FiUser, FiEdit3, FiTrash2, FiShare2, FiTag, FiLink, FiCheck, FiArchive } from 'react-icons/fi';
import { FaXTwitter, FaInstagram } from 'react-icons/fa6';

export default function BlogPostClient() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const { slug } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data.post);
        } else {
          router.push('/blog');
        }
      } catch {
        router.push('/blog');
      }
      setLoading(false);
    };

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

    fetchPost();
    checkAuth();
  }, [slug, router]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/blog/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/blog');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleArchiveToggle = async () => {
    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: !post.archived }),
      });
      if (res.ok) {
        if (!post.archived) {
          router.push('/blog/archive');
        } else {
          setPost({ ...post, archived: false });
          setShowArchiveModal(false);
        }
      }
    } catch (error) {
      console.error('Archive error:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <BlogNavbar />
        <div className="pt-28 max-w-3xl mx-auto px-4">
          <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-gray-100 rounded-full w-1/3" />
            <div className="h-12 bg-gray-100 rounded-2xl w-4/5" />
            <div className="h-64 bg-gray-100 rounded-2xl" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded-full" />
              <div className="h-4 bg-gray-100 rounded-full w-5/6" />
              <div className="h-4 bg-gray-100 rounded-full w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const updatedDate = post.updatedAt !== post.createdAt
    ? new Date(post.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || undefined,
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name: post.author?.displayName,
      url: `https://azelin.my.id`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Azelin Blog',
      url: 'https://azelin.my.id/blog',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://azelin.my.id/blog/${slug}`,
    },
    wordCount: post.content?.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length || 0,
    keywords: post.tags?.join(', ') || '',
  };

  return (
    <div className="min-h-screen bg-white">
      <BlogNavbar />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pt-24 sm:pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Top Bar: Back link + Actions on same row */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <Link href="/blog">
              <motion.div
                whileHover={{ x: -4 }}
                className="inline-flex items-center gap-1.5 text-gray-400 hover:text-[#1c1c84] font-semibold text-sm transition-colors"
              >
                <FiArrowLeft size={15} />
                <span className="hidden sm:inline">Back to Blog</span>
                <span className="sm:hidden">Back</span>
              </motion.div>
            </Link>

            <div className="flex items-center gap-1.5">
              <motion.button
                onClick={handleShare}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full text-gray-400 hover:text-[#1c1c84] hover:bg-[#1c1c84]/10 transition-colors"
                title="Share"
              >
                <FiShare2 size={17} />
              </motion.button>

              {user && (
                <>
                  <Link href={`/blog/edit/${slug}`}>
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full text-gray-400 hover:text-[#1c1c84] hover:bg-[#1c1c84]/10 transition-colors"
                      title="Edit"
                    >
                      <FiEdit3 size={17} />
                    </motion.div>
                  </Link>
                  <motion.button
                    onClick={() => setShowArchiveModal(true)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                    title={post.archived ? 'Unarchive' : 'Archive'}
                  >
                    <FiArchive size={17} />
                  </motion.button>
                  <motion.button
                    onClick={() => setShowDeleteModal(true)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 size={17} />
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            {/* Title */}
            <h1 className="text-3xl sm:text-3xl lg:text-4xl font-bold text-[#333333] leading-tight mb-3">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-5">
              {post.excerpt}
            </p>

            {/* Meta Row: Author + Date + ReadTime all inline */}
            <div className="flex items-center gap-3 py-4 border-y border-gray-100">
              {/* Author */}
              <div className="w-9 h-9 rounded-full bg-[#1c1c84] flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-black">
                {post.author?.profilePicture ? (
                  <img src={post.author.profilePicture} alt={post.author.displayName} className="w-full h-full object-cover" />
                ) : (
                  <FiUser size={14} className="text-white" />
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1 min-w-0">
                <span className="text-sm font-bold text-[#333333] truncate">{post.author?.displayName}</span>
                <span className="hidden sm:inline text-gray-300">·</span>
                <span className="text-xs text-gray-400">@{post.author?.username}</span>
              </div>

              {/* Spacer + Date/ReadTime pushed right */}
              <div className="flex items-center gap-3 ml-auto text-xs sm:text-sm text-gray-400 flex-shrink-0">
                <span className="flex items-center gap-1">
                  <FiCalendar size={13} />
                  <span className="hidden sm:inline">{date}</span>
                  <span className="sm:hidden">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </span>
                <span className="flex items-center gap-1">
                  <FiClock size={13} />
                  {post.readTime}m
                </span>
              </div>
            </div>
          </motion.header>

          {/* Cover Image */}
          {post.coverImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 rounded-2xl overflow-hidden cartoon-outline"
            >
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-auto object-cover max-h-[500px]"
              />
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="blog-content prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Bottom: Updated notice + Author Card */}
          <div className="mt-10 pt-6 border-t-2 border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              {/* Author */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-full bg-[#1c1c84] flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-black">
                  {post.author?.profilePicture ? (
                    <img src={post.author.profilePicture} alt={post.author.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <FiUser size={18} className="text-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#333333] text-sm sm:text-base">Written by {post.author?.displayName}</p>
                  <p className="text-xs text-gray-400">@{post.author?.username}</p>
                </div>
              </div>
              {/* Updated date */}
              {updatedDate && (
                <p className="text-xs text-gray-400 italic sm:text-right sm:flex-shrink-0 pl-14 sm:pl-0">
                  Updated {updatedDate}
                </p>
              )}
            </div>

            {/* Tags + Share row */}
            <div className="flex items-center justify-between gap-4 mt-5">
              {/* Tags */}
              {post.tags && post.tags.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                  <FiTag size={13} className="text-gray-400 flex-shrink-0" />
                  {post.tags.map((tag) => (
                    <Link key={tag} href={`/blog?tag=${tag}`}>
                      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1c1c84]/8 text-[#1c1c84] hover:bg-[#1c1c84] hover:text-white transition-colors">
                        {tag}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : <div />}

              {/* Share buttons */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-xs text-gray-400 font-medium mr-1 hidden sm:inline">Share</span>
                <motion.button
                  onClick={() => {
                    const url = window.location.href;
                    const text = encodeURIComponent(post.title);
                    window.open(`https://x.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank', 'width=550,height=420');
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-black transition-colors"
                  title="Share on X"
                >
                  <FaXTwitter size={14} />
                </motion.button>
                <motion.button
                  onClick={() => {
                    const url = window.location.href;
                    const text = `${post.title} ${url}`;
                    window.open(`https://www.instagram.com/`, '_blank');
                    navigator.clipboard.writeText(text);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 transition-colors"
                  title="Share on Instagram"
                >
                  <FaInstagram size={15} />
                </motion.button>
                <motion.button
                  onClick={async () => {
                    await navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    copied ? 'text-white bg-green-500' : 'text-gray-400 hover:text-white hover:bg-[#1c1c84]'
                  }`}
                  title={copied ? 'Copied!' : 'Copy link'}
                >
                  {copied ? <FiCheck size={14} /> : <FiLink size={14} />}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Comments */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-8 bg-white">
        <CommentSection slug={slug} />
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="cartoon-outline bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg sm:text-xl font-bold text-[#333333] mb-2">Delete Post?</h3>
            <p className="text-gray-500 text-sm mb-5">
              This action cannot be undone. This post will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 cartoon-outline bg-white py-2.5 rounded-full font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 cartoon-outline bg-red-500 text-white py-2.5 rounded-full font-semibold text-sm hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Archive Modal */}
      {showArchiveModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowArchiveModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="cartoon-outline bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg sm:text-xl font-bold text-[#333333] mb-2">
              {post.archived ? 'Unarchive Post?' : 'Archive Post?'}
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              {post.archived
                ? 'This post will be visible to everyone again.'
                : 'This post will be hidden from public view. You can unarchive it later.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowArchiveModal(false)}
                className="flex-1 cartoon-outline bg-white py-2.5 rounded-full font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleArchiveToggle}
                className={`flex-1 cartoon-outline py-2.5 rounded-full font-semibold text-sm transition-colors ${
                  post.archived
                    ? 'bg-[#1c1c84] text-white hover:bg-[#151560]'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {post.archived ? 'Unarchive' : 'Archive'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-gray-100 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-gray-400 font-medium">
            &copy; {new Date().getFullYear()}{' '}
            <a href="https://farrel.id" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-2">frrlrbn</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
