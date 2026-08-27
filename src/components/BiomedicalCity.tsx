import React,{useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import './BiomedicalCity.scss';

type Scene={title:string;subtitle:string;duration:number};
const scenes:Scene[]=[
 {title:'ARRIVAL',subtitle:'The patient arrives at the smart hospital.',duration:3000},
 {title:'ENTRY',subtitle:'Automatic sliding doors open as the patient approaches.',duration:3000},
 {title:'CHECK-IN',subtitle:'The patient is identified and registered at the self-service station.',duration:3000},
 {title:'CORRIDOR',subtitle:'Guided lighting leads the patient to the examination room.',duration:3000},
 {title:'EXAMINATION',subtitle:'The patient lies on the examination bed while medical sensors connect.',duration:4000},
 {title:'BIOSIGNALS',subtitle:'ECG, SpO₂ and temperature appear as live clinical signals.',duration:3000},
 {title:'ANALYSIS',subtitle:'The clinical platform checks the measurements and highlights the result.',duration:3000},
 {title:'ROBOTICS',subtitle:'A precision medical robot assists the care team.',duration:3000},
 {title:'CARE',subtitle:'The patient is reassured and celebrates the good outcome.',duration:3000},
 {title:'SIGNATURE',subtitle:'Engineering technology for better healthcare.',duration:3000}
];
const totalDuration=scenes.reduce((a,s)=>a+s.duration,0);const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));const ease=(v:number)=>v*v*(3-2*v);type V3=[number,number,number];

const BiomedicalCity:React.FC=()=>{
 const mountRef=useRef<HTMLDivElement>(null),timeline=useRef(0),paused=useRef(false);
 const [sceneIndex,setSceneIndex]=useState(0),[isPaused,setIsPaused]=useState(false),[error,setError]=useState(false);
 useEffect(()=>{
  const mount=mountRef.current;if(!mount)return;let dead=false,raf=0;
  try{
   const scene=new THREE.Scene();scene.background=new THREE.Color(0x0a1218);scene.fog=new THREE.Fog(0x0a1218,28,80);
   const camera=new THREE.PerspectiveCamera(44,1,.1,140);
   const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;mount.innerHTML='';mount.appendChild(renderer.domElement);
   scene.add(new THREE.HemisphereLight(0xeaf7ff,0x26333b,2.4));const sun=new THREE.DirectionalLight(0xffffff,3.4);sun.position.set(12,18,10);sun.castShadow=true;scene.add(sun);const cyan=new THREE.PointLight(0x43dcff,22,42);cyan.position.set(-7,7,5);scene.add(cyan);const warm=new THREE.PointLight(0xffd4a0,7,30);warm.position.set(7,5,2);scene.add(warm);
   const g:Record<string,THREE.Group>={};['hospital','entry','patient','checkin','corridor','exam','signals','analysis','robot','care'].forEach(k=>{g[k]=new THREE.Group();scene.add(g[k]);});
   const M=(c:number,r=.45,m=.15,e=0,ei=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m,emissive:e,emissiveIntensity:ei});
   const floor=M(0x697174,.72,.05),wall=M(0xd5d9d8,.82,.05),dark=M(0x202a2f,.38,.65),steel=M(0xbac4c6,.25,.75),blue=M(0x376875,.34,.4),screen=M(0x10272d,.2,.35,0x0b788d,.8),green=M(0x52d58b,.3,.2,0x159a51,1.8),cyanMat=M(0x52dcff,.25,.15,0x20dfff,2.2),skin=M(0xc98f72,.7,.02),shirt=M(0x315d8d,.6,.08),pants=M(0x26333d,.72,.15),shoe=M(0x11161b,.35,.6),white=M(0xf0f2ef,.9,.02),red=M(0xd65c5c,.38,.2,0x8b1717,1);
   const glass=new THREE.MeshPhysicalMaterial({color:0x9fcbd2,transparent:true,opacity:.34,roughness:.08,metalness:.1});
   const box=(q:THREE.Object3D,p:V3,s:V3,mat:THREE.Material)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(...s),mat);o.position.set(...p);o.castShadow=o.receiveShadow=true;q.add(o);return o;};
   const cyl=(q:THREE.Object3D,p:V3,r:number,h:number,mat:THREE.Material)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,24),mat);o.position.set(...p);o.castShadow=true;q.add(o);return o;};
   const sphere=(q:THREE.Object3D,p:V3,r:number,mat:THREE.Material)=>{const o=new THREE.Mesh(new THREE.SphereGeometry(r,24,16),mat);o.position.set(...p);o.castShadow=true;q.add(o);return o;};
   // Hospital exterior.
   box(g.hospital,[0,-.35,0],[42,.55,32],floor);box(g.hospital,[0,5,-8],[27,10,7],wall);box(g.hospital,[-12,3,-2],[4,6,10],blue);box(g.hospital,[12,3,-2],[4,6,10],blue);for(let x=-9;x<=9;x+=3)for(let y=2;y<=8;y+=2)box(g.hospital,[x,y,-4.38],[1.8,1.15,.08],glass);box(g.hospital,[0,2.8,-4.05],[6.4,5.8,.3],dark);box(g.hospital,[0,9.8,-4.4],[11,.12,.14],cyanMat);
   // Complete human with visible head, arms, legs and shoes.
   sphere(g.patient,[0,2.85,0],.32,skin);cyl(g.patient,[0,2.43,0],.11,.2,skin);box(g.patient,[0,1.72,0],[.72,1.25,.42],shirt);const armL=box(g.patient,[-.52,1.76,0],[.18,1.05,.2],skin),armR=box(g.patient,[.52,1.76,0],[.18,1.05,.2],skin);armL.rotation.z=-.1;armR.rotation.z=.1;box(g.patient,[-.22,.68,0],[.25,1.05,.28],pants);box(g.patient,[.22,.68,0],[.25,1.05,.28],pants);box(g.patient,[-.22,.12,-.05],[.34,.18,.58],shoe);box(g.patient,[.22,.12,-.05],[.34,.18,.58],shoe);g.patient.scale.set(.9,.9,.9);
   // Entrance and sliding doors.
   box(g.entry,[-2.7,3,-.2],[2.2,6,1.4],dark);box(g.entry,[2.7,3,-.2],[2.2,6,1.4],dark);const doorL=box(g.entry,[-1.15,2.6,.35],[2.05,4.8,.12],glass),doorR=box(g.entry,[1.15,2.6,.35],[2.05,4.8,.12],glass);box(g.entry,[0,5.2,.35],[6.3,.12,.12],cyanMat);
   // Check-in kiosk with visible screen, scan pad and confirmation light.
   box(g.checkin,[0,1.55,0],[2.2,3,.7],dark);box(g.checkin,[0,2.35,-.38],[1.62,1.1,.08],screen);box(g.checkin,[0,1.5,-.41],[1.1,.12,.05],green);box(g.checkin,[0,.45,-.32],[.7,.12,.45],steel);for(let i=0;i<3;i++)box(g.checkin,[-.45+i*.45,1.75,-.42],[.22,.12,.04],i===1?green:steel);
   // Corridor and room markers.
   box(g.corridor,[0,-.05,-8],[11,.15,28],floor);box(g.corridor,[-5.3,2.8,-8],[.3,5.7,28],wall);box(g.corridor,[5.3,2.8,-8],[.3,5.7,28],wall);for(let z=3;z>-20;z-=3)box(g.corridor,[0,.05,z],[.08,.04,1.4],cyanMat);box(g.corridor,[-4.9,2.8,-9],[.12,5.2,3.2],glass);
   // Examination bed, pillow, overhead lamp, monitor, SpO2 probe and temperature sensor.
   box(g.exam,[0,.72,0],[5.8,.25,2.25],steel);box(g.exam,[0,.91,-.2],[5.25,.25,1.9],white);box(g.exam,[0,1.2,-1.0],[5.15,.65,.22],wall);box(g.exam,[0,2.65,0],[.18,3.5,.18],steel);const lamp=new THREE.Mesh(new THREE.TorusGeometry(1.65,.1,12,48),cyanMat);lamp.position.set(0,4.35,0);lamp.rotation.x=Math.PI/2;g.exam.add(lamp);box(g.exam,[-3.05,1.8,0],[.35,2.8,1.2],dark);box(g.exam,[-3.35,2.65,0],[.9,.55,.35],screen);cyl(g.exam,[1.35,1.3,-.45],.11,.22,red);cyl(g.exam,[1.7,1.3,-.45],.11,.22,green);box(g.exam,[1.15,1.5,-.45],[1,.06,.06],steel);for(let i=0;i<4;i++){const lead=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,1.25,10),cyanMat);lead.position.set(-.75+i*.5,1.45,.18);lead.rotation.z=(i-1.5)*.18;g.exam.add(lead);}
   // Large monitor and animated ECG trace.
   box(g.signals,[4.2,2.9,-1.5],[3.7,2.7,.3],dark);box(g.signals,[4.2,2.9,-1.68],[3.25,2.15,.06],screen);const pts:THREE.Vector3[]=[];for(let i=0;i<110;i++){const phase=i%22;const y=phase===7?.38:phase===8?-.22:phase===9?.18:Math.sin(i*.42)*.025;pts.push(new THREE.Vector3(-1.42+i*.026,y,0));}const trace=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x55e89a}));trace.position.set(4.2,3.08,-1.72);g.signals.add(trace);box(g.signals,[3.2,2.18,-1.72],[.75,.22,.04],green);box(g.signals,[4.15,2.18,-1.72],[.75,.22,.04],cyanMat);box(g.signals,[5.1,2.18,-1.72],[.75,.22,.04],green);
   // Analysis dashboard.
   box(g.analysis,[0,3,-3.4],[5.8,3.6,.3],dark);box(g.analysis,[0,3,-3.58],[5.3,3.05,.05],screen);[1.55,1.05,.55].forEach((r,i)=>{const t=new THREE.Mesh(new THREE.TorusGeometry(r,.04,10,48),i===0?cyanMat:green);t.position.set(-1.35,3,-3.64);g.analysis.add(t);});box(g.analysis,[1.25,3.85,-3.65],[2.1,.16,.05],green);box(g.analysis,[1.25,3.3,-3.65],[1.65,.16,.05],green);box(g.analysis,[1.25,2.75,-3.65],[1.9,.16,.05],cyanMat);
   // Credible articulated medical robot with base, two arms and gripper.
   cyl(g.robot,[0,.5,0],.9,1,dark);const shoulder=new THREE.Group();shoulder.position.y=1;g.robot.add(shoulder);cyl(shoulder,[0,1.05,0],.48,2,steel);const elbow=new THREE.Group();elbow.position.y=2.05;shoulder.add(elbow);cyl(elbow,[0,1.05,0],.4,2,blue);const wrist=new THREE.Group();wrist.position.y=2.05;elbow.add(wrist);cyl(wrist,[0,.5,0],.28,1,steel);box(wrist,[0,1.05,-.12],[.35,.55,.35],cyanMat);box(wrist,[-.2,1.35,-.12],[.12,.55,.12],steel);box(wrist,[.2,1.35,-.12],[.12,.55,.12],steel);g.robot.position.set(3.7,0,-1.5);
   // Care success marker.
   sphere(g.care,[0,4.5,0],.28,green);
   const clock=new THREE.Clock(),a=new THREE.Vector3(),b=new THREE.Vector3(),ta=new THREE.Vector3(),tb=new THREE.Vector3(),look=new THREE.Vector3();
   const move=(p:number,from:V3,to:V3,lf:V3,lt:V3)=>{camera.position.lerpVectors(a.set(...from),b.set(...to),p);look.lerpVectors(ta.set(...lf),tb.set(...lt),p);camera.lookAt(look);};const show=(names:string[])=>Object.keys(g).forEach(k=>g[k].visible=names.includes(k));
   const animate=()=>{if(dead)return;const dt=Math.min(clock.getDelta(),.05);if(!paused.current)timeline.current=(timeline.current+dt*1000)%totalDuration;let t=timeline.current,idx=0;while(idx<scenes.length-1&&t>=scenes[idx].duration){t-=scenes[idx].duration;idx++;}const p=ease(clamp(t/scenes[idx].duration,0,1));setSceneIndex(v=>v===idx?v:idx);
    show(idx===0?['hospital','patient']:idx===1?['entry','patient']:idx===2?['checkin','patient']:idx===3?['corridor','patient']:idx<=5?['exam','patient','signals']:idx===6?['analysis','signals']:idx===7?['robot','patient']:idx===8?['care','patient']:['hospital','patient']);
    if(idx===0){g.patient.position.set(-5+p*5,0,4-p*4);}else if(idx===1){g.patient.position.set(-2+p*2,0,2.5);}else if(idx===2){g.patient.position.set(-1.4+p*1.4,0,1.5);}else if(idx===3){g.patient.position.set(0,0,3-p*10);}else if(idx>=4&&idx<=5){g.patient.position.set(0,1.28,0);g.patient.rotation.z=Math.PI/2;}else if(idx===8){const jump=Math.abs(Math.sin(p*Math.PI*3))*Math.min(1,p*2);g.patient.position.set(0,jump*.65,0);g.patient.rotation.z=Math.sin(p*Math.PI*4)*.18;g.patient.rotation.y=Math.sin(p*Math.PI*3)*.3;}else{g.patient.position.set(0,0,2.5);g.patient.rotation.z=0;}
    if(idx<4)g.patient.rotation.z=0;doorL.position.x=-1.15-p*1.75;doorR.position.x=1.15+p*1.75;lamp.rotation.z=clock.elapsedTime*.25;g.robot.rotation.y=Math.sin(clock.elapsedTime*.5)*.35;shoulder.rotation.z=Math.sin(clock.elapsedTime*1.1)*.2;elbow.rotation.z=Math.sin(clock.elapsedTime*1.5)*.3;wrist.rotation.y=Math.sin(clock.elapsedTime*2)*.5;trace.position.x=4.2+Math.sin(clock.elapsedTime*4)*.03;
    if(idx===0)move(p,[16,10,24],[9,7,14],[0,3,-4],[0,3,-3]);else if(idx===1)move(p,[8,4.5,12],[4,3.4,7],[0,2.2,0],[0,2.2,0]);else if(idx===2)move(p,[6,3.8,8],[5,3.1,5],[0,1.6,0],[0,1.7,0]);else if(idx===3)move(p,[7,3.6,7],[0,3,8],[0,1.6,-5],[0,1.7,-5]);else if(idx===4)move(p,[8,5,7],[5,3.4,5],[0,1.2,0],[0,1.35,0]);else if(idx===5)move(p,[7,3.6,6],[5,3,4],[1,2,-1],[4.2,2.9,-1.5]);else if(idx===6)move(p,[7,4.2,6],[4,3.4,4],[0,3,-3],[0,3,-3.4]);else if(idx===7)move(p,[9,5,8],[7,4.3,5],[3.7,2,-1.5],[3.7,2,-1.5]);else if(idx===8)move(p,[6,4,7],[4,3.3,5],[0,1.8,0],[0,1.8,0]);else move(p,[12,8,15],[17,10,20],[0,3,-3],[0,3,-3]);
    renderer.render(scene,camera);raf=requestAnimationFrame(animate);};
   const resize=()=>{const w=Math.max(1,mount.clientWidth),h=Math.max(1,mount.clientHeight);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);};window.addEventListener('resize',resize);resize();animate();(mount as any).__cleanup=()=>{window.removeEventListener('resize',resize);cancelAnimationFrame(raf);renderer.dispose();};
  }catch(err){console.error(err);if(!dead)setError(true);}return()=>{dead=true;cancelAnimationFrame(raf);const cleanup=(mount as any).__cleanup;if(cleanup)cleanup();};
 },[]);
 const jump=(i:number)=>{timeline.current=scenes.slice(0,i).reduce((a,s)=>a+s.duration,0);setSceneIndex(i);};const toggle=()=>{paused.current=!paused.current;setIsPaused(paused.current);};const current=scenes[sceneIndex];
 return <section className="biomedical-city" id="city" aria-label="Biomedical City — A Patient's Journey"><div ref={mountRef} className="biomedical-city-canvas" />{error&&<div className="city-error">Biomedical City 3D could not initialize. Please reload the page.</div>}<div className="city-vignette" /><div className="city-hud"><div className="city-kicker">BIOMEDICAL CITY • A PATIENT'S JOURNEY • 2035</div><h2>Biomedical City</h2><div className="city-story"><span className="city-scene-number">{String(sceneIndex+1).padStart(2,'0')}</span><div><strong>{current.title}</strong><p>{current.subtitle}</p></div></div><p className="city-description">Patient → registration → examination → biosignals → analysis → robotics → recovery.</p><div className="city-progress">{scenes.map((s,i)=><button key={s.title} className={i===sceneIndex?'active':''} onClick={()=>jump(i)} aria-label={s.title}/>)}</div><button className="city-play" onClick={toggle}>{isPaused?'PLAY JOURNEY':'PAUSE JOURNEY'}</button></div>{sceneIndex===9&&<div className="city-signature"><span>ENGINEERING TECHNOLOGY</span><strong>FOR BETTER HEALTHCARE</strong></div>}<div className="city-label">REALISTIC FUTURE CARE • 2035</div></section>;
};
export default BiomedicalCity;
