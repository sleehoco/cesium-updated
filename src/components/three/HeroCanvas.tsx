'use client';

import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 80;

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Generate particles
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: random(0, width),
      y: random(0, height),
      size: random(1, 3),
      speedX: random(-0.3, 0.3),
      speedY: random(-0.3, 0.3),
      opacity: random(0.2, 0.7),
      pulse: random(0, Math.PI * 2),
    }));

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / width - 0.5) * 2;
      mouseRef.current.y = (e.clientY / height - 0.5) * 2;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const CONNECTION_DIST = 120;

    function animate() {
      ctx!.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x * 30;
      const my = mouseRef.current.y * 30;

      // Update and draw particles
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.02;

        // Wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const drawX = p.x + mx * (p.size / 3);
        const drawY = p.y + my * (p.size / 3);
        const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));

        ctx!.beginPath();
        ctx!.arc(drawX, drawY, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(139, 92, 246, ${alpha})`;
        ctx!.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]!;
          const b = particles[j]!;
          const dx = (a.x + mx * (a.size / 3)) - (b.x + mx * (b.size / 3));
          const dy = (a.y + my * (a.size / 3)) - (b.y + my * (b.size / 3));
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx!.beginPath();
            ctx!.moveTo(a.x + mx * (a.size / 3), a.y + my * (a.size / 3));
            ctx!.lineTo(b.x + mx * (b.size / 3), b.y + my * (b.size / 3));
            ctx!.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
