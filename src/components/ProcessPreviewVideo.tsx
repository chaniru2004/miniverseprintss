'use client';

import { useEffect, useRef, useState } from 'react';

interface ProcessPreviewVideoProps {
  src: string;
  className?: string;
}

/**
 * Lazy-loads and plays the process preview video only when scrolled near/into view
 * so the initial homepage payload does not eagerly download the MP4.
 */
export default function ProcessPreviewVideo({
  src,
  className = 'w-full h-full object-cover',
}: ProcessPreviewVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          setShouldLoad(true);
          video.play().catch(() => {
            // Autoplay may be blocked by browser policy; muted playsInline usually succeeds.
          });
        } else {
          video.pause();
        }
      },
      { rootMargin: '200px 0px', threshold: 0.05 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (shouldLoad && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [shouldLoad]);

  return (
    <video
      ref={videoRef}
      loop
      muted
      playsInline
      preload={shouldLoad ? 'metadata' : 'none'}
      className={className}
    >
      {shouldLoad ? <source src={src} type="video/mp4" /> : null}
    </video>
  );
}
