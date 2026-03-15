import React, { useEffect, useRef } from 'react';

/**
 * Particle class for animation system
 */
class Particle {
  constructor(x, y, vx, vy, size, hue) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.hue = hue;
    this.life = 1;
    this.decay = Math.random() * 0.005 + 0.002;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    this.size += 0.05;
    this.vx *= 0.98;
    this.vy *= 0.98;
  }

  draw(ctx) {
    const alpha = Math.max(0, this.life);
    ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${alpha * 0.6})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  isDead() {
    return this.life <= 0;
  }
}

/**
 * AnimatedBackground Component
 * Beautiful animated background with particles and gradients
 */
const AnimatedBackground = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Setup canvas
    const resizeCanvas = () => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      return { width, height };
    };

    let dimensions = resizeCanvas();
    const particles = [];

    const createParticles = () => {
      if (Math.random() < 0.3) {
        const hue = (Date.now() * 0.5) % 360;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;

        particles.push(
          new Particle(
            mouseRef.current.x,
            mouseRef.current.y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            Math.random() * 2 + 1,
            hue
          )
        );
      }
    };

    let time = 0;
    const animate = () => {
      if (!dimensions) return;

      const { width, height } = dimensions;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.02)';
      ctx.fillRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      const hue1 = (time * 0.5) % 360;
      const hue2 = (time * 0.3 + 120) % 360;
      const hue3 = (time * 0.7 + 240) % 360;

      gradient.addColorStop(0, `hsl(${hue1}, 100%, 10%)`);
      gradient.addColorStop(0.5, `hsl(${hue2}, 80%, 15%)`);
      gradient.addColorStop(1, `hsl(${hue3}, 100%, 10%)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const glowGradient = ctx.createRadialGradient(
        mouseRef.current.x,
        mouseRef.current.y,
        0,
        mouseRef.current.x,
        mouseRef.current.y,
        200
      );

      glowGradient.addColorStop(0, 'rgba(100, 150, 255, 0.15)');
      glowGradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 3; i++) {
        const waveX = width / 2 + Math.sin(time * 0.001 + i) * 100;
        const waveY = height / 2 + Math.cos(time * 0.0008 + i) * 100;
        const radius = 150 + Math.sin(time * 0.005 + i * 2) * 50;

        const waveGradient = ctx.createRadialGradient(
          waveX,
          waveY,
          0,
          waveX,
          waveY,
          radius
        );

        const waveHue = (time * 0.4 + i * 120) % 360;
        waveGradient.addColorStop(0, `hsla(${waveHue}, 100%, 50%, 0.1)`);
        waveGradient.addColorStop(1, `hsla(${waveHue}, 100%, 50%, 0)`);

        ctx.fillStyle = waveGradient;
        ctx.fillRect(0, 0, width, height);
      }

      createParticles();
      particles.forEach((p, index) => {
        p.update();
        p.draw(ctx);
        if (p.isDead()) {
          particles.splice(index, 1);
        }
      });

      ctx.strokeStyle = 'rgba(100, 150, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 50, 0, Math.PI * 2);
      ctx.stroke();

      time++;
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleResize = () => {
      dimensions = resizeCanvas();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default AnimatedBackground;
