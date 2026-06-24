"use client";
import React, { useEffect, useState } from 'react';
import RecipeCard from '@/components/cards/RecipeCard';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      const res = await fetch('http://localhost:5000/api/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch favorites. Ensure backend is running and you are logged in.');
      }
      const data = await res.json();
      setFavorites(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (recipeId) => {
    setFavorites(prev => prev.filter(recipe => recipe._id !== recipeId));
  };

  if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading favorites...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Favorite Recipes</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800">
          <p className="text-gray-500 dark:text-gray-400">You haven't added any recipes to your favorites yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(recipe => (
            <RecipeCard 
              key={recipe._id} 
              recipe={recipe} 
              onRemoveFavorite={handleRemoveFavorite} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
