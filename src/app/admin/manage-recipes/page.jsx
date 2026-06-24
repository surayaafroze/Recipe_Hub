"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageRecipesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/admin?tab=recipes');
  }, [router]);

  return null;
}
