"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const recipeId = params.id;

  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    recipeName: '',
    category: 'Lunch',
    cuisineType: 'American',
    difficultyLevel: 'Easy',
    preparationTime: '',
    ingredients: '',
    instructions: '',
    recipeImage: ''
  });

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage'];
  const cuisines = ['American', 'Italian', 'Indian', 'Mexican', 'Chinese', 'Mediterranean', 'Japanese', 'Thai', 'Other'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    if (recipeId) {
      fetchRecipeDetails();
    }
  }, [recipeId]);

  const fetchRecipeDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/recipes/${recipeId}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          recipeName: data.recipeName || '',
          category: data.category || 'Lunch',
          cuisineType: data.cuisineType || 'American',
          difficultyLevel: data.difficultyLevel || 'Easy',
          preparationTime: data.preparationTime || '',
          ingredients: data.ingredients || '',
          instructions: data.instructions || '',
          recipeImage: data.recipeImage || ''
        });
        if (data.recipeImage) {
          setImagePreview(data.recipeImage);
        }
      } else {
        toast.error('Recipe not found');
        router.push('/dashboard/my-recipes');
      }
    } catch (err) {
      toast.error('Failed to load recipe details');
    } finally {
      setFetching(false);
    }
  };

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

    if (!formData.recipeName.trim()) {
      toast.error('Recipe name is required');
      return;
    }

    setLoading(true);
    try {
      let finalRecipeImage = formData.recipeImage;
      if (imageFile) {
        toast.loading('Uploading new image...', { id: 'imgupload' });
        finalRecipeImage = await uploadToImgbb(imageFile);
        toast.dismiss('imgupload');
      }

      const res = await fetch(`http://localhost:5000/api/recipes/${recipeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...formData, recipeImage: finalRecipeImage }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Recipe updated successfully! 🎉');
        router.push('/dashboard/my-recipes');
      } else {
        toast.error(data.error || 'Failed to update recipe');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition";

  if (fetching) {
    return <div className="text-center py-20 text-gray-500">Loading recipe data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 my-8 bg-white dark:bg-zinc-900 shadow-xl rounded-2xl border border-gray-100 dark:border-zinc-800">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Edit Recipe</h1>
        <p className="text-gray-500 dark:text-gray-400">Make changes to your recipe details below.</p>
      </div>

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

        <div className="flex gap-4">
          <Link href="/dashboard/my-recipes" className="flex-1 text-center bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-700 transition">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
          >
            {loading ? 'Saving Changes...' : 'Save Changes 💾'}
          </button>
        </div>
      </form>
    </div>
  );
}
