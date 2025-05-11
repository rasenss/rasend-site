"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the QuotesCarousel with no SSR to prevent hydration issues
const QuotesCarousel = dynamic(() => import('@/components/QuotesCarousel'), {
  ssr: false,
  loading: () => <div className="h-24 flex items-center justify-center text-blue-400 opacity-60">Loading quotes...</div>
});

const QuotesCarouselWrapper = () => {
  return <QuotesCarousel />;
};

export default QuotesCarouselWrapper;
