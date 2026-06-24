"use client";
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalFavorites: 0,
    totalLikesReceived: 0,
    isPremium: false
  });
  const [fetchingStats, setFetchingStats] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const res = await fetch('http://localhost:5000/api/users/dashboard-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetchingStats(false);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const res = await fetch('http://localhost:5000/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; 
      } else {
        toast.error(data.error || 'Failed to initialize checkout');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            Dashboard
            {stats.isPremium && (
              <span className="bg-yellow-400 text-yellow-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Premium Member
              </span>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome to your RecipeHub overview.</p>
        </div>
      </div>
      
      {fetchingStats ? (
        <div className="text-center py-10">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl">🍲</div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Recipes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalRecipes}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-4">
            <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-2xl">⭐</div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Favorites</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalFavorites}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-4">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl">❤️</div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Likes Received</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalLikesReceived}</p>
            </div>
          </div>
        </div>
      )}

      {!stats.isPremium && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Upgrade to Premium</h2>
            <p className="mb-4 md:mb-0 text-blue-100">Unlock unlimited recipe creations and exclusive features for just $10.00!</p>
          </div>
          <button 
            onClick={handleUpgrade} 
            disabled={loading}
            className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition shadow-md disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Processing...' : '💳 Upgrade Now'}
          </button>
        </div>
      )}
    </div>
  );
}
