import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './BiomedicalCity.scss';

type Scene = { title: string; subtitle: string; duration: number };
type V3 = [number, number, number];

const scenes: Scene[] = [
  { title: 'ARRIVAL', subtitle: 'The patient walks toward the smart hospital.', duration: 4200 },
  { title: 'ENTRY', subtitle: 'Automatic glass doors open and the patient enters.', duration: 3800 },
  { title: 'CHECK-IN', subtitle: 'Registration, scanning and identity verification.', duration: 4200 },
  { title: 'EXAMINATION', subtitle: 'The patient lies down and the clinical sensors connect.', duration: 5200 },
  { title: 'BIOSIGNALS', subtitle: 'ECG, SpO₂ and temperature are monitored live.', duration: 4800 },
  { title: 'AI ANALYSIS', subtitle: 'Clinical data is analysed in real time.', duration: 4800 },
  { title: 'ROBOTIC ASSIST', subtitle: 'A medical robot assists the examination.', duration: 5000 },
  { title: 'RESULT', subtitle: 'The results are reassuring: the patient is stable.', duration: 4000 },
  { title: 'JOY', subtitle: 'The patient gets up and celebrates the good news.', duration: 3800 },
  { title: 'SIGNATURE', subtitle: 'Engineering technology for better healthcare.', duration: 4200 }
];
const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (v: number) => v * v * (3 - 2 * v);

const BiomedicalCity: React.FC = () => {
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
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x061017);
      scene.fog = new THREE.Fog(0x061017, 30, 105);

      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 180);
      const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mount.innerHTML = '';
      mount.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xf4fbff, 0x17252c, 2.8));
      const key = new THREE.DirectionalLight(0xffffff, 3.4);
      key.position.set(12, 18, 16);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      scene.add(key);
      const cyanLight = new THREE.PointLight(0x3de0ff, 20, 55);
      cyanLight.position.set(-10, 8, 10);
      scene.add(cyanLight);
      const greenLight = new THREE.PointLight(0x42e59a, 12, 35);
      greenLight.position.set(8, 4, -4);
      scene.add(greenLight);

      const groupNames = ['hospital', 'entry', 'reception', 'patient', 'exam', 'monitor', 'analysis', 'robot', 'result'];
      const g: Record<string, THREE.Group> = {};
      groupNames.forEach((name) => { g[name] = new THREE.Group(); scene.add(g[name]); });

      const mat = (color: number, roughness = 0.5, metalness = 0.15, emissive = 0, intensity = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive, emissiveIntensity: intensity });
      const floor = mat(0x485459, 0.85, 0.05);
      const wall = mat(0xd7dddb, 0.82, 0.02);
      const dark = mat(0x101b20, 0.3, 0.78);
      const steel = mat(0xb8c5c7, 0.2, 0.9);
      const blue = mat(0x2b6175, 0.36, 0.38);
      const cyan = mat(0x42ddff, 0.24, 0.2, 0x17b9df, 2.8);
      const green = mat(0x45e49a, 0.3, 0.18, 0x149e5d, 2.2);
      const red = mat(0xe45b63, 0.34, 0.2, 0x8d1821, 1.5);
      const skin = mat(0xc88d73, 0.72, 0.02);
      const shirt = mat(0x3974a7, 0.58, 0.08);
      const pants = mat(0x263238, 0.72, 0.14);
      const shoe = mat(0x10171a, 0.28, 0.78);
      const white = mat(0xf3f5f0, 0.88, 0.03);
      const glass = new THREE.MeshPhysicalMaterial({ color: 0x9ed9e4, transparent: true, opacity: 0.3, roughness: 0.06, metalness: 0.1 });
      const screen = mat(0x031219, 0.1, 0.35, 0x08798c, 1.7);

      const box = (parent: THREE.Object3D, position: V3, size: V3, material: THREE.Material) => { const o = new THREE.Mesh(new THREE.BoxGeometry(...size), material); o.position.set(...position); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o; };
      const cyl = (parent: THREE.Object3D, position: V3, radius: number, height: number, material: THREE.Material) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 24), material); o.position.set(...position); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o; };
      const sphere = (parent: THREE.Object3D, position: V3, radius: number, material: THREE.Material) => { const o = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 18), material); o.position.set(...position); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o; };
      const text = (value: string, width = 760, height = 130, size = 28, color = '#55e8a2') => {
        const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Canvas text unavailable');
        ctx.fillStyle = 'rgba(3,14,19,.96)'; ctx.fillRect(4, 4, width - 8, height - 8);
        ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.strokeRect(4, 4, width - 8, height - 8);
        ctx.fillStyle = color; ctx.font = `700 ${size}px Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(value, width / 2, height / 2);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthTest: false }));
        sprite.scale.set(width / 130, height / 130, 1); return sprite;
      };
      const addText = (parent: THREE.Object3D, value: string, position: V3, scale: V3, color = '#55e8a2', size = 28) => { const s = text(value, 820, 130, size, color); s.position.set(...position); s.scale.set(...scale); parent.add(s); return s; };

      // Exterior: a recognizable futuristic hospital, not an abstract block.
      box(g.hospital, [0, -0.4, 0], [48, 0.6, 36], floor);
      box(g.hospital, [0, 5.1, -10], [31, 10.2, 7], wall);
      box(g.hospital, [-12, 3.1, -6], [4, 6.2, 11], blue);
      box(g.hospital, [12, 3.1, -6], [4, 6.2, 11], blue);
      for (let x = -9; x <= 9; x += 3) for (let y = 2; y <= 8; y += 2) box(g.hospital, [x, y, -6.45], [1.9, 1.25, 0.08], glass);
      box(g.hospital, [0, 2.7, -6.05], [7.3, 5.7, 0.4], dark);
      box(g.hospital, [0, 9.9, -6.5], [12, 0.16, 0.16], cyan);
      box(g.hospital, [0, 1.15, -2.6], [12, 0.18, 5.4], steel);
      addText(g.hospital, 'SMART MEDICAL CENTER  •  2035', [0, 7.5, -6.58], [4.2, 0.6, 1], '#57e6ff', 28);

      // Patient rig: a complete human silhouette with independently animated limbs.
      const patientBody = new THREE.Group(); g.patient.add(patientBody);
      sphere(patientBody, [0, 3.18, 0], 0.38, skin);
      sphere(patientBody, [0, 3.43, -0.02], 0.32, dark);
      sphere(patientBody, [-0.13, 3.2, -0.35], 0.035, dark); sphere(patientBody, [0.13, 3.2, -0.35], 0.035, dark);
      cyl(patientBody, [0, 2.72, 0], 0.13, 0.25, skin);
      box(patientBody, [0, 2.02, 0], [0.82, 1.35, 0.48], shirt);
      const armL = new THREE.Group(); armL.position.set(-0.52, 2.52, 0); patientBody.add(armL); box(armL, [0, -0.45, 0], [0.2, 0.9, 0.2], skin); sphere(armL, [0, -0.95, 0], 0.12, skin);
      const armR = new THREE.Group(); armR.position.set(0.52, 2.52, 0); patientBody.add(armR); box(armR, [0, -0.45, 0], [0.2, 0.9, 0.2], skin); sphere(armR, [0, -0.95, 0], 0.12, skin);
      const legL = new THREE.Group(); legL.position.set(-0.23, 1.36, 0); patientBody.add(legL); box(legL, [0, -0.6, 0], [0.28, 1.15, 0.3], pants); box(legL, [0, -1.18, -0.1], [0.36, 0.22, 0.64], shoe);
      const legR = new THREE.Group(); legR.position.set(0.23, 1.36, 0); patientBody.add(legR); box(legR, [0, -0.6, 0], [0.28, 1.15, 0.3], pants); box(legR, [0, -1.18, -0.1], [0.36, 0.22, 0.64], shoe);
      g.patient.scale.setScalar(0.82);

      // Entrance: transparent automatic doors with visible lobby depth.
      box(g.entry, [-3.4, 3.15, -0.5], [2.5, 6.3, 1.7], dark); box(g.entry, [3.4, 3.15, -0.5], [2.5, 6.3, 1.7], dark);
      box(g.entry, [0, 5.95, -0.5], [7.2, 0.3, 1.7], dark);
      box(g.entry, [0, 2.6, -1.1], [5.8, 5.2, 0.16], glass);
      const doorL = box(g.entry, [-1.35, 2.65, 0.25], [2.35, 5.15, 0.1], glass);
      const doorR = box(g.entry, [1.35, 2.65, 0.25], [2.35, 5.15, 0.1], glass);
      box(g.entry, [0, 5.38, 0.3], [6.9, 0.12, 0.14], cyan);
      box(g.entry, [0, 0.08, 0.3], [6.9, 0.12, 2.5], steel);
      addText(g.entry, 'AUTOMATIC ENTRY  •  OPEN', [0, 6.45, 0.1], [3.5, 0.55, 1], '#57e6ff', 27);
      box(g.entry, [0, 2.0, -2.2], [6.2, 4.2, 0.2], dark);
      addText(g.entry, 'RECEPTION', [0, 3.8, -2.35], [2.5, 0.5, 1], '#d9f7ff', 27);

      // Reception kiosk and animated check-in state machine.
      box(g.reception, [0, 1.55, 0], [3.0, 3.2, 0.85], dark);
      box(g.reception, [0, 2.42, -0.5], [2.25, 1.45, 0.08], screen);
      const regStates = [
        addText(g.reception, 'PATIENT REGISTRATION', [0, 2.42, -0.58], [2.95, 0.55, 1], '#55e8a2', 25),
        addText(g.reception, 'SCANNING...', [0, 2.42, -0.58], [2.95, 0.55, 1], '#57e6ff', 28),
        addText(g.reception, 'IDENTITY DETECTED  ✓', [0, 2.42, -0.58], [3.0, 0.55, 1], '#55e8a2', 26),
        addText(g.reception, 'CHECK-IN COMPLETE  ✓', [0, 2.42, -0.58], [3.1, 0.55, 1], '#55e8a2', 26)
      ];
      box(g.reception, [0, 1.52, -0.52], [1.4, 0.12, 0.05], green);
      const scanRing = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.045, 10, 40), cyan); scanRing.position.set(0, 1.05, -0.55); g.reception.add(scanRing);
      const scanBeam = box(g.reception, [0, 1.05, -0.6], [0.04, 0.95, 0.02], cyan);

      // Examination room: bed, pillow, rails, overhead lamp and a side monitor.
      box(g.exam, [0, 0.25, -1.2], [10.5, 0.35, 8], floor);
      box(g.exam, [0, 3.7, -5], [10.5, 7.4, 0.3], wall);
      box(g.exam, [-5, 3.5, -1], [0.3, 7, 8], wall); box(g.exam, [5, 3.5, -1], [0.3, 7, 8], wall);
      box(g.exam, [0, 0.92, -0.8], [6.9, 0.3, 2.55], steel);
      box(g.exam, [0, 1.1, -0.9], [6.3, 0.28, 2.15], white);
      box(g.exam, [0, 1.32, -1.78], [5.8, 0.5, 0.28], wall);
      box(g.exam, [-3.05, 1.55, -0.8], [0.1, 1.0, 2.15], steel); box(g.exam, [3.05, 1.55, -0.8], [0.1, 1.0, 2.15], steel);
      cyl(g.exam, [-3.2, 0.5, -0.8], 0.12, 0.9, steel); cyl(g.exam, [3.2, 0.5, -0.8], 0.12, 0.9, steel);
      const lamp = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.1, 14, 48), cyan); lamp.position.set(0, 4.2, -0.7); lamp.rotation.x = Math.PI / 2; g.exam.add(lamp); cyl(g.exam, [0, 3.4, -0.7], 0.07, 1.6, steel);
      box(g.exam, [-3.65, 2.25, -0.6], [0.5, 3.8, 0.65], dark); box(g.exam, [-3.65, 3.35, -0.98], [2.25, 1.65, 0.08], screen);
      addText(g.exam, 'PATIENT MONITOR', [-3.65, 4.0, -1.04], [2.3, 0.42, 1], '#57e6ff', 23);
      addText(g.exam, 'ECG  •  SpO₂  •  TEMP', [0, 0.4, -2.25], [2.9, 0.48, 1], '#55e8a2', 25);

      // Patient sensors and cables are attached to the examination body, not floating separately.
      const sensorGroup = new THREE.Group(); sensorGroup.position.set(0, 0, 0); g.exam.add(sensorGroup);
      const pads: THREE.Mesh[] = [];
      [-0.75, -0.25, 0.25, 0.75].forEach((x, i) => { const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.04, 18), i % 2 ? green : red); pad.rotation.x = Math.PI / 2; pad.position.set(x, 1.56, -0.95); sensorGroup.add(pad); pads.push(pad); });
      const fingerProbe = box(sensorGroup, [0.42, 1.42, -1.08], [0.2, 0.17, 0.13], red);
      const tempProbe = box(sensorGroup, [-0.48, 1.5, -1.12], [0.16, 0.1, 0.16], cyan);
      const cableMat = new THREE.LineBasicMaterial({ color: 0x52dfff });
      const cable = (points: V3[]) => { const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(...p))), cableMat); sensorGroup.add(line); return line; };
      cable([[-0.75, 1.55, -0.95], [-1.8, 1.35, -0.9], [-3.15, 2.2, -0.95]]);
      cable([[0.75, 1.55, -0.95], [1.4, 1.25, -0.95], [2.8, 1.8, -0.9]]);
      cable([[0.42, 1.42, -1.08], [1.3, 1.2, -1.08], [2.8, 1.8, -0.9]]);
      cable([[-0.48, 1.5, -1.12], [-1.3, 1.2, -1.1], [-2.8, 1.8, -0.9]]);

      // Biosignal display: multiple genuinely animated traces.
      box(g.monitor, [3.35, 3.2, -2.55], [5.9, 4.6, 0.35], dark); box(g.monitor, [3.35, 3.2, -2.75], [5.4, 4.1, 0.08], screen);
      addText(g.monitor, 'LIVE PATIENT VITALS', [3.35, 4.95, -2.82], [3.0, 0.5, 1], '#57e6ff', 27);
      const makeTrace = (baseY: number, phase: number) => { const points: THREE.Vector3[] = []; for (let i = 0; i < 180; i++) points.push(new THREE.Vector3(-2.35 + i * 0.026, baseY, 0)); const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: phase === 0 ? 0x55e89a : phase === 1 ? 0x52dfff : 0xf1c85c })); line.position.set(3.35, 3.55, -2.86); g.monitor.add(line); return { line, points }; };
      const ecg = makeTrace(0.9, 0); const spo = makeTrace(0.05, 1); const temp = makeTrace(-0.8, 2);
      const vitalText = addText(g.monitor, 'HR 72 BPM   •   SpO₂ 98%   •   TEMP 36.7°C', [3.35, 1.35, -2.84], [3.8, 0.48, 1], '#dffaff', 22);
      const alarm = addText(g.monitor, '●  NORMAL   ●  STABLE   ●  CONNECTED', [3.35, 1.85, -2.84], [3.35, 0.42, 1], '#55e8a2', 21);

      // AI dashboard with progressive data and a moving analysis sweep.
      box(g.analysis, [0, 2.9, -4.2], [8.8, 5.6, 0.3], dark); box(g.analysis, [0, 2.9, -4.38], [8.3, 5.1, 0.08], screen);
      addText(g.analysis, 'AI CLINICAL ANALYSIS', [0, 4.75, -4.45], [3.5, 0.55, 1], '#57e6ff', 28);
      const analysisRows = [
        addText(g.analysis, 'ECG              ✓ NORMAL', [-0.5, 3.75, -4.46], [2.8, 0.44, 1], '#dffaff', 23),
        addText(g.analysis, 'OXYGENATION      ✓ NORMAL', [-0.5, 3.15, -4.46], [3.0, 0.44, 1], '#dffaff', 23),
        addText(g.analysis, 'TEMPERATURE      ✓ NORMAL', [-0.5, 2.55, -4.46], [3.0, 0.44, 1], '#dffaff', 23),
        addText(g.analysis, 'PATIENT STATUS   STABLE', [-0.5, 1.95, -4.46], [3.0, 0.44, 1], '#55e8a2', 23),
        addText(g.analysis, 'ANALYSIS COMPLETE  ✓', [-0.5, 1.35, -4.46], [3.0, 0.44, 1], '#55e8a2', 23)
      ];
      const graphPoints: THREE.Vector3[] = []; for (let i = 0; i < 120; i++) graphPoints.push(new THREE.Vector3(-2.0 + i * 0.035, 0.15, 0));
      const graph = new THREE.Line(new THREE.BufferGeometry().setFromPoints(graphPoints), new THREE.LineBasicMaterial({ color: 0x52dfff })); graph.position.set(2.0, 3.0, -4.48); g.analysis.add(graph);
      const sweep = box(g.analysis, [2.0, 3.0, -4.5], [0.035, 2.7, 0.02], cyan);
      addText(g.analysis, 'CONFIDENCE  98.4%   •   NO CRITICAL ANOMALY', [1.7, 1.45, -4.46], [3.25, 0.44, 1], '#55e8a2', 20);

      // Robotic assistant: articulated links, joints, instrument and work light.
      const robotBase = new THREE.Group(); robotBase.position.set(3.1, 0.95, 0.55); g.robot.add(robotBase);
      cyl(robotBase, [0, 0, 0], 0.78, 0.5, dark); cyl(robotBase, [0, 0.38, 0], 0.45, 0.32, steel);
      const shoulder = new THREE.Group(); shoulder.position.set(0, 0.58, 0); robotBase.add(shoulder); sphere(shoulder, [0, 0, 0], 0.34, steel); box(shoulder, [0, 0.62, 0], [0.44, 1.25, 0.44], blue);
      const elbow = new THREE.Group(); elbow.position.set(0, 1.25, 0); shoulder.add(elbow); sphere(elbow, [0, 0, 0], 0.3, steel); box(elbow, [0, 0.68, 0], [0.36, 1.35, 0.36], steel);
      const wrist = new THREE.Group(); wrist.position.set(0, 1.36, 0); elbow.add(wrist); sphere(wrist, [0, 0, 0], 0.24, cyan); box(wrist, [0, 0.4, 0], [0.26, 0.72, 0.26], steel);
      const tool = new THREE.Group(); tool.position.set(0, 0.78, 0); wrist.add(tool); box(tool, [0, 0, 0], [0.3, 0.18, 0.3], dark); cyl(tool, [0, -0.28, 0], 0.055, 0.52, steel); const tip = cyl(tool, [0, -0.58, 0], 0.08, 0.12, red);
      const workLight = new THREE.PointLight(0x55e8ff, 9, 8); workLight.position.set(0, -0.5, 0.4); tool.add(workLight);
      addText(g.robot, 'ROBOTIC ASSIST  •  ACTIVE', [1.2, 4.8, -0.3], [3.2, 0.52, 1], '#57e6ff', 27);
      const target = new THREE.Mesh(new THREE.RingGeometry(0.32, 0.4, 32), red); target.rotation.x = Math.PI / 2; target.position.set(0.5, 1.5, -0.35); g.robot.add(target);

      // Result and celebration visuals.
      addText(g.result, 'RESULT  •  STABLE', [0, 4.4, 0], [3.0, 0.55, 1], '#55e8a2', 30);
      addText(g.result, 'GOOD NEWS  ✓', [0, 3.65, 0], [2.8, 0.5, 1], '#57e6ff', 28);
      const resultRing = new THREE.Mesh(new THREE.RingGeometry(0.7, 0.84, 48), green); resultRing.position.set(0, 2.8, 0); g.result.add(resultRing);
      const successLight = new THREE.PointLight(0x55e8a2, 14, 20); successLight.position.set(0, 3, 1); g.result.add(successLight);

      const cameraA = new THREE.Vector3(); const cameraB = new THREE.Vector3(); const lookA = new THREE.Vector3(); const lookB = new THREE.Vector3(); const targetLook = new THREE.Vector3();
      const moveCamera = (p: number, from: V3, to: V3, lookFrom: V3, lookTo: V3) => { camera.position.lerpVectors(cameraA.set(...from), cameraB.set(...to), p); targetLook.lerpVectors(lookA.set(...lookFrom), lookB.set(...lookTo), p); camera.lookAt(targetLook); };
      const show = (visible: string[]) => groupNames.forEach((name) => { g[name].visible = visible.includes(name); });

      const clock = new THREE.Clock();
      const animate = () => {
        if (dead) return;
        const dt = Math.min(clock.getDelta(), 0.05);
        if (!paused.current) timeline.current = (timeline.current + dt * 1000) % totalDuration;
        let local = timeline.current; let idx = 0;
        while (idx < scenes.length - 1 && local >= scenes[idx].duration) { local -= scenes[idx].duration; idx++; }
        const p = ease(clamp(local / scenes[idx].duration));
        setSceneIndex((value) => value === idx ? value : idx);

        show(idx === 0 ? ['hospital', 'patient'] : idx === 1 ? ['entry', 'patient'] : idx === 2 ? ['reception', 'patient'] : idx === 3 ? ['exam', 'patient'] : idx === 4 ? ['exam', 'patient', 'monitor'] : idx === 5 ? ['exam', 'patient', 'analysis'] : idx === 6 ? ['exam', 'patient', 'robot'] : idx === 7 || idx === 8 ? ['result', 'patient'] : ['hospital', 'patient']);

        // Patient story: walk, enter, lie down, then stand and celebrate.
        const walk = Math.sin(clock.elapsedTime * 7.2) * 0.43;
        legL.rotation.x = idx < 3 ? walk : 0; legR.rotation.x = idx < 3 ? -walk : 0;
        armL.rotation.x = idx < 3 ? -walk * 0.7 : 0; armR.rotation.x = idx < 3 ? walk * 0.7 : 0;
        if (idx === 0) g.patient.position.set(-7 + p * 5.8, 0, 4 - p * 4);
        else if (idx === 1) g.patient.position.set(-1.8 + p * 1.8, 0, 2.2 - p * 2.2);
        else if (idx === 2) g.patient.position.set(-1.4 + p * 1.4, 0, 1.2);
        else if (idx === 3 || idx === 4 || idx === 5 || idx === 6 || idx === 7) g.patient.position.set(0, 1.28, 0);
        else if (idx === 8) g.patient.position.set(0, Math.abs(Math.sin(p * Math.PI * 2)) * 0.8, 0);
        else g.patient.position.set(0, 0, 0);
        g.patient.rotation.set(0, 0, idx >= 3 && idx <= 7 ? Math.PI / 2 : 0);
        if (idx === 8) { g.patient.rotation.set(0, Math.sin(p * Math.PI * 2) * 0.22, 0); patientBody.rotation.z = Math.sin(p * Math.PI * 4) * 0.08; } else patientBody.rotation.z = 0;

        const doorP = idx === 1 ? p : 0;
        doorL.position.x = -1.35 - doorP * 2.0; doorR.position.x = 1.35 + doorP * 2.0;
        regStates.forEach((sprite, i) => { sprite.visible = idx === 2 && i === (p < 0.2 ? 0 : p < 0.48 ? 1 : p < 0.72 ? 2 : 3); });
        scanRing.rotation.z = clock.elapsedTime * 2.8; scanRing.scale.setScalar(1 + Math.sin(clock.elapsedTime * 5) * 0.1);
        scanBeam.scale.y = 0.5 + (Math.sin(clock.elapsedTime * 5) + 1) * 0.25;
        lamp.rotation.z = clock.elapsedTime * 0.18;

        const signalTime = clock.elapsedTime * 8;
        const updateTrace = (trace: { line: THREE.Line; points: THREE.Vector3[] }, kind: number) => {
          trace.points.forEach((point, i) => {
            const phase = i + signalTime * (kind === 0 ? 20 : kind === 1 ? 14 : 8);
            const wave = kind === 0 ? Math.sin(phase * 0.28) * 0.045 + (i % 44 === 22 ? 0.46 : i % 44 === 23 ? -0.28 : i % 44 === 24 ? 0.18 : 0) : kind === 1 ? Math.sin(phase * 0.19) * 0.075 : Math.sin(phase * 0.08) * 0.055;
            point.y = (kind === 0 ? 0.9 : kind === 1 ? 0.05 : -0.8) + wave;
            point.x = -2.35 + (i / (trace.points.length - 1)) * 4.65;
          });
          trace.line.geometry.setFromPoints(trace.points);
        };
        updateTrace(ecg, 0); updateTrace(spo, 1); updateTrace(temp, 2);
        vitalText.scale.x = 3.8 + Math.sin(clock.elapsedTime * 2) * 0.02; alarm.visible = idx >= 4;

        analysisRows.forEach((row, i) => { row.visible = idx === 5 && p > i * 0.16; });
        graphPoints.forEach((point, i) => { point.y = 0.15 + Math.sin((i + clock.elapsedTime * 18) * 0.22) * 0.07 + (i % 30 === 15 ? 0.24 : 0); });
        graph.geometry.setFromPoints(graphPoints); sweep.position.x = 0.0 + Math.sin(clock.elapsedTime * 2) * 2.0;

        if (idx === 6) {
          g.robot.position.set(0.9, 0, -0.15);
          shoulder.rotation.z = -0.7 + Math.sin(clock.elapsedTime * 1.2) * 0.05;
          elbow.rotation.z = 0.9 + Math.sin(clock.elapsedTime * 1.45) * 0.07;
          wrist.rotation.z = -0.5 + Math.sin(clock.elapsedTime * 1.8) * 0.08;
          tool.rotation.z = Math.sin(clock.elapsedTime * 2.2) * 0.06;
          target.scale.setScalar(1 + Math.sin(clock.elapsedTime * 5) * 0.14);
          tip.material = red;
        } else { g.robot.position.set(2.8, 0, -1); shoulder.rotation.z = 0; elbow.rotation.z = 0; wrist.rotation.z = 0; }
        resultRing.rotation.z = clock.elapsedTime * 0.8; resultRing.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3) * 0.08);
        successLight.intensity = 10 + Math.sin(clock.elapsedTime * 4) * 3;

        if (idx === 0) moveCamera(p, [17, 9.5, 24], [10, 7, 15], [0, 3, -6], [0, 2.7, -4]);
        else if (idx === 1) moveCamera(p, [8, 5.2, 13], [5.3, 4.0, 8], [0, 2.8, 0], [0, 2.6, 0]);
        else if (idx === 2) moveCamera(p, [6.2, 4.3, 8], [4.2, 3.5, 5.4], [0, 1.9, 0], [0, 1.9, 0]);
        else if (idx === 3) moveCamera(p, [7.5, 5.0, 7.5], [6.0, 4.0, 5.6], [0, 1.4, -0.5], [0, 1.3, -0.6]);
        else if (idx === 4) moveCamera(p, [8.0, 4.6, 7], [5.4, 3.7, 4.8], [1.0, 2.0, -0.8], [3.35, 3.2, -2.55]);
        else if (idx === 5) moveCamera(p, [7.0, 4.8, 6.5], [5.0, 3.6, 5.0], [0, 2.8, -2], [0, 2.9, -4.2]);
        else if (idx === 6) moveCamera(p, [9.0, 5.4, 8.0], [7.0, 4.6, 6.2], [0.2, 1.8, 0], [0.6, 1.8, 0]);
        else if (idx === 7) moveCamera(p, [6.5, 4.6, 7.0], [4.5, 3.7, 5.2], [0, 2.0, 0], [0, 2.6, 0]);
        else if (idx === 8) moveCamera(p, [6.0, 4.4, 7.0], [4.0, 3.5, 5.2], [0, 2.0, 0], [0, 2.4, 0]);
        else moveCamera(p, [12, 8, 15], [18, 10, 22], [0, 3, -5], [0, 3, -5]);

        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };

      const resize = () => { const width = Math.max(1, mount.clientWidth); const height = Math.max(1, mount.clientHeight); camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false); };
      window.addEventListener('resize', resize); resize(); animate();
      return () => {
        dead = true; window.removeEventListener('resize', resize); cancelAnimationFrame(raf); renderer.dispose();
        scene.traverse((object) => { const mesh = object as THREE.Mesh; if (mesh.geometry) mesh.geometry.dispose(); if (Array.isArray(mesh.material)) mesh.material.forEach((material) => material.dispose()); else if (mesh.material) mesh.material.dispose(); });
        if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
      };
    } catch (e) {
      console.error('Biomedical City 3D initialization failed:', e);
      if (!dead) setError(true);
      return () => { dead = true; cancelAnimationFrame(raf); };
    }
  }, []);

  const jump = (index: number) => { timeline.current = scenes.slice(0, index).reduce((sum, s) => sum + s.duration, 0); setSceneIndex(index); };
  const toggle = () => { paused.current = !paused.current; setIsPaused(paused.current); };
  const current = scenes[sceneIndex];

  return <section className="biomedical-city" id="city" aria-label="Biomedical City — A Patient's Journey">
    <div ref={mountRef} className="biomedical-city-canvas" />
    {error && <div className="city-error">Biomedical City 3D could not initialize. Please reload the page.</div>}
    <div className="city-vignette" />
    <div className="city-hud">
      <div className="city-kicker">BIOMEDICAL CITY • A PATIENT'S JOURNEY • 2035</div>
      <h2>Biomedical City</h2>
      <div className="city-story"><span className="city-scene-number">{String(sceneIndex + 1).padStart(2, '0')}</span><div><strong>{current.title}</strong><p>{current.subtitle}</p></div></div>
      <p className="city-description">Arrival → entry → check-in → examination → biosignals → AI → robotics → result → joy.</p>
      <div className="city-progress">{scenes.map((s, i) => <button key={s.title} className={i === sceneIndex ? 'active' : ''} onClick={() => jump(i)} aria-label={s.title} />)}</div>
      <button className="city-play" onClick={toggle}>{isPaused ? 'PLAY JOURNEY' : 'PAUSE JOURNEY'}</button>
    </div>
    {sceneIndex === 9 && <div className="city-signature"><span>ENGINEERING TECHNOLOGY</span><strong>FOR BETTER HEALTHCARE</strong></div>}
    <div className="city-label">REALISTIC FUTURE CARE • 2035</div>
  </section>;
};

export default BiomedicalCity;
