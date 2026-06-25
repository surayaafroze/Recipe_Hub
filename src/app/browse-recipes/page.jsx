"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BrowseRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage'];

  useEffect(() => {
    fetchRecipes();
  }, [page, categoryFilter]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/recipes?page=${page}&limit=9`;
      if (categoryFilter) {
        url += `&categories=${categoryFilter}`;
      }
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setRecipes(data.recipes);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Browse All Recipes</h1>
          <p className="text-gray-500">Discover new culinary inspirations.</p>
        </div>
        
        <div className="mt-4 md:mt-0 w-full md:w-64">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Category</label>
          <select 
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading recipes...</div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-gray-50 dark:bg-zinc-900/50 rounded-xl">
          No recipes found for the selected criteria.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {recipes.map(recipe => (
              <div key={recipe._id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                <div className="h-56 bg-gray-200 relative">
                  {recipe.isFeatured && <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-sm z-10">Featured</span>}
                  {recipe.recipeImage ? (
                    <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white line-clamp-1">{recipe.recipeName}</h3>
                  <p className="text-sm text-gray-500 mb-4">{recipe.category} • {recipe.cuisineType}</p>
                  
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <span className="text-red-500 text-sm font-medium">❤️ {recipe.likesCount || 0}</span>
                    <Link href={`/recipe/${recipe._id}`} className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
              >
                Previous
              </button>
              <span className="px-4 text-gray-500">Page {page} of {totalPages}</span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
