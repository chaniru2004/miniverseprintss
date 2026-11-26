'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

function Reviews() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      <div
        id="featurable-1f34bc2c-ea93-4d15-8c91-3510578a5ee6"
        data-featurable-async
      ></div>
      {shouldLoad ? (
        <Script
          src="https://cdn.featurable.com/widget/v2/embed.js"
          strategy="lazyOnload"
        />
      ) : null}
    </div>
  );
}

export default Reviews;