import { useEffect, useRef } from 'react';

const COLORS = ['#60a5fa', '#a78bfa', '#34d399', '#f472b6', '#fbbf24', '#fb923c', '#38bdf8', '#e879f9', '#4ade80', '#f87171'];

export default function Sparkle() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    let mouseX = 0, mouseY = 0;

    const spawn = (x, y) => {
      const count = 7;
      for (let i = 0; i < count; i++) {
        const el = document.createElement('span');
        el.className = 'sparkle-dot';
        const size = Math.random() * 5 + 3;
        const angle = Math.random() * 360;
        const dist = Math.random() * 20 + 8;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        el.style.cssText = `
          left:${x}px; top:${y}px;
          width:${size}px; height:${size}px;
          background:${color};
          --tx:${Math.cos((angle * Math.PI) / 180) * dist}px;
          --ty:${Math.sin((angle * Math.PI) / 180) * dist}px;
        `;
        container.appendChild(el);
        el.addEventListener('animationend', () => el.remove());
      }
    };

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const interval = setInterval(() => spawn(mouseX, mouseY), 100);

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      clearInterval(interval);
    };
  }, []);

  return <div ref={containerRef} className="sparkle-container" />;
}
