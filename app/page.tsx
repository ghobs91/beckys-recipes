'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import with ssr: false to avoid hydration issues
const RecipeCollections = dynamic(() => import('../components/RecipeCollections'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  ),
});

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Becky's Meal Prep Collection</h1>
        {mounted ? <RecipeCollections /> : (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </main>
  );
}
