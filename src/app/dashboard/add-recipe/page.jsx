"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useSession, authFetch } from '@/lib/auth-client';

export default function AddRecipePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [recipeLimit, setRecipeLimit] = useState({ canAdd: true, current: 0, limit: 2, isPremium: false });
  const [limitLoading, setLimitLoading] = useState(true);

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
  const cuisines = ['American', 'Italian', 'Indian', 'Mexican', 'Chinese', 'Mediterranean', 'Japanese', 'Thai', 'Other'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  // Fetch dashboard stats to check recipe limit
  useEffect(() => {
    const checkLimit = async () => {
      try {
        const res = await authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/dashboard-stats`);
        if (res.ok) {
          const data = await res.json();
          setRecipeLimit({
            canAdd: data.canAddMore !== false,
            current: data.totalRecipes || 0,
            limit: data.recipeLimit,
            isPremium: data.isPremium || false,
          });
        }
      } catch {}
      finally {
        setLimitLoading(false);
      }
    };
    checkLimit();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToImgbb = async (file) => {
    const data = new FormData();
    data.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_UPLOAD_API}`, {
      method: 'POST',
      body: data,
    });
    const result = await res.json();
    if (!result.data?.url) throw new Error('Image upload failed');
    return result.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recipeLimit.canAdd) {
      toast.error('Recipe limit reached. Please upgrade to Premium for unlimited recipes.');
      return;
    }

    if (!formData.recipeName.trim()) {
      toast.error('Recipe name is required');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Publishing recipe...');
    try {
      let recipeImage = '';
      if (imageFile) {
        toast.loading('Uploading recipe image...', { id: toastId });
        recipeImage = await uploadToImgbb(imageFile);
      }

      toast.loading('Saving recipe details...', { id: toastId });
      const res = await authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recipeImage }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Recipe published successfully! 🎉', { id: toastId });
        router.push('/dashboard/my-recipes');
      } else {
        toast.error(data.error || 'Failed to add recipe', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error. Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition";

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 my-8 bg-white dark:bg-zinc-900 shadow-xl rounded-2xl border border-gray-100 dark:border-zinc-800">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Add New Recipe</h1>
        <p className="text-gray-500 dark:text-gray-400">Share your culinary creation with the RecipeHub community.</p>
      </div>

      {/* Recipe Limit Banner */}
      {!limitLoading && session?.user?.role !== 'admin' && (
        !recipeLimit.isPremium && recipeLimit.limit !== null ? (
          <div className={`mb-6 p-4 rounded-xl border flex items-center justify-between gap-4 flex-wrap ${
            recipeLimit.canAdd
              ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
              : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
          }`}>
            <div>
              <p className={`font-semibold text-sm ${recipeLimit.canAdd ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'}`}>
                {recipeLimit.canAdd
                  ? `📋 Recipe Slot: ${recipeLimit.current} / ${recipeLimit.limit} used`
                  : `🚫 Recipe limit reached (${recipeLimit.current}/${recipeLimit.limit})`}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {recipeLimit.canAdd
                  ? 'Normal users can add up to 2 recipes. Upgrade to Premium for unlimited!'
                  : 'Upgrade to Premium to add unlimited recipes.'}
              </p>
            </div>
            {!recipeLimit.canAdd && (
              <Link href="/dashboard" className="shrink-0 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                Upgrade to Premium
              </Link>
            )}
          </div>
        ) : recipeLimit.isPremium ? (
          <div className="mb-6 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
            <p className="text-yellow-700 dark:text-yellow-300 font-semibold text-sm">⭐ Premium Member — Unlimited recipe creation enabled!</p>
          </div>
        ) : null
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recipe Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipe Name *</label>
          <input
            type="text"
            required
            value={formData.recipeName}
            onChange={(e) => setFormData({ ...formData, recipeName: e.target.value })}
            className={inputCls}
            placeholder="e.g. Spaghetti Carbonara"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipe Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-100 transition"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-3 w-full h-48 object-cover rounded-lg" />
          )}
        </div>

        {/* Category, Cuisine, Difficulty, Prep Time Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={inputCls}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cuisine Type *</label>
            <select value={formData.cuisineType} onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })} className={inputCls}>
              {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty Level *</label>
            <select value={formData.difficultyLevel} onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value })} className={inputCls}>
              {difficulties.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preparation Time *</label>
            <input
              type="text"
              required
              placeholder="e.g. 45 mins"
              value={formData.preparationTime}
              onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ingredients *</label>
          <textarea
            required
            rows={5}
            placeholder="List your ingredients, one per line or use HTML..."
            value={formData.ingredients}
            onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
            className={inputCls}
          />
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instructions *</label>
          <textarea
            required
            rows={7}
            placeholder="Step-by-step cooking instructions..."
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            className={inputCls}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !recipeLimit.canAdd}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Publishing...' : (!recipeLimit.canAdd ? 'Upgrade to Add More Recipes' : 'Publish Recipe 🚀')}
        </button>
      </form>
    </div>
  );
}
