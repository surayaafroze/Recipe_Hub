import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <div className="text-9xl font-extrabold text-gray-200 dark:text-zinc-800 mb-8">
        404
      </div>
      <div className="mb-8">
        <span className="text-6xl mb-4 block">🍳</span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Oops! We burnt the toast.
      </h1>
      <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
        The page or recipe you are looking for doesn't exist or has been moved to a different kitchen.
      </p>
      <Link 
        href="/" 
        className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-md"
      >
        Back to Home
      </Link>
    </div>
  );
}
