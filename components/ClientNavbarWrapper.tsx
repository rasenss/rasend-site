"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Navbar with no SSR to prevent hydration mismatch
const Navbar = dynamic(() => import('./Navbar'), {
  ssr: false,
  loading: () => <div className="h-16"></div> // Placeholder while loading
});

export default function ClientNavbarWrapper() {
  return (
    <Suspense fallback={<div className="h-16"></div>}>
      <Navbar />
    </Suspense>
  );
}