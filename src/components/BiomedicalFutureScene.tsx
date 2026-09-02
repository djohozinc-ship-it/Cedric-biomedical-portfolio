import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './BiomedicalCity.scss';

type V3 = [number, number, number];
type Scene = { title: string; subtitle: string; duration: number };

const scenes: Scene[] = [
  { title: 'ARRIVAL', subtitle: 'The patient approaches the smart hospital.', duration: 4600 },
  { title: 'ENTRY', subtitle: 'Autonomous doors and biometric access activate.', duration: 4200 },
  { title: 'CHECK-IN', subtitle: 'A contactless station identifies the patient.', duration: 5000 },
  { title: 'EXAMINATION', subtitle: 'The patient is positioned on the intelligent examination bed.', duration: 5400 },
  { title: 'BIOSIGNALS', subtitle: 'ECG, oxygen saturation and temperature stream live.', duration: 6200 },
  { title: 'AI ANALYSIS', subtitle: 'Clinical data is processed by a real-time AI system.', duration: 6200 },
  { title: 'ROBOTIC ASSIST', subtitle: 'A precision medical robot assists the examination.', duration: 5600 },
  { title: 'RESULT', subtitle: 'The clinical assessment is stable and reassuring.', duration: 4000 },
  { title: 'JOY', subtitle: 'The patient gets up and leaves the examination area.', duration: 4800 },
  { title: 'SIGNATURE', subtitle: 'Engineering technology for better healthcare.', duration: 5000 },
];

const totalDuration = scenes.reduce((a, b) => a + b.duration, 0);
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (v: number) => v * v * (3 - 2 * v);

const BiomedicalFutureScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const timeline = useRef(0);
  const paused = useRef(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let dead = false;
    let raf = 0;

    try {
      const mobile = window.matchMedia('(max-width: 700px)').matches;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x03080c);
      scene.fog = new THREE.Fog(0x03080c, 28, 125);

      const camera = new THREE.PerspectiveCamera(mobile ? 48 : 40, 1, 0.1, 180);
      const renderer = new THREE.WebGLRenderer({ antialias: !mobile, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.15 : 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = !mobile;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mount.innerHTML = '';
      mount.appendChild(renderer.domElement);

      const hemi = new THREE.HemisphereLight(0xc9eaff, 0x020508, 1.7);
      scene.add(hemi);
      const sun = new THREE.DirectionalLight(0xe8f6ff, 3.5);
      sun.position.set(16, 26, 18);
      sun.castShadow = !mobile;
      if (!mobile) sun.shadow.mapSize.set(1024, 1024);
      scene.add(sun);
      const cyanLight = new THREE.PointLight(0x25d9ff, 18, 55);
      cyanLight.position.set(-7, 8, 10);
      scene.add(cyanLight);
      const violetLight = new THREE.PointLight(0x705cff, 13, 48);
      violetLight.position.set(12, 7, -10);
      scene.add(violetLight);
      const greenLight = new THREE.PointLight(0x42f0a1, 10, 32);
      greenLight.position.set(0, 5, 2);
      scene.add(greenLight);

      const root = new THREE.Group();
      scene.add(root);
      const exterior = new THREE.Group();
      const interior = new THREE.Group();
      const patientGroup = new THREE.Group();
      const robotGroup = new THREE.Group();
      root.add(exterior, interior, patientGroup, robotGroup);

      const mat = (color: number, roughness = .5, metalness = .15, emissive = 0, ei = 0) =>
        new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive, emissiveIntensity: ei });
      const black = mat(0x071015, .26, .88);
      const graphite = mat(0x18252b, .34, .72);
      const glass = new THREE.MeshPhysicalMaterial({ color: 0x68b9ce, transparent: true, opacity: .24, roughness: .08, metalness: .25, transmission: .12 });
      const steel = mat(0x9caeb5, .2, .9);
      const white = mat(0xe7eef0, .72, .12);
      const concrete = mat(0x35434a, .82, .05);
      const cyan = mat(0x36e2ff, .2, .35, 0x12b8dc, 3.4);
      const cyanSoft = mat(0x1aa6c7, .32, .2, 0x0b718a, 1.5);
      const green = mat(0x4af0a8, .25, .28, 0x159e63, 3);
      const violet = mat(0x8b72ff, .25, .35, 0x4c2ed8, 2.5);
      const red = mat(0xff5965, .3, .3, 0x9c1623, 2.2);
      const skin = mat(0xc98e76, .68, .03);
      const fabric = mat(0x326e9f, .62, .1);
      const darkFabric = mat(0x18232a, .68, .15);

      const box = (p: THREE.Object3D, pos: V3, size: V3, m: THREE.Material, bevel = 0) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), m);
        mesh.position.set(...pos); mesh.castShadow = !mobile; mesh.receiveShadow = true; p.add(mesh);
        if (bevel) mesh.geometry.translate(0, 0, 0);
        return mesh;
      };
      const cyl = (p: THREE.Object3D, pos: V3, r: number, h: number, m: THREE.Material, segments = 20) => {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, segments), m);
        mesh.position.set(...pos); mesh.castShadow = !mobile; mesh.receiveShadow = true; p.add(mesh); return mesh;
      };
      const sphere = (p: THREE.Object3D, pos: V3, r: number, m: THREE.Material) => {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, mobile ? 12 : 20, mobile ? 10 : 16), m);
        mesh.position.set(...pos); mesh.castShadow = !mobile; mesh.receiveShadow = true; p.add(mesh); return mesh;
      };
      const line = (p: THREE.Object3D, points: V3[], m: THREE.Material) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(points.map(v => new THREE.Vector3(...v)));
        const mesh = new THREE.Line(geometry, m); p.add(mesh); return mesh;
      };

      /* FUTURE CITY: layered architecture, roads, towers and light infrastructure */
      box(exterior, [0, -.45, -4], [62, .7, 58], concrete);
      box(exterior, [0, -.02, 7], [62, .12, 6], black);
      for (let x = -27; x <= 27; x += 3) box(exterior, [x, .06, 7], [.08, .04, 6], cyanSoft);
      for (let z = -31; z <= 23; z += 3) box(exterior, [0, .06, z], [58, .035, .07], cyanSoft);
      box(exterior, [0, .15, 10], [62, .1, 9], black);

      const towers = [
        [-25, 7, -22, 9, 22, 7], [-15, 10, -25, 7, 28, 6], [18, 8, -25, 9, 25, 7],
        [28, 5, -19, 7, 16, 6], [-27, 6, -7, 6, 18, 5], [24, 11, 3, 8, 30, 7],
      ];
      towers.forEach(([x, w, z, d, h, step]) => {
        box(exterior, [x, h / 2 - .2, z], [w, h, d], graphite);
        for (let y = 2; y < h - 1; y += 2.4) {
          box(exterior, [x, y, z - d / 2 - .025], [w * .72, .055, .035], cyanSoft);
          for (let wx = x - w / 2 + 1; wx < x + w / 2; wx += 2.1) box(exterior, [wx, y + .55, z - d / 2 - .04], [.72, .65, .045], glass);
        }
        box(exterior, [x, h + .08, z], [w * .58, .12, d * .55], cyanSoft);
      });

      // Main hospital: a glass-and-steel research tower rather than a simple box.
      box(exterior, [0, 5.8, -8], [31, 11.6, 7], graphite);
      box(exterior, [0, 5.8, -11.58], [28, 11.2, .08], glass);
      box(exterior, [-14.5, 5.8, -8], [.18, 11.2, 6.7], cyanSoft);
      box(exterior, [14.5, 5.8, -8], [.18, 11.2, 6.7], cyanSoft);
      for (let y = 1.5; y <= 10; y += 1.7) {
        box(exterior, [0, y, -11.66], [27.2, .06, .05], cyanSoft);
        for (let x = -12; x <= 12; x += 3) box(exterior, [x, y + .5, -11.69], [1.9, .9, .04], glass);
      }
      box(exterior, [0, 3.15, -11.9], [9.5, 5.9, .22], black);
      box(exterior, [0, 9.7, -12], [14, .12, .12], cyan);
      box(exterior, [0, 6.1, -12.1], [2.2, 3.2, .08], cyanSoft);

      // Arrival plaza, autonomous lane and moving light markers.
      box(exterior, [0, .08, 2], [20, .08, 5], black);
      for (let x = -8; x <= 8; x += 2) box(exterior, [x, .13, 2], [.75, .035, .08], cyan);
      for (let x = -20; x <= 20; x += 4) {
        cyl(exterior, [x, .8, 10], .06, 1.5, cyanSoft, 12);
        sphere(exterior, [x, 1.6, 10], .13, cyan);
      }

      // Interior shell and ceiling light grid.
      box(interior, [0, .1, -1], [15, .2, 11], concrete);
      box(interior, [0, 6.5, -4.9], [15, .2, 11], white);
      box(interior, [-7.25, 3.2, -1], [.25, 6.4, 10], white);
      box(interior, [7.25, 3.2, -1], [.25, 6.4, 10], white);
      for (let x = -5.5; x <= 5.5; x += 2.75) box(interior, [x, 6.3, -1], [1.5, .08, 7.5], cyanSoft);
      for (let z = -4; z <= 3; z += 2) box(interior, [0, 6.18, z], [12, .05, .045], cyanSoft);

      // Examination bed + overhead scanner ring.
      box(interior, [0, .9, -1], [7.3, .35, 2.8], steel);
      box(interior, [0, 1.13, -1], [6.8, .25, 2.5], white);
      box(interior, [0, 1.35, -2.05], [2.3, .18, .72], white);
      box(interior, [-3.1, 1.45, -1], [.12, 1.2, 2.5], steel);
      box(interior, [3.1, 1.45, -1], [.12, 1.2, 2.5], steel);
      const scanner = new THREE.Mesh(new THREE.TorusGeometry(1.35, .08, 16, 64), cyan);
      scanner.rotation.x = Math.PI / 2; scanner.position.set(0, 4.9, -1); interior.add(scanner);
      box(interior, [0, 4.2, -1], [2.8, .06, .08], cyan);

      // Monitor, equipment cart, wall panels.
      box(interior, [4.7, 2.9, -2.5], [3.4, 4.9, .5], black);
      box(interior, [4.7, 3.0, -2.78], [3.05, 4.5, .06], cyanSoft);
      box(interior, [4.7, .25, -2.5], [.9, .15, .9], steel);
      cyl(interior, [4.7, 1.6, -2.5], .12, 2.6, steel);
      box(interior, [-4.6, 1.2, -3.5], [1.4, 2.2, 1], graphite);
      box(interior, [-4.6, 2.5, -3.55], [1.15, .65, .05], cyan);
      for (let x = -5.8; x <= 5.8; x += 2.9) box(interior, [x, 5.25, -4.78], [2.1, .75, .05], glass);

      // Check-in kiosk.
      box(interior, [0, 1.5, .8], [3, 3, 1], black);
      box(interior, [0, 2.6, .28], [2.45, 1.55, .06], cyanSoft);
      box(interior, [0, .35, .2], [1.2, .08, .75], cyan);
      const scanRing = new THREE.Mesh(new THREE.TorusGeometry(.35, .055, 12, 40), cyan);
      scanRing.rotation.x = Math.PI / 2; scanRing.position.set(0, 3.55, .18); interior.add(scanRing);

      // AI holographic display and neural network.
      const aiPanel = new THREE.Group(); aiPanel.position.set(0, 3.2, -4.65); interior.add(aiPanel);
      box(aiPanel, [0, 0, 0], [10.5, 6.2, .18], black);
      box(aiPanel, [0, 0, -.11], [9.9, 5.65, .025], cyanSoft);
      const nodes: THREE.Mesh[] = [];
      const nodeMat = mat(0x76f3ff, .15, .2, 0x27cfe8, 4);
      [-3.7, -1.8, 0, 1.8, 3.7].forEach((x, i) => {
        const n = sphere(aiPanel, [x, Math.sin(i) * 1.1, .08], .12, nodeMat); nodes.push(n);
      });
      [-2.8, -1, 1, 2.8].forEach((x, i) => {
        const n = sphere(aiPanel, [x, 1.45 + Math.cos(i) * .35, .08], .1, violet); nodes.push(n);
      });
      for (let i = 0; i < nodes.length - 1; i++) line(aiPanel, [nodes[i].position.toArray() as V3, nodes[(i + 1) % nodes.length].position.toArray() as V3], cyanSoft);

      // Medical robot with articulated arm and precision tool.
      const robotRoot = new THREE.Group(); robotRoot.position.set(3.1, .8, .8); robotGroup.add(robotRoot);
      cyl(robotRoot, [0, 0, 0], .95, .48, black);
      cyl(robotRoot, [0, .38, 0], .56, .25, steel);
      const shoulder = new THREE.Group(); shoulder.position.set(0, .6, 0); robotRoot.add(shoulder);
      sphere(shoulder, [0, 0, 0], .34, steel); box(shoulder, [0, .62, 0], [.42, 1.25, .42], graphite);
      const elbow = new THREE.Group(); elbow.position.set(0, 1.25, 0); shoulder.add(elbow);
      sphere(elbow, [0, 0, 0], .3, steel); box(elbow, [0, .7, 0], [.36, 1.35, .36], steel);
      const wrist = new THREE.Group(); wrist.position.set(0, 1.4, 0); elbow.add(wrist);
      sphere(wrist, [0, 0, 0], .24, cyan); box(wrist, [0, .42, 0], [.28, .8, .28], steel);
      const tool = new THREE.Group(); tool.position.set(0, .85, 0); wrist.add(tool);
      box(tool, [0, 0, 0], [.36, .22, .36], black); cyl(tool, [0, -.32, 0], .065, .6, steel); cyl(tool, [0, -.68, 0], .1, .16, red);
      const workLight = new THREE.PointLight(0x55e8ff, 14, 7); workLight.position.set(0, -.55, .35); tool.add(workLight);
      const target = new THREE.Mesh(new THREE.RingGeometry(.32, .41, 32), red); target.rotation.x = Math.PI / 2; target.position.set(.2, 1.5, -.75); robotGroup.add(target);

      // Patient: proportions, joints, clothing and subtle biological motion.
      const body = new THREE.Group(); patientGroup.add(body);
      const pelvis = new THREE.Group(); pelvis.position.y = .2; body.add(pelvis);
      box(pelvis, [0, 0, 0], [1, .55, .62], darkFabric);
      const torso = new THREE.Group(); torso.position.y = .78; pelvis.add(torso);
      box(torso, [0, .38, 0], [1.05, 1.35, .58], fabric);
      const neck = new THREE.Group(); neck.position.y = 1.12; torso.add(neck); cyl(neck, [0, 0, 0], .15, .28, skin);
      const head = new THREE.Group(); head.position.y = .5; neck.add(head); sphere(head, [0, 0, 0], .4, skin); sphere(head, [0, .19, 0], .35, black);
      const makeLimb = (x: number, y: number, length: number, m: THREE.Material) => { const g = new THREE.Group(); g.position.set(x, y, 0); torso.add(g); box(g, [0, -length / 2, 0], [.22, length, .22], m); sphere(g, [0, -length, 0], .12, skin); return g; };
      const armL = makeLimb(-.62, .9, .8, skin); const armR = makeLimb(.62, .9, .8, skin);
      const legL = new THREE.Group(); legL.position.set(-.27, -.5, 0); pelvis.add(legL); box(legL, [0, -.55, 0], [.32, 1.1, .34], darkFabric); box(legL, [0, -1.1, -.12], [.4, .22, .7], black);
      const legR = new THREE.Group(); legR.position.set(.27, -.5, 0); pelvis.add(legR); box(legR, [0, -.55, 0], [.32, 1.1, .34], darkFabric); box(legR, [0, -1.1, -.12], [.4, .22, .7], black);
      patientGroup.scale.setScalar(.92);

      // Ambient particles / aerial traffic.
      const particleCount = mobile ? 90 : 180;
      const particlePositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) { particlePositions[i * 3] = (Math.random() - .5) * 70; particlePositions[i * 3 + 1] = 2 + Math.random() * 24; particlePositions[i * 3 + 2] = -35 + Math.random() * 48; }
      const particleGeometry = new THREE.BufferGeometry(); particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x63dcff, size: mobile ? .035 : .045, transparent: true, opacity: .42 }));
      scene.add(particles);

      const clock = new THREE.Clock();
      const camPos = new THREE.Vector3(), camTarget = new THREE.Vector3();
      const fromP = new THREE.Vector3(), toP = new THREE.Vector3(), fromT = new THREE.Vector3(), toT = new THREE.Vector3();
      const moveCamera = (p: number, a: V3, b: V3, c: V3, d: V3) => {
        camPos.lerpVectors(fromP.set(...a), toP.set(...b), p);
        camTarget.lerpVectors(fromT.set(...c), toT.set(...d), p);
        camera.position.copy(camPos); camera.lookAt(camTarget);
      };
      const show = (type: number) => {
        exterior.visible = type < 3 || type === 9;
        interior.visible = type >= 2 && type <= 8;
        patientGroup.visible = true;
        robotGroup.visible = type === 6 || type === 7;
      };

      const drawMonitor = (t: number, mode: 'vitals' | 'ai') => {
        const canvas = document.createElement('canvas'); canvas.width = 900; canvas.height = 520;
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        ctx.fillStyle = '#031018'; ctx.fillRect(0, 0, 900, 520);
        ctx.strokeStyle = '#1b6170'; ctx.lineWidth = 4; ctx.strokeRect(12, 12, 876, 496);
        ctx.font = '700 26px Arial'; ctx.fillStyle = '#68edff'; ctx.fillText(mode === 'vitals' ? 'PATIENT MONITOR // LIVE' : 'AI CLINICAL CORE // 2035', 34, 48);
        ctx.font = '700 22px Arial'; ctx.fillStyle = '#63f0ad'; ctx.fillText('HR 72 BPM', 40, 92); ctx.fillStyle = '#68edff'; ctx.fillText('SpO₂ 98%', 250, 92); ctx.fillStyle = '#f0d66b'; ctx.fillText('TEMP 36.7°C', 440, 92);
        ctx.strokeStyle = 'rgba(89,230,255,.12)'; ctx.lineWidth = 1; for (let x = 30; x < 880; x += 42) { ctx.beginPath(); ctx.moveTo(x, 125); ctx.lineTo(x, 470); ctx.stroke(); } for (let y = 140; y < 470; y += 42) { ctx.beginPath(); ctx.moveTo(25, y); ctx.lineTo(875, y); ctx.stroke(); }
        ctx.beginPath(); ctx.strokeStyle = mode === 'vitals' ? '#63f0ad' : '#8b72ff'; ctx.lineWidth = 4;
        for (let i = 0; i < 200; i++) { const x = 32 + i * 4.2; const spike = i % 46; const y = 290 + Math.sin((i + t * 6) * .12) * 9 + ((spike > 21 && spike < 27) ? [0, -22, 65, -42, 16, 0][spike - 21] : 0); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
        if (mode === 'ai') { ctx.fillStyle = 'rgba(139,114,255,.16)'; ctx.fillRect(520, 150, 320, 280); ctx.fillStyle = '#bcaeff'; ctx.font = '700 20px Arial'; ctx.fillText('NEURAL INFERENCE', 545, 185); ctx.fillStyle = '#63f0ad'; ctx.font = '700 30px Arial'; ctx.fillText('STABLE 98.4%', 545, 235); }
        return { canvas, texture: new THREE.CanvasTexture(canvas) };
      };
      const monitorTexture = drawMonitor(0, 'vitals');
      if (monitorTexture) { const m = new THREE.Mesh(new THREE.PlaneGeometry(3.05, 1.76), new THREE.MeshBasicMaterial({ map: monitorTexture.texture })); m.position.set(4.7, 3.0, -2.79); interior.add(m); }
      let lastDraw = 0;

      const cameraData: Array<[V3, V3, V3, V3]> = [
        [[15, 8.5, 22], [9, 5.4, 15], [0, 3, -8], [0, 3, -8]],
        [[8, 5.4, 13], [4, 4.1, 8], [0, 2.6, 0], [0, 2.6, 0]],
        [[7.4, 4.6, 10], [4.8, 3.8, 7], [0, 2.1, .4], [0, 2.1, .4]],
        [[9, 5.2, 8], [6.8, 4.4, 6], [0, 1.4, -1], [0, 1.6, -1]],
        [[-12.8, 7.4, 12.8], [-8.5, 6.2, 10], [-.2, 1.8, -1], [3.8, 3, -2.6]],
        [[-13.8, 8.5, 13.5], [-9.2, 6.4, 11], [-.2, 1.9, -1], [0, 3.2, -4.6]],
        [[11.2, 6.2, 9.6], [8.4, 5.1, 7.7], [2.8, 2.2, .2], [2.9, 2.3, .3]],
        [[8.2, 5.3, 8.6], [6.8, 4.6, 7.4], [0, 1.6, -1], [0, 1.6, -1]],
        [[9.2, 5.7, 10.2], [7.4, 4.7, 8.4], [0, 1.8, .5], [0, 1.7, .8]],
        [[12.5, 8.2, 15.5], [7.5, 5.8, 10], [0, 3.8, -8], [0, 3.5, -8]],
      ];

      const animate = () => {
        if (dead) return;
        const dt = Math.min(clock.getDelta(), .05);
        if (!paused.current) timeline.current = (timeline.current + dt * 1000) % totalDuration;
        let local = timeline.current, idx = 0;
        while (idx < scenes.length - 1 && local >= scenes[idx].duration) { local -= scenes[idx].duration; idx++; }
        const p = ease(clamp(local / scenes[idx].duration));
        setSceneIndex(v => v === idx ? v : idx);
        show(idx);

        // Cinematic environmental motion.
        particles.rotation.y += dt * .012;
        cyanLight.intensity = 16 + Math.sin(clock.elapsedTime * 1.8) * 3;
        violetLight.intensity = 11 + Math.sin(clock.elapsedTime * 1.25 + 2) * 2;
        scanner.rotation.z += dt * .35;
        scanRing.scale.setScalar(1 + Math.sin(clock.elapsedTime * 5) * .08);
        nodes.forEach((n, i) => { n.position.y += Math.sin(clock.elapsedTime * 2 + i) * dt * .08; });

        // Patient choreography: walking -> bed -> standing.
        if (idx <= 1) {
          patientGroup.position.set(-7 + p * 5.2, 0, 3 - p * 3.2); patientGroup.rotation.y = 0;
          armL.rotation.z = Math.sin(clock.elapsedTime * 5) * .08; armR.rotation.z = -Math.sin(clock.elapsedTime * 5) * .08;
        } else if (idx === 2) {
          patientGroup.position.set(0, 0, 1.7); patientGroup.rotation.y = .05;
        } else if (idx >= 3 && idx <= 7) {
          patientGroup.position.set(-.35, 1.45, -.9); patientGroup.rotation.z = -Math.PI / 2;
        } else if (idx === 8) {
          const rise = ease(clamp((p - .08) / .48)); const legs = ease(clamp((p - .45) / .3));
          patientGroup.rotation.z = THREE.MathUtils.lerp(-Math.PI / 2, 0, rise);
          patientGroup.position.set(THREE.MathUtils.lerp(-.35, -.05, legs), THREE.MathUtils.lerp(1.45, .35, legs), THREE.MathUtils.lerp(-.9, .7, legs));
          body.rotation.x = Math.sin(clock.elapsedTime * 2.1) * .018;
        } else {
          patientGroup.position.set(0, .35, 1.25); patientGroup.rotation.set(0, 0, 0); body.rotation.set(0, 0, 0);
        }

        // Automatic doors become physically visible only during entry.
        if (idx === 1) {
          const doorGap = p * 1.5;
          // Reuse the main façade as a visual door aperture via light intensity.
          cyanLight.intensity = 18 + doorGap * 4;
        }

        if (idx === 2) { scanRing.scale.setScalar(1 + Math.sin(clock.elapsedTime * 7) * .13); }
        if (idx === 6) {
          robotRoot.position.x = 3.1 - p * .25;
          shoulder.rotation.z = -.48 - Math.sin(p * Math.PI) * .22;
          elbow.rotation.z = .82 + Math.sin(p * Math.PI) * .32;
          wrist.rotation.z = -.32;
          tool.rotation.z = Math.sin(clock.elapsedTime * 3) * .08;
          target.scale.setScalar(1 + Math.sin(clock.elapsedTime * 5) * .13);
        } else { robotRoot.position.set(3.1, .8, .8); shoulder.rotation.z = -.48; elbow.rotation.z = .82; wrist.rotation.z = -.32; }

        if (clock.elapsedTime - lastDraw > (mobile ? .18 : .09)) {
          lastDraw = clock.elapsedTime;
          // Keep the screen animation alive without repainting every frame on phones.
          const tex = drawMonitor(clock.elapsedTime, idx === 5 ? 'ai' : 'vitals');
          if (tex) {
            const old = interior.children.find(o => (o as THREE.Mesh).isMesh && (o as THREE.Mesh).geometry instanceof THREE.PlaneGeometry) as THREE.Mesh | undefined;
            if (old) { const material = old.material as THREE.MeshBasicMaterial; material.map = tex.texture; material.needsUpdate = true; }
          }
        }

        const cd = cameraData[idx];
        moveCamera(p, cd[0], cd[1], cd[2], cd[3]);
        const cinematic = mobile ? .012 : .022;
        camera.position.x += Math.sin(clock.elapsedTime * .65) * cinematic;
        camera.position.y += Math.sin(clock.elapsedTime * .9) * cinematic * .55;
        camera.fov = mobile ? 50 : 41;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };

      const resize = () => {
        const w = Math.max(1, mount.clientWidth), h = Math.max(1, mount.clientHeight);
        camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false);
      };
      window.addEventListener('resize', resize); resize(); animate();

      return () => {
        dead = true; window.removeEventListener('resize', resize); cancelAnimationFrame(raf); renderer.dispose();
        scene.traverse(o => { const m = o as THREE.Mesh; if (m.geometry) m.geometry.dispose(); if (Array.isArray(m.material)) m.material.forEach(x => x.dispose()); else if (m.material) m.material.dispose(); });
        if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
      };
    } catch (e) {
      console.error('Biomedical Future Scene failed:', e); setError(true);
      return () => { dead = true; cancelAnimationFrame(raf); };
    }
  }, []);

  const jump = (index: number) => {
    timeline.current = scenes.slice(0, index).reduce((s, x) => s + x.duration, 0);
    setSceneIndex(index);
  };
  const toggle = () => { paused.current = !paused.current; setIsPaused(paused.current); };
  const current = scenes[sceneIndex];

  return (
    <section className="biomedical-city" id="city" aria-label="Biomedical City — A Patient's Journey">
      <div ref={mountRef} className="biomedical-city-canvas" />
      {error && <div className="city-error">Biomedical City 3D could not initialize. Please reload the page.</div>}
      <div className="city-vignette" />
      <div className="city-hud">
        <div className="city-kicker">BIOMEDICAL CITY • 2035</div>
        <h2>Biomedical City</h2>
        <div className="city-story"><span className="city-scene-number">{String(sceneIndex + 1).padStart(2, '0')}</span><div><strong>{current.title}</strong><p>{current.subtitle}</p></div></div>
        <div className="city-progress">{scenes.map((item, i) => <button key={item.title} className={i === sceneIndex ? 'active' : ''} onClick={() => jump(i)} aria-label={item.title} />)}</div>
        <button className="city-play" onClick={toggle}>{isPaused ? 'PLAY JOURNEY' : 'PAUSE JOURNEY'}</button>
      </div>
      {sceneIndex === 9 && <div className="city-signature"><span>ENGINEERING TECHNOLOGY</span><strong>FOR BETTER HEALTHCARE</strong></div>}
      <div className="city-label">FUTURE CARE • 2035</div>
    </section>
  );
};

export default BiomedicalFutureScene;
