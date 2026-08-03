"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-12 text-center">
      <div className="max-w-md w-full glass-card bg-white/80 dark:bg-zinc-900/80 rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-200/60 dark:border-zinc-800 hover-lift">
        <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Something went wrong</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
          An unexpected error occurred while loading this page. Don&apos;t worry, you can try refreshing.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-500/20 text-sm"
          >
            Try Again
          </button>
          <Link 
            href="/"
            className="flex-1 py-3 px-5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition text-sm"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

