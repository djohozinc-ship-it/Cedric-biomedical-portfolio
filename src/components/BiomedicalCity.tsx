import React, { useEffect, useRef, useState } from 'react';
import './BiomedicalCity.scss';

type Point = { x: number; y: number };

const BiomedicalCity: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [speed, setSpeed] = useState(0);
  const [auto, setAuto] = useState(true);
  const [nearCenter, setNearCenter] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let running = true;
    let car = { x: 0, z: 0, lane: 0, t: 0 };
    const keys: Record<string, boolean> = {};
    const buildings = Array.from({ length: 26 }, (_, i) => ({
      side: i % 2 ? 1 : -1,
      z: 90 + i * 55,
      h: 35 + ((i * 29) % 80),
      w: 35 + ((i * 17) % 35),
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const down = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = true; };
    const up = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    const project = (x: number, z: number, y = 0): Point & { scale: number } => {
      const horizon = canvas.clientHeight * 0.43;
      const depth = Math.max(40, z + 120);
      const scale = 260 / depth;
      return {
        x: canvas.clientWidth / 2 + (x - car.x) * scale,
        y: horizon + y * scale + 120 * scale,
        scale,
      };
    };

    const drawBuilding = (b: typeof buildings[number]) => {
      const p = project(b.side * 82, b.z);
      const w = b.w * p.scale;
      const h = b.h * p.scale;
      ctx.fillStyle = 'rgba(8, 28, 45, .94)';
      ctx.fillRect(p.x - w / 2, p.y - h, w, h);
      ctx.strokeStyle = 'rgba(55, 220, 255, .35)';
      ctx.strokeRect(p.x - w / 2, p.y - h, w, h);
      for (let y = p.y - h + 10 * p.scale; y < p.y - 5; y += 15 * p.scale) {
        ctx.fillStyle = 'rgba(91, 225, 255, .35)';
        ctx.fillRect(p.x - w / 2 + 7 * p.scale, y, Math.max(2, 5 * p.scale), Math.max(2, 4 * p.scale));
      }
    };

    const draw = () => {
      if (!running) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#030b17');
      sky.addColorStop(0.55, '#071b2b');
      sky.addColorStop(1, '#02070d');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(52, 215, 255, .08)';
      for (let i = 0; i < 70; i++) {
        const x = (i * 83) % w;
        const y = (i * 47) % (h * .42);
        ctx.fillRect(x, y, 1.5, 1.5);
      }

      // road
      const horizon = h * .43;
      ctx.fillStyle = '#071018';
      ctx.beginPath();
      ctx.moveTo(w * .49, horizon);
      ctx.lineTo(w * .51, horizon);
      ctx.lineTo(w * .96, h);
      ctx.lineTo(w * .04, h);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(52, 220, 255, .5)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(w*.49, horizon); ctx.lineTo(w*.03, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w*.51, horizon); ctx.lineTo(w*.97, h); ctx.stroke();

      buildings.forEach(drawBuilding);

      for (let i = 0; i < 9; i++) {
        const z = 30 + i * 75 + ((car.z * 1.2) % 75);
        const p = project(0, z);
        const len = Math.max(4, 22 * p.scale);
        ctx.strokeStyle = 'rgba(220, 250, 255, .75)';
        ctx.lineWidth = Math.max(1, 3 * p.scale);
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y + len); ctx.stroke();
      }

      // vehicle
      const cx = w / 2;
      const cy = h * .78;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.shadowBlur = 24;
      ctx.shadowColor = '#29dfff';
      ctx.fillStyle = '#142d42';
      ctx.beginPath(); ctx.roundRect(-38, -12, 76, 30, 10); ctx.fill();
      ctx.fillStyle = '#68eaff';
      ctx.fillRect(-22, -20, 44, 12);
      ctx.fillStyle = '#061018';
      ctx.fillRect(-17, -17, 34, 8);
      ctx.fillStyle = '#baf7ff';
      ctx.fillRect(-31, 6, 12, 4); ctx.fillRect(19, 6, 12, 4);
      ctx.restore();

      const target = auto ? 42 : (keys.w || keys.arrowup ? 60 : 0);
      car.t += .012;
      car.z += target * .012;
      if (keys.a || keys.arrowleft) car.x -= 1.2;
      if (keys.d || keys.arrowright) car.x += 1.2;
      if (auto) car.x = Math.sin(car.t) * 10;
      car.x *= .985;
      car.z %= 1100;

      const near = Math.abs(car.x - 82) < 45 && car.z > 300 && car.z < 520;
      setNearCenter(near);
      setSpeed(Math.round(target));
      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [auto]);

  return (
    <section className="biomedical-city" id="city">
      <canvas ref={canvasRef} aria-label="Cédric Biomedical City" />
      <div className="city-vignette" />
      <div className="city-hud">
        <div className="city-kicker">BIOMEDICAL ENGINEERING • 2026</div>
        <h2>Cédric Biomedical City</h2>
        <p>Explore a living digital city built around biomedical engineering, AI and connected healthcare.</p>
        <div className="city-actions">
          <button onClick={() => setAuto(v => !v)}>{auto ? 'MANUAL DRIVE' : 'AUTO DRIVE'}</button>
          <span className="city-speed">{speed} km/h</span>
        </div>
        <div className="city-controls">WASD / ↑ ↓ ← → &nbsp; • &nbsp; mobile-friendly</div>
        {nearCenter && <div className="city-card"><strong>BIOMEDICAL ENGINEERING CENTER</strong><br/>Intelligent medical systems • electronics • AI • maintenance</div>}
      </div>
      <div className="city-label">DRIVE THROUGH MY WORK →</div>
    </section>
  );
};

export default BiomedicalCity;
