"use client";
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function ReportModal({ isOpen, onClose, recipeId, recipeName }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      toast.error('Please select a reason');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ recipeId, reason }),
      });
      
      if (res.ok) {
        toast.success('Report submitted successfully');
        onClose();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to submit report');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Report Recipe</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Why are you reporting <strong>{recipeName || 'this recipe'}</strong>?
          </p>
          
          <div className="space-y-3 mb-6">
            {['Spam', 'Offensive Content', 'Copyright Issue'].map((opt) => (
              <label key={opt} className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="reason" 
                  value={opt} 
                  checked={reason === opt}
                  onChange={(e) => setReason(e.target.value)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700"
                />
                <span className="text-gray-700 dark:text-gray-300">{opt}</span>
              </label>
            ))}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 transition"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
