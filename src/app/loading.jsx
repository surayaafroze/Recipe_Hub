export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-zinc-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
        {/* Inner static element (optional, could be an icon) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">Loading delicious recipes...</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Just a moment while we fetch the best flavors.</p>
    </div>
  );
}
