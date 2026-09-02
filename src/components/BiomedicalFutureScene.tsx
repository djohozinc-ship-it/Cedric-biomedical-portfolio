import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './BiomedicalFutureScene.scss';

type V3 = [number, number, number];
type Door = { left: THREE.Object3D; right: THREE.Object3D };

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
      scene.background = new THREE.Color(0x07151d);
      scene.fog = new THREE.Fog(0x07151d, 30, 112);
      const camera = new THREE.PerspectiveCamera(mobile ? 52 : 44, 1, 0.1, 145);
      const renderer = new THREE.WebGLRenderer({ antialias: !mobile, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.15 : 1.35));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = !mobile;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mount.innerHTML = '';
      mount.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xcff8ff, 0x061016, 2.8));
      const key = new THREE.DirectionalLight(0xffffff, 4);
      key.position.set(-12, 25, 22);
      key.castShadow = !mobile;
      scene.add(key);
      const cyanLight = new THREE.PointLight(0x22e6ff, mobile ? 12 : 22, 58);
      cyanLight.position.set(-10, 8, 12);
      scene.add(cyanLight);
      const violetLight = new THREE.PointLight(0x775cff, mobile ? 8 : 15, 55);
      violetLight.position.set(16, 8, 8);
      scene.add(violetLight);
      const greenLight = new THREE.PointLight(0x54ffb5, mobile ? 6 : 10, 48);
      greenLight.position.set(7, 7, -13);
      scene.add(greenLight);

      const mat = (color: number, metalness = .25, roughness = .4, emissive = 0, intensity = 0) => new THREE.MeshStandardMaterial({ color, metalness, roughness, emissive, emissiveIntensity: intensity });
      const steel = mat(0xd9e7e9, .85, .24);
      const white = mat(0xf1f8f8, .15, .52);
      const dark = mat(0x132831, .9, .3);
      const graphite = mat(0x31515a, .72, .35);
      const cyan = mat(0x38eaff, .35, .18, 0x0ccde9, 5);
      const violet = mat(0x987dff, .4, .2, 0x5c3ee8, 4);
      const green = mat(0x57ffb6, .3, .22, 0x20d890, 4);
      const amber = mat(0xffd35a, .25, .25, 0xe49b00, 3);
      const red = mat(0xff5877, .2, .3, 0xc91f43, 3);
      const robot = mat(0xbfd1d5, .88, .22);
      const robotDark = mat(0x0b171d, .95, .18);
      const glass = new THREE.MeshPhysicalMaterial({ color: 0x73eaff, transmission: .55, opacity: .19, transparent: true, roughness: .06, metalness: .08, side: THREE.DoubleSide, depthWrite: false, emissive: 0x0b4552, emissiveIntensity: 1.3 });
      const doorGlass = new THREE.MeshPhysicalMaterial({ color: 0x9af4ff, transmission: .65, opacity: .24, transparent: true, roughness: .04, metalness: .05, side: THREE.DoubleSide, depthWrite: false, emissive: 0x0a6070, emissiveIntensity: 1.8 });

      const box = (parent: THREE.Object3D, pos: V3, size: V3, material: THREE.Material) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
        m.position.set(...pos); m.castShadow = !mobile; m.receiveShadow = true; parent.add(m); return m;
      };
      const cyl = (parent: THREE.Object3D, pos: V3, radius: number, height: number, material: THREE.Material, segments = 20) => {
        const m = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, segments), material);
        m.position.set(...pos); m.castShadow = !mobile; m.receiveShadow = true; parent.add(m); return m;
      };
      const sphere = (parent: THREE.Object3D, pos: V3, radius: number, material: THREE.Material, segments = 18) => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, Math.max(8, segments - 4)), material);
        m.position.set(...pos); m.castShadow = !mobile; m.receiveShadow = true; parent.add(m); return m;
      };
      const line = (parent: THREE.Object3D, points: V3[], material: THREE.Material) => {
        const g = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p)));
        const l = new THREE.Line(g, material); parent.add(l); return l;
      };

      box(scene, [0, -.65, 0], [74, 1.1, 58], dark);
      box(scene, [0, -.05, 0], [72, .08, 56], graphite);
      for (let x = -34; x <= 34; x += 4) box(scene, [x, .01, 0], [.015, .015, 54], cyan);
      for (let z = -25; z <= 25; z += 4) box(scene, [0, .01, z], [70, .015, .015], cyan);

      const createPanel = (title: string, subtitle: string, width: number, height: number) => {
        const group = new THREE.Group();
        const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 360;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'rgba(4,25,34,.86)'; ctx.fillRect(0, 0, 1024, 360);
          ctx.strokeStyle = '#67edff'; ctx.lineWidth = 5; ctx.strokeRect(5, 5, 1014, 350);
          ctx.font = '700 48px Arial'; ctx.fillStyle = '#8af2ff'; ctx.fillText(title, 42, 72);
          ctx.font = '600 25px Arial'; ctx.fillStyle = '#d1f5fa'; ctx.fillText(subtitle, 42, 112);
          ctx.strokeStyle = '#43e7ff'; ctx.lineWidth = 3; ctx.beginPath();
          const ecg: Array<[number, number]> = [[0,0],[20,0],[30,-34],[42,18],[56,0],[82,0],[94,-24],[106,10],[124,0],[150,0],[164,-30],[178,16],[196,0],[230,0]];
          ecg.forEach(([x,y], i) => i === 0 ? ctx.moveTo(45 + x * 2.7, 195 + y) : ctx.lineTo(45 + x * 2.7, 195 + y)); ctx.stroke();
          ctx.font = '700 26px Arial'; ctx.fillStyle = '#55ffb5'; ctx.fillText('HR 72 BPM', 42, 300); ctx.fillText('SpO₂ 98%', 270, 300);
          ctx.fillStyle = '#a28aff'; ctx.fillText('AI CONFIDENCE 97.4%', 500, 300);
        }
        const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: .94, side: THREE.DoubleSide, depthWrite: false });
        group.add(new THREE.Mesh(new THREE.PlaneGeometry(width, height), material));
        group.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(width, height, .03)), new THREE.LineBasicMaterial({ color: 0x73efff, transparent: true, opacity: .85 })));
        group.userData.material = material; return group;
      };

      const slidingDoors = (parent: THREE.Object3D, z: number, width: number, height: number): Door => {
        box(parent, [0, height + .08, z], [width, .08, .12], steel);
        const left = box(parent, [-width * .22, height / 2, z], [width * .4, height, .08], doorGlass);
        const right = box(parent, [width * .22, height / 2, z], [width * .4, height, .08], doorGlass);
        box(parent, [-width * .43, height / 2, z - .05], [.06, height, .1], cyan); box(parent, [width * .43, height / 2, z - .05], [.06, height, .1], cyan);
        return { left, right };
      };

      // OPERATING ROOM
      const surgery = new THREE.Group(); surgery.position.set(-13, 0, 8); scene.add(surgery);
      box(surgery, [0,.45,0], [15,.25,10], white); box(surgery, [-7.2,3.7,0], [.22,7.2,10], graphite); box(surgery,[7.2,3.7,0],[.22,7.2,10],graphite); box(surgery,[0,7.2,0],[14.6,.22,10],graphite); box(surgery,[0,3.6,-4.85],[14.4,6.9,.06],glass);
      const surgeryDoors = slidingDoors(surgery,4.9,7,5.4);
      const surgicalJoints: THREE.Object3D[]=[]; const surgicalTips: THREE.Object3D[]=[];
      const light = new THREE.Group(); light.position.set(0,6.2,0); surgery.add(light); cyl(light,[0,0,0],.22,1.2,robotDark,18); const lamp=new THREE.Mesh(new THREE.TorusGeometry(1.55,.12,10,48),steel); lamp.rotation.x=Math.PI/2; light.add(lamp); sphere(light,[0,-.05,0],1.05,white,24);
      const makeSurgicalArm=(x:number,z:number,flip:number)=>{ const root=new THREE.Group(); root.position.set(x,1.05,z); surgery.add(root); cyl(root,[0,.55,0],.7,1.1,robotDark,22); const shoulder=new THREE.Group(); shoulder.position.y=1.05; shoulder.rotation.z=flip*.48; root.add(shoulder); sphere(shoulder,[0,0,0],.3,cyan,14); box(shoulder,[0,.9,0],[.38,1.8,.38],robot); const elbow=new THREE.Group(); elbow.position.y=1.8; elbow.rotation.z=-flip*.62; shoulder.add(elbow); sphere(elbow,[0,0,0],.27,violet,14); box(elbow,[0,.8,0],[.32,1.6,.32],robot); const wrist=new THREE.Group(); wrist.position.y=1.6; wrist.rotation.z=flip*.35; elbow.add(wrist); sphere(wrist,[0,0,0],.2,cyan,12); box(wrist,[0,.48,0],[.24,.9,.24],steel); const tip=cyl(wrist,[0,.98,0],.06,.5,cyan,10); surgicalJoints.push(shoulder,elbow,wrist); surgicalTips.push(tip); };
      makeSurgicalArm(-4.8,-3.2,1); makeSurgicalArm(-4.8,3.2,1); makeSurgicalArm(4.8,-3.2,-1); makeSurgicalArm(4.8,3.2,-1); box(surgery,[0,1.25,0],[6.4,.3,2.8],robot);
      const surgeryPanel=createPanel('SURGICAL ROBOT','4-ARM PRECISION SYSTEM // STERILE OR',6.8,2.2); surgeryPanel.position.set(0,5.2,-4.9); surgery.add(surgeryPanel);

      // ADVANCED GLASS LABORATORY
      const lab=new THREE.Group(); lab.position.set(15,0,6); scene.add(lab);
      box(lab,[0,.45,0],[18,.25,13],white); box(lab,[-8.7,4,0],[.22,8,13],graphite); box(lab,[8.7,4,0],[.22,8,13],graphite); box(lab,[0,8,0],[17.5,.22,13],graphite); box(lab,[0,4,-6.35],[17.4,7.8,.06],glass); box(lab,[0,4,6.35],[17.4,7.8,.06],glass);
      const labDoors=slidingDoors(lab,-6.4,6.4,5.3);
      // Interior light bars make the equipment readable through glass.
      for(let x=-7;x<=7;x+=3.5) box(lab,[x,7.5,0],[.08,.05,11],cyan);

      // Workbench + sample carousel.
      box(lab,[0,1.15,-.1],[16,.25,3.8],graphite);
      const carousel=new THREE.Group(); carousel.position.set(-5.8,1.55,-.1); lab.add(carousel); cyl(carousel,[0,0,0],1.55,.22,steel,32);
      for(let i=0;i<12;i++){const a=i/12*Math.PI*2;cyl(carousel,[Math.cos(a)*1.2,.38,Math.sin(a)*1.2],.13,.7,i%3===0?red:cyan,12);}
      const pipette=new THREE.Group(); pipette.position.set(-2.6,2.1,-.1); lab.add(pipette); box(pipette,[0,.7,0],[.25,1.55,.25],steel); sphere(pipette,[0,1.55,0],.2,cyan,12); box(pipette,[0,-.22,0],[.09,.55,.09],green);

      // 1. DNA SEQUENCER — cartridge bay + data lanes.
      const sequencer=new THREE.Group(); sequencer.position.set(3.2,1.3,-.8); lab.add(sequencer);
      box(sequencer,[0,1.1,0],[3.8,2.3,2.5],steel); box(sequencer,[0,1.55,-1.28],[2.8,1.25,.06],robotDark); box(sequencer,[0,.35,-1.3],[3.1,.42,.08],cyan);
      for(let i=-2;i<=2;i++){box(sequencer,[i*.48,.95,-1.38],[.25,.5,.04],i===0?green:violet);}
      for(let i=0;i<7;i++) box(sequencer,[-1.25+i*.42,1.85,-1.34],[.24,.08,.03],cyan);
      const seqBars: THREE.Mesh[]=[]; for(let i=0;i<6;i++) seqBars.push(box(sequencer,[-1.1+i*.45,2.65,0],[.22,.5,.04],i%2?violet:cyan));

      // 2. AUTOMATED MICROSCOPE — optical column, objective turret, stage, monitor.
      const microscope=new THREE.Group(); microscope.position.set(6.7,1.2,-.5); lab.add(microscope);
      box(microscope,[0,.55,0],[2.5,.3,2.2],robotDark); box(microscope,[0,2,0],[.5,2.7,.55],steel); box(microscope,[.42,3.05,0],[1.3,.35,.7],steel);
      cyl(microscope,[.35,2.58,0],.55,.25,violet,24); for(let i=0;i<4;i++){const o=cyl(microscope,[.35+Math.cos(i*Math.PI/2)*.38,2.3,Math.sin(i*Math.PI/2)*.38],.09,.65,cyan,12); o.rotation.z=.15;}
      box(microscope,[0,.85,-1.18],[1.8,1.1,.06],glass); box(microscope,[1.15,2.1,-.5],[1.5,1.05,.08],robotDark); box(microscope,[1.15,2.1,-.55],[1.25,.8,.04],cyan);

      // 3. PCR / qPCR station — sample tray + thermal wells.
      const pcr=new THREE.Group(); pcr.position.set(3.2,1.25,3.7); lab.add(pcr); box(pcr,[0,1,0],[3.4,2,2.4],white); box(pcr,[0,1.65,-1.23],[2.5,.75,.05],robotDark); box(pcr,[0,.65,-1.25],[2.3,.12,.05],violet);
      for(let r=0;r<3;r++) for(let c=0;c<8;c++) cyl(pcr,[-.9+c*.26,.9+r*.22,-1.34],.055,.05,(r+c)%3===0?green:cyan,10);

      // 4. HEMATOLOGY ANALYZER — reagent/sample rack + display.
      const hema=new THREE.Group(); hema.position.set(-.5,1.25,3.8); lab.add(hema); box(hema,[0,1,0],[3.5,2.1,2.5],steel); box(hema,[0,1.55,-1.27],[1.8,.8,.05],robotDark); box(hema,[0,1.55,-1.31],[1.45,.5,.03],green); box(hema,[-.7,.55,-1.4],[.12,.65,.08],red);
      for(let i=-3;i<=3;i++) cyl(hema,[i*.32,.58,-.95],.08,.35,i%2?cyan:amber,12);

      // 5. BIOCHEMISTRY ANALYZER — reagent carousel + sample input.
      const bio=new THREE.Group(); bio.position.set(-4.9,1.25,3.8); lab.add(bio); box(bio,[0,1,0],[3.7,2.1,2.5],white); box(bio,[0,2.1,0],[2.2,.25,1.7],robotDark); cyl(bio,[0,1.55,-1.3],.75,.16,steel,28); for(let i=0;i<10;i++){const a=i/10*Math.PI*2;cyl(bio,[Math.cos(a)*.57,1.7,-1.3+Math.sin(a)*.25],.08,.3,i%2?cyan:violet,10);}

      // 6. BIOSAFETY CABINET — transparent containment chamber + internal work zone.
      const bsc=new THREE.Group(); bsc.position.set(7,-.0,3.9); lab.add(bsc); box(bsc,[0,2.4,0],[3.1,4.6,2.4],steel); box(bsc,[0,3.0,-1.25],[2.65,2.7,.05],glass); box(bsc,[0,1.1,-1.3],[2.5,.12,.05],cyan); box(bsc,[0,4.35,0],[2.5,.12,1.7],robotDark); for(let i=-1;i<=1;i++) cyl(bsc,[i*.75,2.1,-.95],.13,.55,green,12);

      // 7. SMART INCUBATOR — tall chamber with visible sample racks.
      const incubator=new THREE.Group(); incubator.position.set(-7,1.0,-3.8); lab.add(incubator); box(incubator,[0,2.4,0],[3.0,4.8,2.5],graphite); box(incubator,[0,2.55,-1.28],[2.45,3.9,.05],glass); box(incubator,[0,4.65,-1.34],[1.5,.28,.04],green);
      for(let y=1.2;y<=4;y+=.75){box(incubator,[0,y,-1.38],[2.0,.05,.05],steel); for(let x=-.7;x<=.7;x+=.7)cyl(incubator,[x,y+.18,-1.42],.12,.35,cyan,10);}

      // 8. CRYOGENIC BIOBANK — cryotank + sample canisters.
      const cryo=new THREE.Group(); cryo.position.set(5.5,1.0,4.0); lab.add(cryo); cyl(cryo,[0,2,0],1.45,3.8,steel,28); cyl(cryo,[0,3.95,0],1.52,.25,robotDark,28); cyl(cryo,[0,4.15,0],1.05,.18,cyan,24); for(let i=0;i<8;i++){const a=i/8*Math.PI*2;cyl(cryo,[Math.cos(a)*.8,2.2,Math.sin(a)*.8],.12,2.4,cyan,10);}

      // 9. BIOFABRICATION / 3D BIOPRINTER — gantry + print bed + nozzle.
      const printer=new THREE.Group(); printer.position.set(-4.6,1.0,-3.8); lab.add(printer); box(printer,[0,.35,0],[3.8,.2,2.9],steel); box(printer,[-1.65,1.9,0],[.18,3.2,2.7],graphite); box(printer,[1.65,1.9,0],[.18,3.2,2.7],graphite); box(printer,[0,3.35,0],[3.5,.18,2.7],graphite); const gantry=box(printer,[0,3.0,0],[2.8,.18,.18],cyan); const nozzle=new THREE.Group(); nozzle.position.set(0,2.65,0); printer.add(nozzle); cyl(nozzle,[0,-.35,0],.13,.7,steel,12); cyl(nozzle,[0,-.78,0],.06,.25,violet,10); box(printer,[0,.6,0],[2.2,.08,1.5],violet);

      // 10. ROBOTIC SAMPLE RAIL — moving carriage and articulated manipulator.
      const rail=new THREE.Group(); rail.position.set(0,0,-5.25); lab.add(rail); box(rail,[0,.75,0],[15,.14,.18],steel); const carriage=new THREE.Group(); carriage.position.set(-3,.9,0); rail.add(carriage); box(carriage,[0,0,0],[.9,.25,.8],robotDark); cyl(carriage,[0,.65,0],.16,1.1,cyan,14); const arm=new THREE.Group(); arm.position.y=1.15; carriage.add(arm); box(arm,[.55,.45,0],[1.2,.18,.18],robot); sphere(arm,[1.1,.45,0],.2,violet,12); box(arm,[1.35,.15,0],[.18,.75,.18],steel); cyl(arm,[1.35,-.35,0],.06,.45,green,10);

      // Humanoid lab robot remains central and performs sample handling.
      const humanoid=new THREE.Group(); humanoid.position.set(-1.9,.55,-.6); lab.add(humanoid); cyl(humanoid,[0,2.05,0],.7,1.45,robot,20); sphere(humanoid,[0,3.15,0],.58,robotDark,20); box(humanoid,[0,3.15,-.54],[.55,.14,.05],cyan); box(humanoid,[0,2.2,-.7],[.32,.42,.05],green);
      const hL=new THREE.Group(), hR=new THREE.Group(); hL.position.set(-.8,2.45,0); hR.position.set(.8,2.45,0); humanoid.add(hL,hR); box(hL,[0,-.62,0],[.3,1.25,.3],robot); box(hR,[0,-.62,0],[.3,1.25,.3],robot); sphere(hL,[0,-1.28,0],.18,cyan,12); sphere(hR,[0,-1.28,0],.18,cyan,12); box(humanoid,[-.3,.55,0],[.38,1.25,.38],robot); box(humanoid,[.3,.55,0],[.38,1.25,.38],robot);
      const labPanel=createPanel('ADVANCED BIOMEDICAL LAB','GENOMICS · ANALYSIS · CELL CULTURE · BIOFABRICATION',8.5,2.15); labPanel.position.set(0,6.25,-6.4); lab.add(labPanel);

      // IMAGING CENTER
      const imaging=new THREE.Group(); imaging.position.set(0,0,18); scene.add(imaging); box(imaging,[0,.65,0],[12,.25,7],white); const ct=new THREE.Mesh(new THREE.TorusGeometry(3.2,.42,18,64),robotDark); ct.rotation.y=Math.PI/2; ct.position.set(0,3.5,0); imaging.add(ct); const ctGlow=new THREE.Mesh(new THREE.TorusGeometry(2.7,.12,12,64),cyan); ctGlow.rotation.y=Math.PI/2; ctGlow.position.copy(ct.position); imaging.add(ctGlow); const body=new THREE.Group(); body.position.set(0,3.5,0); imaging.add(body); sphere(body,[0,1.1,0],.42,cyan,16); box(body,[0,0,0],[.75,1.7,.38],cyan); for(let y=-.75;y<=.75;y+=.2){const ring=new THREE.Mesh(new THREE.TorusGeometry(.55,.025,8,32),violet); ring.position.y=y; ring.rotation.x=Math.PI/2; body.add(ring);} const imagingPanel=createPanel('IMAGING / CT-MRI','3D ANATOMICAL RECONSTRUCTION // LIVE SCAN',7,2.2); imagingPanel.position.set(-5.2,6.4,-3.5); imaging.add(imagingPanel);

      // AI diagnostics wall
      const ai=new THREE.Group(); ai.position.set(25,0,-7); scene.add(ai); box(ai,[0,4.2,0],[11,8.4,.22],graphite); const aiPanel=createPanel('AI DIAGNOSTICS','NEURAL ANALYSIS // PATIENT TELEMETRY',9.5,3.1); aiPanel.position.set(0,4.4,-.18); ai.add(aiPanel);
      for(let i=0;i<14;i++){const x=-4+(i%7)*1.3,y=1.4+Math.floor(i/7)*1.4;sphere(ai,[x,y,-.35],.1,i%2?violet:cyan,8);if(i<7)line(ai,[[x,y,-.34],[x+.9,y+.2,-.34]],cyan);}
      const patientPanel=createPanel('PATIENT STATUS','REMOTE MONITORING // SECURE BIOMEDICAL LINK',7.2,2.2); patientPanel.position.set(-2.5,6.5,5); patientPanel.rotation.y=.18; scene.add(patientPanel);
      const genomicPanel=createPanel('GENOMIC ANALYSIS','DNA SEQUENCING // AI MATCH 99.1%',7.2,2.2); genomicPanel.position.set(9,7,-8); genomicPanel.rotation.y=-.2; scene.add(genomicPanel);

      // DNA landmark + research entrance
      const helix=new THREE.Group(); helix.position.set(-22,.8,-7); scene.add(helix); for(let i=0;i<32;i++){const y=i*.22,a=i*.52,x=Math.cos(a)*1.15,z=Math.sin(a)*1.15;sphere(helix,[x,y,z],.07,cyan,9);sphere(helix,[-x,y,-z],.07,violet,9);if(i%2===0)line(helix,[[x,y,z],[-x,y,-z]],green);}
      const entrance=new THREE.Group(); entrance.position.set(0,0,-22); scene.add(entrance); box(entrance,[0,5,0],[25,10,.12],glass); box(entrance,[-12.5,5,0],[.3,10,5],graphite); box(entrance,[12.5,5,0],[.3,10,5],graphite); box(entrance,[0,10,0],[25,.3,5],graphite); const entranceDoors=slidingDoors(entrance,.08,8,7); const entrancePanel=createPanel('BIOMEDICAL RESEARCH CENTER','ROBOTICS · AI · IMAGING · BIOENGINEERING',10,2.6); entrancePanel.position.set(0,8,-.15); entrance.add(entrancePanel);

      const particleCount=mobile?65:120; const positions=new Float32Array(particleCount*3); for(let i=0;i<particleCount;i++){positions[i*3]=(Math.random()-.5)*64;positions[i*3+1]=.8+Math.random()*13;positions[i*3+2]=(Math.random()-.5)*48;} const pg=new THREE.BufferGeometry(); pg.setAttribute('position',new THREE.BufferAttribute(positions,3)); const pm=new THREE.PointsMaterial({color:0x76ecff,size:mobile?.04:.055,transparent:true,opacity:.5}); const particles=new THREE.Points(pg,pm); scene.add(particles);

      const paths:Array<{p:V3;l:V3;fov:number}>=[
        {p:[0,8,34],l:[0,3.5,14],fov:46},
        {p:[-25,5.5,14],l:[-13,3.5,8],fov:38},
        {p:[-13,3.9,19],l:[-13,3.1,8],fov:34},
        {p:[8,4.4,15],l:[15,3.2,6],fov:34},
        {p:[14.5,4.0,9],l:[12,2.5,4],fov:31},
        {p:[18,4.1,2],l:[4,2.4,3],fov:33},
        {p:[10,3.9,7],l:[7,2.8,4],fov:31},
        {p:[5,4.4,1],l:[3,2.2,-1],fov:34},
        {p:[-2,4.5,20],l:[0,3.5,18],fov:36},
        {p:[24,4.5,-1],l:[25,4,-7],fov:37},
        {p:[-1,4.8,4],l:[0,3.2,18],fov:43},
        {p:[0,7.5,-13],l:[0,4.5,-22],fov:40},
        {p:[0,14,32],l:[0,3.5,4],fov:49},
      ];
      const clock=new THREE.Clock(); const target=new THREE.Vector3(); const look=new THREE.Vector3();
      const resize=()=>{const width=Math.max(1,mount.clientWidth),height=Math.max(1,mount.clientHeight);camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height,false);}; window.addEventListener('resize',resize); resize();

      const animate=()=>{ if(dead)return; const t=clock.getElapsedTime(); const duration=mobile?6.5:5.1; const phase=(t%(paths.length*duration))/duration; const i=Math.floor(phase),n=(i+1)%paths.length,blend=phase-i,e=blend*blend*(3-2*blend); const a=paths[i],b=paths[n];
        camera.position.set(THREE.MathUtils.lerp(a.p[0],b.p[0],e),THREE.MathUtils.lerp(a.p[1],b.p[1],e)+Math.sin(t*.5)*.12,THREE.MathUtils.lerp(a.p[2],b.p[2],e)); camera.fov=THREE.MathUtils.lerp(a.fov,b.fov,e); camera.updateProjectionMatrix(); target.set(THREE.MathUtils.lerp(a.l[0],b.l[0],e),THREE.MathUtils.lerp(a.l[1],b.l[1],e),THREE.MathUtils.lerp(a.l[2],b.l[2],e)); look.lerp(target,.14); camera.lookAt(look);
        const door=THREE.MathUtils.smoothstep(Math.sin(t*.42)*.5+.5,.25,.72); surgeryDoors.left.position.x=THREE.MathUtils.lerp(-1.54,-3.25,door);surgeryDoors.right.position.x=THREE.MathUtils.lerp(1.54,3.25,door);labDoors.left.position.x=THREE.MathUtils.lerp(-1.41,-3.05,door);labDoors.right.position.x=THREE.MathUtils.lerp(1.41,3.05,door);entranceDoors.left.position.x=THREE.MathUtils.lerp(-1.6,-3.7,door);entranceDoors.right.position.x=THREE.MathUtils.lerp(1.6,3.7,door);
        surgicalJoints.forEach((joint,index)=>{joint.rotation.x=Math.sin(t*.9+index*.65)*.08;joint.rotation.y=Math.sin(t*1.15+index)*.04;}); surgicalTips.forEach((tip,index)=>{tip.position.z=Math.sin(t*1.7+index)*.16;});
        hL.rotation.z=-.3+Math.sin(t*.75)*.2;hR.rotation.z=.3-Math.sin(t*.75+.7)*.2;humanoid.rotation.y=Math.sin(t*.32)*.12;carousel.rotation.y=t*.65;pipette.rotation.z=Math.sin(t*1.2)*.3;ctGlow.rotation.z=t*1.1;body.rotation.y=t*.7;helix.rotation.y=t*.5;particles.rotation.y=t*.008;
        seqBars.forEach((bar,index)=>{bar.scale.y=.45+(.5+.5*Math.sin(t*2.2+index))*.9;bar.position.y=2.65+bar.scale.y*.12;});
        gantry.position.x=Math.sin(t*.7)*.8; nozzle.position.x=Math.sin(t*.7)*.8; carriage.position.x=-4.8+(Math.sin(t*.5)*.5+.5)*9.6; arm.rotation.z=Math.sin(t*1.1)*.28;
        bsc.children.forEach((child,index)=>{if(index%3===0)child.rotation.y=Math.sin(t*.8+index)*.02;}); cryo.rotation.y=Math.sin(t*.2)*.08; printer.rotation.y=Math.sin(t*.15)*.02;
        cyanLight.intensity=(mobile?12:22)+Math.sin(t)*2; violetLight.intensity=(mobile?8:15)+Math.cos(t*.8)*1.5;
        [surgeryPanel,labPanel,imagingPanel,aiPanel,patientPanel,genomicPanel,entrancePanel].forEach((panel,index)=>{const material=panel.userData.material as THREE.MeshBasicMaterial|undefined;if(material)material.opacity=.88+Math.sin(t*2+index)*.06;});
        renderer.render(scene,camera); raf=requestAnimationFrame(animate);
      };
      animate();
      return()=>{dead=true;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);pg.dispose();pm.dispose();renderer.dispose();mount.innerHTML='';};
    } catch(e){console.error('Biomedical future scene failed:',e);setError(true);return()=>{dead=true;cancelAnimationFrame(raf);};}
  },[]);

  return <section className="biomedical-future-scene" aria-label="Biomedical City — futuristic medical technology showcase">
    <div ref={mountRef} className="biomedical-future-canvas" />
    <div className="future-scene-overlay">
      <div className="future-scene-hud future-scene-hud-left"><span>BIOMEDICAL CITY</span><strong>RESEARCH CAMPUS // 2035</strong></div>
      <div className="future-scene-hud future-scene-hud-right"><span>LIVE SYSTEMS</span><strong>ROBOTICS · AI · IMAGING · BIOENGINEERING</strong></div>
      <div className="future-scene-title"><span>THE FUTURE OF</span><strong>HEALTHCARE</strong></div>
    </div>
    {error&&<div className="future-scene-error"><strong>BIOMEDICAL CITY</strong><span>Visualisation 3D indisponible — interface médicale de secours active.</span></div>}
  </section>;
};

export default BiomedicalCity;
