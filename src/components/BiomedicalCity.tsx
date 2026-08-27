import React, { useEffect, useRef, useState } from 'react';
import './BiomedicalCity.scss';

type Scene = { title: string; subtitle: string };

const scenes: Scene[] = [
  { title: 'ARRIVAL', subtitle: 'A patient enters the hospital.' },
  { title: 'CHECK-IN', subtitle: 'Vitals are collected by an intelligent station.' },
  { title: 'EXAMINATION', subtitle: 'Sensors capture physiological signals.' },
  { title: 'ANALYSIS', subtitle: 'Clinical data becomes useful information.' },
  { title: 'ASSISTANCE', subtitle: 'Robotic precision supports clinical care.' },
  { title: 'CARE', subtitle: 'Technology quietly returns to the patient.' },
];

const BiomedicalCity: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const sceneRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let raf = 0;
    let alive = true;
    let sceneStarted = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const person = (x: number, y: number, s: number, walk = 0) => {
      ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#dcecf0'; ctx.fillStyle = '#dcecf0'; ctx.lineWidth = 4 * s; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(0, -48*s, 10*s, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(0,-37*s); ctx.lineTo(0,4*s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,-24*s); ctx.lineTo((-18+walk)*s,-5*s); ctx.moveTo(0,-24*s); ctx.lineTo((18-walk)*s,-5*s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,4*s); ctx.lineTo((-13-walk)*s,42*s); ctx.moveTo(0,4*s); ctx.lineTo((13+walk)*s,42*s); ctx.stroke(); ctx.restore();
    };

    const robotArm = (x: number, y: number, s: number, t: number) => {
      const q = Math.sin(t*1.1)*18;
      ctx.save(); ctx.translate(x,y); ctx.scale(s,s); ctx.strokeStyle='#d9e9ed'; ctx.lineWidth=14; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(0,110); ctx.lineTo(-10,45); ctx.lineTo(28+q,-8); ctx.lineTo(4+q*1.2,-64); ctx.stroke();
      ctx.fillStyle='#173443'; [[0,110],[-10,45],[28+q,-8],[4+q*1.2,-64]].forEach(([a,b])=>{ctx.beginPath();ctx.arc(a,b,11,0,Math.PI*2);ctx.fill();});
      ctx.fillStyle='#70e9ff'; ctx.fillRect(q*1.2-3,-88,13,28); ctx.restore();
    };

    const heart = (x:number,y:number,s:number,t:number) => {
      const p=1+Math.sin(t*5)*.05; ctx.save();ctx.translate(x,y);ctx.scale(s*p,s*p);ctx.fillStyle='#67e8ff';ctx.beginPath();
      ctx.moveTo(0,26);ctx.bezierCurveTo(-55,-10,-40,-48,-13,-40);ctx.bezierCurveTo(0,-36,0,-20,0,-20);ctx.bezierCurveTo(0,-20,0,-36,13,-40);ctx.bezierCurveTo(40,-48,55,-10,0,26);ctx.fill();ctx.restore();
    };

    const screen = (x:number,y:number,w:number,h:number) => {
      ctx.fillStyle='#081923';ctx.strokeStyle='rgba(111,230,250,.4)';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(x,y,w,h,12);ctx.fill();ctx.stroke();
    };

    const draw = (now:number) => {
      if(!alive) return;
      const w=canvas.clientWidth,h=canvas.clientHeight,t=(now-sceneStarted)/1000,s=sceneRef.current;
      const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#020811');bg.addColorStop(.6,'#071b29');bg.addColorStop(1,'#02060b');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);

      // Futuristic but believable hospital architecture.
      ctx.fillStyle='rgba(12,34,48,.7)';ctx.fillRect(w*.38,h*.16,w*.57,h*.68);ctx.strokeStyle='rgba(111,224,244,.12)';
      for(let x=w*.38;x<w*.96;x+=72){ctx.beginPath();ctx.moveTo(x,h*.16);ctx.lineTo(x,h*.84);ctx.stroke();}
      ctx.beginPath();ctx.moveTo(w*.38,h*.47);ctx.lineTo(w*.96,h*.47);ctx.stroke();
      ctx.fillStyle='rgba(18,46,61,.8)';ctx.beginPath();ctx.moveTo(0,h*.72);ctx.lineTo(w,h*.59);ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fill();
      ctx.strokeStyle='rgba(105,224,245,.16)';ctx.beginPath();ctx.moveTo(0,h*.82);ctx.lineTo(w,h*.68);ctx.stroke();

      // Examination room.
      const rx=w*.58,ry=h*.27;screen(rx,ry,w*.27,h*.37);ctx.fillStyle='rgba(102,231,255,.07)';ctx.fillRect(rx+25,ry+28,w*.27-50,h*.21);
      ctx.fillStyle='#a9dce7';ctx.font='11px system-ui,sans-serif';ctx.fillText('ROOM 03  •  CLINICAL LAB',rx+25,ry+h*.32);

      if(s===0){
        const p=Math.min(1,t/5);person(w*(.06+p*.38),h*.71,.9,Math.sin(t*7)*5);
        ctx.fillStyle='#72e9ff';ctx.font='bold 11px system-ui,sans-serif';ctx.fillText('MAIN ENTRANCE',w*.06,h*.64);
      } else if(s===1){
        person(w*.48,h*.66,.95,Math.sin(t*4)*2);screen(w*.27,h*.34,w*.18,h*.27);ctx.fillStyle='#72e9ff';ctx.font='bold 13px system-ui,sans-serif';ctx.fillText('CHECK-IN',w*.30,h*.41);ctx.fillStyle='#9fbcc5';ctx.font='11px system-ui,sans-serif';ctx.fillText('VITAL SIGNS',w*.30,h*.47);ctx.fillText('SpO₂     98%',w*.30,h*.52);ctx.fillText('HR       78 BPM',w*.30,h*.57);
      } else if(s===2){
        person(w*.71,h*.66,.85);ctx.fillStyle='#72e9ff';ctx.font='11px system-ui,sans-serif';ctx.fillText('ECG  •  SENSOR ARRAY ACTIVE',w*.48,h*.39);ctx.strokeStyle='#6cecff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(w*.48,h*.48);for(let i=0;i<w*.31;i+=3){const yy=h*.48+Math.sin(i*.11+t*4)*7+(i%47<5?-18:0);ctx.lineTo(w*.48+i,yy);}ctx.stroke();
      } else if(s===3){
        screen(w*.48,h*.27,w*.35,h*.34);ctx.fillStyle='#73eaff';ctx.font='bold 12px system-ui,sans-serif';ctx.fillText('PATIENT DATA  •  PROCESSING',w*.51,h*.33);ctx.strokeStyle='rgba(113,234,255,.65)';ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(w*.51,h*(.40+i*.045));ctx.lineTo(w*(.75+Math.sin(t*2+i)*.03),h*(.40+i*.045));ctx.stroke();}heart(w*.78,h*.70,.62,t);
      } else if(s===4){
        person(w*.73,h*.69,.8);robotArm(w*.58,h*.54,.72,t);ctx.fillStyle='#73eaff';ctx.font='11px system-ui,sans-serif';ctx.fillText('ROBOTIC ASSISTANCE',w*.51,h*.29);ctx.fillText('PRECISION  •  CONTROL  •  SAFETY',w*.51,h*.33);
      } else {
        person(w*.70,h*.68,.86);heart(w*.70,h*.49,.58,t);ctx.fillStyle='#b9dfe7';ctx.font='12px system-ui,sans-serif';ctx.fillText('CARE COMPLETED',w*.61,h*.30);ctx.fillStyle='#73eaff';ctx.font='bold 14px system-ui,sans-serif';ctx.fillText('TECHNOLOGY → HUMAN CARE',w*.56,h*.35);
      }

      // A small moving signal connects each scene.
      const progress=(t%3.2)/3.2,px=w*.08+progress*w*.78,py=h*.79;ctx.strokeStyle='rgba(107,229,251,.2)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(w*.08,py);ctx.lineTo(w*.86,py);ctx.stroke();ctx.fillStyle='#73eaff';ctx.shadowBlur=12;ctx.shadowColor='#73eaff';ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
      const vg=ctx.createRadialGradient(w*.55,h*.48,20,w*.55,h*.48,Math.max(w,h)*.75);vg.addColorStop(0,'transparent');vg.addColorStop(1,'rgba(0,0,0,.6)');ctx.fillStyle=vg;ctx.fillRect(0,0,w,h);
      raf=requestAnimationFrame(draw);
    };

    resize();window.addEventListener('resize',resize);raf=requestAnimationFrame(draw);
    const timer=window.setInterval(()=>{const next=(sceneRef.current+1)%scenes.length;sceneRef.current=next;sceneStarted=performance.now();setSceneIndex(next);},5500);
    return()=>{alive=false;cancelAnimationFrame(raf);clearInterval(timer);window.removeEventListener('resize',resize);};
  },[]);

  const scene=scenes[sceneIndex];
  return <section className="biomedical-city" id="city">
    <canvas ref={canvasRef} aria-label="Cinematic biomedical patient journey" />
    <div className="city-vignette" />
    <div className="city-hud">
      <div className="city-kicker">BIOMEDICAL ENGINEERING • A SHORT JOURNEY</div>
      <h2>Biomedical City</h2>
      <div className="city-story"><span className="city-scene-number">0{sceneIndex+1}</span><div><strong>{scene.title}</strong><p>{scene.subtitle}</p></div></div>
      <p className="city-description">A patient journey through a future hospital — where electronics, sensing, intelligent systems and robotics work quietly together around care.</p>
      <div className="city-progress">{scenes.map((item,i)=><button key={item.title} className={i===sceneIndex?'active':''} onClick={()=>{sceneRef.current=i;setSceneIndex(i);}} aria-label={`Show ${item.title}`} />)}</div>
      <div className="city-controls">A continuous story • click a point to explore</div>
    </div>
    <div className="city-label">PATIENT → SIGNAL → DATA → INTELLIGENCE → CARE</div>
  </section>;
};

export default BiomedicalCity;
