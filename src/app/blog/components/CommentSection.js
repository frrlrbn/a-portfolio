'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FiMessageCircle, FiTrash2, FiCornerDownRight, FiUser, FiX, FiSend, FiChevronDown, FiChevronUp, FiShield } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

// Single comment component (recursive for replies)
function CommentItem({ comment, onReply, onDelete, blogUser, googleUser, depth = 0 }) {
  const [showReplies, setShowReplies] = useState(true);
  const isBlogAuthor = !!comment.blogAuthor;
  const replyCount = comment.replies?.length || 0;

  // Can delete: blog author can delete any, google user can delete own
  const canDelete = blogUser || (googleUser && comment.googleId === (googleUser.googleId || googleUser.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={depth > 0 ? 'ml-3 sm:ml-8 pl-3 sm:pl-4 border-l-2 border-gray-100' : ''}
    >
      <div className="py-2.5 sm:py-3">
        {/* Comment header */}
        <div className="flex items-start gap-2 sm:gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
            {comment.avatar ? (
              <img src={comment.avatar} alt={comment.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <FiUser size={12} className="text-gray-400 sm:w-3.5 sm:h-3.5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[13px] sm:text-sm font-bold text-[#333333] truncate max-w-[120px] sm:max-w-none">{comment.name}</span>
              {isBlogAuthor && (
                <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded bg-[#1c1c84] text-white flex-shrink-0">
                  <FiShield size={8} />
                  Admin
                </span>
              )}
              <span className="text-[11px] sm:text-xs text-gray-400 flex-shrink-0">{timeAgo(comment.createdAt)}</span>
            </div>

            {/* Comment body */}
            <p className="text-[13px] sm:text-sm text-[#333333] mt-1 leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
              {comment.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4 sm:gap-3 mt-2">
              {(blogUser || googleUser) && depth === 0 && (
                <button
                  onClick={() => onReply(comment)}
                  className="text-xs text-gray-400 hover:text-[#1c1c84] active:text-[#1c1c84] font-semibold flex items-center gap-1 transition-colors py-0.5"
                >
                  <FiCornerDownRight size={12} />
                  Reply
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => onDelete(comment._id)}
                  className="text-xs text-gray-400 hover:text-red-500 active:text-red-500 font-semibold flex items-center gap-1 transition-colors py-0.5"
                >
                  <FiTrash2 size={11} />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      {replyCount > 0 && (
        <div>
          {replyCount > 1 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-xs text-[#1c1c84] font-semibold flex items-center gap-1 ml-9 sm:ml-[3.25rem] mb-1 hover:underline py-0.5"
            >
              {showReplies ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
              {showReplies ? 'Hide' : 'Show'} {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
            </button>
          )}
          <AnimatePresence>
            {showReplies && comment.replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                onReply={onReply}
                onDelete={onDelete}
                blogUser={blogUser}
                googleUser={googleUser}
                depth={depth + 1}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

export default function CommentSection({ slug }) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [blogUser, setBlogUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const textareaRef = useRef(null);

  // Check if current user is blog author
  useEffect(() => {
    const checkBlogAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setBlogUser(data.user);
        }
      } catch {
        // Not a blog author
      }
    };
    checkBlogAuth();
  }, []);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments || []);
          setTotal(data.total || 0);
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
      setLoading(false);
    };
    fetchComments();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          content: content.trim(),
          parentComment: replyTo?._id || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        if (replyTo) {
          // Add reply to the correct parent in the tree
          setComments(prev => addReplyToTree(prev, replyTo._id, data.comment));
        } else {
          // Add new top-level comment
          setComments(prev => [data.comment, ...prev]);
        }
        setTotal(prev => prev + 1);
        setContent('');
        setReplyTo(null);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to post comment');
      }
    } catch {
      alert('Failed to post comment');
    }
    setSubmitting(false);
  };

  // Recursively add a reply into the comment tree
  const addReplyToTree = (comments, parentId, newReply) => {
    return comments.map(comment => {
      if (comment._id === parentId) {
        return { ...comment, replies: [...(comment.replies || []), newReply] };
      }
      if (comment.replies?.length > 0) {
        return { ...comment, replies: addReplyToTree(comment.replies, parentId, newReply) };
      }
      return comment;
    });
  };

  const handleDelete = async (commentId) => {
    setDeleteId(commentId);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/comments?id=${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setComments(prev => removeFromTree(prev, deleteId));
        setTotal(prev => prev - 1);
      }
    } catch {
      alert('Failed to delete comment');
    }
    setDeleteId(null);
  };

  // Recursively remove a comment from the tree
  const removeFromTree = (comments, id) => {
    return comments
      .filter(c => c._id !== id)
      .map(c => ({
        ...c,
        replies: c.replies ? removeFromTree(c.replies, id) : [],
      }));
  };

  const handleReply = (comment) => {
    setReplyTo(comment);
    setContent('');
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const googleUser = session?.user || null;
  const isAuthenticated = !!blogUser || !!googleUser;

  return (
    <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t-2 border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <FiMessageCircle size={18} className="text-[#333333] sm:w-5 sm:h-5" />
        <h2 className="text-base sm:text-lg font-bold text-[#333333]">
          Comments{total > 0 && <span className="text-gray-400 font-normal ml-1">({total})</span>}
        </h2>
      </div>

      {/* Comment input */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {/* Reply indicator */}
          <AnimatePresence>
            {replyTo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 mb-2 text-sm text-[#1c1c84] bg-[#1c1c84]/5 px-3 py-2 rounded-lg"
              >
                <FiCornerDownRight size={14} />
                <span className="font-medium">Replying to {replyTo.name}</span>
                <button
                  type="button"
                  onClick={() => { setReplyTo(null); setContent(''); }}
                  className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FiX size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 mt-1 hidden sm:flex">
              {blogUser?.profilePicture ? (
                <img src={blogUser.profilePicture} alt={blogUser.displayName} className="w-full h-full object-cover" />
              ) : googleUser?.image ? (
                <img src={googleUser.image} alt={googleUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <FiUser size={14} className="text-gray-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={replyTo ? `Reply to ${replyTo.name}...` : 'Write a comment...'}
                rows={2}
                maxLength={2000}
                className="w-full resize-none outline-none border-2 border-gray-200 focus:border-[#1c1c84] rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-[13px] sm:text-sm text-[#333333] placeholder:text-gray-400 bg-gray-50 focus:bg-white transition-colors leading-relaxed"
              />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] sm:text-xs text-gray-400 truncate">
                    {blogUser ? (
                      <span className="flex items-center gap-1"><FiShield size={10} /> As <strong className="truncate">{blogUser.displayName}</strong></span>
                    ) : (
                      <span>As <strong className="truncate">{googleUser?.name}</strong></span>
                    )}
                  </span>
                  {!blogUser && googleUser && (
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="text-[11px] sm:text-xs text-gray-400 hover:text-red-500 active:text-red-500 underline transition-colors flex-shrink-0"
                    >
                      Sign out
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-2">
                  <span className="text-[11px] sm:text-xs text-gray-400">{content.length}/2000</span>
                  <motion.button
                    type="submit"
                    disabled={!content.trim() || submitting}
                    whileHover={{ scale: content.trim() ? 1.05 : 1 }}
                    whileTap={{ scale: content.trim() ? 0.95 : 1 }}
                    className="bg-[#1c1c84] text-white px-4 py-2 rounded-full text-[13px] sm:text-sm font-semibold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#151560] transition-colors"
                  >
                    <FiSend size={13} />
                    {submitting ? 'Posting...' : 'Post'}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 sm:mb-8 text-center py-5 sm:py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 mx-0">
          <p className="text-[13px] sm:text-sm text-gray-500 mb-3">Sign in to join the conversation</p>
          <motion.button
            onClick={() => signIn('google')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-[#1c1c84] active:border-[#1c1c84] px-4 py-2.5 sm:px-5 rounded-full text-[13px] sm:text-sm font-semibold text-[#333333] transition-colors shadow-sm"
          >
            <FcGoogle size={18} />
            Sign in with Google
          </motion.button>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-3 sm:space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-2 sm:gap-3 animate-pulse">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-24" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <FiMessageCircle size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-400">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          <AnimatePresence>
            {comments.map(comment => (
              <CommentItem
                key={comment._id}
                comment={comment}
                onReply={handleReply}
                onDelete={handleDelete}
                blogUser={blogUser}
                googleUser={googleUser}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="cartoon-outline bg-white rounded-2xl p-5 sm:p-6 max-w-[280px] sm:max-w-xs w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-[15px] sm:text-base font-bold text-[#333333] mb-1.5">Delete Comment?</h3>
              <p className="text-gray-500 text-[13px] sm:text-sm mb-4 sm:mb-5">This will also delete any replies.</p>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 sm:py-2 rounded-full font-semibold text-[13px] sm:text-sm border-2 border-gray-200 hover:bg-gray-50 active:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 sm:py-2 rounded-full font-semibold text-[13px] sm:text-sm bg-red-500 text-white hover:bg-red-600 active:bg-red-600 transition-colors"
                >
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
