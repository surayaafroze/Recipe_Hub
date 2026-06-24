"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('processing'); // processing, success, error

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const verifyPayment = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
        const res = await fetch('http://localhost:5000/api/payments/verify-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ sessionId })
        });

        const data = await res.json();
        if (res.ok && data.isPremium) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        setStatus('error');
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100 dark:border-zinc-800">
        {status === 'processing' && (
          <div>
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Verifying Payment...</h2>
            <p className="text-gray-500 dark:text-gray-400">Please wait while we confirm your premium status.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Payment Successful!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Welcome to Premium. You can now add unlimited recipes.</p>
            <Link href="/dashboard" className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition block">
              Go to Dashboard
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Payment Verification Failed</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">We couldn't verify your payment. If you were charged, please contact support.</p>
            <Link href="/dashboard" className="bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-lg hover:bg-gray-300 transition block">
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
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
