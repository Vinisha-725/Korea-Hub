'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
}

export function ThemeEffects() {
  const [isDark, setIsDark] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Check dark mode
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const createParticles = () => {
      const newParticles: Particle[] = [];
      const count = isDark ? 50 : 30; // More snowflakes than petals
      
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: isDark ? Math.random() * 4 + 2 : Math.random() * 8 + 4,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: isDark ? Math.random() * 1 + 0.5 : Math.random() * 0.5 + 0.3,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 2,
        });
      }
      setParticles(newParticles);
    };

    createParticles();
  }, [isDark]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: p.y + p.speedY,
        x: p.x + p.speedX + Math.sin(p.y * 0.01) * 0.3,
        rotation: p.rotation + p.rotationSpeed,
      })).map(p => ({
        ...p,
        y: p.y > 100 ? -10 : p.y,
        x: p.x > 100 ? 0 : p.x < 0 ? 100 : p.x,
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute transition-opacity duration-300"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            transform: `rotate(${p.rotation}deg)`,
            opacity: isDark ? 0.8 : 0.6,
          }}
        >
          {isDark ? (
            // Snowflake
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(200, 220, 255, 0.9) 0%, rgba(150, 180, 255, 0.5) 50%, transparent 70%)',
                boxShadow: '0 0 6px rgba(200, 220, 255, 0.6), 0 0 12px rgba(150, 180, 255, 0.3)',
              }}
            />
          ) : (
            // Cherry blossom petal
            <div
              className="w-full h-full"
              style={{
                background: 'radial-gradient(ellipse at 30% 30%, rgba(255, 182, 193, 0.9) 0%, rgba(255, 105, 180, 0.7) 50%, rgba(255, 182, 193, 0.4) 100%)',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                boxShadow: '0 0 8px rgba(255, 182, 193, 0.4)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
