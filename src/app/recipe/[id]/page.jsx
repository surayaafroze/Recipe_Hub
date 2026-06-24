"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import ReportModal from '../../../components/modals/ReportModal';

export default function RecipeDetailsPage() {
  const params = useParams();
  const recipeId = params.id;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const fetchToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  useEffect(() => {
    if (recipeId) fetchRecipe();
  }, [recipeId]);

  const fetchRecipe = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/recipes/${recipeId}`);
      if (res.ok) {
        const data = await res.json();
        setRecipe(data);
        
        // Very basic checks for UI state (In reality, backend should return this or we fetch favorites)
        const token = fetchToken();
        if (token && data.likedBy) {
          // Parse JWT to check ID if we want, but since we don't have decoding here,
          // we assume state is fetched or toggled purely server-side.
        }
      } else {
        toast.error('Failed to load recipe');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    const token = fetchToken();
    if (!token) return toast.error('Please login to like recipes');
    
    try {
      const res = await fetch(`http://localhost:5000/api/recipes/${recipeId}/like`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIsLiked(data.liked);
        setRecipe(prev => ({
          ...prev,
          likesCount: data.liked ? prev.likesCount + 1 : prev.likesCount - 1
        }));
        toast.success(data.message);
      }
    } catch (err) {
      toast.error('Failed to like recipe');
    }
  };

  const handleFavorite = async () => {
    const token = fetchToken();
    if (!token) return toast.error('Please login to favorite recipes');
    
    try {
      if (isFavorited) {
        await fetch(`http://localhost:5000/api/favorites/${recipeId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setIsFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await fetch(`http://localhost:5000/api/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ recipeId })
        });
        setIsFavorited(true);
        toast.success('Added to favorites');
      }
    } catch (err) {
      toast.error('Failed to toggle favorite');
    }
  };

  const handlePurchase = async () => {
    const token = fetchToken();
    if (!token) return toast.error('Please login to purchase');
    
    setPurchasing(true);
    try {
      const res = await fetch(`http://localhost:5000/api/payments/purchase-recipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ recipeId })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Checkout failed');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return <div className="text-center p-12">Loading...</div>;
  if (!recipe) return <div className="text-center p-12 text-red-500">Recipe not found!</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 my-8 bg-white dark:bg-zinc-900 shadow-xl rounded-2xl border border-gray-100 dark:border-zinc-800">
      {recipe.recipeImage && (
        <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-full h-80 object-cover rounded-xl mb-8" />
      )}
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{recipe.recipeName}</h1>
          <p className="text-gray-500 dark:text-gray-400">By <span className="font-medium text-gray-700 dark:text-gray-300">{recipe.authorName}</span></p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleLike} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition">
            <span className={isLiked ? "text-red-500" : "text-gray-500"}>❤️</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{recipe.likesCount || 0}</span>
          </button>
          <button onClick={handleFavorite} className={`px-4 py-2 rounded-lg transition ${isFavorited ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'}`}>
            ⭐ {isFavorited ? 'Favorited' : 'Favorite'}
          </button>
          <button onClick={() => setIsReportModalOpen(true)} className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition">
            🚩 Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-xl">
        <div><h4 className="text-sm text-gray-500">Category</h4><p className="font-semibold">{recipe.category || 'N/A'}</p></div>
        <div><h4 className="text-sm text-gray-500">Cuisine</h4><p className="font-semibold">{recipe.cuisineType || 'N/A'}</p></div>
        <div><h4 className="text-sm text-gray-500">Difficulty</h4><p className="font-semibold">{recipe.difficultyLevel || 'N/A'}</p></div>
        <div><h4 className="text-sm text-gray-500">Prep Time</h4><p className="font-semibold">{recipe.preparationTime || 'N/A'}</p></div>
      </div>

      <div className="mb-8 border-t border-gray-200 dark:border-zinc-800 pt-8">
        <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
        <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: recipe.ingredients || '<p>No ingredients provided.</p>' }} />
      </div>

      <div className="mb-8 border-t border-gray-200 dark:border-zinc-800 pt-8">
        <h2 className="text-2xl font-bold mb-4">Instructions</h2>
        <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: recipe.instructions || '<p>No instructions provided.</p>' }} />
      </div>

      <div className="mt-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 text-center text-white shadow-lg">
        <h3 className="text-2xl font-bold mb-2">Want to own this recipe forever?</h3>
        <p className="mb-6 text-blue-100">Purchase this recipe for just $5.00 to save it to your dashboard.</p>
        <button 
          onClick={handlePurchase}
          disabled={purchasing}
          className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition shadow-md disabled:opacity-50"
        >
          {purchasing ? 'Processing...' : '💳 Purchase Recipe'}
        </button>
      </div>

      <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} recipeId={recipe._id} recipeName={recipe.recipeName} />
    </div>
  );
}
