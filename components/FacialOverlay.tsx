'use client';

import { forwardRef, useEffect, useRef } from 'react';

interface FacialOverlayProps {
  imageSrc: string;
  className?: string;
}

const FacialOverlay = forwardRef<HTMLCanvasElement, FacialOverlayProps>(
  ({ imageSrc, className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const canvas = (ref as React.RefObject<HTMLCanvasElement>)?.current || canvasRef.current;
      if (!canvas || !imageSrc) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        // Limit canvas size for performance
        const maxSize = 600;
        let width = img.width;
        let height = img.height;
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        // No overlay - just the image
      };
      img.src = imageSrc;
    }, [imageSrc, ref]);

    return <canvas ref={ref || canvasRef} className={className} />;
  }
);

FacialOverlay.displayName = 'FacialOverlay';

export default FacialOverlay;
