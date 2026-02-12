'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import BlogNavbar from '../components/BlogNavbar';
import { FiUser, FiCamera, FiSave, FiAlertCircle, FiCheck, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function ProfilePageClient() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login?redirect=/blog/profile');
          return;
        }
        const data = await res.json();
        setUser(data.user);

        // Fetch full profile
        const profileRes = await fetch(`/api/profile/${data.user.username}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setDisplayName(profileData.user.displayName || '');
          setBio(profileData.user.bio || '');
          setProfilePicture(profileData.user.profilePicture || '');
        }
      } catch {
        router.push('/login');
      }
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/blog/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to upload image');
        setUploading(false);
        return;
      }
      if (data.url) {
        setProfilePicture(data.url);
        setSuccess('Image uploaded! Click Save Profile to apply.');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to upload image');
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/profile/${user.username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: displayName.trim(),
          profilePicture,
          bio: bio.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update profile');
        setSaving(false);
        return;
      }

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Something went wrong');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <BlogNavbar />
        <div className="pt-28 max-w-2xl mx-auto px-4">
          <div className="space-y-6 animate-pulse">
            <div className="h-10 bg-gray-200 rounded-2xl w-1/3" />
            <div className="cartoon-outline bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
              <div className="w-28 h-28 rounded-full bg-gray-200" />
              <div className="h-6 bg-gray-200 rounded-xl w-40" />
              <div className="h-20 bg-gray-200 rounded-xl w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <BlogNavbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
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
            <h1 className="text-3xl font-bold text-[#333333]">Edit Profile</h1>
            <p className="text-gray-500 mt-1">Customize how you appear on the blog</p>
          </motion.div>

          {/* Messages */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3 mb-6">
              <FiAlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3 mb-6">
              <FiCheck className="text-green-500 flex-shrink-0" size={20} />
              <p className="text-green-600 text-sm font-medium">{success}</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Profile Picture */}
            <div className="cartoon-outline bg-white rounded-2xl p-8">
              <label className="text-sm font-semibold text-[#333333] mb-4 block">Profile Picture</label>
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-full overflow-hidden cartoon-outline bg-gray-100 flex items-center justify-center">
                    {profilePicture ? (
                      <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <FiUser size={40} className="text-gray-300" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 cartoon-outline bg-[#1c1c84] text-white p-2.5 rounded-full hover:bg-[#151560] transition-colors"
                  >
                    {uploading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <FiCamera size={16} />
                    )}
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAvatarUpload(e.target.files?.[0])}
                  className="hidden"
                />
                <p className="text-xs text-gray-400">Click the camera icon to upload a new photo</p>
                {profilePicture && (
                  <button
                    onClick={() => setProfilePicture('')}
                    className="text-sm text-red-500 hover:text-red-600 font-semibold"
                  >
                    Remove picture
                  </button>
                )}
              </div>
            </div>

            {/* Display Name */}
            <div className="cartoon-outline bg-white rounded-2xl p-6">
              <label className="text-sm font-semibold text-[#333333] mb-2 block">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                className="w-full text-xl font-bold text-[#333333] placeholder:text-gray-300 outline-none border-2 border-gray-200 focus:border-[#1c1c84] rounded-xl px-4 py-3 transition-colors bg-gray-50 focus:bg-white"
                maxLength={50}
              />
              <div className="text-xs text-gray-400 mt-2">{displayName.length}/50</div>
            </div>

            {/* Bio */}
            <div className="cartoon-outline bg-white rounded-2xl p-6">
              <label className="text-sm font-semibold text-[#333333] mb-2 block">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell readers a bit about yourself..."
                rows={4}
                className="w-full text-gray-600 placeholder:text-gray-300 outline-none border-2 border-gray-200 focus:border-[#1c1c84] rounded-xl px-4 py-3 transition-colors bg-gray-50 focus:bg-white resize-none leading-relaxed"
                maxLength={300}
              />
              <div className="text-xs text-gray-400 mt-1">{bio.length}/300</div>
            </div>

            {/* Username (read only) */}
            <div className="cartoon-outline bg-white rounded-2xl p-6">
              <label className="text-sm font-semibold text-[#333333] mb-2 block">Username</label>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-lg font-mono">@{user?.username}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Cannot be changed</span>
              </div>
            </div>

            {/* Save Button */}
            <motion.button
              onClick={handleSave}
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full cartoon-outline bg-[#1c1c84] text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-[#151560] transition-colors disabled:opacity-50"
            >
              <FiSave size={18} />
              {saving ? 'Saving...' : 'Save Profile'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
