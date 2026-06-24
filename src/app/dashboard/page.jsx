"use client";
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardStats from '../../components/dashboard/DashboardStats';
import { useSession } from '../../lib/auth-client';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalFavorites: 0,
    totalLikesReceived: 0,
    isPremium: false,
    role: 'user'
  });
  const [fetchingStats, setFetchingStats] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/dashboard-stats', {
        credentials: 'include',
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
    const toastId = toast.loading('Initializing premium upgrade...');
    try {
      const res = await fetch('http://localhost:5000/api/payments/create-checkout-session', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.url) {
        toast.success('Redirecting to secure Stripe payment...', { id: toastId });
        window.location.href = data.url; 
      } else {
        toast.error(data.error || 'Failed to initialize checkout', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error during checkout', { id: toastId });
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
        <DashboardStats stats={stats} />
      )}

      {!fetchingStats && !stats.isPremium && session?.user?.role !== 'admin' && (
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
