import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <div className="text-9xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">
        404
      </div>
      <div className="mb-8 w-64 h-64 mx-auto text-gray-300 dark:text-zinc-700">
        <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
        </svg>
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
