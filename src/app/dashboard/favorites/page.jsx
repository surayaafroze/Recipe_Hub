"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/favorites', {
        headers: { 'Authorization': `Bearer ${fetchToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch (err) {
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (recipeId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/favorites/${recipeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${fetchToken()}` }
      });
      if (res.ok) {
        toast.success('Removed from favorites');
        setFavorites(favorites.filter(fav => fav._id !== recipeId));
      } else {
        toast.error('Failed to remove favorite');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  if (loading) return <div className="p-8">Loading favorites...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 my-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Favorites</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
          <p className="text-gray-500 mb-4">You have no favorite recipes yet.</p>
          <Link href="/browse-recipes" className="text-indigo-600 font-medium hover:underline">Explore recipes</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(recipe => (
            <div key={recipe._id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="h-48 bg-gray-200">
                {recipe.recipeImage && <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-full h-full object-cover" />}
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="font-bold text-lg mb-1">{recipe.recipeName}</h3>
                <p className="text-sm text-gray-500 mb-4">By {recipe.authorName}</p>
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100 dark:border-zinc-800">
                  <Link href={`/recipe/${recipe._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">View Details</Link>
                  <button onClick={() => handleRemove(recipe._id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
