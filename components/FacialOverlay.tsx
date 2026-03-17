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

        // Draw RED biometric overlay lines
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;

        // Eye alignment line (horizontal across eyes)
        const eyeY = height * 0.42;
        ctx.beginPath();
        ctx.moveTo(width * 0.2, eyeY);
        ctx.lineTo(width * 0.8, eyeY);
        ctx.stroke();

        // Jaw width line
        const jawY = height * 0.78;
        ctx.beginPath();
        ctx.moveTo(width * 0.2, jawY);
        ctx.lineTo(width * 0.8, jawY);
        ctx.stroke();

        // Midface ratio vertical center
        const centerX = width / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, height * 0.25);
        ctx.lineTo(centerX, height * 0.85);
        ctx.stroke();

        // No text labels - clean biometric overlay
      };
      img.src = imageSrc;
    }, [imageSrc, ref]);

    return <canvas ref={ref || canvasRef} className={className} />;
  }
);

FacialOverlay.displayName = 'FacialOverlay';

export default FacialOverlay;
