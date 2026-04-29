'use client';

import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    const threshold = 50;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      
      setIsAtTop(scrollY < 10);

      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      if (direction !== scrollDirection && (Math.abs(scrollY - lastScrollY) > threshold || scrollY === 0)) {
        setScrollDirection(direction);
      }
      
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDirection);
    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
    };
  }, [scrollDirection]);

  return { scrollDirection, isAtTop };
}
