import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './BiomedicalCity.scss';

type Scene = { title: string; subtitle: string; duration: number };
type V3 = [number, number, number];

const scenes: Scene[] = [
  { title: 'ARRIVAL', subtitle: 'The patient walks toward the smart hospital entrance.', duration: 3000 },
  { title: 'ENTRY', subtitle: 'Automatic glass doors open as the patient approaches.', duration: 3000 },
  { title: 'CHECK-IN', subtitle: 'The registration kiosk scans and verifies the patient.', duration: 3500 },
  { title: 'CORRIDOR', subtitle: 'Guided floor lighting leads the patient to examination.', duration: 3000 },
  { title: 'EXAMINATION', subtitle: 'The patient lies on the medical bed while sensors connect.', duration: 4000 },
  { title: 'BIOSIGNALS', subtitle: 'Live ECG, SpO₂ and temperature signals are monitored.', duration: 4000 },
  { title: 'ANALYSIS', subtitle: 'AI compares the clinical measurements in real time.', duration: 4000 },
  { title: 'ROBOTICS', subtitle: 'A medical robotic arm assists over the examination bed.', duration: 4000 },
  { title: 'CARE', subtitle: 'The result is reassuring — the patient celebrates.', duration: 3500 },
  { title: 'SIGNATURE', subtitle: 'Engineering technology for better healthcare.', duration: 3500 }
];
const totalDuration = scenes.reduce((a, s) => a + s.duration, 0);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
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
      scene.background = new THREE.Color(0x071017);
      scene.fog = new THREE.Fog(0x071017, 28, 105);

      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 180);
      const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mount.innerHTML = '';
      mount.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xf5fbff, 0x24333a, 2.6));
      const key = new THREE.DirectionalLight(0xffffff, 3.2);
      key.position.set(12, 18, 15);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      scene.add(key);
      const cyanLight = new THREE.PointLight(0x45ddff, 18, 48);
      cyanLight.position.set(-8, 7, 8);
      scene.add(cyanLight);
      const warmLight = new THREE.PointLight(0xffb477, 8, 35);
      warmLight.position.set(10, 5, 8);
      scene.add(warmLight);

      const names = ['hospital', 'entry', 'patient', 'checkin', 'corridor', 'exam', 'signals', 'analysis', 'robot', 'care'];
      const g: Record<string, THREE.Group> = {};
      names.forEach((n) => { g[n] = new THREE.Group(); scene.add(g[n]); });

      const M = (c: number, r = 0.45, m = 0.15, e = 0, ei = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m, emissive: e, emissiveIntensity: ei });
      const floor = M(0x555f63, 0.82, 0.05);
      const wall = M(0xd9dedc, 0.82, 0.02);
      const dark = M(0x172328, 0.32, 0.72);
      const steel = M(0xbac5c7, 0.22, 0.86);
      const blue = M(0x2f5f72, 0.38, 0.35);
      const screen = M(0x04151b, 0.12, 0.35, 0x08788a, 1.5);
      const green = M(0x43df91, 0.28, 0.18, 0x149b55, 2.2);
      const cyan = M(0x4bdfff, 0.24, 0.15, 0x20dfff, 2.8);
      const skin = M(0xc98d72, 0.74, 0.02);
      const shirt = M(0x356b9d, 0.62, 0.08);
      const pants = M(0x263238, 0.72, 0.12);
      const shoe = M(0x11171b, 0.28, 0.72);
      const white = M(0xf4f5f1, 0.9, 0.02);
      const red = M(0xe15b62, 0.34, 0.2, 0xa51b22, 1.4);
      const yellow = M(0xf1c85c, 0.34, 0.2, 0xb98518, 1.3);
      const glass = new THREE.MeshPhysicalMaterial({ color: 0x9ed5df, transparent: true, opacity: 0.34, roughness: 0.07, metalness: 0.08 });

      const box = (q: THREE.Object3D, p: V3, s: V3, mat: THREE.Material) => { const o = new THREE.Mesh(new THREE.BoxGeometry(...s), mat); o.position.set(...p); o.castShadow = true; o.receiveShadow = true; q.add(o); return o; };
      const cyl = (q: THREE.Object3D, p: V3, r: number, h: number, mat: THREE.Material) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 28), mat); o.position.set(...p); o.castShadow = true; o.receiveShadow = true; q.add(o); return o; };
      const sphere = (q: THREE.Object3D, p: V3, r: number, mat: THREE.Material) => { const o = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 20), mat); o.castShadow = true; q.add(o); return o; };
      const label = (text: string, w = 700, h = 150, size = 30, color = '#55e8a2') => {
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        const x = c.getContext('2d'); if (!x) throw new Error('Canvas text unavailable');
        x.fillStyle = 'rgba(3,14,19,.96)'; x.fillRect(5, 5, w - 10, h - 10);
        x.strokeStyle = color; x.lineWidth = 3; x.strokeRect(5, 5, w - 10, h - 10);
        x.fillStyle = color; x.font = `700 ${size}px Arial`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, w / 2, h / 2);
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthTest: false }));
        s.scale.set(w / 125, h / 125, 1); return s;
      };
      const panel = (q: THREE.Object3D, p: V3, title: string, rows: string[]) => {
        const frame = box(q, p, [4.8, 3.1, 0.18], dark);
        frame.position.z += 0.03;
        const titleSprite = label(title, 760, 130, 28, '#57e6ff'); titleSprite.position.set(p[0], p[1] + 1.02, p[2] - 0.12); titleSprite.scale.set(2.9, 0.5, 1); q.add(titleSprite);
        rows.forEach((row, i) => { const s = label(row, 620, 100, 22, i === rows.length - 1 ? '#55e8a2' : '#d9f7ff'); s.position.set(p[0], p[1] + 0.42 - i * 0.48, p[2] - 0.13); s.scale.set(2.35, 0.38, 1); q.add(s); });
      };

      // Hospital exterior: glass facade, entrance canopy and architectural depth.
      box(g.hospital, [0, -0.4, 0], [46, 0.6, 34], floor);
      box(g.hospital, [0, 5.2, -10], [30, 10.4, 7], wall);
      box(g.hospital, [-12, 3.2, -6], [4, 6.4, 11], blue);
      box(g.hospital, [12, 3.2, -6], [4, 6.4, 11], blue);
      for (let x = -9; x <= 9; x += 3) for (let y = 2; y <= 8; y += 2) box(g.hospital, [x, y, -6.45], [1.9, 1.25, 0.08], glass);
      box(g.hospital, [0, 2.7, -6.1], [7.2, 5.7, 0.4], dark);
      box(g.hospital, [0, 9.9, -6.5], [12, 0.14, 0.16], cyan);
      box(g.hospital, [0, 1.2, -2.8], [12, 0.18, 5.5], steel);

      // Patient: complete human silhouette with face, hair, hands, legs and shoes.
      const patientBody = new THREE.Group(); g.patient.add(patientBody);
      const head = sphere(patientBody, [0, 3.02, 0], 0.36, skin);
      sphere(patientBody, [0, 3.27, -0.02], 0.31, dark); // hair
      sphere(patientBody, [-0.12, 3.04, -0.33], 0.035, dark); sphere(patientBody, [0.12, 3.04, -0.33], 0.035, dark);
      cyl(patientBody, [0, 2.62, 0], 0.12, 0.22, skin);
      box(patientBody, [0, 1.92, 0], [0.78, 1.25, 0.46], shirt);
      const armL = new THREE.Group(); armL.position.set(-0.48, 2.42, 0); patientBody.add(armL); box(armL, [0, -0.45, 0], [0.19, 0.9, 0.2], skin); sphere(armL, [0, -0.93, 0], 0.12, skin);
      const armR = new THREE.Group(); armR.position.set(0.48, 2.42, 0); patientBody.add(armR); box(armR, [0, -0.45, 0], [0.19, 0.9, 0.2], skin); sphere(armR, [0, -0.93, 0], 0.12, skin);
      const legL = new THREE.Group(); legL.position.set(-0.22, 1.32, 0); patientBody.add(legL); box(legL, [0, -0.58, 0], [0.27, 1.1, 0.3], pants); box(legL, [0, -1.12, -0.08], [0.34, 0.2, 0.62], shoe);
      const legR = new THREE.Group(); legR.position.set(0.22, 1.32, 0); patientBody.add(legR); box(legR, [0, -0.58, 0], [0.27, 1.1, 0.3], pants); box(legR, [0, -1.12, -0.08], [0.34, 0.2, 0.62], shoe);
      g.patient.scale.setScalar(0.82);

      // Entry with genuine sliding doors and interior vestibule.
      box(g.entry, [-3.15, 3.2, -0.5], [2.3, 6.4, 1.7], dark); box(g.entry, [3.15, 3.2, -0.5], [2.3, 6.4, 1.7], dark);
      box(g.entry, [0, 5.9, -0.5], [6.5, 0.25, 1.7], dark);
      const doorL = box(g.entry, [-1.15, 2.75, 0.36], [2.1, 5.0, 0.12], glass);
      const doorR = box(g.entry, [1.15, 2.75, 0.36], [2.1, 5.0, 0.12], glass);
      box(g.entry, [0, 5.35, 0.4], [6.4, 0.12, 0.14], cyan);
      box(g.entry, [0, 0.05, 0.4], [6.4, 0.12, 2.4], steel);
      const entrySign = label('SMART HOSPITAL  •  MAIN ENTRANCE', 900, 140, 27, '#57e6ff'); entrySign.position.set(0, 6.5, 0.2); entrySign.scale.set(3.5, 0.55, 1); g.entry.add(entrySign);

      // Registration kiosk with visible process states.
      box(g.checkin, [0, 1.55, 0], [2.7, 3.25, 0.82], dark); box(g.checkin, [0, 2.4, -0.47], [2.0, 1.25, 0.08], screen);
      const regStates = [label('PATIENT REGISTRATION', 760, 140, 26, '#55e8a2'), label('SCANNING...', 760, 140, 28, '#57e6ff'), label('IDENTITY VERIFIED  ✓', 760, 140, 27, '#55e8a2'), label('CHECK-IN COMPLETE  ✓', 820, 140, 27, '#55e8a2')];
      regStates.forEach((s) => { s.position.set(0, 2.4, -0.54); s.scale.set(3, 0.55, 1); g.checkin.add(s); });
      box(g.checkin, [0, 1.48, -0.48], [1.25, 0.13, 0.05], green); box(g.checkin, [0, 0.5, -0.36], [0.78, 0.14, 0.52], steel);
      const scanRing = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.045, 10, 40), cyan); scanRing.position.set(0, 1.08, -0.52); g.checkin.add(scanRing);

      // Corridor: architectural walls, ceiling strips and guiding lights.
      box(g.corridor, [0, -0.05, -8], [11.5, 0.18, 30], floor);
      box(g.corridor, [-5.5, 2.8, -8], [0.35, 5.8, 30], wall); box(g.corridor, [5.5, 2.8, -8], [0.35, 5.8, 30], wall);
      for (let z = 5; z > -23; z -= 2.8) box(g.corridor, [0, 0.06, z], [0.11, 0.05, 1.45], cyan);
      for (let z = 4; z > -23; z -= 5) { box(g.corridor, [-3.8, 5.65, z], [2.2, 0.08, 0.12], cyan); box(g.corridor, [3.8, 5.65, z], [2.2, 0.08, 0.12], cyan); }
      const corridorSign = label('EXAMINATION →', 520, 130, 28, '#55e8a2'); corridorSign.position.set(0, 3.9, -14); corridorSign.scale.set(2.2, 0.52, 1); g.corridor.add(corridorSign);

      // Examination room: recognizable medical bed, pillow, rails, overhead lamp and monitor.
      box(g.exam, [0, 0.72, 0], [6.6, 0.25, 2.45], steel); box(g.exam, [0, 0.91, -0.15], [5.9, 0.27, 2.05], white); box(g.exam, [0, 1.15, -0.96], [5.4, 0.5, 0.2], wall);
      box(g.exam, [-2.8, 1.55, 0], [0.12, 1.05, 2.1], steel); box(g.exam, [2.8, 1.55, 0], [0.12, 1.05, 2.1], steel);
      const lamp = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.11, 14, 56), cyan); lamp.position.set(0, 4.25, 0); lamp.rotation.x = Math.PI / 2; g.exam.add(lamp); cyl(g.exam, [0, 3.35, 0], 0.08, 1.8, steel);
      // Patient monitor tower.
      box(g.exam, [-3.25, 2.15, -0.15], [0.5, 3.3, 0.65], dark); box(g.exam, [-3.25, 3.2, -0.52], [2.1, 1.55, 0.08], screen); box(g.exam, [-3.25, 1.1, -0.45], [1.5, 0.12, 0.05], green);
      const examTitle = label('PATIENT MONITOR', 600, 120, 25, '#57e6ff'); examTitle.position.set(-3.25, 3.8, -0.57); examTitle.scale.set(2.2, 0.45, 1); g.exam.add(examTitle);
      // ECG electrodes and SpO2 probe.
      [ -0.7, -0.2, 0.3, 0.8 ].forEach((x, i) => { const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.035, 18), i % 2 ? green : red); pad.rotation.x = Math.PI / 2; pad.position.set(x, 1.68, -0.25); g.exam.add(pad); const lead = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.15, 8), cyan); lead.position.set(x * 0.7, 1.42, 0.02); lead.rotation.z = (i - 1.5) * 0.12; g.exam.add(lead); });
      const finger = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.12), red); finger.position.set(0.57, 1.52, -0.22); g.exam.add(finger);
      const sensorLabel = label('ECG  •  SpO₂  •  TEMP', 700, 130, 26, '#55e8a2'); sensorLabel.position.set(0, 0.38, -1.35); sensorLabel.scale.set(2.7, 0.5, 1); g.exam.add(sensorLabel);

      // Live biosignal monitor: three actual animated line geometries.
      box(g.signals, [3.55, 3.15, -2.15], [5.3, 4.0, 0.3], dark); box(g.signals, [3.55, 3.15, -2.33], [4.85, 3.55, 0.06], screen);
      const makeTrace = (color: number, yOffset: number) => { const pts: THREE.Vector3[] = []; for (let i = 0; i < 220; i++) pts.push(new THREE.Vector3(-2.15 + i * 0.019, yOffset, 0)); const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color })); line.position.set(3.55, 3.35, -2.39); g.signals.add(line); return { line, pts }; };
      const ecg = makeTrace(0x54e89b, 0.75); const spo = makeTrace(0x53dfff, -0.05); const temp = makeTrace(0xf1c85c, -0.78);
      const sigTitle = label('LIVE PATIENT VITALS', 760, 130, 28, '#57e6ff'); sigTitle.position.set(3.55, 4.62, -2.45); sigTitle.scale.set(2.9, 0.5, 1); g.signals.add(sigTitle);
      const vital = label('HR 72 BPM   •   SpO₂ 98%   •   TEMP 36.7°C', 1000, 130, 23, '#dffaff'); vital.position.set(3.55, 1.78, -2.45); vital.scale.set(3.8, 0.5, 1); g.signals.add(vital);

      // AI analysis: bright clinical dashboard, never a blank black panel.
      panel(g.analysis, [0, 3.05, -3.9], 'AI CLINICAL ANALYSIS', ['ECG             ✓ NORMAL', 'OXYGENATION     ✓ NORMAL', 'TEMPERATURE     ✓ NORMAL', 'PATIENT STATUS  STABLE', 'ANALYSIS COMPLETE  ✓']);
      const aiRing = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.62, 48), green); aiRing.position.set(-2.45, 3.05, -4.02); g.analysis.add(aiRing);
      const aiGraphPts: THREE.Vector3[] = []; for (let i = 0; i < 120; i++) aiGraphPts.push(new THREE.Vector3(-2.1 + i * 0.035, 0.35 + Math.sin(i * 0.28) * 0.08, 0));
      const aiGraph = new THREE.Line(new THREE.BufferGeometry().setFromPoints(aiGraphPts), new THREE.LineBasicMaterial({ color: 0x53dfff })); aiGraph.position.set(0, 1.12, -4.04); g.analysis.add(aiGraph);
      const analysisStatus = label('CONFIDENCE  98.4%    •    NO CRITICAL ANOMALY', 980, 130, 24, '#55e8a2'); analysisStatus.position.set(0, 0.58, -4.05); analysisStatus.scale.set(3.7, 0.5, 1); g.analysis.add(analysisStatus);

      // Medical robotic arm: base, joints, articulated links and end effector clearly over the patient.
      const robotBase = new THREE.Group(); robotBase.position.set(2.9, 0.9, 0.65); g.robot.add(robotBase); cyl(robotBase, [0, 0, 0], 0.7, 0.55, dark); cyl(robotBase, [0, 0.42, 0], 0.42, 0.35, steel);
      const rShoulder = new THREE.Group(); rShoulder.position.set(0, 0.58, 0); robotBase.add(rShoulder); sphere(rShoulder, [0, 0, 0], 0.34, steel); box(rShoulder, [0, 0.62, 0], [0.42, 1.25, 0.42], blue);
      const rElbow = new THREE.Group(); rElbow.position.set(0, 1.25, 0); rShoulder.add(rElbow); sphere(rElbow, [0, 0, 0], 0.3, steel); box(rElbow, [0, 0.68, 0], [0.34, 1.35, 0.34], steel);
      const rWrist = new THREE.Group(); rWrist.position.set(0, 1.36, 0); rElbow.add(rWrist); sphere(rWrist, [0, 0, 0], 0.23, cyan); box(rWrist, [0, 0.42, 0], [0.25, 0.75, 0.25], steel);
      const gripper = new THREE.Group(); gripper.position.set(0, 0.78, 0); rWrist.add(gripper); box(gripper, [0, 0, 0], [0.28, 0.18, 0.28], dark); box(gripper, [-0.16, -0.22, 0], [0.07, 0.5, 0.07], steel); box(gripper, [0.16, -0.22, 0], [0.07, 0.5, 0.07], steel);
      const robotStatus = label('ROBOTIC ASSIST  •  ACTIVE', 760, 140, 27, '#57e6ff'); robotStatus.position.set(2.0, 4.55, -0.25); robotStatus.scale.set(2.9, 0.54, 1); g.robot.add(robotStatus);
      const target = new THREE.Mesh(new THREE.RingGeometry(0.34, 0.42, 32), red); target.position.set(0.5, 1.38, -0.35); target.rotation.x = Math.PI / 2; g.robot.add(target);

      const careText = label('✓  CARE COMPLETE', 650, 140, 32, '#55e8a2'); careText.position.set(0, 4.0, 0); careText.scale.set(2.8, 0.62, 1); g.care.add(careText);
      const resultText = label('PATIENT STABLE  •  GOOD NEWS', 850, 140, 27, '#57e6ff'); resultText.position.set(0, 3.35, 0); resultText.scale.set(3.2, 0.54, 1); g.care.add(resultText);
      const successLight = new THREE.PointLight(0x55e8a2, 12, 17); successLight.position.set(0, 3, 1); g.care.add(successLight);

      const clock = new THREE.Clock();
      const ca = new THREE.Vector3(), cb = new THREE.Vector3(), la = new THREE.Vector3(), lb = new THREE.Vector3(), look = new THREE.Vector3();
      const move = (p: number, from: V3, to: V3, lf: V3, lt: V3) => { camera.position.lerpVectors(ca.set(...from), cb.set(...to), p); look.lerpVectors(la.set(...lf), lb.set(...lt), p); camera.lookAt(look); };
      const show = (visible: string[]) => names.forEach((n) => { g[n].visible = visible.includes(n); });

      const animate = () => {
        if (dead) return;
        const dt = Math.min(clock.getDelta(), 0.05);
        if (!paused.current) timeline.current = (timeline.current + dt * 1000) % totalDuration;
        let t = timeline.current; let idx = 0;
        while (idx < scenes.length - 1 && t >= scenes[idx].duration) { t -= scenes[idx].duration; idx++; }
        const p = ease(clamp(t / scenes[idx].duration, 0, 1));
        setSceneIndex((v) => v === idx ? v : idx);

        show(idx === 0 ? ['hospital', 'patient'] : idx === 1 ? ['entry', 'patient'] : idx === 2 ? ['checkin', 'patient'] : idx === 3 ? ['corridor', 'patient'] : idx <= 5 ? ['exam', 'patient', 'signals'] : idx === 6 ? ['analysis', 'exam', 'patient'] : idx === 7 ? ['exam', 'patient', 'robot'] : idx === 8 ? ['care', 'patient'] : ['hospital', 'patient']);

        // Walking cycle: legs and arms alternate, making feet visibly contact the floor.
        const walk = Math.sin(clock.elapsedTime * 7) * 0.42;
        legL.rotation.x = idx < 4 ? walk : 0; legR.rotation.x = idx < 4 ? -walk : 0;
        armL.rotation.x = idx < 4 ? -walk * 0.7 : 0; armR.rotation.x = idx < 4 ? walk * 0.7 : 0;
        g.patient.position.set(idx === 0 ? -6 + p * 6 : idx === 1 ? -2.8 + p * 2.8 : idx === 2 ? -1.5 + p * 1.5 : idx === 3 ? 0 : 0, idx >= 4 && idx !== 8 ? 1.22 : idx === 8 ? Math.abs(Math.sin(p * Math.PI * 3)) * 0.85 : 0, idx === 0 ? 4 - p * 4 : idx === 1 ? 2.5 : idx === 2 ? 1.4 : idx === 3 ? 3 - p * 11 : 0);
        g.patient.rotation.set(0, 0, idx >= 4 && idx !== 8 ? Math.PI / 2 : 0);
        if (idx === 8) { g.patient.rotation.set(0, Math.sin(p * Math.PI * 3) * 0.18, 0); patientBody.rotation.z = Math.sin(p * Math.PI * 2) * 0.08; } else patientBody.rotation.z = 0;

        const doorOpen = idx === 1 ? p : 0;
        doorL.position.x = -1.15 - doorOpen * 1.85; doorR.position.x = 1.15 + doorOpen * 1.85;
        regStates.forEach((s, i) => { s.visible = idx === 2 && (i === (p < 0.25 ? 0 : p < 0.55 ? 1 : p < 0.78 ? 2 : 3)); });
        scanRing.rotation.z = clock.elapsedTime * 2.5; scanRing.scale.setScalar(1 + Math.sin(clock.elapsedTime * 5) * 0.12);
        lamp.rotation.z = clock.elapsedTime * 0.2;

        const signalTime = clock.elapsedTime * 7;
        const updateTrace = (obj: { line: THREE.Line; pts: THREE.Vector3[] }, kind: number) => { obj.pts.forEach((pt, i) => { const x = i / obj.pts.length; const wave = kind === 0 ? (Math.sin((i + signalTime * 20) * 0.28) * 0.055 + (i % 48 === 24 ? 0.46 : i % 48 === 25 ? -0.28 : i % 48 === 26 ? 0.2 : 0)) : kind === 1 ? Math.sin((i + signalTime * 14) * 0.19) * 0.08 : Math.sin((i + signalTime * 8) * 0.08) * 0.055; pt.y = kind === 0 ? 0.75 + wave : kind === 1 ? -0.05 + wave : -0.78 + wave; pt.x = -2.15 + x * 4.18; }); obj.line.geometry.setFromPoints(obj.pts); };
        updateTrace(ecg, 0); updateTrace(spo, 1); updateTrace(temp, 2);
        aiRing.rotation.z = clock.elapsedTime * 0.8; aiRing.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3) * 0.08);

        if (idx === 7) {
          g.robot.position.set(0.8, 0, -0.1);
          rShoulder.rotation.z = -0.72 + Math.sin(clock.elapsedTime * 1.1) * 0.05;
          rElbow.rotation.z = 0.95 + Math.sin(clock.elapsedTime * 1.35) * 0.06;
          rWrist.rotation.z = -0.5 + Math.sin(clock.elapsedTime * 1.7) * 0.08;
          gripper.rotation.z = 0.1 * Math.sin(clock.elapsedTime * 2);
          target.scale.setScalar(1 + Math.sin(clock.elapsedTime * 5) * 0.15);
        } else { g.robot.position.set(2.8, 0, -1); rShoulder.rotation.z = 0; rElbow.rotation.z = 0; rWrist.rotation.z = 0; }

        if (idx === 0) move(p, [17, 10, 25], [9, 7, 15], [0, 2.7, -5], [0, 2.6, -4]);
        else if (idx === 1) move(p, [8, 4.8, 13], [5.2, 3.7, 8], [0, 2.4, 0], [0, 2.4, 0]);
        else if (idx === 2) move(p, [6.5, 4.2, 8], [5.0, 3.3, 5.2], [0, 1.7, 0], [0, 1.8, 0]);
        else if (idx === 3) move(p, [7, 4, 7], [0, 3.1, 9], [0, 1.5, -5], [0, 1.7, -5]);
        else if (idx === 4) move(p, [8, 5.2, 7], [5.8, 4.0, 5.2], [0, 1.2, 0], [0, 1.35, 0]);
        else if (idx === 5) move(p, [7.5, 4.2, 6.5], [5.0, 3.2, 4.5], [1.0, 2.0, -1], [3.55, 3.15, -2.15]);
        else if (idx === 6) move(p, [7, 4.6, 6], [5.0, 3.5, 4.8], [0, 2.8, -2], [0, 3.0, -3.9]);
        else if (idx === 7) move(p, [8.5, 5.2, 7.5], [6.5, 4.5, 5.8], [0.4, 1.7, 0], [0.7, 1.9, 0]);
        else if (idx === 8) move(p, [6, 4.5, 7], [4, 3.6, 5], [0, 1.7, 0], [0, 1.9, 0]);
        else move(p, [12, 8, 15], [17, 10, 21], [0, 3, -4], [0, 3, -4]);

        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };

      const resize = () => { const w = Math.max(1, mount.clientWidth); const h = Math.max(1, mount.clientHeight); camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false); };
      window.addEventListener('resize', resize); resize(); animate();
      const cleanup = () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); renderer.dispose(); scene.traverse((o) => { const m = o as THREE.Mesh; if (m.geometry) m.geometry.dispose(); if (Array.isArray(m.material)) m.material.forEach((x) => x.dispose()); else if (m.material) m.material.dispose(); }); if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement); };
      return () => { dead = true; cleanup(); };
    } catch (e) { console.error('Biomedical City 3D initialization failed:', e); if (!dead) setError(true); return () => { dead = true; cancelAnimationFrame(raf); }; }
  }, []);

  const jump = (i: number) => { timeline.current = scenes.slice(0, i).reduce((a, s) => a + s.duration, 0); setSceneIndex(i); };
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
      <p className="city-description">Patient → registration → examination → biosignals → AI analysis → robotics → care.</p>
      <div className="city-progress">{scenes.map((s, i) => <button key={s.title} className={i === sceneIndex ? 'active' : ''} onClick={() => jump(i)} aria-label={s.title} />)}</div>
      <button className="city-play" onClick={toggle}>{isPaused ? 'PLAY JOURNEY' : 'PAUSE JOURNEY'}</button>
    </div>
    {sceneIndex === 9 && <div className="city-signature"><span>ENGINEERING TECHNOLOGY</span><strong>FOR BETTER HEALTHCARE</strong></div>}
    <div className="city-label">REALISTIC FUTURE CARE • 2035</div>
  </section>;
};

export default BiomedicalCity;
