"use client";
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { authClient, useSession, authFetch } from '../../../lib/auth-client';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState({ name: '', email: '', image: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/profile`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const uploadToImgbb = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_UPLOAD_API}`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading('Updating profile...');
    try {
      let imageUrl = profile.image;
      if (imageFile) {
        toast.loading('Uploading profile image...', { id: toastId });
        imageUrl = await uploadToImgbb(imageFile);
      }

      toast.loading('Saving profile changes...', { id: toastId });
      const res = await authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profile.name, image: imageUrl })
      });

      if (res.ok) {
        // Sync changes with Better Auth so navbar reflects immediately
        await authClient.updateUser({ image: imageUrl, name: profile.name });
        toast.success('Profile updated successfully! 🎉', { id: toastId });
        setProfile(prev => ({ ...prev, image: imageUrl }));
        setImageFile(null);
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to update profile', { id: toastId });
      }
    } catch (err) {
      toast.error('Error updating profile', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 my-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4 border-2 border-indigo-500">
            {imageFile ? (
              <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
            ) : profile.image ? (
              <img
                src={profile.image}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-2xl">
                {profile.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm font-medium transition">
            Change Photo
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </label>
          {/* Premium / Admin Badge */}
          {(session?.user?.isPremium || session?.user?.plan === 'premium') && (
            <span className="mt-3 inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              ⭐ Premium Member
            </span>
          )}
          {session?.user?.role === 'admin' && (
            <span className="mt-3 inline-flex items-center gap-1 bg-red-500 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              🛡️ Admin
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-500 cursor-not-allowed outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
