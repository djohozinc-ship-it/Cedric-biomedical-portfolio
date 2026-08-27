import React, { useEffect, useRef, useState } from 'react';
import './BiomedicalCity.scss';

declare global { interface Window { THREE?: any } }

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
const totalDuration = scenes.reduce((a, s) => a + s.duration, 0);
const clamp = (v:number,a:number,b:number) => Math.max(a,Math.min(b,v));
const ease = (v:number) => v*v*(3-2*v);

function loadThree() {
  return new Promise<void>((resolve,reject) => {
    if (window.THREE) return resolve();
    const urls = ['https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.min.js','https://unpkg.com/three@0.179.1/build/three.min.js'];
    let i = 0;
    const next = () => {
      if (window.THREE) return resolve();
      if (i >= urls.length) return reject(new Error('Three.js could not be loaded'));
      const s = document.createElement('script');
      s.src = urls[i++]; s.async = true; s.dataset.biomedicalThree = 'true';
      s.onload = () => window.THREE ? resolve() : next();
      s.onerror = () => { s.remove(); next(); };
      document.head.appendChild(s);
    };
    next();
  });
}

const BiomedicalCity: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const timeline = useRef(0);
  const paused = useRef(false);
  const [sceneIndex,setSceneIndex] = useState(0);
  const [isPaused,setIsPaused] = useState(false);
  const [error,setError] = useState(false);

  useEffect(() => {
    let dead=false, raf=0, renderer:any;
    const mount=mountRef.current;
    if(!mount) return;

    loadThree().then(() => {
      if(dead || !window.THREE) return;
      try {
        const T=window.THREE;
        const scene=new T.Scene();
        scene.background=new T.Color(0x02070d);
        scene.fog=new T.FogExp2(0x06141d,0.012);
        const camera=new T.PerspectiveCamera(42,Math.max(1,mount.clientWidth)/Math.max(1,mount.clientHeight),0.1,200);
        renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
        renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
        renderer.setSize(Math.max(1,mount.clientWidth),Math.max(1,mount.clientHeight));
        if(T.SRGBColorSpace) renderer.outputColorSpace=T.SRGBColorSpace;
        renderer.shadowMap.enabled=true;
        mount.innerHTML=''; mount.appendChild(renderer.domElement);

        scene.add(new T.HemisphereLight(0xcff5ff,0x061018,2.2));
        const key=new T.DirectionalLight(0xffffff,3.2); key.position.set(10,18,12); key.castShadow=true; scene.add(key);
        const cyanLight=new T.PointLight(0x45ddff,18,45); cyanLight.position.set(-7,7,5); scene.add(cyanLight);

        const g:any={}; ['hospital','patient','entry','checkin','corridor','exam','monitor','analysis','robot'].forEach(k=>{g[k]=new T.Group();scene.add(g[k]);});
        const mat=(c:number,m=0.25,r=0.42,e=0,ei=0)=>new T.MeshStandardMaterial({color:c,metalness:m,roughness:r,emissive:e,emissiveIntensity:ei});
        const dark=mat(0x0a1c25,.65,.3), blue=mat(0x17485b,.45,.34), white=mat(0xdce9eb,.5,.3), cyan=mat(0x54e7ff,.15,.2,0x20dfff,2.5), glass=new T.MeshPhysicalMaterial({color:0x205267,transparent:true,opacity:.4,roughness:.08,metalness:.1});
        const box=(q:any,x:number,y:number,z:number,sx:number,sy:number,sz:number,m:any)=>{const o=new T.Mesh(new T.BoxGeometry(sx,sy,sz),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;q.add(o);return o;};
        const cyl=(q:any,x:number,y:number,z:number,r:number,h:number,m:any)=>{const o=new T.Mesh(new T.CylinderGeometry(r,r,h,24),m);o.position.set(x,y,z);o.castShadow=true;q.add(o);return o;};

        box(g.hospital,0,-.3,0,42,.5,34,mat(0x07131b,.1,.85));
        box(g.hospital,0,5,-7,26,10,7,dark); box(g.hospital,-11,3,-2,4,6,10,blue); box(g.hospital,11,3,-2,4,6,10,blue);
        box(g.hospital,0,4.8,-3.35,9.5,9.4,.3,glass);
        for(let y=2;y<9;y+=1.6) for(let x=-9;x<=9;x+=3) box(g.hospital,x,y,-3.15,1.35,.8,.08,glass);
        box(g.hospital,0,9.8,-3.35,10,.12,.12,cyan);

        cyl(g.patient,0,.75,0,.12,1.5,white); cyl(g.patient,0,2.05,0,.31,.5,white); box(g.patient,0,1.45,0,.7,1.2,.38,white);
        const al=cyl(g.patient,-.45,1.45,0,.1,1.1,white),ar=cyl(g.patient,.45,1.45,0,.1,1.1,white); al.rotation.z=-.15;ar.rotation.z=.15;
        g.patient.scale.set(.8,.8,.8);

        box(g.entry,-2.1,3,0,3.7,6,1.2,dark); box(g.entry,2.1,3,0,3.7,6,1.2,dark);
        const dl=box(g.entry,-1.05,2.6,.15,1.8,4.8,.12,glass),dr=box(g.entry,1.05,2.6,.15,1.8,4.8,.12,glass); box(g.entry,0,5.2,.15,5.8,.1,.1,cyan);
        box(g.checkin,0,1.5,0,2.2,3,.65,dark); box(g.checkin,0,2.35,-.38,1.55,1.15,.08,cyan);
        box(g.corridor,-5.2,2.5,-7,.35,5,25,dark); box(g.corridor,5.2,2.5,-7,.35,5,25,dark); box(g.corridor,0,-.05,-7,10.4,.12,25,blue);
        for(let z=3;z>-20;z-=4) box(g.corridor,0,.03,z,.05,.04,1.7,cyan);

        box(g.exam,0,.82,0,5.8,.3,2.1,blue); box(g.exam,0,1.18,-.3,5.2,.2,1.8,white); box(g.exam,-2.45,2,0,.15,2.1,.15,dark); box(g.exam,2.45,2,0,.15,2.1,.15,dark);
        const ring=new T.Mesh(new T.TorusGeometry(2.25,.06,12,64),cyan); ring.position.set(0,3.05,0); ring.rotation.x=Math.PI/2; g.exam.add(ring); g.exam.position.z=-1;
        box(g.monitor,0,3,-2.2,3.8,2.5,.25,dark); box(g.monitor,0,3,-2.36,3.45,2.1,.06,mat(0x07161d,.2,.2,0x28dfff,1)); g.monitor.position.set(4.2,0,-1);
        const ecg:any[]=[]; for(let i=0;i<52;i++) ecg.push(box(g.monitor,-1.6+i*.06,3,-2.42,.04,.04,.025,cyan));
        const r1=new T.Mesh(new T.TorusGeometry(2.3,.06,12,64),cyan),r2=new T.Mesh(new T.TorusGeometry(1.4,.045,12,64),cyan); r1.position.set(0,3,0);r2.position.set(0,3,0);r2.rotation.x=Math.PI/2;g.analysis.add(r1,r2);cyl(g.analysis,0,3,0,.55,1.1,blue);g.analysis.position.z=-3;
        cyl(g.robot,0,.45,0,.8,.9,dark); const j1=new T.Group();j1.position.y=.9;g.robot.add(j1);cyl(j1,0,1.1,0,.42,2.2,white);const j2=new T.Group();j2.position.y=2.15;j1.add(j2);cyl(j2,0,1.1,0,.34,2.1,white);const wrist=new T.Group();wrist.position.y=2.1;j2.add(wrist);cyl(wrist,0,.55,0,.24,1,white);box(wrist,0,1.05,-.12,.32,.55,.32,cyan);g.robot.position.set(3.8,0,-1.4);

        const clock=new T.Clock(); const target=new T.Vector3(),a=new T.Vector3(),b=new T.Vector3(),ta=new T.Vector3(),tb=new T.Vector3();
        const move=(p:number,from:number[],to:number[],look1:number[],look2:number[])=>{camera.position.lerpVectors(a.set(...from),b.set(...to),p);target.lerpVectors(ta.set(...look1),tb.set(...look2),p);camera.lookAt(target);};
        const show=(names:string[])=>Object.keys(g).forEach(k=>g[k].visible=names.includes(k));
        const animate=()=>{if(dead)return;const dt=Math.min(clock.getDelta(),.05);if(!paused.current)timeline.current=(timeline.current+dt*1000)%totalDuration;let cur=timeline.current,idx=0;while(idx<scenes.length-1&&cur>=scenes[idx].duration){cur-=scenes[idx].duration;idx++;}const p=ease(clamp(cur/scenes[idx].duration,0,1));setSceneIndex(v=>v===idx?v:idx);
          show(idx===0?['hospital','patient']:idx===1?['entry','patient']:idx===2?['checkin','patient']:idx===3?['corridor','patient']:idx<=5?['exam','patient','monitor']:idx===6?['analysis','monitor']:idx===7?['robot','patient']:idx===8?['exam','patient']:['hospital','patient']);
          g.patient.position.x=idx<=3?-4+p*7:0;g.patient.position.z=idx===0?4-p*5:idx===3?4-p*7:idx>=4&&idx<=5?0:3.8;g.patient.position.y=idx>=4&&idx<=5?1.1:0;g.patient.rotation.z=idx>=4&&idx<=5?Math.PI/2:0;
          dl.position.x=-1.05-p*1.15;dr.position.x=1.05+p*1.15;ring.rotation.z=clock.elapsedTime*.45;r1.rotation.y=clock.elapsedTime*.7;r2.rotation.z=-clock.elapsedTime*.9;j1.rotation.z=Math.sin(clock.elapsedTime*1.2)*.28;j2.rotation.z=Math.sin(clock.elapsedTime*1.6)*.35;wrist.rotation.y=Math.sin(clock.elapsedTime*2.2)*.45;ecg.forEach((m:any,i:number)=>m.position.y=3+Math.sin(i*.5+clock.elapsedTime*8)*.06+(i%13===4?-.35:0));
          if(idx===0)move(p,[15,9,22],[8,7,14],[0,3,-3],[0,3,0]);else if(idx===1)move(p,[8,4,13],[3.8,3.3,7],[0,2,0],[0,2,0]);else if(idx===2)move(p,[7,4.5,8],[5.5,3.3,6],[0,1.5,0],[0,1.7,0]);else if(idx===3)move(p,[8,3.8,8],[0,3,10],[0,1.5,-5],[0,2,-5]);else if(idx===4)move(p,[9,5,9],[6,3.5,6],[0,1.2,0],[0,1.4,0]);else if(idx===5)move(p,[7,3.5,7],[5,3.1,4],[1,2,-1],[4.2,2.8,-1]);else if(idx===6)move(p,[7,4.2,6],[4,3.2,4],[0,3,-3],[0,3,-3]);else if(idx===7)move(p,[9,5,8],[7,4.2,5],[3.8,2,-1],[3.8,2,-1]);else if(idx===8)move(p,[6,4,7],[4,3.2,5],[0,1.5,0],[0,1.5,0]);else move(p,[13,9,16],[17,10,21],[0,3,-3],[0,3,-3]);
          renderer.render(scene,camera);raf=requestAnimationFrame(animate);};
        const resize=()=>{camera.aspect=Math.max(1,mount.clientWidth)/Math.max(1,mount.clientHeight);camera.updateProjectionMatrix();renderer.setSize(Math.max(1,mount.clientWidth),Math.max(1,mount.clientHeight));};
        window.addEventListener('resize',resize); animate();
        (mount as any).__cleanup=()=>{window.removeEventListener('resize',resize);cancelAnimationFrame(raf);if(renderer)renderer.dispose();};
      } catch(err) { console.error(err); if(!dead)setError(true); }
    }).catch(err=>{console.error(err);if(!dead)setError(true);});
    return()=>{dead=true;cancelAnimationFrame(raf);const cleanup=(mount as any).__cleanup;if(cleanup)cleanup();};
  },[]);

  const jump=(i:number)=>{timeline.current=scenes.slice(0,i).reduce((a,s)=>a+s.duration,0);setSceneIndex(i);};
  const toggle=()=>{paused.current=!paused.current;setIsPaused(paused.current);};
  const current=scenes[sceneIndex];
  return <section className="biomedical-city" id="city" aria-label="Biomedical City — A Patient's Journey">
    <div ref={mountRef} className="biomedical-city-canvas" />
    {error&&<div className="city-error">Biomedical City 3D could not initialize. Please reload the page.</div>}
    <div className="city-vignette" />
    <div className="city-hud"><div className="city-kicker">BIOMEDICAL CITY • A PATIENT'S JOURNEY • 2035</div><h2>Biomedical City</h2><div className="city-story"><span className="city-scene-number">{String(sceneIndex+1).padStart(2,'0')}</span><div><strong>{current.title}</strong><p>{current.subtitle}</p></div></div><p className="city-description">A continuous patient journey: arrival, examination, biosignals, intelligent analysis, robotics, then human care.</p><div className="city-progress">{scenes.map((s,i)=><button key={s.title} className={i===sceneIndex?'active':''} onClick={()=>jump(i)} aria-label={`Show scene ${i+1}: ${s.title}`} />)}</div><button className="city-play" onClick={toggle}><span>{isPaused?'▶':'Ⅱ'}</span> {isPaused?'RESUME JOURNEY':'PAUSE JOURNEY'}</button></div>
    <div className="city-label">PATIENT → SENSOR → SIGNAL → DATA → INTELLIGENCE → ROBOT → CARE</div>
  </section>;
};
export default BiomedicalCity;
