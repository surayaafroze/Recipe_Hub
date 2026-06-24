"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getValidToken } from '../../../lib/auth-client';

export default function AddRecipePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    recipeName: '',
    category: 'Lunch',
    cuisineType: 'American',
    difficultyLevel: 'Easy',
    preparationTime: '',
    ingredients: '',
    instructions: ''
  });

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage'];
  const cuisines = ['American', 'Italian', 'Indian', 'Mexican', 'Chinese', 'Mediterranean', 'Other'];
  const difficulties = ['Easy', 'Medium', 'Hard'];



  const uploadToImgbb = async (file) => {
    const data = new FormData();
    data.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_UPLOAD_API}`, {
      method: 'POST',
      body: data
    });
    const result = await res.json();
    return result.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let recipeImage = '';
      if (imageFile) {
        recipeImage = await uploadToImgbb(imageFile);
      }

      const payload = {
        ...formData,
        recipeImage
      };

      const token = await getValidToken();
      const res = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Recipe published successfully!');
        router.push('/dashboard/my-recipes');
      } else {
        toast.error(data.error || 'Failed to add recipe');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 my-8 bg-white dark:bg-zinc-900 shadow-xl rounded-2xl border border-gray-100 dark:border-zinc-800">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Add New Recipe</h1>
      <p className="text-gray-500 mb-8">Share your culinary creation with the world. Normal users can upload up to 2 recipes.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipe Name *</label>
            <input 
              type="text" required
              value={formData.recipeName}
              onChange={(e) => setFormData({...formData, recipeName: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipe Image (Optional)</label>
            <input 
              type="file" accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preparation Time *</label>
            <input 
              type="text" required placeholder="e.g. 45 mins"
              value={formData.preparationTime}
              onChange={(e) => setFormData({...formData, preparationTime: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white outline-none"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cuisine Type *</label>
            <select 
              value={formData.cuisineType}
              onChange={(e) => setFormData({...formData, cuisineType: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white outline-none"
            >
              {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty Level *</label>
            <select 
              value={formData.difficultyLevel}
              onChange={(e) => setFormData({...formData, difficultyLevel: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white outline-none"
            >
              {difficulties.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ingredients (HTML allowed) *</label>
          <textarea 
            required rows="4" placeholder="<ul><li>1 cup flour</li>...</ul>"
            value={formData.ingredients}
            onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instructions (HTML allowed) *</label>
          <textarea 
            required rows="6" placeholder="<ol><li>Preheat oven...</li>...</ol>"
            value={formData.instructions}
            onChange={(e) => setFormData({...formData, instructions: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
        >
          {loading ? 'Publishing...' : 'Publish Recipe'}
        </button>
      </form>
    </div>
  );
}
