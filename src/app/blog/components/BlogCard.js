'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiClock, FiUser, FiCalendar, FiTag } from 'react-icons/fi';

export default function BlogCard({ post, index }) {
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <motion.article
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="cartoon-outline bg-white rounded-2xl overflow-hidden h-full flex flex-col transition-shadow duration-300 hover:shadow-[6px_6px_0px_0px_rgba(28,28,132,0.3)]"
        >
          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-[#1c1c84]/10 text-[#1c1c84] border border-[#1c1c84]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h2 className="text-xl font-bold text-[#333333] mb-2 line-clamp-2 leading-tight">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
              {post.excerpt}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#1c1c84] flex items-center justify-center overflow-hidden">
                  {post.author?.profilePicture ? (
                    <img src={post.author.profilePicture} alt={post.author.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <FiUser size={12} className="text-white" />
                  )}
                </div>
                <span className="text-xs font-semibold text-[#333333]">
                  {post.author?.displayName || 'Anonymous'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-400 text-xs">
                <span className="flex items-center gap-1">
                  <FiCalendar size={12} />
                  {date}
                </span>
                <span className="flex items-center gap-1">
                  <FiClock size={12} />
                  {post.readTime} min
                </span>
              </div>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
