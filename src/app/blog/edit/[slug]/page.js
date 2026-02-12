'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import BlogNavbar from '../../components/BlogNavbar';
import RichTextEditor from '../../components/RichTextEditor';
import { FiSave, FiImage, FiTag, FiX, FiSend, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function EditPostPage() {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef(null);
  const { slug } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.post.title);
          setExcerpt(data.post.excerpt);
          setContent(data.post.content);
          setCoverImage(data.post.coverImage || '');
          setTags(data.post.tags || []);
        } else {
          router.push('/blog');
        }
      } catch {
        router.push('/blog');
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug, router]);

  const handleCoverUpload = async (file) => {
    if (!file) return;
    setCoverUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/blog/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) setCoverImage(data.url);
    } catch (error) {
      console.error('Cover upload failed:', error);
    }
    setCoverUploading(false);
  };

  const addTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !tags.includes(tag) && tags.length < 5) {
        setTags([...tags, tag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async () => {
    setError('');
    if (!title.trim()) { setError('Title is required'); return; }
    if (!excerpt.trim()) { setError('Excerpt is required'); return; }
    if (!content.trim() || content === '<p></p>') { setError('Content is required'); return; }

    setSaving(true);
    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          excerpt: excerpt.trim(),
          content,
          coverImage,
          tags,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update post');
        setSaving(false);
        return;
      }

      router.push(`/blog/${data.post.slug}`);
    } catch {
      setError('Something went wrong. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <BlogNavbar />
        <div className="pt-28 max-w-3xl mx-auto px-4">
          <div className="space-y-6 animate-pulse">
            <div className="h-10 bg-gray-200 rounded-2xl w-1/3" />
            <div className="cartoon-outline bg-white rounded-2xl p-6 h-48" />
            <div className="cartoon-outline bg-white rounded-2xl p-6 h-20" />
            <div className="cartoon-outline bg-white rounded-2xl p-6 h-40" />
          </div>
        </div>
      </div>
    );
  }

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
            <Link href={`/blog/${slug}`}>
              <motion.div whileHover={{ x: -4 }} className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1c1c84] font-semibold text-sm transition-colors mb-4">
                <FiArrowLeft size={16} /> Back to Post
              </motion.div>
            </Link>
            <h1 className="text-3xl font-bold text-[#333333]">Edit Post</h1>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3 mb-6"
            >
              <FiAlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
            {/* Cover Image */}
            <div className="cartoon-outline bg-white rounded-2xl p-6">
              <label className="text-sm font-semibold text-[#333333] flex items-center gap-2 mb-3">
                <FiImage size={14} /> Cover Image
              </label>
              {coverImage ? (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={coverImage} alt="Cover" className="w-full h-48 object-cover" />
                  <button onClick={() => setCoverImage('')} className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors">
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <button onClick={() => coverInputRef.current?.click()} disabled={coverUploading} className="w-full h-48 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#1c1c84] flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#1c1c84] transition-colors">
                  {coverUploading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-3 border-[#1c1c84] border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <FiImage size={32} />
                      <span className="text-sm font-medium">Click to upload cover image</span>
                    </>
                  )}
                </button>
              )}
              <input ref={coverInputRef} type="file" accept="image/*" onChange={(e) => handleCoverUpload(e.target.files?.[0])} className="hidden" />
            </div>

            {/* Title */}
            <div className="cartoon-outline bg-white rounded-2xl p-6">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title..." className="w-full text-3xl font-bold text-[#333333] placeholder:text-gray-300 outline-none border-none bg-transparent" maxLength={200} />
              <div className="text-xs text-gray-400 mt-2">{title.length}/200</div>
            </div>

            {/* Excerpt */}
            <div className="cartoon-outline bg-white rounded-2xl p-6">
              <label className="text-sm font-semibold text-[#333333] mb-2 block">Excerpt</label>
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="A brief summary..." rows={3} className="w-full text-gray-600 placeholder:text-gray-300 outline-none border-none bg-transparent resize-none leading-relaxed" maxLength={300} />
              <div className="text-xs text-gray-400 mt-1">{excerpt.length}/300</div>
            </div>

            {/* Tags */}
            <div className="cartoon-outline bg-white rounded-2xl p-6">
              <label className="text-sm font-semibold text-[#333333] flex items-center gap-2 mb-3">
                <FiTag size={14} /> Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c1c84]/10 text-[#1c1c84] text-sm font-semibold border border-[#1c1c84]/20">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors"><FiX size={14} /></button>
                  </span>
                ))}
              </div>
              {tags.length < 5 && (
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="Add a tag..." className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#1c1c84] outline-none transition-colors text-sm font-medium placeholder:text-gray-400" />
              )}
            </div>

            {/* Content Editor */}
            <div className="cartoon-outline bg-white rounded-2xl p-6">
              <label className="text-sm font-semibold text-[#333333] mb-3 block">Content</label>
              <RichTextEditor content={content} onChange={setContent} />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <motion.button
                onClick={handleSave}
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cartoon-outline bg-[#1c1c84] text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-[#151560] transition-colors disabled:opacity-50 flex-1 sm:flex-initial"
              >
                <FiSave size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
