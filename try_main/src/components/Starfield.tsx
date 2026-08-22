import React, { useEffect, useRef } from 'react';

// Exact bright 4-pointed diffraction spike stars positioned to mirror the reference image
const SIGNATURE_STARS = [
  // Top right prominent star
  { id: 'tr-1', top: '14.5%', left: '76.8%', size: 24, glow: '#70d6ff', duration: 4.2, delay: 0 },
  // Far right top
  { id: 'tr-2', top: '18.5%', left: '96.6%', size: 20, glow: '#60a5fa', duration: 5.1, delay: 1.2 },
  // Mid right
  { id: 'mr-1', top: '32.8%', left: '70.5%', size: 14, glow: '#93c5fd', duration: 4.8, delay: 2.1 },
  { id: 'mr-2', top: '37.2%', left: '85.2%', size: 12, glow: '#38bdf8', duration: 3.9, delay: 0.7 },
  // Top center & left-center
  { id: 'tc-1', top: '16.2%', left: '56.2%', size: 13, glow: '#70d6ff', duration: 4.5, delay: 1.8 },
  { id: 'tl-1', top: '13.5%', left: '32.6%', size: 16, glow: '#60a5fa', duration: 5.0, delay: 0.4 },
  { id: 'tl-2', top: '26.8%', left: '38.8%', size: 14, glow: '#38bdf8', duration: 3.8, delay: 2.5 },
  // Mid left
  { id: 'ml-1', top: '32.6%', left: '25.3%', size: 18, glow: '#70d6ff', duration: 4.6, delay: 1.1 },
  { id: 'ml-2', top: '31.4%', left: '15.7%', size: 15, glow: '#93c5fd', duration: 5.3, delay: 0.9 },
  // Lower left prominent star (matches bottom-left flare in reference)
  { id: 'bl-1', top: '85.5%', left: '25.5%', size: 28, glow: '#70d6ff', duration: 4.0, delay: 0.2 },
  // Mid lower left
  { id: 'bl-2', top: '66.8%', left: '20.2%', size: 17, glow: '#60a5fa', duration: 4.7, delay: 1.5 },
  { id: 'bl-3', top: '59.4%', left: '31.3%', size: 15, glow: '#38bdf8', duration: 3.6, delay: 2.8 },
  { id: 'bl-4', top: '60.5%', left: '9.2%', size: 12, glow: '#93c5fd', duration: 4.9, delay: 0.8 },
  // Bottom center right
  { id: 'br-1', top: '89.2%', left: '65.8%', size: 16, glow: '#70d6ff', duration: 4.3, delay: 1.4 },
  { id: 'br-2', top: '70.4%', left: '69.6%', size: 15, glow: '#60a5fa', duration: 5.2, delay: 2.0 },
  { id: 'br-3', top: '91.2%', left: '84.2%', size: 13, glow: '#38bdf8', duration: 4.1, delay: 0.5 },
  { id: 'br-4', top: '66.2%', left: '90.8%', size: 18, glow: '#70d6ff', duration: 4.8, delay: 1.9 },
];

export const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    // Stars particle array
    interface Star {
      x: number;
      y: number;
      size: number;
      baseOpacity: number;
      twinkleSpeed: number;
      twinkleOffset: number;
      color: string;
    }

    let stars: Star[] = [];

    const initStars = () => {
      stars = [];
      const count = Math.floor((width * height) / 2400); // Dense cosmic field

      for (let i = 0; i < count; i++) {
        // High percentage of ultra-faint pinpoint stars + a few brighter dots
        const rand = Math.random();
        let size = 0.5;
        let baseOpacity = 0.2 + Math.random() * 0.4;
        let color = '#ffffff';

        if (rand > 0.95) {
          size = 1.4 + Math.random() * 0.8;
          baseOpacity = 0.7 + Math.random() * 0.3;
          color = Math.random() > 0.4 ? '#e0f2fe' : '#bae6fd';
        } else if (rand > 0.8) {
          size = 0.9 + Math.random() * 0.5;
          baseOpacity = 0.4 + Math.random() * 0.4;
          color = Math.random() > 0.5 ? '#f8fafc' : '#dbeafe';
        } else {
          size = 0.4 + Math.random() * 0.5;
          baseOpacity = 0.15 + Math.random() * 0.35;
        }

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          baseOpacity,
          twinkleSpeed: 0.005 + Math.random() * 0.015,
          twinkleOffset: Math.random() * Math.PI * 2,
          color,
        });
      }
    };

    initStars();

    let time = 0;
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Draw faint stardust points
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        // Varying opacity
        const opacity = Math.max(0.05, Math.min(1, star.baseOpacity + twinkle * 0.25));

        ctx.fillStyle = star.color;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black select-none">
      {/* Background Canvas for pinpoint starry field */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {/* Complete pitch black nebula overlay */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950/15 via-black/80 to-black" 
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Signature 4-pointed cross diffraction spike stars */}
      {SIGNATURE_STARS.map((star) => (
        <div
          key={star.id}
          id={`star-${star.id}`}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000"
          style={{
            top: star.top,
            left: star.left,
            animation: `star-pulse ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        >
          {/* Radial cyan bloom glow */}
          <div
            className="absolute -inset-4 rounded-full opacity-60 pointer-events-none blur-[6px]"
            style={{
              background: `radial-gradient(circle, ${star.glow} 0%, rgba(112, 214, 255, 0) 70%)`,
            }}
          />

          {/* 4-point cross diffraction spikes with central diamond */}
          <svg
            width={star.size}
            height={star.size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
            style={{
              filter: `drop-shadow(0 0 6px ${star.glow})`,
            }}
          >
            {/* Extended Horizontal and Vertical Spikes */}
            <path
              d="M12 0 C12 7.5 10.5 12 0 12 C10.5 12 12 16.5 12 24 C12 16.5 13.5 12 24 12 C13.5 12 12 7.5 12 0 Z"
              fill="#ffffff"
            />
            {/* Soft inner cyan center */}
            <circle cx="12" cy="12" r="1.5" fill="#a5f3fc" />
          </svg>
        </div>
      ))}
    </div>
  );
};
