"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession } from '@/lib/auth-client';

export default function HomePage() {
  const { data: session } = useSession();
  const [featured, setFeatured] = useState([]);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/recipes/featured`)
      .then(res => res.json())
      .then(data => setFeatured(data))
      .catch(() => {});
      
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/recipes/popular`)
      .then(res => res.json())
      .then(data => setPopular(data))
      .catch(() => {});
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      {/* Banner Section */}
      <section className="relative w-full overflow-hidden bg-black min-h-[85vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Culinary background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent md:to-black/40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div variants={fadeIn} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-md">
              <span className="text-indigo-300 font-semibold text-sm tracking-wide uppercase">Your Culinary Journey Starts Here</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Discover, Share & <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Savor Every Bite
              </span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
              RecipeHub is your ultimate destination to explore thousands of mouth-watering recipes, share your own creations, and connect with a global community of food lovers.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link href="/browse-recipes" className="inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-black transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transform hover:-translate-y-1">
                Explore Recipes
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-bold text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all transform hover:-translate-y-1">
                Join Community
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Recipes (Dynamic Section 1) */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Recipes</h2>
          <p className="text-gray-500 mt-2">Hand-picked by our culinary experts</p>
        </motion.div>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featured.map(recipe => (
            <motion.div key={recipe._id} variants={fadeIn} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden group hover:shadow-xl transition">
              <div className="h-56 relative overflow-hidden bg-gray-200">
                {recipe.recipeImage && <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{recipe.recipeName}</h3>
                <p className="text-gray-500 text-sm mb-4">{recipe.category} • {recipe.cuisineType} • {recipe.preparationTime}</p>
                <Link href={`/recipe/${recipe._id}`} className="text-indigo-600 font-medium hover:underline">View Recipe &rarr;</Link>
              </div>
            </motion.div>
          ))}
          {featured.length === 0 && <p className="col-span-full text-center text-gray-500">No featured recipes yet.</p>}
        </motion.div>
      </section>

      {/* Static Section 1: How it Works */}
      <section className="py-20 bg-gray-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How RecipeHub Works</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="p-6">
              <div className="w-16 h-16 mx-auto bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">Discover</h3>
              <p className="text-gray-500">Find thousands of recipes filtered by category, cuisine, or diet.</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="p-6">
              <div className="w-16 h-16 mx-auto bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-2xl mb-4">❤️</div>
              <h3 className="text-xl font-bold mb-2">Save & Like</h3>
              <p className="text-gray-500">Create your own personal cookbook by saving your favorite finds.</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="p-6">
              <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mb-4">👨‍🍳</div>
              <h3 className="text-xl font-bold mb-2">Share</h3>
              <p className="text-gray-500">Upload your own recipes and build your culinary following.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Recipes (Dynamic Section 2) */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Popular Recipes</h2>
            <p className="text-gray-500 mt-2">Most loved by our community</p>
          </div>
          <Link href="/browse-recipes" className="hidden sm:block text-indigo-600 font-medium hover:underline">View All</Link>
        </motion.div>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {popular.map(recipe => (
            <motion.div key={recipe._id} variants={fadeIn} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-4 hover:shadow-md transition">
              <div className="h-40 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                {recipe.recipeImage && <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-full h-full object-cover" />}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white truncate mb-1">{recipe.recipeName}</h3>
              <p className="text-sm text-gray-500 mb-3 truncate">By {recipe.authorName}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-red-500 font-medium flex items-center gap-1">❤️ {recipe.likesCount || 0}</span>
                <Link href={`/recipe/${recipe._id}`} className="text-indigo-600 hover:underline">View</Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Static Section 2: Premium CTA or Admin Dashboard */}
      {session?.user?.role === 'admin' ? (
        <section className="py-24 bg-gradient-to-br from-indigo-900 to-black text-white text-center px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">System Administration</h2>
            <p className="text-indigo-200 text-lg mb-10">Welcome back, Admin. Access your management dashboard to oversee users, monitor platform activity, and manage recipes and reports.</p>
            <Link href="/dashboard/admin" className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition shadow-xl border border-indigo-500">
              Go to Admin Dashboard
            </Link>
          </motion.div>
        </section>
      ) : (
        <section className="py-24 bg-gradient-to-br from-gray-900 to-black text-white text-center px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Unlock Unlimited Possibilities</h2>
            <p className="text-gray-400 text-lg mb-10">Normal users can only upload up to 2 recipes. Upgrade to Premium to share unlimited recipes, get a premium badge, and access exclusive content.</p>
            {session?.user?.isPremium || session?.user?.plan === 'premium' ? (
              <div className="inline-block bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 px-8 py-4 rounded-full font-bold text-lg shadow-xl">
                ⭐ You are a Premium Member
              </div>
            ) : (
              <Link href="/dashboard" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-indigo-600 hover:to-purple-700 transition shadow-xl">
                Upgrade to Premium Now
              </Link>
            )}
          </motion.div>
        </section>
      )}
    </div>
  );
}
