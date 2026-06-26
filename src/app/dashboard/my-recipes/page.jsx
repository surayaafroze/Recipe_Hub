"use client";
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/recipes/my-recipes`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setRecipes(data);
      }
    } catch (err) {
      toast.error('Failed to load your recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    const toastId = toast.loading('Deleting recipe...');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/recipes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Recipe deleted successfully! 🗑️', { id: toastId });
        setRecipes(recipes.filter(r => r._id !== id));
      } else {
        toast.error('Failed to delete recipe', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error', { id: toastId });
    }
  };

  if (loading) return <div className="p-8">Loading recipes...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 my-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Recipes</h1>
        <Link href="/dashboard/add-recipe" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          + Add New Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
          <p className="text-gray-500 mb-4">You haven't created any recipes yet.</p>
          <Link href="/dashboard/add-recipe" className="text-indigo-600 font-medium hover:underline">Start cooking!</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <div key={recipe._id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="h-48 bg-gray-200">
                {recipe.recipeImage && <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-full h-full object-cover" />}
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="font-bold text-lg mb-1">{recipe.recipeName}</h3>
                <p className="text-sm text-gray-500 mb-4">{recipe.category} • ❤️ {recipe.likesCount || 0}</p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800 gap-2">
                  <Link href={`/recipe/${recipe._id}`} className="text-indigo-600 hover:underline text-sm font-semibold">View</Link>
                  <div className="flex gap-3">
                    <Link href={`/dashboard/edit-recipe/${recipe._id}`} className="text-amber-600 hover:underline text-sm font-semibold">Edit</Link>
                    <button onClick={() => handleDelete(recipe._id)} className="text-red-600 hover:text-red-800 text-sm font-semibold">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
