import React, { useEffect, useRef, useState } from 'react';
import './BiomedicalCity.scss';

type Stage = {
  title: string;
  subtitle: string;
};

const stages: Stage[] = [
  { title: 'ELECTRONICS', subtitle: 'A signal begins in hardware.' },
  { title: 'SENSORS', subtitle: 'The body becomes measurable data.' },
  { title: 'EMBEDDED SYSTEMS', subtitle: 'A controller turns measurements into information.' },
  { title: 'AI & DATA', subtitle: 'Algorithms transform information into insight.' },
  { title: 'MEDICAL ROBOTICS', subtitle: 'Engineering becomes action for healthcare.' },
];

const BiomedicalCity: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let running = true;
    let start = performance.now();

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

    const drawPulse = (x: number, y: number, width: number, phase: number) => {
      ctx.beginPath();
      for (let i = 0; i <= width; i += 2) {
        const t = i / width;
        const yy = y + Math.sin(t * Math.PI * 8 + phase) * (4 + Math.sin(t * Math.PI) * 10);
        if (i === 0) ctx.moveTo(x + i, yy);
        else ctx.lineTo(x + i, yy);
      }
      ctx.stroke();
    };

    const draw = (now: number) => {
      if (!running) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const elapsed = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#030914');
      sky.addColorStop(0.58, '#071b2a');
      sky.addColorStop(1, '#02070d');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Subtle laboratory/city background.
      ctx.strokeStyle = 'rgba(85, 220, 255, .07)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 42) {
        ctx.beginPath(); ctx.moveTo(x, h * .42); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = h * .42; y < h; y += 42) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      const cx = w * 0.58;
      const cy = h * 0.56;
      const scale = Math.min(w / 1100, h / 650);

      // Central biomedical workstation.
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      // Floor platform.
      ctx.fillStyle = 'rgba(20, 43, 58, .72)';
      ctx.beginPath();
      ctx.ellipse(0, 125, 390, 48, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(84, 225, 255, .22)';
      ctx.stroke();

      // Main monitor.
      ctx.fillStyle = '#0b1c2b';
      roundedRect(-190, -165, 380, 230, 16); ctx.fill();
      ctx.strokeStyle = 'rgba(93, 225, 255, .42)'; ctx.stroke();
      ctx.fillStyle = '#020b12';
      roundedRect(-168, -143, 336, 170, 8); ctx.fill();

      // ECG/data visualization on monitor.
      ctx.strokeStyle = '#6cecff';
      ctx.lineWidth = 2;
      drawPulse(-145, -57, 290, elapsed * 5);
      ctx.strokeStyle = 'rgba(108, 236, 255, .18)';
      ctx.lineWidth = 1;
      for (let y = -115; y <= 5; y += 30) {
        ctx.beginPath(); ctx.moveTo(-150, y); ctx.lineTo(150, y); ctx.stroke();
      }

      // Workstation stand.
      ctx.fillStyle = '#122b3d';
      ctx.fillRect(-12, 65, 24, 55);
      ctx.fillRect(-70, 118, 140, 9);

      // Circuit board on the left.
      ctx.fillStyle = '#0b2b2b';
      roundedRect(-365, 10, 125, 78, 8); ctx.fill();
      ctx.strokeStyle = 'rgba(82, 232, 191, .55)'; ctx.stroke();
      ctx.fillStyle = '#3dd6b0';
      ctx.fillRect(-335, 30, 24, 24);
      ctx.fillRect(-293, 30, 42, 8);
      ctx.fillRect(-293, 47, 26, 8);
      ctx.strokeStyle = 'rgba(88, 235, 194, .5)';
      ctx.beginPath(); ctx.moveTo(-355, 68); ctx.lineTo(-320, 68); ctx.lineTo(-305, 56); ctx.lineTo(-255, 56); ctx.stroke();

      // Sensor module on the right.
      ctx.fillStyle = '#152a38';
      roundedRect(240, 10, 125, 78, 8); ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, .2)'; ctx.stroke();
      ctx.fillStyle = '#d9f7ff';
      ctx.beginPath(); ctx.arc(275, 49, 17, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#183847';
      ctx.beginPath(); ctx.arc(275, 49, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#66e8ff';
      ctx.fillRect(305, 30, 38, 6); ctx.fillRect(305, 47, 27, 6); ctx.fillRect(305, 64, 45, 6);

      // Medical robotic arm.
      ctx.strokeStyle = 'rgba(215, 239, 246, .9)';
      ctx.lineWidth = 15;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(305, 115);
      ctx.lineTo(335, 52);
      ctx.lineTo(290, -12);
      ctx.lineTo(330, -72);
      ctx.stroke();
      ctx.fillStyle = '#193445';
      [[305,115],[335,52],[290,-12],[330,-72]].forEach(([x,y]) => { ctx.beginPath(); ctx.arc(x,y,12,0,Math.PI*2); ctx.fill(); });
      ctx.fillStyle = '#73eaff';
      ctx.fillRect(322, -91, 18, 34);
      ctx.fillRect(338, -89, 18, 28);

      // Moving data particles connect the system.
      const particle = (Math.sin(elapsed * 2.2) + 1) / 2;
      const px = -360 + particle * 720;
      ctx.fillStyle = '#72edff';
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#72edff';
      ctx.beginPath(); ctx.arc(px, -105, 4, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();

      // Stage markers.
      const lineY = h * 0.88;
      const left = w * 0.22;
      const right = w * 0.9;
      ctx.strokeStyle = 'rgba(109, 227, 255, .18)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(left, lineY); ctx.lineTo(right, lineY); ctx.stroke();
      stages.forEach((_, i) => {
        const x = left + ((right - left) * i) / (stages.length - 1);
        ctx.fillStyle = i === stageIndex ? '#72edff' : 'rgba(180, 225, 235, .35)';
        ctx.beginPath(); ctx.arc(x, lineY, i === stageIndex ? 5 : 3, 0, Math.PI * 2); ctx.fill();
      });

      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    frame = requestAnimationFrame(draw);

    const timer = window.setInterval(() => {
      setStageIndex(v => (v + 1) % stages.length);
    }, 3600);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.clearInterval(timer);
      window.removeEventListener('resize', resize);
    };
  }, [stageIndex]);

  const stage = stages[stageIndex];

  return (
    <section className="biomedical-city" id="city">
      <canvas ref={canvasRef} aria-label="Animated biomedical engineering laboratory" />
      <div className="city-vignette" />
      <div className="city-hud">
        <div className="city-kicker">BIOMEDICAL ENGINEERING • 2026</div>
        <h2>Biomedical City</h2>
        <div className="city-story">
          <span className="city-stage-number">0{stageIndex + 1}</span>
          <div>
            <strong>{stage.title}</strong>
            <p>{stage.subtitle}</p>
          </div>
        </div>
        <p className="city-description">
          From electronics and sensors to intelligent systems and medical robotics —
          follow the chain from a physical signal to a healthcare solution.
        </p>
        <div className="city-progress">
          {stages.map((item, i) => (
            <button
              key={item.title}
              className={i === stageIndex ? 'active' : ''}
              onClick={() => setStageIndex(i)}
              aria-label={`Show ${item.title}`}
            />
          ))}
        </div>
        <div className="city-controls">A living engineering system • click the points to explore</div>
      </div>
      <div className="city-label">SIGNAL → DATA → INTELLIGENCE → CARE</div>
    </section>
  );
};

export default BiomedicalCity;
