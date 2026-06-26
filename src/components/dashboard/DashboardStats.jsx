"use client";
import React from 'react';

export default function DashboardStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-4 hover:shadow-md transition">
        <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl">🍲</div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Total Recipes</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalRecipes}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-4 hover:shadow-md transition">
        <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-2xl">⭐</div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Total Favorites</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalFavorites}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-4 hover:shadow-md transition">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl">❤️</div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Likes Received</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalLikesReceived}</p>
        </div>
      </div>
    </div>
  );
}
