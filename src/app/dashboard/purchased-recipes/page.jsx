"use client";
import React, { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { authFetch } from '../../../lib/auth-client';

export default function PurchasedRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredRecipes = useMemo(() => {
    if (!searchTerm.trim()) return recipes;
    const term = searchTerm.toLowerCase();
    return recipes.filter(r => 
      r.recipeName?.toLowerCase().includes(term) || 
      r.authorName?.toLowerCase().includes(term) ||
      r.category?.toLowerCase().includes(term)
    );
  }, [recipes, searchTerm]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 my-8">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">My Purchased Recipes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Access all premium recipes unlocked in your collection.</p>
        </div>

        {recipes.length > 0 && (
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search recipes or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* Loading Skeleton Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className="h-48 skeleton-shimmer" />
              <div className="p-5 flex-grow space-y-3">
                <div className="h-5 skeleton-shimmer rounded w-3/4" />
                <div className="h-4 skeleton-shimmer rounded w-1/2" />
                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-zinc-800">
                  <div className="h-9 skeleton-shimmer rounded-lg w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : recipes.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No purchased recipes yet</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto mb-6">Explore our curated collection of gourmet recipes from expert chefs worldwide.</p>
          <Link href="/browse-recipes" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition shadow-md shadow-indigo-500/10">
            Browse Premium Recipes
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      ) : filteredRecipes.length === 0 ? (
        /* No Search Match State */
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No recipes match &quot;{searchTerm}&quot;.</p>
          <button onClick={() => setSearchTerm('')} className="mt-3 text-xs text-indigo-600 hover:underline font-medium">Clear search filter</button>
        </div>
      ) : (
        /* Recipe Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <div key={recipe._id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover-lift flex flex-col group">
              <div className="h-48 bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
                <span className="absolute top-3 right-3 z-10 bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  Purchased
                </span>
                {recipe.recipeImage ? (
                  <img
                    src={recipe.recipeImage}
                    alt={recipe.recipeName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {recipe.recipeName}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">By {recipe.authorName || 'Chef'}</p>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-zinc-800/80">
                  <Link
                    href={`/recipe/${recipe._id}`}
                    className="flex items-center justify-center gap-1.5 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-semibold text-sm w-full py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition"
                  >
                    View Full Recipe
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

