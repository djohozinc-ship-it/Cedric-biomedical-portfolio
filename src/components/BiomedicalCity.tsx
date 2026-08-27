import React, { useEffect, useRef, useState } from 'react';
import './BiomedicalCity.scss';

type Scene = { title: string; subtitle: string; duration: number };

const scenes: Scene[] = [
  { title: 'ARRIVAL', subtitle: 'The patient arrives at the future hospital.', duration: 3000 },
  { title: 'ENTRY', subtitle: 'The doors open and welcome the patient inside.', duration: 3000 },
  { title: 'CHECK-IN', subtitle: 'An intelligent station completes the check-in.', duration: 3000 },
  { title: 'CORRIDOR', subtitle: 'The patient is guided toward the examination room.', duration: 3000 },
  { title: 'EXAMINATION', subtitle: 'Sensors position themselves around the patient.', duration: 4000 },
  { title: 'BIOSIGNALS', subtitle: 'ECG, SpO₂ and temperature become live signals.', duration: 3000 },
  { title: 'ANALYSIS', subtitle: 'The system transforms signals into clinical information.', duration: 3000 },
  { title: 'ROBOTICS', subtitle: 'A medical robotic arm assists with precision.', duration: 3000 },
  { title: 'CARE', subtitle: 'Technology brings the care team back to the patient.', duration: 3000 },
  { title: 'SIGNATURE', subtitle: 'Engineering technology for better healthcare.', duration: 2000 },
];

const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const ease = (value: number) => value * value * (3 - 2 * value);

const BiomedicalCity: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sceneIndexRef = useRef(0);
  const pausedRef = useRef(false);
  const timelineRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let raf = 0;
    let alive = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const roundedRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    };

    const glow = (x: number, y: number, radius: number, alpha = 0.22) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(92,224,255,${alpha})`);
      gradient.addColorStop(1, 'rgba(92,224,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    };

    const text = (value: string, x: number, y: number, size: number, color: string, weight = '400', align: CanvasTextAlign = 'left') => {
      ctx.font = `${weight} ${size}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.fillText(value, x, y);
    };

    const person = (x: number, y: number, scale: number, walk = 0, seated = false) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.strokeStyle = '#dcecef';
      ctx.fillStyle = '#dcecef';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(0, -58, 11, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, -45); ctx.lineTo(0, seated ? -5 : 12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(-20 + walk, -10); ctx.moveTo(0, -30); ctx.lineTo(20 - walk, -10); ctx.stroke();
      if (seated) {
        ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(28, 8); ctx.lineTo(40, 35); ctx.moveTo(0, -5); ctx.lineTo(-22, 16); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(-15 - walk, 55); ctx.moveTo(0, 12); ctx.lineTo(15 + walk, 55); ctx.stroke();
      }
      ctx.restore();
    };

    const hospital = (w: number, h: number, camera: number) => {
      ctx.save();
      ctx.translate(-camera * w * 0.05, 0);
      ctx.fillStyle = '#0b202c';
      ctx.fillRect(w * 0.31, h * 0.17, w * 0.62, h * 0.61);
      ctx.fillStyle = '#102e3d';
      ctx.fillRect(w * 0.04, h * 0.39, w * 0.34, h * 0.39);
      ctx.strokeStyle = 'rgba(128,225,244,.18)';
      ctx.lineWidth = 1;
      for (let x = w * 0.35; x < w * 0.92; x += 76) {
        ctx.beginPath(); ctx.moveTo(x, h * 0.18); ctx.lineTo(x, h * 0.77); ctx.stroke();
      }
      for (let y = h * 0.28; y < h * 0.75; y += 82) {
        ctx.beginPath(); ctx.moveTo(w * 0.33, y); ctx.lineTo(w * 0.92, y); ctx.stroke();
      }
      ctx.fillStyle = '#06121a';
      ctx.fillRect(w * 0.46, h * 0.48, w * 0.18, h * 0.30);
      ctx.strokeStyle = 'rgba(101,231,255,.38)';
      ctx.strokeRect(w * 0.46, h * 0.48, w * 0.18, h * 0.30);
      ctx.fillStyle = 'rgba(76,210,239,.07)';
      ctx.fillRect(w * 0.34, h * 0.20, w * 0.52, h * 0.05);
      ctx.restore();
    };

    const doors = (w: number, h: number, opening: number) => {
      const cx = w * 0.58;
      const top = h * 0.29;
      const bottom = h * 0.79;
      const half = w * 0.105;
      const gap = half * opening;
      ctx.fillStyle = '#07141d';
      ctx.fillRect(cx - half, top, half - gap, bottom - top);
      ctx.fillRect(cx + gap, top, half - gap, bottom - top);
      ctx.strokeStyle = 'rgba(103,231,255,.45)';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - half, top, half - gap, bottom - top);
      ctx.strokeRect(cx + gap, top, half - gap, bottom - top);
      glow(cx, h * 0.52, w * 0.18, 0.13 + opening * 0.08);
      text('AUTOMATIC ENTRY', cx, top - 16, 11, '#73eaff', '600', 'center');
    };

    const checkIn = (x: number, y: number, pulse: number) => {
      ctx.fillStyle = '#0a1c27';
      roundedRect(x, y, 190, 260, 18); ctx.fill();
      ctx.strokeStyle = 'rgba(104,230,255,.45)'; ctx.stroke();
      ctx.fillStyle = '#102c3b';
      roundedRect(x + 18, y + 22, 154, 130, 10); ctx.fill();
      text('WELCOME', x + 30, y + 50, 12, '#70e9ff', '700');
      text('PATIENT CHECK-IN', x + 30, y + 73, 10, '#9bbac4');
      ctx.strokeStyle = 'rgba(104,230,255,.7)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x + 30, y + 102); ctx.lineTo(x + 125 + Math.sin(pulse) * 15, y + 102); ctx.stroke();
      text('ID VERIFIED', x + 30, y + 132, 10, '#bfeaf2', '600');
      ctx.fillStyle = '#0e3342'; roundedRect(x + 18, y + 172, 154, 62, 10); ctx.fill();
      text('VITALS READY', x + 30, y + 198, 10, '#73eaff', '600');
      text('SpO₂  98%   HR  78', x + 30, y + 218, 9, '#a9c7cf');
    };

    const corridor = (w: number, h: number, camera: number) => {
      const vanishingX = w * (0.59 + camera * 0.02);
      const vanishingY = h * 0.40;
      ctx.fillStyle = '#071923';
      ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(w * 0.40, h * 0.44); ctx.lineTo(w * 0.72, h * 0.44); ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(107,225,246,.20)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 7; i++) {
        ctx.beginPath(); ctx.moveTo(w * (i / 7), h); ctx.lineTo(vanishingX, vanishingY); ctx.stroke();
      }
      for (let i = 0; i < 5; i++) {
        const yy = h * (0.49 + i * 0.10);
        ctx.beginPath(); ctx.moveTo(w * 0.12, yy); ctx.lineTo(w * 0.88, yy); ctx.stroke();
      }
      for (let i = 0; i < 4; i++) {
        const x = w * (0.20 + i * 0.20);
        ctx.fillStyle = '#0d2936';
        ctx.fillRect(x, h * 0.28, w * 0.11, h * 0.18);
      }
      glow(vanishingX, vanishingY, w * 0.20, 0.10);
    };

    const examBed = (w: number, h: number) => {
      ctx.fillStyle = '#183441';
      roundedRect(w * 0.43, h * 0.61, w * 0.30, 32, 8); ctx.fill();
      ctx.fillStyle = '#d2e6ea';
      roundedRect(w * 0.47, h * 0.57, w * 0.20, 50, 8); ctx.fill();
      ctx.fillStyle = '#0b202c'; ctx.fillRect(w * 0.68, h * 0.62, 8, h * 0.14);
      ctx.fillStyle = '#102b38'; ctx.fillRect(w * 0.42, h * 0.75, 10, h * 0.07); ctx.fillRect(w * 0.71, h * 0.75, 10, h * 0.07);
    };

    const sensor = (x: number, y: number, r: number, active: number) => {
      ctx.strokeStyle = `rgba(111,232,255,${0.30 + active * 0.45})`;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, r * 0.45, 0, Math.PI * 2); ctx.stroke();
      glow(x, y, r * 1.8, 0.08 + active * 0.10);
    };

    const monitor = (x: number, y: number, w: number, h: number, time: number, detailed = true) => {
      ctx.fillStyle = '#06131b'; roundedRect(x, y, w, h, 14); ctx.fill();
      ctx.strokeStyle = 'rgba(111,230,255,.42)'; ctx.lineWidth = 1.5; ctx.stroke();
      if (detailed) {
        text('PATIENT MONITOR', x + 18, y + 25, 9, '#6feaff', '700');
        ctx.strokeStyle = '#73eaff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x + 18, y + 62);
        for (let i = 0; i < w - 36; i += 3) {
          const spike = i % 72 < 5 ? -18 : 0;
          ctx.lineTo(x + 18 + i, y + 62 + Math.sin(i * 0.14 + time * 5) * 6 + spike);
        }
        ctx.stroke();
        text('ECG', x + 18, y + h - 18, 9, '#a6c7ce');
        text('98%', x + w * 0.50, y + h - 18, 9, '#a6c7ce');
        text('SpO₂', x + w * 0.68, y + h - 18, 9, '#a6c7ce');
      }
    };

    const robotArm = (x: number, y: number, scale: number, time: number) => {
      const a = Math.sin(time * 1.6) * 0.28;
      ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
      ctx.strokeStyle = '#d6e5e8'; ctx.lineWidth = 17; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(0, 130); ctx.lineTo(-12, 58); ctx.lineTo(32, -4); ctx.lineTo(18 + a * 45, -70); ctx.stroke();
      ctx.fillStyle = '#0b2532';
      [[0,130],[-12,58],[32,-4],[18+a*45,-70]].forEach(([jx, jy]) => { ctx.beginPath(); ctx.arc(jx, jy, 13, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = '#6feaff'; ctx.fillRect(10 + a * 45, -94, 15, 32);
      ctx.restore();
    };

    const drawScene = (scene: number, local: number, w: number, h: number, nowSeconds: number) => {
      const p = clamp(local / scenes[scene].duration, 0, 1);
      const e = ease(p);
      const camera = scene === 0 ? e : scene === 1 ? 1 - e : Math.sin(nowSeconds * 0.22) * 0.35;

      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#020811'); bg.addColorStop(0.55, '#08202d'); bg.addColorStop(1, '#02070c');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 12; i++) {
        const x = (i * 173 + nowSeconds * 7) % (w + 80) - 40;
        const y = h * (0.08 + (i % 6) * 0.14);
        ctx.fillStyle = 'rgba(128,225,244,.08)'; ctx.fillRect(x, y, 2, 2);
      }

      if (scene <= 1) hospital(w, h, camera);

      if (scene === 0) {
        const px = w * (0.08 + e * 0.30);
        person(px, h * 0.73, 0.88, Math.sin(nowSeconds * 9) * 5);
        text('2035 • FUTURE HOSPITAL', w * 0.07, h * 0.26, 11, '#73eaff', '700');
        text('A PATIENT ARRIVES', w * 0.07, h * 0.31, 30, '#e9fbff', '700');
        text('The journey begins at the main entrance.', w * 0.07, h * 0.36, 13, '#a8c4cc');
        glow(px, h * 0.66, 110, 0.08);
      } else if (scene === 1) {
        const opening = e;
        doors(w, h, opening);
        person(w * (0.47 + e * 0.11), h * 0.73, 0.88, Math.sin(nowSeconds * 8) * 4);
        text('ENTRY', w * 0.08, h * 0.28, 11, '#73eaff', '700');
        text('A seamless welcome.', w * 0.08, h * 0.34, 28, '#e9fbff', '700');
      } else if (scene === 2) {
        hospital(w, h, 0);
        checkIn(w * 0.29, h * 0.27, nowSeconds);
        person(w * 0.68, h * 0.72, 0.86, Math.sin(nowSeconds * 3) * 2);
        text('CHECK-IN', w * 0.08, h * 0.28, 11, '#73eaff', '700');
        text('The hospital identifies and prepares.', w * 0.08, h * 0.34, 25, '#e9fbff', '700');
      } else if (scene === 3) {
        corridor(w, h, e);
        const px = w * (0.16 + e * 0.47);
        person(px, h * 0.73, 0.82, Math.sin(nowSeconds * 8) * 4);
        text('CORRIDOR • GUIDED ROUTE', w * 0.08, h * 0.26, 11, '#73eaff', '700');
        text('Patient → Examination Room 03', w * 0.08, h * 0.32, 25, '#e9fbff', '700');
        text('The environment guides the next step.', w * 0.08, h * 0.37, 12, '#a8c4cc');
      } else if (scene === 4) {
        examBed(w, h);
        person(w * 0.56, h * 0.60, 0.72, 0, true);
        const active = Math.sin(nowSeconds * 4) * 0.5 + 0.5;
        sensor(w * 0.56, h * 0.42, 28, active);
        sensor(w * 0.45, h * 0.57, 18, active);
        sensor(w * 0.68, h * 0.57, 18, active);
        monitor(w * 0.72, h * 0.27, w * 0.20, h * 0.22, nowSeconds);
        text('EXAMINATION', w * 0.08, h * 0.25, 11, '#73eaff', '700');
        text('Sensors position around the patient.', w * 0.08, h * 0.31, 24, '#e9fbff', '700');
      } else if (scene === 5) {
        monitor(w * 0.44, h * 0.22, w * 0.42, h * 0.40, nowSeconds);
        person(w * 0.27, h * 0.72, 0.78);
        const pulse = Math.sin(nowSeconds * 6) * 0.5 + 0.5;
        glow(w * 0.64, h * 0.42, 150, 0.06 + pulse * 0.07);
        text('LIVE BIOSIGNALS', w * 0.08, h * 0.26, 11, '#73eaff', '700');
        text('ECG • SpO₂ • TEMPERATURE', w * 0.08, h * 0.32, 24, '#e9fbff', '700');
        text('Signals move from the patient to the clinical system.', w * 0.08, h * 0.38, 12, '#a8c4cc');
      } else if (scene === 6) {
        monitor(w * 0.46, h * 0.22, w * 0.39, h * 0.39, nowSeconds);
        ctx.strokeStyle = 'rgba(111,232,255,.45)'; ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          const yy = h * (0.70 + i * 0.035);
          ctx.beginPath(); ctx.moveTo(w * 0.48, yy); ctx.lineTo(w * (0.58 + e * 0.24), yy); ctx.stroke();
        }
        glow(w * 0.70, h * 0.42, 180, 0.11);
        text('INTELLIGENT ANALYSIS', w * 0.08, h * 0.26, 11, '#73eaff', '700');
        text('Signal → information → clinical insight', w * 0.08, h * 0.32, 24, '#e9fbff', '700');
        text('The system compares, interprets and prepares the next action.', w * 0.08, h * 0.38, 12, '#a8c4cc');
      } else if (scene === 7) {
        robotArm(w * 0.62, h * 0.36, 0.80, nowSeconds);
        person(w * 0.78, h * 0.70, 0.70);
        ctx.fillStyle = '#102c38'; roundedRect(w * 0.50, h * 0.69, w * 0.30, 14, 7); ctx.fill();
        text('ROBOTIC ASSISTANCE', w * 0.08, h * 0.26, 11, '#73eaff', '700');
        text('Precision supports human care.', w * 0.08, h * 0.32, 25, '#e9fbff', '700');
        text('CONTROL • PRECISION • SAFETY', w * 0.08, h * 0.38, 11, '#a8c4cc', '600');
      } else if (scene === 8) {
        person(w * (0.48 + e * 0.05), h * 0.70, 0.86);
        const heartScale = 1 + Math.sin(nowSeconds * 5) * 0.04;
        ctx.save(); ctx.translate(w * 0.49, h * 0.50); ctx.scale(heartScale, heartScale);
        ctx.fillStyle = '#72eaff'; ctx.beginPath();
        ctx.moveTo(0, 25); ctx.bezierCurveTo(-52, -8, -40, -43, -14, -39); ctx.bezierCurveTo(0, -36, 0, -20, 0, -20); ctx.bezierCurveTo(0, -20, 0, -36, 14, -39); ctx.bezierCurveTo(40, -43, 52, -8, 0, 25); ctx.fill(); ctx.restore();
        glow(w * 0.49, h * 0.49, 100, 0.12);
        text('CARE', w * 0.08, h * 0.26, 11, '#73eaff', '700');
        text('The technology returns to the patient.', w * 0.08, h * 0.32, 25, '#e9fbff', '700');
        text('The system has one purpose: better healthcare.', w * 0.08, h * 0.38, 12, '#a8c4cc');
      } else {
        const zoom = 1 - e * 0.18;
        ctx.save(); ctx.translate(w * 0.50, h * 0.52); ctx.scale(zoom, zoom); ctx.translate(-w * 0.50, -h * 0.52);
        hospital(w, h, 0);
        person(w * 0.50, h * 0.73, 0.72);
        glow(w * 0.50, h * 0.50, 190, 0.12);
        ctx.restore();
        const alpha = clamp(e * 1.8, 0, 1);
        ctx.fillStyle = `rgba(2,8,14,${alpha * 0.48})`; ctx.fillRect(0, 0, w, h);
        text('BIOMEDICAL CITY', w * 0.50, h * 0.40, 12, '#73eaff', '700', 'center');
        text('ENGINEERING TECHNOLOGY FOR BETTER HEALTHCARE', w * 0.50, h * 0.48, 22, '#e9fbff', '700', 'center');
      }

      const progress = clamp((timelineRef.current / totalDuration), 0, 1);
      ctx.fillStyle = 'rgba(120,220,240,.14)'; ctx.fillRect(w * 0.08, h * 0.90, w * 0.84, 2);
      ctx.fillStyle = '#73eaff'; ctx.fillRect(w * 0.08, h * 0.90, w * 0.84 * progress, 2);
    };

    const draw = (now: number) => {
      if (!alive) return;
      if (lastFrameRef.current === null) lastFrameRef.current = now;
      const delta = Math.min(now - lastFrameRef.current, 50);
      lastFrameRef.current = now;

      if (!pausedRef.current) {
        timelineRef.current += delta;
        if (timelineRef.current >= totalDuration) timelineRef.current = 0;
      }

      let cursor = timelineRef.current;
      let index = 0;
      while (index < scenes.length - 1 && cursor >= scenes[index].duration) {
        cursor -= scenes[index].duration;
        index += 1;
      }
      if (sceneIndexRef.current !== index) {
        sceneIndexRef.current = index;
        setSceneIndex(index);
      }

      drawScene(index, cursor, canvas.clientWidth, canvas.clientHeight, now / 1000);
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const jumpToScene = (index: number) => {
    const safeIndex = clamp(index, 0, scenes.length - 1);
    timelineRef.current = scenes.slice(0, safeIndex).reduce((sum, scene) => sum + scene.duration, 0);
    sceneIndexRef.current = safeIndex;
    setSceneIndex(safeIndex);
  };

  const togglePause = () => {
    pausedRef.current = !pausedRef.current;
    setIsPaused(pausedRef.current);
  };

  const scene = scenes[sceneIndex];

  return (
    <section className="biomedical-city" id="city" aria-label="Biomedical City — A Patient's Journey">
      <canvas ref={canvasRef} aria-label="Cinematic biomedical patient journey animation" />
      <div className="city-vignette" />

      <div className="city-hud">
        <div className="city-kicker">BIOMEDICAL CITY • A PATIENT'S JOURNEY • 2035</div>
        <h2>Biomedical City</h2>
        <div className="city-story">
          <span className="city-scene-number">{String(sceneIndex + 1).padStart(2, '0')}</span>
          <div><strong>{scene.title}</strong><p>{scene.subtitle}</p></div>
        </div>
        <p className="city-description">A continuous patient journey: arrival, examination, biosignals, intelligent analysis, robotics, then human care.</p>
        <div className="city-progress" aria-label="Journey scenes">
          {scenes.map((item, index) => (
            <button key={item.title} className={index === sceneIndex ? 'active' : ''} onClick={() => jumpToScene(index)} aria-label={`Show scene ${index + 1}: ${item.title}`} />
          ))}
        </div>
        <button className="city-play" onClick={togglePause} aria-label={isPaused ? 'Resume journey' : 'Pause journey'}>
          <span>{isPaused ? '▶' : 'Ⅱ'}</span> {isPaused ? 'RESUME JOURNEY' : 'PAUSE JOURNEY'}
        </button>
      </div>

      <div className="city-label">PATIENT → SENSOR → SIGNAL → DATA → INTELLIGENCE → ROBOT → CARE</div>
    </section>
  );
};

export default BiomedicalCity;
