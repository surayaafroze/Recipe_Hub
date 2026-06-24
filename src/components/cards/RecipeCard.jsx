"use client";
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import ReportModal from '../modals/ReportModal';

export default function RecipeCard({ recipe, onRemoveFavorite }) {
  const [isFavorited, setIsFavorited] = useState(recipe.isFavorited || false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const toggleFavorite = async () => {
    // Standard fetch, assuming token is managed by the app somehow
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    
    try {
      if (isFavorited) {
        const res = await fetch(`http://localhost:5000/api/favorites/${recipe._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          setIsFavorited(false);
          toast.success('Removed from favorites');
          if (onRemoveFavorite) onRemoveFavorite(recipe._id);
        } else {
          toast.error('Failed to remove favorite');
        }
      } else {
        const res = await fetch(`http://localhost:5000/api/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ recipeId: recipe._id })
        });
        if (res.ok) {
          setIsFavorited(true);
          toast.success('Added to favorites');
        } else {
          toast.error('Failed to add favorite');
        }
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-sm overflow-hidden flex flex-col relative">
      <button 
        onClick={toggleFavorite}
        className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-black/50 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill={isFavorited ? "red" : "none"} 
          viewBox="0 0 24 24" 
          strokeWidth="1.5" 
          stroke={isFavorited ? "red" : "currentColor"} 
          className="w-6 h-6 text-gray-700 dark:text-gray-300"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </button>

      <div className="h-48 bg-gray-200 dark:bg-zinc-800 w-full object-cover">
        {recipe.recipeImage ? (
          <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-full h-full object-cover" />
        ) : (
           <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{recipe.recipeName || 'Untitled Recipe'}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{recipe.category || 'Category'} • {recipe.cuisineType || 'Cuisine'}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">By {recipe.authorName || 'Unknown'}</p>
        
        <div className="mt-auto flex justify-between items-center text-sm font-medium">
           <span className="text-gray-500 dark:text-gray-400">Prep: {recipe.preparationTime || 'N/A'}</span>
           <div className="flex space-x-3 items-center">
             <button 
               onClick={() => setIsReportModalOpen(true)}
               className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
               title="Report this recipe"
             >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
               </svg>
               Report
             </button>
             <Link href={`/recipe/${recipe._id}`} className="text-blue-600 dark:text-blue-400 hover:underline">View Details</Link>
           </div>
        </div>
      </div>
      
      {/* Report Modal */}
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        recipeId={recipe._id} 
        recipeName={recipe.recipeName}
      />
    </div>
  );
}
