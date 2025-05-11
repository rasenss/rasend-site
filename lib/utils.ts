// Simple utility function for conditionally joining classNames
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

import { useState, useEffect } from 'react';

// Standard Tailwind breakpoints (in pixels)
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

type Breakpoint = keyof typeof breakpoints;

/**
 * A custom hook that returns boolean values for each Tailwind CSS breakpoint
 * to help with responsive design.
 *
 * @returns Object with boolean values for each breakpoint
 * @example
 * const { isSm, isMd, isLg, isXl, is2Xl } = useBreakpoint();
 * // isSm: true if the screen width is at least 640px
 * // isMd: true if the screen width is at least 768px
 * // etc.
 */
export function useBreakpoint() {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create a result object with each breakpoint as a boolean
  const result: Record<`is${Capitalize<Breakpoint>}`, boolean> & Record<string, boolean> = {} as any;

  // Check each breakpoint
  Object.entries(breakpoints).forEach(([key, value]) => {
    result[`is${key.charAt(0).toUpperCase() + key.slice(1)}`] = windowWidth >= value;
  });

  return result;
}
