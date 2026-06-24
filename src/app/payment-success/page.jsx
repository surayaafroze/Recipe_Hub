"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const type = searchParams.get('type') || 'premium';
  const recipeId = searchParams.get('recipeId') || null;
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/payments/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ sessionId, type, recipeId }),
        });

        if (res.ok) {
          setStatus('success');
          toast.success(type === 'recipe' 
            ? 'Recipe purchased successfully! 🎉' 
            : 'Premium membership activated! Welcome to Premium! ⭐'
          );
        } else {
          setStatus('error');
          toast.error('Payment verification failed.');
        }
      } catch {
        setStatus('error');
        toast.error('Network error verifying payment.');
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100 dark:border-zinc-800">

        {status === 'processing' && (
          <div>
            <div className="animate-spin w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Verifying Payment...</h2>
            <p className="text-gray-500 dark:text-gray-400">Please wait while we confirm your payment.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Payment Successful! 🎉</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              {type === 'recipe'
                ? 'Recipe purchased successfully! You can now access it from your dashboard.'
                : 'Welcome to RecipeHub Premium! You can now add unlimited recipes and show off your premium badge.'}
            </p>
            <Link
              href={type === 'recipe' ? '/dashboard/purchased-recipes' : '/dashboard'}
              className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-indigo-700 transition block"
            >
              {type === 'recipe' ? 'View Purchased Recipes' : 'Go to Dashboard'}
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Verification Failed</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              We couldn't verify your payment. If you were charged, please contact support.
            </p>
            <Link href="/dashboard" className="bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 font-medium py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-600 transition block">
              Return to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
