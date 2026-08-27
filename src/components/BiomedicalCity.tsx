import React, { useEffect, useRef, useState } from 'react';
import './BiomedicalCity.scss';

declare const THREE: any;

type Scene = { title: string; subtitle: string; duration: number };
const scenes: Scene[] = [
  { title: 'ARRIVAL', subtitle: 'The patient approaches the future hospital.', duration: 3000 },
  { title: 'ENTRY', subtitle: 'Automatic doors welcome the patient.', duration: 3000 },
  { title: 'CHECK-IN', subtitle: 'An intelligent station prepares the patient.', duration: 3000 },
  { title: 'CORRIDOR', subtitle: 'The patient is guided to the examination room.', duration: 3000 },
  { title: 'EXAMINATION', subtitle: 'Medical sensors position around the patient.', duration: 4000 },
  { title: 'BIOSIGNALS', subtitle: 'ECG, SpO₂ and temperature become live signals.', duration: 3000 },
  { title: 'ANALYSIS', subtitle: 'The system transforms signals into clinical information.', duration: 3000 },
  { title: 'ROBOTICS', subtitle: 'A medical robotic arm assists with precision.', duration: 3000 },
  { title: 'CARE', subtitle: 'Technology brings the journey back to the patient.', duration: 3000 },
  { title: 'SIGNATURE', subtitle: 'Engineering technology for better healthcare.', duration: 2000 },
];
const totalDuration = scenes.reduce((s, x) => s + x.duration, 0);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const ease = (v: number) => v * v * (3 - 2 * v);

function loadThree() {
  return new Promise<void>((resolve, reject) => {
    if (typeof THREE !== 'undefined') return resolve();
    const old = document.querySelector('script[data-biomedical-three]');
    if (old) { old.addEventListener('load', () => resolve()); old.addEventListener('error', reject); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.min.js';
    s.async = true; s.dataset.biomedicalThree = 'true'; s.onload = () => resolve(); s.onerror = reject;
    document.head.appendChild(s);
  });
}

const BiomedicalCity: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const timeline = useRef(0);
  const paused = useRef(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let dead = false; let raf = 0; let renderer: any;
    loadThree().then(() => {
      if (dead || !mountRef.current) return;
      const T = THREE, mount = mountRef.current;
      const scene = new T.Scene(); scene.background = new T.Color(0x02070d); scene.fog = new T.FogExp2(0x06141d, 0.018);
      const camera = new T.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 180);
      renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75)); renderer.setSize(mount.clientWidth, mount.clientHeight); renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap; renderer.outputColorSpace = T.SRGBColorSpace; mount.appendChild(renderer.domElement);
      scene.add(new T.HemisphereLight(0xbdefff, 0x071018, 2));
      const key = new T.DirectionalLight(0xd9f7ff, 3); key.position.set(8, 18, 10); key.castShadow = true; scene.add(key);
      const glowLight = new T.PointLight(0x55ddff, 16, 42); glowLight.position.set(-10, 7, 2); scene.add(glowLight);
      const groups: Record<string, any> = {}; ['hospital','patient','entry','checkin','corridor','exam','monitor','analysis','robot'].forEach(k => { groups[k] = new T.Group(); scene.add(groups[k]); });
      const M = (c: number, metal=0.2, rough=0.45, e=0, ei=0) => new T.MeshStandardMaterial({ color:c, metalness:metal, roughness:rough, emissive:e, emissiveIntensity:ei });
      const dark=M(0x081820,.55,.32), blue=M(0x124258,.45,.35), white=M(0xdce9eb,.55,.3), cyan=M(0x55e6ff,.2,.2,0x2bdfff,2.3), glass=new T.MeshPhysicalMaterial({color:0x1a4557,transparent:true,opacity:.36,roughness:.08,metalness:.1});
      const box=(g:any,x:number,y:number,z:number,sx:number,sy:number,sz:number,m:any)=>{const o=new T.Mesh(new T.BoxGeometry(sx,sy,sz),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;};
      const cyl=(g:any,x:number,y:number,z:number,r:number,h:number,m:any)=>{const o=new T.Mesh(new T.CylinderGeometry(r,r,h,20),m);o.position.set(x,y,z);o.castShadow=true;g.add(o);return o;};

      // Modern hospital exterior and approach.
      box(groups.hospital,0,-.3,0,42,.5,34,M(0x07121a,.1,.82)); box(groups.hospital,0,5,-7,26,10,7,dark); box(groups.hospital,-11,3,-1.8,4,6.2,10,blue); box(groups.hospital,11,3,-1.8,4,6.2,10,blue);
      box(groups.hospital,0,4.6,-3.25,9.2,9.2,.3,glass); box(groups.hospital,0,9.9,-3.25,9.6,.12,.12,cyan);
      for(let y=2.1;y<9;y+=1.6) for(let x=-9;x<=9;x+=3) box(groups.hospital,x,y,-3.08,1.4,.82,.07,glass);
      for(let z=8;z>=-20;z-=3.5) box(groups.hospital,-13.2,2.5,z,.06,5,.06,cyan);

      // Patient model: simple, readable and deliberately non-photorealistic.
      box(groups.patient,0,1.65,0,.72,1.45,.42,white); cyl(groups.patient,0,2.65,0,.31,.5,white);
      const armL=cyl(groups.patient,-.48,1.62,0,.11,1.15,white), armR=cyl(groups.patient,.48,1.62,0,.11,1.15,white); armL.rotation.z=-.12; armR.rotation.z=.12;
      cyl(groups.patient,-.22,.45,0,.11,1.45,white); cyl(groups.patient,.22,.45,0,.11,1.45,white); groups.patient.scale.set(.8,.8,.8);

      // Entry doors.
      box(groups.entry,-2,3,0,3.8,6,1.2,dark); box(groups.entry,2,3,0,3.8,6,1.2,dark);
      const doorL=box(groups.entry,-1.05,2.6,.15,1.8,4.8,.12,glass), doorR=box(groups.entry,1.05,2.6,.15,1.8,4.8,.12,glass); box(groups.entry,0,5.2,.15,5.8,.12,.12,cyan);

      // Check-in station.
      box(groups.checkin,0,1.5,0,2.2,3,.65,dark); box(groups.checkin,0,2.35,-.36,1.55,1.15,.08,M(0x102d3a,.2,.2,0x28cfff,1.4)); box(groups.checkin,0,.55,-.39,1.25,.08,.08,cyan);

      // Corridor with perspective geometry.
      box(groups.corridor,-5.2,2.4,-7,.35,5,24,dark); box(groups.corridor,5.2,2.4,-7,.35,5,24,dark); box(groups.corridor,0,-.05,-7,10.4,.12,24,M(0x0b2029,.2,.55));
      for(let z=3;z>=-18;z-=4) box(groups.corridor,0,.03,z,.05,.04,1.6,cyan);
      for(let z=1;z>=-17;z-=4){box(groups.corridor,-5,2.5,z,.08,4,2.2,glass);box(groups.corridor,5,2.5,z,.08,4,2.2,glass);}

      // Examination bed + overhead sensor ring.
      box(groups.exam,0,.82,0,5.8,.3,2.1,blue); box(groups.exam,0,1.18,-.35,5.2,.2,1.8,white); box(groups.exam,-2.45,2,0,.16,2.1,.16,dark); box(groups.exam,2.45,2,0,.16,2.1,.16,dark); box(groups.exam,0,3.05,0,.18,.18,.18,cyan);
      const sensorRing=new T.Mesh(new T.TorusGeometry(2.25,.045,12,64),cyan); sensorRing.position.set(0,3.05,0); sensorRing.rotation.x=Math.PI/2; groups.exam.add(sensorRing); groups.exam.position.z=-1;

      // Patient monitor + live ECG.
      box(groups.monitor,0,2.9,-2.2,3.8,2.5,.25,dark); box(groups.monitor,0,2.9,-2.36,3.45,2.1,.06,M(0x07161d,.2,.2,0x28dfff,.8));
      const ecg:any[]=[]; for(let i=0;i<48;i++) ecg.push(box(groups.monitor,-1.5+i*.064,3,-2.42,.05,.035,.025,cyan)); groups.monitor.position.set(4.2,0,-1);

      // Analysis core.
      const r1=new T.Mesh(new T.TorusGeometry(2.3,.05,12,64),cyan), r2=new T.Mesh(new T.TorusGeometry(1.45,.035,12,64),cyan); r1.position.set(0,3,0);r2.position.set(0,3,0);r2.rotation.x=Math.PI/2;groups.analysis.add(r1,r2);cyl(groups.analysis,0,3,0,.55,1.1,M(0x173d4d,.4,.15,0x29dfff,2));groups.analysis.position.z=-3;

      // Real 3D articulated robotic arm.
      cyl(groups.robot,0,.45,0,.8,.9,dark); const j1=new T.Group();j1.position.set(0,.9,0);groups.robot.add(j1);cyl(j1,0,1.1,0,.42,2.2,white);const j2=new T.Group();j2.position.set(0,2.15,0);j1.add(j2);cyl(j2,0,1.1,0,.34,2.1,white);const wrist=new T.Group();wrist.position.set(0,2.1,0);j2.add(wrist);cyl(wrist,0,.55,0,.24,1,white);box(wrist,0,1.05,-.12,.32,.55,.32,cyan);groups.robot.position.set(3.8,0,-1.4);

      const visible=(names:string[])=>Object.entries(groups).forEach(([k,g])=>g.visible=names.includes(k));
      const target=new T.Vector3(), from=new T.Vector3(), to=new T.Vector3();
      const cameraMove=(p:number,a:number[],b:number[],ta:number[],tb:number[])=>{camera.position.lerpVectors(from.set(...a),to.set(...b),p);target.set(...ta).lerp(new T.Vector3(...tb),p);camera.lookAt(target);};
      const clock=new T.Clock();
      const animate=()=>{if(dead)return;const dt=Math.min(clock.getDelta(),.05);if(!paused.current)timeline.current=(timeline.current+dt*1000)%totalDuration;let cur=timeline.current,idx=0;while(idx<scenes.length-1&&cur>=scenes[idx].duration){cur-=scenes[idx].duration;idx++;}const p=ease(clamp(cur/scenes[idx].duration,0,1));setSceneIndex(v=>v===idx?v:idx);
        visible(idx===0?['hospital','patient']:idx===1?['entry','patient']:idx===2?['checkin','patient']:idx===3?['corridor','patient']:idx<=5?['exam','patient','monitor']:idx===6?['analysis','monitor']:idx===7?['robot','patient']:idx===8?['exam','patient']:['hospital','patient']);
        groups.patient.position.x=idx<=3?-4+p*7:0;groups.patient.position.z=idx===0?3.8-p*5:idx===3?4-p*7:idx>=4&&idx<=5?0:3.8;groups.patient.position.y=idx===4||idx===5?1.1:0;groups.patient.rotation.z=idx===4||idx===5?Math.PI/2:0;
        doorL.position.x=-1.05-p*1.15;doorR.position.x=1.05+p*1.15;sensorRing.rotation.z=clock.elapsedTime*.45;r1.rotation.y=clock.elapsedTime*.7;r2.rotation.z=-clock.elapsedTime*.9;j1.rotation.z=Math.sin(clock.elapsedTime*1.2)*.28;j2.rotation.z=Math.sin(clock.elapsedTime*1.6+1)*.35;wrist.rotation.y=Math.sin(clock.elapsedTime*2.2)*.45;ecg.forEach((m:any,i:number)=>m.position.y=3+Math.sin(i*.5+clock.elapsedTime*8)*.06+(i%13===4?-.35:0));
        if(idx===0)cameraMove(p,[15,9,22],[8,7,14],[0,3,-3],[0,3,0]);else if(idx===1)cameraMove(p,[8,4,13],[3.8,3.3,7],[0,2,0],[0,2,0]);else if(idx===2)cameraMove(p,[7,4.5,8],[5.5,3.3,6],[0,1.5,0],[0,1.7,0]);else if(idx===3)cameraMove(p,[8,3.8,8],[0,3,10],[0,1.5,-5],[0,2,-5]);else if(idx===4)cameraMove(p,[9,5,9],[6,3.5,6],[0,1.2,0],[0,1.4,0]);else if(idx===5)cameraMove(p,[7,3.5,7],[5,3.1,4],[1,2,-1],[4.2,2.8,-1]);else if(idx===6)cameraMove(p,[7,4.2,6],[4,3.2,4],[0,3,-3],[0,3,-3]);else if(idx===7)cameraMove(p,[9,5,8],[7,4.2,5],[3.8,2,-1],[3.8,2,-1]);else if(idx===8)cameraMove(p,[6,4,7],[4,3.2,5],[0,1.5,0],[0,1.5,0]);else cameraMove(p,[13,9,16],[17,10,21],[0,3,-3],[0,3,-3]);
        renderer.render(scene,camera);raf=requestAnimationFrame(animate);};
      const resize=()=>{camera.aspect=mount.clientWidth/mount.clientHeight;camera.updateProjectionMatrix();renderer.setSize(mount.clientWidth,mount.clientHeight);};window.addEventListener('resize',resize);animate();
      (mount as any).__cleanup=()=>{window.removeEventListener('resize',resize);cancelAnimationFrame(raf);renderer.dispose();};
    }).catch(()=>{if(mountRef.current)mountRef.current.dataset.error='three';});
    return()=>{dead=true;cancelAnimationFrame(raf);const m=mountRef.current as any;if(m?.__cleanup)m.__cleanup();};
  },[]);

  const jump=(i:number)=>{timeline.current=scenes.slice(0,i).reduce((s,x)=>s+x.duration,0);setSceneIndex(i);};
  const toggle=()=>{paused.current=!paused.current;setIsPaused(paused.current);};
  const current=scenes[sceneIndex];
  return <section className="biomedical-city" id="city" aria-label="Biomedical City — A Patient's Journey">
    <div className="city-3d" ref={mountRef} aria-label="Real-time 3D biomedical city scene"/><div className="city-vignette"/>
    <div className="city-hud"><div className="city-kicker">BIOMEDICAL CITY • A PATIENT'S JOURNEY • 2035</div><h2>Biomedical City</h2><div className="city-story"><span className="city-scene-number">{String(sceneIndex+1).padStart(2,'0')}</span><div><strong>{current.title}</strong><p>{current.subtitle}</p></div></div><p className="city-description">A continuous 3D journey: arrival, examination, biosignals, intelligent analysis, robotics, then human care.</p><div className="city-progress">{scenes.map((s,i)=><button key={s.title} className={i===sceneIndex?'active':''} onClick={()=>jump(i)} aria-label={`Show scene ${i+1}: ${s.title}`}/>)}</div><button className="city-play" onClick={toggle}>{isPaused?'▶ RESUME JOURNEY':'Ⅱ PAUSE JOURNEY'}</button></div>
    <div className="city-label">REAL-TIME 3D • PATIENT → SENSOR → SIGNAL → DATA → INTELLIGENCE → ROBOT → CARE</div>
  </section>;
};
export default BiomedicalCity;
