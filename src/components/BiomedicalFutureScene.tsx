import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './BiomedicalFutureScene.scss';

type V3 = [number, number, number];
type Door = { left: THREE.Object3D; right: THREE.Object3D };
type Shot = { p: V3; l: V3; fov: number; hold: number };

const BiomedicalCity: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let raf = 0;
    let dead = false;
    try {
      const mobile = window.matchMedia('(max-width: 768px)').matches;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x06151d);
      scene.fog = new THREE.Fog(0x06151d, 32, 118);
      const camera = new THREE.PerspectiveCamera(mobile ? 54 : 47, 1, .1, 150);
      const renderer = new THREE.WebGLRenderer({ antialias: !mobile, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.1 : 1.35));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = !mobile;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mount.innerHTML = '';
      mount.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xd9fbff, 0x071017, 2.7));
      const key = new THREE.DirectionalLight(0xffffff, 4.2); key.position.set(-18,25,20); key.castShadow=!mobile; scene.add(key);
      const cyanLight = new THREE.PointLight(0x21e8ff, mobile?10:20, 60); cyanLight.position.set(10,8,4); scene.add(cyanLight);
      const violetLight = new THREE.PointLight(0x775cff, mobile?7:14, 55); violetLight.position.set(-14,8,8); scene.add(violetLight);
      const greenLight = new THREE.PointLight(0x51ffb1, mobile?5:9, 45); greenLight.position.set(16,5,-8); scene.add(greenLight);

      const mat=(color:number,metalness=.3,roughness=.4,emissive=0,intensity=0)=>new THREE.MeshStandardMaterial({color,metalness,roughness,emissive,emissiveIntensity:intensity});
      const steel=mat(0xdce8e9,.88,.2), white=mat(0xf4f9f8,.18,.48), dark=mat(0x10262e,.9,.3), graphite=mat(0x29464f,.75,.34);
      const cyan=mat(0x36eaff,.35,.17,0x0bd3ec,5), violet=mat(0x987dff,.42,.2,0x5a3de8,4), green=mat(0x58ffb7,.3,.2,0x1bd88a,4);
      const amber=mat(0xffd25a,.28,.25,0xd99100,3), red=mat(0xff5576,.2,.3,0xc91f43,3), black=mat(0x081116,.96,.16);
      const glass=new THREE.MeshPhysicalMaterial({color:0x73eaff,transmission:.5,opacity:.16,transparent:true,roughness:.06,metalness:.08,side:THREE.DoubleSide,depthWrite:false,emissive:0x0b4552,emissiveIntensity:1.2});
      const doorGlass=new THREE.MeshPhysicalMaterial({color:0x9af4ff,transmission:.62,opacity:.25,transparent:true,roughness:.04,metalness:.05,side:THREE.DoubleSide,depthWrite:false,emissive:0x0a6070,emissiveIntensity:1.7});
      const box=(parent:THREE.Object3D,p:V3,s:V3,m:THREE.Material)=>{const x=new THREE.Mesh(new THREE.BoxGeometry(...s),m);x.position.set(...p);x.castShadow=!mobile;x.receiveShadow=true;parent.add(x);return x;};
      const cyl=(parent:THREE.Object3D,p:V3,r:number,h:number,m:THREE.Material,seg=18)=>{const x=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,seg),m);x.position.set(...p);x.castShadow=!mobile;x.receiveShadow=true;parent.add(x);return x;};
      const sphere=(parent:THREE.Object3D,p:V3,r:number,m:THREE.Material,seg=16)=>{const x=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(8,seg-4)),m);x.position.set(...p);x.castShadow=!mobile;x.receiveShadow=true;parent.add(x);return x;};

      box(scene,[0,-.7,0],[76,1.2,60],dark); box(scene,[0,-.05,0],[74,.08,58],graphite);
      for(let x=-35;x<=35;x+=4)box(scene,[x,.01,0],[.012,.012,56],cyan);
      for(let z=-27;z<=27;z+=4)box(scene,[0,.01,z],[72,.012,.012],cyan);

      const panel=(title:string,subtitle:string,w:number,h:number)=>{const g=new THREE.Group();const c=document.createElement('canvas');c.width=1024;c.height=360;const ctx=c.getContext('2d');if(ctx){ctx.fillStyle='rgba(3,23,31,.92)';ctx.fillRect(0,0,1024,360);ctx.strokeStyle='#70efff';ctx.lineWidth=5;ctx.strokeRect(5,5,1014,350);ctx.font='700 48px Arial';ctx.fillStyle='#8af2ff';ctx.fillText(title,38,68);ctx.font='600 24px Arial';ctx.fillStyle='#d7f6fa';ctx.fillText(subtitle,38,108);ctx.strokeStyle='#43e7ff';ctx.lineWidth=3;ctx.beginPath();const ecg:Array<[number,number]>=[[0,0],[18,0],[28,-30],[40,18],[54,0],[76,0],[90,-23],[103,10],[120,0],[148,0],[162,-28],[176,14],[195,0],[225,0]];ecg.forEach(([x,y],i)=>i?ctx.lineTo(45+x*2.7,190+y):ctx.moveTo(45+x*2.7,190+y));ctx.stroke();ctx.font='700 25px Arial';ctx.fillStyle='#55ffb5';ctx.fillText('HR 72 BPM',38,302);ctx.fillText('SpO₂ 98%',270,302);ctx.fillStyle='#a28aff';ctx.fillText('AI CONFIDENCE 97.4%',500,302);}const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const pm=new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:.96,side:THREE.DoubleSide,depthWrite:false});g.add(new THREE.Mesh(new THREE.PlaneGeometry(w,h),pm));g.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w,h,.03)),new THREE.LineBasicMaterial({color:0x73efff,transparent:true,opacity:.9})));g.userData.material=pm;return g;};
      const doors=(parent:THREE.Object3D,z:number,width:number,height:number):Door=>{box(parent,[0,height+.08,z],[width,.08,.12],steel);const left=box(parent,[-width*.22,height/2,z],[width*.4,height,.08],doorGlass);const right=box(parent,[width*.22,height/2,z],[width*.4,height,.08],doorGlass);box(parent,[-width*.43,height/2,z-.05],[.06,height,.1],cyan);box(parent,[width*.43,height/2,z-.05],[.06,height,.1],cyan);return{left,right};};

      const lab=new THREE.Group();lab.position.set(12,0,3);scene.add(lab);
      box(lab,[0,.45,0],[22,.25,17],white);box(lab,[-10.7,4.5,0],[.25,9,17],graphite);box(lab,[10.7,4.5,0],[.25,9,17],graphite);box(lab,[0,9,0],[21.5,.25,17],graphite);box(lab,[0,4.5,-8.35],[21.2,8.8,.06],glass);box(lab,[0,4.5,8.35],[21.2,8.8,.06],glass);
      const labDoors=doors(lab,-8.4,7,5.8);const labName=panel('CEDRIC BIOMEDICAL LAB CENTER','ADVANCED RESEARCH FACILITY // ROBOTICS · GENOMICS · BIOENGINEERING',11.5,2.8);labName.position.set(0,7.2,-8.48);lab.add(labName);
      for(let x=-9;x<=9;x+=3)box(lab,[x,8.45,0],[.07,.06,15],cyan);
      box(lab,[0,1.05,0],[19,.25,4.4],graphite);
      const carousel=new THREE.Group();carousel.position.set(-7.2,1.45,0);lab.add(carousel);cyl(carousel,[0,0,0],1.55,.24,steel,32);for(let i=0;i<12;i++){const a=i*Math.PI*2/12;cyl(carousel,[Math.cos(a)*1.2,.38,Math.sin(a)*1.2],.13,.72,i%3===0?red:cyan,12);}
      const pipette=new THREE.Group();pipette.position.set(-3.6,1.6,0);lab.add(pipette);box(pipette,[0,.85,0],[.3,1.7,.3],steel);sphere(pipette,[0,1.75,0],.22,cyan,12);box(pipette,[0,-.18,0],[.09,.5,.09],green);
      const seq=new THREE.Group();seq.position.set(-2.2,1.25,-4.4);lab.add(seq);box(seq,[0,1.35,0],[4.4,2.7,2.8],steel);box(seq,[0,1.55,-1.43],[3.35,1.3,.08],black);box(seq,[0,.55,-1.46],[3.5,.35,.06],cyan);for(let i=-2;i<=2;i++)box(seq,[i*.55,.98,-1.52],[.28,.52,.05],i===0?green:violet);const seqBars:THREE.Mesh[]=[];for(let i=0;i<7;i++)seqBars.push(box(seq,[-1.45+i*.48,2.62,-.1],[.24,.55,.05],i%2?violet:cyan));const seqPanel=panel('DNA SEQUENCER','GENOMIC ANALYSIS // RUNNING',4.4,1.35);seqPanel.position.set(0,3.25,-1.5);seq.add(seqPanel);
      const scope=new THREE.Group();scope.position.set(3.2,1.2,-4.2);lab.add(scope);box(scope,[0,.5,0],[3.1,.3,2.5],black);box(scope,[0,2.05,0],[.58,3,.62],steel);box(scope,[.55,3.2,0],[1.55,.4,.8],steel);cyl(scope,[.5,2.68,0],.62,.25,violet,24);for(let i=0;i<4;i++){const a=i*Math.PI/2;cyl(scope,[.5+Math.cos(a)*.4,2.42,Math.sin(a)*.4],.1,.65,steel,10);}box(scope,[0,1.02,-1.18],[2.2,1.1,.08],cyan);const scopeScreen=panel('AUTO MICROSCOPY','CELL IMAGING // 40× OBJECTIVE',3.6,1.25);scopeScreen.position.set(0,2.25,-1.55);scope.add(scopeScreen);
      const pcr=new THREE.Group();pcr.position.set(7.4,1.25,-4.1);lab.add(pcr);box(pcr,[0,1.05,0],[3.7,2.1,2.6],white);box(pcr,[0,1.55,-1.33],[2.8,.72,.07],black);box(pcr,[0,.78,-1.38],[2.6,.28,.05],cyan);for(let r=0;r<3;r++)for(let c=0;c<6;c++)cyl(pcr,[-1.05+c*.42,.98,-1.43+r*.18],.07,.05,r===1?green:violet,10);const pcrPanel=panel('PCR / qPCR','AMPLIFICATION STATION // 96-WELL',3.9,1.25);pcrPanel.position.set(0,2.65,-1.4);pcr.add(pcrPanel);
      const bsc=new THREE.Group();bsc.position.set(-7.2,1.2,4.3);lab.add(bsc);box(bsc,[0,.65,0],[5.3,.35,2.8],steel);box(bsc,[-2.45,2.9,0],[.18,4.6,2.8],graphite);box(bsc,[2.45,2.9,0],[.18,4.6,2.8],graphite);box(bsc,[0,5.1,0],[5,.18,2.8],graphite);box(bsc,[0,2.9,-1.35],[4.8,4.2,.05],doorGlass);box(bsc,[0,1.15,0],[4.6,.08,2.2],white);box(bsc,[0,4.7,-1.42],[3.8,.08,.06],cyan);const bscPanel=panel('BIOSAFETY CABINET','STERILE CELL CULTURE // HEPA FLOW',4.7,1.25);bscPanel.position.set(0,4.25,-1.48);bsc.add(bscPanel);
      const incubator=new THREE.Group();incubator.position.set(-1.2,1.15,4.35);lab.add(incubator);box(incubator,[0,2.4,0],[3.1,4.8,2.5],white);box(incubator,[0,2.5,-1.28],[2.35,3.9,.06],doorGlass);for(let y=1.15;y<=4;y+=.85){box(incubator,[0,y,-1.34],[2.1,.08,.05],steel);for(let x=-.72;x<=.72;x+=.48)box(incubator,[x,y+.18,-1.34],[.28,.32,.04],green);}const incPanel=panel('SMART INCUBATOR','37.0 °C // CO₂ 5.0% // STABLE',3.5,1.25);incPanel.position.set(0,5.2,-1.45);incubator.add(incPanel);
      const analyzer=(parent:THREE.Object3D,position:V3,title:string,color:THREE.Material)=>{const g=new THREE.Group();g.position.set(...position);parent.add(g);box(g,[0,1,0],[3.6,2,2.5],steel);box(g,[0,1.75,-1.3],[2.6,.7,.06],black);box(g,[-.9,.45,-1.34],[.5,.35,.05],color);box(g,[0,.45,-1.34],[.5,.35,.05],green);box(g,[.9,.45,-1.34],[.5,.35,.05],violet);const analyzerPanel=panel(title,'AUTOMATED CLINICAL ANALYSIS',3.7,1.2);analyzerPanel.position.set(0,2.7,-1.42);g.add(analyzerPanel);return g;};
      analyzer(lab,[5.8,1.2,2.9],'HEMATOLOGY ANALYZER',red);analyzer(lab,[9.1,1.2,4.9],'BIOCHEMISTRY ANALYZER',amber);
      const cryo=new THREE.Group();cryo.position.set(7.4,1.05,8);lab.add(cryo);cyl(cryo,[0,1.7,0],1.65,3.4,steel,28);cyl(cryo,[0,3.45,0],1.42,.28,black,28);cyl(cryo,[0,3.7,0],.9,.25,cyan,24);for(let i=0;i<6;i++)cyl(cryo,[Math.cos(i*Math.PI/3)*.9,2.2,Math.sin(i*Math.PI/3)*.9],.12,1.3,i%2?violet:green,10);const cryoPanel=panel('CRYOBIOBANK','−196 °C // SAMPLE STORAGE',3.9,1.25);cryoPanel.position.set(0,4.7,-1.5);cryo.add(cryoPanel);
      const printer=new THREE.Group();printer.position.set(-3.1,1,8);lab.add(printer);box(printer,[0,.35,0],[5.2,.3,3.7],black);box(printer,[-2.3,2.7,0],[.18,4.7,3.5],steel);box(printer,[2.3,2.7,0],[.18,4.7,3.5],steel);box(printer,[0,4.9,0],[4.7,.18,3.5],steel);const gantry=box(printer,[0,4.5,0],[3.8,.22,.22],cyan);const nozzle=new THREE.Group();nozzle.position.set(0,4.05,0);printer.add(nozzle);box(nozzle,[0,-.25,0],[.32,.55,.32],steel);cyl(nozzle,[0,-.6,0],.09,.3,green,12);box(printer,[0,.58,0],[3.9,.12,2.6],white);const printPanel=panel('BIOFABRICATION','3D BIOPRINTING // TISSUE ENGINEERING',4.8,1.25);printPanel.position.set(0,5.8,-1.9);printer.add(printPanel);
      box(lab,[0,6.4,5.9],[19,.12,.12],steel);const arm=new THREE.Group();arm.position.set(-6,0,5.9);lab.add(arm);box(arm,[0,2.9,0],[.3,5.6,.3],black);sphere(arm,[0,5.7,0],.32,cyan,12);const arm2=new THREE.Group();arm2.position.y=5.5;arm.add(arm2);box(arm2,[1.3,0,0],[2.6,.28,.28],steel);sphere(arm2,[2.6,0,0],.3,violet,12);const gripper=new THREE.Group();gripper.position.set(2.75,-.15,0);arm2.add(gripper);box(gripper,[.15,-.28,0],[.08,.55,.08],green);box(gripper,[-.15,-.28,0],[.08,.55,.08],green);const railPanel=panel('ROBOTIC SAMPLE HANDLER','AUTONOMOUS TRANSFER // RAIL R-01',5.2,1.25);railPanel.position.set(0,7.4,5.75);lab.add(railPanel);
      const surgery=new THREE.Group();surgery.position.set(-15,0,8);scene.add(surgery);box(surgery,[0,.45,0],[15,.25,11],white);box(surgery,[-7.3,3.8,0],[.22,7.5,11],graphite);box(surgery,[7.3,3.8,0],[.22,7.5,11],graphite);box(surgery,[0,7.4,0],[14.6,.22,11],graphite);box(surgery,[0,3.7,-5.35],[14.4,7.1,.06],glass);const surgeryDoors=doors(surgery,5.4,7,5.5);const joints:THREE.Object3D[]=[];const tips:THREE.Object3D[]=[];
      const makeArm=(x:number,z:number,flip:number)=>{const root=new THREE.Group();root.position.set(x,1.05,z);surgery.add(root);cyl(root,[0,.55,0],.72,1.1,black,22);const s=new THREE.Group();s.position.y=1;s.rotation.z=flip*.5;root.add(s);sphere(s,[0,0,0],.3,cyan,14);box(s,[0,.9,0],[.4,1.8,.4],steel);const e=new THREE.Group();e.position.y=1.8;e.rotation.z=-flip*.65;s.add(e);sphere(e,[0,0,0],.28,violet,14);box(e,[0,.82,0],[.34,1.65,.34],steel);const w=new THREE.Group();w.position.y=1.65;w.rotation.z=flip*.35;e.add(w);sphere(w,[0,0,0],.2,cyan,12);box(w,[0,.5,0],[.25,.9,.25],steel);const tip=cyl(w,[0,.98,0],.06,.48,cyan,10);joints.push(s,e,w);tips.push(tip);};
      makeArm(-4.7,-3.5,1);makeArm(-4.7,3.5,1);makeArm(4.7,-3.5,-1);makeArm(4.7,3.5,-1);box(surgery,[0,1.3,0],[6.4,.3,2.8],steel);cyl(surgery,[0,6.2,0],.22,1.1,black,18);const lamp=new THREE.Mesh(new THREE.TorusGeometry(1.55,.12,10,48),steel);lamp.rotation.x=Math.PI/2;lamp.position.set(0,6.2,0);surgery.add(lamp);sphere(surgery,[0,6.12,0],1.02,white,22);const surgPanel=panel('SURGICAL ROBOT','4-ARM PRECISION SYSTEM // STERILE OR',7,2.2);surgPanel.position.set(0,5.25,-5.4);surgery.add(surgPanel);
      const imaging=new THREE.Group();imaging.position.set(0,0,20);scene.add(imaging);box(imaging,[0,.6,0],[12,.25,8],white);const ct=new THREE.Mesh(new THREE.TorusGeometry(3.1,.42,18,64),black);ct.rotation.y=Math.PI/2;ct.position.set(0,3.6,0);imaging.add(ct);const ctGlow=new THREE.Mesh(new THREE.TorusGeometry(2.65,.12,12,64),cyan);ctGlow.rotation.y=Math.PI/2;ctGlow.position.copy(ct.position);imaging.add(ctGlow);const imgPanel=panel('IMAGING / CT-MRI','3D ANATOMICAL RECONSTRUCTION // LIVE SCAN',7,2.2);imgPanel.position.set(-5,6.4,-3.8);imaging.add(imgPanel);
      const entrance=new THREE.Group();entrance.position.set(0,0,-22);scene.add(entrance);box(entrance,[0,5,0],[26,10,.12],glass);box(entrance,[-13,5,0],[.3,10,5],graphite);box(entrance,[13,5,0],[.3,10,5],graphite);box(entrance,[0,10,0],[26,.3,5],graphite);const entranceDoors=doors(entrance,.08,8.5,7);const title=panel('CEDRIC BIOMEDICAL LAB CENTER','ROBOTICS  ·  AI  ·  IMAGING  ·  GENOMICS  ·  BIOENGINEERING',11,2.8);title.position.set(0,8,-.16);entrance.add(title);
      const count=mobile?55:105;const positions=new Float32Array(count*3);for(let i=0;i<count;i++){positions[i*3]=(Math.random()-.5)*66;positions[i*3+1]=.8+Math.random()*14;positions[i*3+2]=(Math.random()-.5)*50;}const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(positions,3));const pm=new THREE.PointsMaterial({color:0x76ecff,size:mobile?.04:.055,transparent:true,opacity:.42});const particles=new THREE.Points(pg,pm);scene.add(particles);

      // Wider, slower camera tour: equipment stays readable instead of filling the frame.
      const shots:Shot[]=[
        {p:[0,9.5,42],l:[0,3.8,12],fov:52,hold:6},
        {p:[10,6.5,25],l:[12,3.2,3],fov:49,hold:8},
        {p:[18,6.2,14],l:[12,3.0,2],fov:47,hold:8},
        {p:[25,6.2,9],l:[15,3.0,3],fov:47,hold:7},
        {p:[27,6.2,16],l:[18,3.0,5],fov:48,hold:7},
        {p:[21,6.5,22],l:[10,3.0,7],fov:49,hold:7},
        {p:[11,6.5,21],l:[0,3.0,7],fov:49,hold:7},
        {p:[2,6.5,16],l:[0,3.0,7],fov:48,hold:7},
        {p:[-5,6.5,15],l:[-3,3.0,5],fov:48,hold:7},
        {p:[-22,8,26],l:[-15,3.5,8],fov:50,hold:8},
        {p:[-25,7,15],l:[-15,3.5,8],fov:49,hold:7},
        {p:[-5,10,40],l:[0,4,18],fov:53,hold:6},
        {p:[0,10,-18],l:[0,4.5,-22],fov:53,hold:7},
      ];

      const clock=new THREE.Clock();
      const look=new THREE.Vector3(...shots[0].l);
      const target=new THREE.Vector3(...shots[0].l);
      const desiredPosition=new THREE.Vector3(...shots[0].p);
      const offset=new THREE.Vector3();
      let currentFov=shots[0].fov;

      const resize=()=>{const w=Math.max(1,mount.clientWidth),h=Math.max(1,mount.clientHeight);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);};window.addEventListener('resize',resize);resize();

      const animate=()=>{
        if(dead)return;
        const rawDelta=clock.getDelta();
        const delta=Math.min(rawDelta,.05);
        const t=clock.elapsedTime;
        const total=shots.reduce((sum,s)=>sum+s.hold,0);
        let time=t%total;
        let idx=0;
        while(idx<shots.length-1&&time>shots[idx].hold){time-=shots[idx].hold;idx++;}
        const next=(idx+1)%shots.length;
        const a=shots[idx],b=shots[next];
        const transition=Math.min(1,Math.max(0,(time-a.hold*.68)/(a.hold*.32)));
        const e=transition*transition*(3-2*transition);

        desiredPosition.set(
          THREE.MathUtils.lerp(a.p[0],b.p[0],e),
          THREE.MathUtils.lerp(a.p[1],b.p[1],e),
          THREE.MathUtils.lerp(a.p[2],b.p[2],e)
        );
        const cinematicDrift=mobile?.025:.045;
        desiredPosition.x+=Math.sin(t*.22)*cinematicDrift;
        desiredPosition.y+=Math.sin(t*.32)*.04;
        desiredPosition.z+=Math.cos(t*.19)*cinematicDrift;

        target.set(
          THREE.MathUtils.lerp(a.l[0],b.l[0],e),
          THREE.MathUtils.lerp(a.l[1],b.l[1],e),
          THREE.MathUtils.lerp(a.l[2],b.l[2],e)
        );
        target.x+=Math.sin(t*.28)*.025;
        target.y+=Math.cos(t*.31)*.018;

        // Hard safety margin: never let the cinematic camera collapse onto its target.
        offset.subVectors(desiredPosition,target);
        const minDistance=mobile?13:16;
        if(offset.lengthSq()<minDistance*minDistance){
          offset.setLength(minDistance);
          desiredPosition.copy(target).add(offset);
        }

        const cameraSmooth=1-Math.exp(-delta*(mobile?2.7:3.2));
        const targetSmooth=1-Math.exp(-delta*(mobile?3.8:4.5));
        camera.position.lerp(desiredPosition,cameraSmooth);
        look.lerp(target,targetSmooth);

        const nextFov=THREE.MathUtils.lerp(a.fov,b.fov,e);
        currentFov=THREE.MathUtils.damp(currentFov,nextFov,2.1,delta);
        if(Math.abs(camera.fov-currentFov)>.015){camera.fov=currentFov;camera.updateProjectionMatrix();}
        camera.lookAt(look);

        const doorCycle=(Math.sin(t*.22-.7)+1)*.5;
        const door=THREE.MathUtils.smoothstep(doorCycle,.24,.76);
        labDoors.left.position.x=THREE.MathUtils.lerp(-1.54,-3.5,door);labDoors.right.position.x=THREE.MathUtils.lerp(1.54,3.5,door);
        surgeryDoors.left.position.x=THREE.MathUtils.lerp(-1.54,-3.5,door);surgeryDoors.right.position.x=THREE.MathUtils.lerp(1.54,3.5,door);
        entranceDoors.left.position.x=THREE.MathUtils.lerp(-1.9,-4.4,door);entranceDoors.right.position.x=THREE.MathUtils.lerp(1.9,4.4,door);

        carousel.rotation.y=t*.34+Math.sin(t*.17)*.08;
        pipette.rotation.z=Math.sin(t*.72)*.16;
        pipette.position.y=1.6+Math.sin(t*.92)*.035;
        seqBars.forEach((m,i)=>{const phase=t*1.65-i*.32;const pulse=(Math.sin(phase)+1)*.5;m.scale.y=.72+pulse*.28;m.position.y=2.48+pulse*.18;});
        scope.rotation.y=Math.sin(t*.28)*.022;
        scope.rotation.x=Math.sin(t*.19)*.012;
        pcr.rotation.y=Math.sin(t*.24)*.018;
        nozzle.position.x=Math.sin(t*.55)*1.35;
        nozzle.position.z=Math.cos(t*.38)*.28;
        gantry.position.x=nozzle.position.x;
        gantry.position.z=nozzle.position.z;
        arm.position.x=-6+((Math.sin(t*.22)+1)*.5)*12;
        arm2.rotation.z=Math.sin(t*.62)*.09;
        gripper.rotation.z=Math.sin(t*.86)*.12;
        joints.forEach((j,i)=>{const phase=t*(.45+i*.035)+i*.8;j.rotation.x=Math.sin(phase)*(.045+.012*(i%3));j.rotation.y=Math.cos(phase*.83)*.035;j.rotation.z+=Math.sin(phase*.5)*.002;});
        tips.forEach((x,i)=>{x.position.z=Math.sin(t*.95+i*.75)*.09;});
        ctGlow.rotation.z=t*.72;
        particles.rotation.y=t*.004;
        cyanLight.intensity=(mobile?10:20)+Math.sin(t*.65)*1.2;
        violetLight.intensity=(mobile?7:14)+Math.cos(t*.52)*.8;
        greenLight.intensity=(mobile?5:9)+Math.sin(t*.73+.8)*.6;

        [labName,seqPanel,scopeScreen,pcrPanel,bscPanel,incPanel,cryoPanel,printPanel,railPanel,surgPanel,imgPanel,title].forEach((p,i)=>{const m=p.userData.material as THREE.MeshBasicMaterial|undefined;if(m)m.opacity=.9+Math.sin(t*1.15+i*.55)*.035;});

        renderer.render(scene,camera);
        raf=requestAnimationFrame(animate);
      };
      animate();
      return()=>{dead=true;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);pg.dispose();pm.dispose();renderer.dispose();mount.innerHTML='';};
    }catch(e){console.error('Biomedical future scene failed:',e);setError(true);return()=>{dead=true;cancelAnimationFrame(raf);};}
  },[]);

  return <section className="biomedical-future-scene" aria-label="Cédric Biomedical Lab Center — futuristic medical technology showcase"><div ref={mountRef} className="biomedical-future-canvas"/><div className="future-scene-overlay"><div className="future-scene-hud future-scene-hud-left"><span>CEDRIC BIOMEDICAL LAB CENTER</span><strong>RESEARCH CAMPUS // 2035</strong></div><div className="future-scene-hud future-scene-hud-right"><span>LIVE SYSTEMS</span><strong>ROBOTICS · AI · IMAGING · GENOMICS</strong></div><div className="future-scene-title"><span>THE FUTURE OF</span><strong>HEALTHCARE</strong></div></div>{error&&<div className="future-scene-error"><strong>CEDRIC BIOMEDICAL LAB CENTER</strong><span>Visualisation 3D indisponible — interface médicale de secours active.</span></div>}</section>;
};

export default BiomedicalCity;
