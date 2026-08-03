import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-12 text-center">
      <div className="max-w-md w-full glass-card bg-white/80 dark:bg-zinc-900/80 rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-200/60 dark:border-zinc-800 hover-lift">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <svg className="w-10 h-10 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <span className="text-sm font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">404 Error</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1 mb-3 tracking-tight">
          Recipe Not Found
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
          The dish or page you are looking for has been moved to a different kitchen or no longer exists.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-500/20 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home Page
        </Link>
      </div>
    </div>
  );
}

