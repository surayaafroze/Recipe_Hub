"use client";
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import ReportModal from '../modals/ReportModal';

export default function RecipeCard({ recipe, onRemoveFavorite }) {
  const [isFavorited, setIsFavorited] = useState(recipe.isFavorited || false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const toggleFavorite = async () => {
    try {
      if (isFavorited) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/favorites/${recipe._id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (res.ok) {
          setIsFavorited(false);
          toast.success('Removed from favorites');
          if (onRemoveFavorite) onRemoveFavorite(recipe._id);
        } else {
          toast.error('Failed to remove favorite');
        }
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
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

      <div className="h-48 bg-gray-200 dark:bg-zinc-800 w-full object-cover relative">
        {recipe.isFeatured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded shadow-md z-10 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
            Featured
          </div>
        )}
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
