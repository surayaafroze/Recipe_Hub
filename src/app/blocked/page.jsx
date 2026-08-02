import Link from 'next/link';

export const metadata = {
  title: 'Account Blocked | RecipeHub',
};

export default function BlockedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-200/80 dark:border-zinc-800 p-8 sm:p-10 hover-lift">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-red-50 dark:ring-red-950/30">
          <svg className="w-10 h-10 text-red-600 dark:text-red-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">Account Suspended</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
          Your RecipeHub account has been restricted by an administrator. If you believe this is an error or require assistance, please contact our support team.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition text-sm"
          >
            Go to Home
          </Link>
          <a
            href="mailto:support@recipehub.com"
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition text-sm shadow-lg shadow-indigo-500/20"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}

