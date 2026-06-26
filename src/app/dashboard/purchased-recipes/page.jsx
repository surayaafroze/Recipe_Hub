"use client";
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { authFetch } from '../../../lib/auth-client';

export default function PurchasedRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchasedRecipes();
  }, []);

  const fetchPurchasedRecipes = async () => {
    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/recipes/purchased`);
      if (res.ok) {
        const data = await res.json();
        setRecipes(data);
      }
    } catch (err) {
      toast.error('Failed to load purchased recipes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading purchased recipes...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 my-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Purchased Recipes</h1>

      {recipes.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
          <p className="text-gray-500 mb-4">You haven't purchased any recipes yet.</p>
          <Link href="/browse-recipes" className="text-indigo-600 font-medium hover:underline">Browse premium recipes</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <div key={recipe._id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="h-48 bg-gray-200 relative">
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">Purchased</span>
                {recipe.recipeImage && <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-full h-full object-cover" />}
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="font-bold text-lg mb-1">{recipe.recipeName}</h3>
                <p className="text-sm text-gray-500 mb-4">By {recipe.authorName}</p>
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800 text-center">
                  <Link href={`/recipe/${recipe._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium w-full block">View Full Recipe</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
