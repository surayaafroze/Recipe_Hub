"use client";
import React, { useState } from 'react';

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);

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
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        alert(data.error || 'Failed to initialize checkout');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Welcome to your RecipeHub dashboard.</p>
      
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Upgrade to Premium</h2>
          <p className="mb-4 text-blue-100">Unlock unlimited recipe creations and exclusive features!</p>
        </div>
        <button 
          onClick={handleUpgrade} 
          disabled={loading}
          className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition shadow-md disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Upgrade Now'}
        </button>
      </div>
    </div>
  );
}
