"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ReportModal from '../../../components/modals/ReportModal';
import { useSession, authFetch } from '../../../lib/auth-client';
import Link from 'next/link';

export default function RecipeDetailsPage() {
  const params = useParams();
  const recipeId = params.id;
  const router = useRouter();
  const { data: session } = useSession();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [likingInProgress, setLikingInProgress] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    if (recipeId) fetchRecipe();
  }, [recipeId]);

  const fetchRecipe = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/recipes/${recipeId}`);
      if (res.ok) {
        const data = await res.json();
        setRecipe(data);

        // Check if the current user has liked this recipe
        if (session?.user?.id && data.likedBy) {
          setIsLiked(data.likedBy.includes(session.user.id));
        }
      } else {
        toast.error('Recipe not found');
      }
    } catch (err) {
      toast.error('Network error loading recipe');
    } finally {
      setLoading(false);
    }
  };

  // Check favorite + purchase status once session is available
  useEffect(() => {
    if (session?.user && recipeId) {
      checkFavoriteStatus();
      checkPurchaseStatus();
    }
  }, [session, recipeId]);

  const checkFavoriteStatus = async () => {
    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/favorites`);
      if (res.ok) {
        const favs = await res.json();
        setIsFavorited(favs.some(f => f._id?.toString() === recipeId || f.recipeId === recipeId));
      }
    } catch {}
  };

  const checkPurchaseStatus = async () => {
    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/recipes/purchased`);
      if (res.ok) {
        const purchased = await res.json();
        setIsPurchased(purchased.some(r => r._id?.toString() === recipeId));
      }
    } catch {}
  };

  const requireLogin = (action) => {
    if (!session?.user) {
      toast.error('Please login to ' + action);
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return false;
    }
    return true;
  };

  const handleLike = async () => {
    if (!requireLogin('like recipes')) return;
    if (likingInProgress) return;
    setLikingInProgress(true);
    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/recipes/${recipeId}/like`, {
        method: 'PATCH',
      });
      if (res.ok) {
        const data = await res.json();
        setIsLiked(data.liked);
        setRecipe(prev => ({
          ...prev,
          likesCount: data.liked ? (prev.likesCount || 0) + 1 : Math.max(0, (prev.likesCount || 0) - 1)
        }));
        toast.success(data.liked ? 'Recipe liked!' : 'Like removed');
      } else {
        toast.error('Failed to toggle like');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLikingInProgress(false);
    }
  };

  const handleFavorite = async () => {
    if (!requireLogin('favorite recipes')) return;
    try {
      if (isFavorited) {
        const res = await authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/favorites/${recipeId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setIsFavorited(false);
          toast.success('Removed from favorites');
        }
      } else {
        const res = await authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipeId }),
        });
        if (res.ok) {
          setIsFavorited(true);
          toast.success('Added to favorites!');
        } else {
          const err = await res.json();
          toast.error(err.error || 'Failed to add to favorites');
        }
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const handlePurchase = async () => {
    if (!requireLogin('purchase recipes')) return;
    setPurchasing(true);
    const toastId = toast.loading('Initializing checkout...');
    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments/purchase-recipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId }),
      });
      const data = await res.json();
      if (data.url) {
        toast.success('Redirecting to secure Stripe payment...', { id: toastId });
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Checkout initialization failed', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error during checkout', { id: toastId });
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recipe not found</p>
          <Link href="/browse-recipes" className="text-indigo-600 hover:underline">Browse all recipes</Link>
        </div>
      </div>
    );
  }

  const isOwner = session?.user && (recipe.authorEmail === session.user.email || recipe.authorId === session.user.id);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 my-8 bg-white dark:bg-zinc-900 shadow-xl rounded-2xl border border-gray-100 dark:border-zinc-800">
      {recipe.recipeImage && (
        <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-full h-72 sm:h-80 object-cover rounded-xl mb-8" />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{recipe.recipeName}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            By <span className="font-medium text-gray-700 dark:text-gray-300">{recipe.authorName}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleLike}
            disabled={likingInProgress}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
              isLiked
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
            }`}
          >
            ❤️ <span>{recipe.likesCount || 0}</span>
          </button>

          <button
            onClick={handleFavorite}
            className={`px-4 py-2 rounded-lg transition font-medium ${
              isFavorited
                ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
            }`}
          >
            ⭐ {isFavorited ? 'Favorited' : 'Favorite'}
          </button>

          {!isOwner && (
            <button
              onClick={() => {
                if (!session?.user) { toast.error('Please login to report'); return; }
                setIsReportModalOpen(true);
              }}
              className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition font-medium"
            >
              🚩 Report
            </button>
          )}
        </div>
      </div>

      {/* Recipe Meta Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-xl">
        <div>
          <h4 className="text-xs text-gray-500 uppercase tracking-wide mb-1">Category</h4>
          <p className="font-semibold text-gray-900 dark:text-white">{recipe.category || 'N/A'}</p>
        </div>
        <div>
          <h4 className="text-xs text-gray-500 uppercase tracking-wide mb-1">Cuisine</h4>
          <p className="font-semibold text-gray-900 dark:text-white">{recipe.cuisineType || 'N/A'}</p>
        </div>
        <div>
          <h4 className="text-xs text-gray-500 uppercase tracking-wide mb-1">Difficulty</h4>
          <p className="font-semibold text-gray-900 dark:text-white">{recipe.difficultyLevel || 'N/A'}</p>
        </div>
        <div>
          <h4 className="text-xs text-gray-500 uppercase tracking-wide mb-1">Prep Time</h4>
          <p className="font-semibold text-gray-900 dark:text-white">{recipe.preparationTime || 'N/A'}</p>
        </div>
      </div>

      {/* Ingredients */}
      <div className="mb-8 border-t border-gray-200 dark:border-zinc-800 pt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Ingredients</h2>
        <div className="text-gray-700 dark:text-gray-300 space-y-1">
          {(recipe.ingredients || 'No ingredients provided.')
            .split('\n')
            .filter(line => line.trim())
            .map((line, i) => (
              <p key={i} className="text-sm leading-relaxed">{line.trim()}</p>
            ))
          }
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-8 border-t border-gray-200 dark:border-zinc-800 pt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Instructions</h2>
        <div className="text-gray-700 dark:text-gray-300 space-y-2">
          {(recipe.instructions || 'No instructions provided.')
            .split('\n')
            .filter(line => line.trim())
            .map((line, i) => (
              <p key={i} className="text-sm leading-relaxed">{line.trim()}</p>
            ))
          }
        </div>
      </div>

      {/* Purchase CTA — hidden for own recipe or already purchased */}
      {!isOwner && (
        isPurchased ? (
          <div className="mt-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-8 text-center text-white shadow-lg">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">You Own This Recipe! 🎉</h3>
            <p className="text-green-100">This recipe has been added to your purchased collection.</p>
            <Link href="/dashboard/purchased-recipes" className="inline-block mt-4 bg-white text-green-700 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition shadow-md">
              View My Purchased Recipes
            </Link>
          </div>
        ) : (
          <div className="mt-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 text-center text-white shadow-lg">
            <h3 className="text-2xl font-bold mb-2">Want to own this recipe forever?</h3>
            <p className="mb-6 text-blue-100">Purchase this recipe for just $5.00 to save it permanently to your dashboard.</p>
            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition shadow-md disabled:opacity-50"
            >
              {purchasing ? 'Processing...' : '💳 Purchase Recipe — $5.00'}
            </button>
          </div>
        )
      )}

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        recipeId={recipe._id}
        recipeName={recipe.recipeName}
      />
    </div>
  );
}
