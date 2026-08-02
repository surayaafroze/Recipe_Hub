export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ambient ring */}
        <div className="w-20 h-20 rounded-full border-4 border-indigo-100 dark:border-zinc-800 border-t-indigo-600 dark:border-t-indigo-400 animate-spin"></div>
        {/* Center Chef Hat / Plate Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </div>
      <h2 className="mt-6 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Loading delicious recipes...</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center max-w-sm">Just a moment while we prepare fresh flavors for your kitchen.</p>
    </div>
  );
}

