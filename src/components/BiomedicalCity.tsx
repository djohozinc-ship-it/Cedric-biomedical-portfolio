import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './BiomedicalCity.scss';

type Scene = { title: string; subtitle: string; duration: number };
type V3 = [number, number, number];

const scenes: Scene[] = [
  { title: 'ARRIVAL', subtitle: 'The patient approaches the smart hospital.', duration: 4200 },
  { title: 'ENTRY', subtitle: 'The automatic doors open and the patient enters.', duration: 3800 },
  { title: 'CHECK-IN', subtitle: 'The patient is registered at the biometric station.', duration: 5000 },
  { title: 'EXAMINATION', subtitle: 'The patient lies on the examination bed.', duration: 5200 },
  { title: 'BIOSIGNALS', subtitle: 'Vital signs are monitored live.', duration: 5200 },
  { title: 'AI ANALYSIS', subtitle: 'Clinical data is analysed in real time.', duration: 5200 },
  { title: 'ROBOTIC ASSIST', subtitle: 'A medical robot assists the examination.', duration: 5200 },
  { title: 'RESULT', subtitle: 'The results are reassuring.', duration: 3000 },
  { title: 'JOY', subtitle: 'The patient gets up and celebrates.', duration: 4500 },
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
      scene.background = new THREE.Color(0x071116);
      scene.fog = new THREE.Fog(0x071116, 34, 110);
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 160);
      const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mount.innerHTML = '';
      mount.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xf5fbff, 0x1a2529, 2.7));
      const key = new THREE.DirectionalLight(0xffffff, 3.2);
      key.position.set(12, 18, 14);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      scene.add(key);
      const cyanLight = new THREE.PointLight(0x39dfff, 16, 50);
      cyanLight.position.set(-8, 7, 10);
      scene.add(cyanLight);
      const greenLight = new THREE.PointLight(0x42e59a, 9, 30);
      greenLight.position.set(8, 5, -5);
      scene.add(greenLight);

      const groups: Record<string, THREE.Group> = {};
      ['hospital', 'entry', 'reception', 'exam', 'patient', 'monitor', 'analysis', 'robot', 'result'].forEach((name) => {
        groups[name] = new THREE.Group();
        scene.add(groups[name]);
      });

      const material = (color: number, roughness = 0.5, metalness = 0.15, emissive = 0, intensity = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive, emissiveIntensity: intensity });
      const floor = material(0x465257, 0.88, 0.04);
      const wall = material(0xd9dedc, 0.84, 0.02);
      const dark = material(0x101b20, 0.3, 0.8);
      const steel = material(0xb9c5c7, 0.2, 0.9);
      const blue = material(0x2b6278, 0.38, 0.4);
      const white = material(0xf3f5f0, 0.88, 0.03);
      const cyan = material(0x40ddff, 0.22, 0.18, 0x17b9df, 2.8);
      const green = material(0x45e49a, 0.3, 0.18, 0x149e5d, 2.2);
      const red = material(0xe45b63, 0.34, 0.2, 0x8d1821, 1.5);
      const skin = material(0xc88d73, 0.72, 0.02);
      const shirt = material(0x3974a7, 0.58, 0.08);
      const pants = material(0x263238, 0.72, 0.14);
      const shoe = material(0x10171a, 0.28, 0.78);
      const glass = new THREE.MeshPhysicalMaterial({ color: 0x9ed9e4, transparent: true, opacity: 0.28, roughness: 0.06, metalness: 0.1 });

      const box = (parent: THREE.Object3D, p: V3, s: V3, m: THREE.Material) => {
        const o = new THREE.Mesh(new THREE.BoxGeometry(...s), m);
        o.position.set(...p); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o;
      };
      const cyl = (parent: THREE.Object3D, p: V3, r: number, h: number, m: THREE.Material) => {
        const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 24), m);
        o.position.set(...p); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o;
      };
      const sphere = (parent: THREE.Object3D, p: V3, r: number, m: THREE.Material) => {
        const o = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 18), m);
        o.castShadow = true; o.receiveShadow = true; o.position.set(...p); parent.add(o); return o;
      };
      const makeScreen = (w: number, h: number) => {
        const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
        const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w / 220, h / 220), new THREE.MeshBasicMaterial({ map: texture, transparent: false }));
        return { canvas, texture, mesh };
      };
      const write = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, color: string, align: CanvasTextAlign = 'left') => {
        ctx.fillStyle = color; ctx.font = `700 ${size}px Arial`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y);
      };
      const clearScreen = (screen: { canvas: HTMLCanvasElement; texture: THREE.CanvasTexture }, title: string) => {
        const ctx = screen.canvas.getContext('2d'); if (!ctx) return;
        ctx.fillStyle = '#06151c'; ctx.fillRect(0, 0, screen.canvas.width, screen.canvas.height);
        ctx.strokeStyle = '#1f5260'; ctx.lineWidth = 8; ctx.strokeRect(8, 8, screen.canvas.width - 16, screen.canvas.height - 16);
        write(ctx, title, 45, 48, 28, '#59e6ff'); screen.texture.needsUpdate = true;
      };

      // Exterior and entrance.
      box(groups.hospital, [0, -0.35, 0], [48, 0.55, 36], floor);
      box(groups.hospital, [0, 5.1, -10], [31, 10.2, 7], wall);
      box(groups.hospital, [-12, 3.1, -6], [4, 6.2, 11], blue);
      box(groups.hospital, [12, 3.1, -6], [4, 6.2, 11], blue);
      for (let x = -9; x <= 9; x += 3) for (let y = 2; y <= 8; y += 2) box(groups.hospital, [x, y, -6.45], [1.9, 1.25, 0.08], glass);
      box(groups.hospital, [0, 2.7, -6.05], [7.4, 5.7, 0.4], dark);
      box(groups.hospital, [0, 9.9, -6.5], [12, 0.16, 0.16], cyan);
      box(groups.hospital, [-3.5, 0.9, -2.8], [5.5, 0.2, 5], steel);
      box(groups.hospital, [3.5, 0.9, -2.8], [5.5, 0.2, 5], steel);

      box(groups.entry, [-3.4, 3.1, -0.4], [2.5, 6.2, 1.7], dark);
      box(groups.entry, [3.4, 3.1, -0.4], [2.5, 6.2, 1.7], dark);
      box(groups.entry, [0, 5.95, -0.4], [7.3, 0.3, 1.7], dark);
      const doorL = box(groups.entry, [-1.35, 2.65, 0.3], [2.35, 5.15, 0.1], glass);
      const doorR = box(groups.entry, [1.35, 2.65, 0.3], [2.35, 5.15, 0.1], glass);
      box(groups.entry, [0, 5.4, 0.35], [6.8, 0.12, 0.14], cyan);

      // Realistic check-in kiosk: screen, camera and biometric pad.
      box(groups.reception, [0, 1.4, -0.2], [3.0, 2.8, 1.15], dark);
      box(groups.reception, [0, 0.25, -0.2], [1.45, 0.35, 0.8], steel);
      const kioskScreen = makeScreen(900, 600);
      kioskScreen.mesh.position.set(0, 2.55, -0.8); kioskScreen.mesh.scale.set(0.88, 0.88, 0.88); groups.reception.add(kioskScreen.mesh);
      cyl(groups.reception, [0, 3.7, -0.25], 0.38, 0.18, steel);
      const scanRing = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.045, 12, 40), cyan);
      scanRing.rotation.x = Math.PI / 2; scanRing.position.set(0, 3.7, -0.48); groups.reception.add(scanRing);
      const scanPad = box(groups.reception, [0, 0.55, -0.85], [0.9, 0.08, 0.6], cyan);
      clearScreen(kioskScreen, 'PATIENT REGISTRATION');

      // Patient rig. The pelvis is the root, so lying -> sitting -> standing stays spatially coherent.
      const patient = groups.patient;
      const body = new THREE.Group(); patient.add(body);
      const torso = new THREE.Group(); body.add(torso); torso.position.y = 1.65;
      box(torso, [0, 0, 0], [0.9, 1.5, 0.52], shirt);
      cyl(torso, [0, 0.82, 0], 0.13, 0.25, skin);
      const head = new THREE.Group(); head.position.set(0, 1.55, 0); torso.add(head);
      sphere(head, [0, 0, 0], 0.39, skin); sphere(head, [0, 0.2, -0.02], 0.33, dark);
      sphere(head, [-0.13, -0.02, -0.35], 0.035, dark); sphere(head, [0.13, -0.02, -0.35], 0.035, dark);
      const armL = new THREE.Group(); armL.position.set(-0.55, 0.45, 0); torso.add(armL); box(armL, [0, -0.43, 0], [0.2, 0.88, 0.2], skin); sphere(armL, [0, -0.9, 0], 0.12, skin);
      const armR = new THREE.Group(); armR.position.set(0.55, 0.45, 0); torso.add(armR); box(armR, [0, -0.43, 0], [0.2, 0.88, 0.2], skin); sphere(armR, [0, -0.9, 0], 0.12, skin);
      const legL = new THREE.Group(); legL.position.set(-0.25, 0.75, 0); body.add(legL); box(legL, [0, -0.55, 0], [0.3, 1.1, 0.32], pants); box(legL, [0, -1.1, -0.1], [0.38, 0.22, 0.65], shoe);
      const legR = new THREE.Group(); legR.position.set(0.25, 0.75, 0); body.add(legR); box(legR, [0, -0.55, 0], [0.3, 1.1, 0.32], pants); box(legR, [0, -1.1, -0.1], [0.38, 0.22, 0.65], shoe);
      patient.scale.setScalar(0.88);

      // Examination room and bed.
      box(groups.exam, [0, 0.15, -1], [12, 0.3, 9], floor);
      box(groups.exam, [0, 4, -5.2], [12, 8, 0.25], wall);
      box(groups.exam, [-5.7, 3.5, -1], [0.3, 7, 8], wall);
      box(groups.exam, [5.7, 3.5, -1], [0.3, 7, 8], wall);
      box(groups.exam, [0, 0.82, -0.7], [7.2, 0.35, 2.8], steel);
      box(groups.exam, [0, 1.02, -0.7], [6.6, 0.28, 2.45], white);
      box(groups.exam, [0, 1.28, -1.55], [5.8, 0.42, 0.28], wall);
      box(groups.exam, [-3.1, 1.5, -0.7], [0.12, 1.2, 2.4], steel);
      box(groups.exam, [3.1, 1.5, -0.7], [0.12, 1.2, 2.4], steel);
      const lamp = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.1, 14, 48), cyan); lamp.position.set(0, 4.6, -0.7); lamp.rotation.x = Math.PI / 2; groups.exam.add(lamp);

      // Patient monitor with animated traces drawn directly into a canvas.
      box(groups.monitor, [3.8, 2.7, -1.9], [3.0, 4.6, 0.45], dark);
      const vitalScreen = makeScreen(1100, 850); vitalScreen.mesh.position.set(3.8, 2.85, -2.15); vitalScreen.mesh.scale.set(0.95, 0.95, 0.95); groups.monitor.add(vitalScreen.mesh);
      cyl(groups.monitor, [3.8, 0.25, -1.9], 0.65, 0.18, dark);
      clearScreen(vitalScreen, 'PATIENT VITALS');

      // Sensors and clean visible cables on the patient's chest/hand.
      const sensorGroup = new THREE.Group(); sensorGroup.position.set(0, 2.25, -0.34); groups.exam.add(sensorGroup);
      [-0.55, -0.18, 0.18, 0.55].forEach((x, i) => { const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.04, 18), i % 2 ? green : red); pad.rotation.x = Math.PI / 2; pad.position.set(x, 0, 0); sensorGroup.add(pad); });
      const fingerProbe = box(sensorGroup, [0.72, -0.02, -0.04], [0.2, 0.18, 0.14], red);
      const tempProbe = box(sensorGroup, [-0.78, -0.02, -0.02], [0.16, 0.12, 0.16], cyan);
      const cableMat = new THREE.LineBasicMaterial({ color: 0x43dfff });
      const cablePoints = [[-0.55, 0, 0], [-1.3, -0.45, 0.05], [-2.0, -0.7, 0.1], [-2.7, -0.3, 0.15]] as V3[];
      const cable = new THREE.Line(new THREE.BufferGeometry().setFromPoints(cablePoints.map((p) => new THREE.Vector3(...p))), cableMat); sensorGroup.add(cable);
      fingerProbe.visible = true; tempProbe.visible = true;

      // AI analysis panel.
      box(groups.analysis, [0, 3.0, -4.0], [10.5, 6.3, 0.35], dark);
      const aiScreen = makeScreen(1400, 850); aiScreen.mesh.position.set(0, 3.0, -4.22); aiScreen.mesh.scale.set(0.96, 0.96, 0.96); groups.analysis.add(aiScreen.mesh);
      clearScreen(aiScreen, 'AI CLINICAL ANALYSIS');

      // Robot placed beside the bed, with a clearly articulated tool reaching the patient.
      const robotRoot = new THREE.Group(); robotRoot.position.set(3.0, 0.95, 0.2); groups.robot.add(robotRoot);
      cyl(robotRoot, [0, 0, 0], 0.9, 0.55, dark); cyl(robotRoot, [0, 0.42, 0], 0.52, 0.32, steel);
      const shoulder = new THREE.Group(); shoulder.position.set(0, 0.62, 0); robotRoot.add(shoulder); sphere(shoulder, [0, 0, 0], 0.38, steel); box(shoulder, [0, 0.65, 0], [0.48, 1.35, 0.48], blue);
      const elbow = new THREE.Group(); elbow.position.set(0, 1.3, 0); shoulder.add(elbow); sphere(elbow, [0, 0, 0], 0.34, steel); box(elbow, [0, 0.72, 0], [0.4, 1.45, 0.4], steel);
      const wrist = new THREE.Group(); wrist.position.set(0, 1.45, 0); elbow.add(wrist); sphere(wrist, [0, 0, 0], 0.27, cyan); box(wrist, [0, 0.44, 0], [0.3, 0.82, 0.3], steel);
      const tool = new THREE.Group(); tool.position.set(0, 0.88, 0); wrist.add(tool); box(tool, [0, 0, 0], [0.34, 0.2, 0.34], dark); cyl(tool, [0, -0.3, 0], 0.065, 0.56, steel); cyl(tool, [0, -0.64, 0], 0.095, 0.15, red);
      const workLight = new THREE.PointLight(0x55e8ff, 14, 8); workLight.position.set(0, -0.5, 0.45); tool.add(workLight);
      const target = new THREE.Mesh(new THREE.RingGeometry(0.35, 0.44, 32), red); target.rotation.x = Math.PI / 2; target.position.set(0, 1.5, -0.55); groups.robot.add(target);

      // Result scene is a clean hospital bay.
      box(groups.result, [0, 0.15, 0], [14, 0.3, 9], floor);
      box(groups.result, [0, 4, -5], [14, 8, 0.25], wall);
      box(groups.result, [0, 0.82, -0.5], [7.2, 0.35, 2.8], steel);
      box(groups.result, [0, 1.02, -0.5], [6.6, 0.28, 2.45], white);
      box(groups.result, [0, 1.28, -1.35], [5.8, 0.42, 0.28], wall);
      const resultLight = new THREE.PointLight(0x45e49a, 12, 18); resultLight.position.set(0, 3.5, 1); groups.result.add(resultLight);

      const clock = new THREE.Clock();
      const camPos = new THREE.Vector3();
      const camLook = new THREE.Vector3();
      const fromPos = new THREE.Vector3();
      const toPos = new THREE.Vector3();
      const fromLook = new THREE.Vector3();
      const toLook = new THREE.Vector3();
      const moveCamera = (p: number, fp: V3, tp: V3, fl: V3, tl: V3) => {
        camPos.lerpVectors(fromPos.set(...fp), toPos.set(...tp), p);
        camLook.lerpVectors(fromLook.set(...fl), toLook.set(...tl), p);
        camera.position.copy(camPos); camera.lookAt(camLook);
      };
      const show = (visible: string[]) => Object.keys(groups).forEach((name) => { groups[name].visible = visible.includes(name); });

      const drawVitals = (time: number) => {
        const ctx = vitalScreen.canvas.getContext('2d'); if (!ctx) return;
        ctx.fillStyle = '#06151c'; ctx.fillRect(0, 0, 1100, 850);
        write(ctx, 'PATIENT VITALS', 45, 48, 30, '#59e6ff');
        write(ctx, 'HR 72 BPM', 45, 110, 34, '#55e8a2'); write(ctx, 'SpO₂ 98 %', 45, 160, 32, '#59e6ff'); write(ctx, 'TEMP 36.7 °C', 45, 210, 30, '#f1cf68');
        ctx.strokeStyle = '#1e4852'; ctx.lineWidth = 3; ctx.strokeRect(40, 255, 1020, 500);
        const rows = [360, 500, 640]; const colors = ['#55e8a2', '#59e6ff', '#f1cf68'];
        rows.forEach((y, row) => {
          ctx.beginPath(); ctx.strokeStyle = colors[row]; ctx.lineWidth = 5;
          for (let i = 0; i < 220; i++) {
            const x = 55 + i * 4.55; const phase = i + time * (row === 0 ? 7 : row === 1 ? 4 : 2.5); let wave = Math.sin(phase * 0.12) * 10;
            if (row === 0 && i % 46 > 20 && i % 46 < 26) wave += [0, -28, 75, -52, 18, 0][i % 46 - 20] || 0;
            const yy = y + wave; if (i === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
          }
          ctx.stroke();
        });
        vitalScreen.texture.needsUpdate = true;
      };

      const drawAnalysis = (p: number, time: number) => {
        const ctx = aiScreen.canvas.getContext('2d'); if (!ctx) return;
        ctx.fillStyle = '#06151c'; ctx.fillRect(0, 0, 1400, 850);
        write(ctx, 'AI CLINICAL ANALYSIS', 55, 58, 38, '#59e6ff');
        const rows = [['ECG', 'NORMAL'], ['OXYGENATION', 'NORMAL'], ['TEMPERATURE', 'NORMAL'], ['PATIENT STATUS', 'STABLE']];
        rows.forEach((row, i) => { if (p > i * 0.18) { write(ctx, row[0], 75, 150 + i * 78, 28, '#dffaff'); write(ctx, row[1], 440, 150 + i * 78, 28, '#55e8a2'); } });
        if (p > 0.72) write(ctx, 'ANALYSIS COMPLETE', 75, 500, 30, '#55e8a2');
        ctx.strokeStyle = '#1e4852'; ctx.lineWidth = 3; ctx.strokeRect(650, 120, 670, 520);
        ctx.beginPath(); ctx.strokeStyle = '#59e6ff'; ctx.lineWidth = 5;
        for (let i = 0; i < 220; i++) { const x = 670 + i * 2.85; const y = 380 + Math.sin((i + time * 5) * 0.12) * 65 + Math.sin((i + time * 8) * 0.037) * 25; if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
        ctx.stroke();
        if (p > 0.88) write(ctx, 'STABLE', 985, 720, 42, '#55e8a2', 'center');
        aiScreen.texture.needsUpdate = true;
      };

      const animate = () => {
        if (dead) return;
        const dt = Math.min(clock.getDelta(), 0.05);
        if (!paused.current) timeline.current = (timeline.current + dt * 1000) % totalDuration;
        let local = timeline.current; let idx = 0;
        while (idx < scenes.length - 1 && local >= scenes[idx].duration) { local -= scenes[idx].duration; idx += 1; }
        const p = ease(clamp(local / scenes[idx].duration));
        setSceneIndex((value) => value === idx ? value : idx);
        show(idx === 0 ? ['hospital', 'patient'] : idx === 1 ? ['entry', 'patient'] : idx === 2 ? ['reception', 'patient'] : idx <= 6 ? ['exam', 'patient', 'monitor', 'analysis', 'robot'] : ['result', 'patient']);

        // Patient positions are explicitly tied to each story beat.
        if (idx === 0) { patient.rotation.set(0, 0, 0); patient.position.set(-7 + p * 5, 0, 3 - p * 3); }
        if (idx === 1) { patient.rotation.set(0, 0, 0); patient.position.set(-2 + p * 2, 0, 1.2); const d = p * 1.7; doorL.position.x = -1.35 - d; doorR.position.x = 1.35 + d; }
        if (idx === 2) { patient.rotation.set(0, Math.PI * 0.05, 0); patient.position.set(0, 0, 1.25); const state = p < 0.28 ? 0 : p < 0.55 ? 1 : p < 0.78 ? 2 : 3; const ctx = kioskScreen.canvas.getContext('2d'); if (ctx) { clearScreen(kioskScreen, ['PATIENT REGISTRATION', 'SCANNING...', 'IDENTITY DETECTED', 'CHECK-IN COMPLETE ✓'][state]); ctx.fillStyle = '#55e8a2'; ctx.fillRect(110, 460, 680 * clamp((p - 0.28) / 0.72), 24); kioskScreen.texture.needsUpdate = true; } scanRing.scale.setScalar(1 + Math.sin(clock.elapsedTime * 6) * 0.12); scanPad.material = p > 0.55 ? green : cyan; }

        if (idx >= 3 && idx <= 6) {
          patient.rotation.x = Math.PI / 2; patient.rotation.y = 0; patient.rotation.z = 0; patient.position.set(-0.55, 1.48, -0.65);
          if (idx === 3) { patient.position.x = -1.8 + p * 1.25; }
          if (idx === 4) { drawVitals(clock.elapsedTime); }
          if (idx === 5) { drawAnalysis(p, clock.elapsedTime); }
          if (idx === 6) {
            const approach = 0.72 + 0.28 * Math.sin(p * Math.PI);
            robotRoot.position.set(2.65 - approach * 0.35, 0.95, 0.25);
            shoulder.rotation.z = -0.55 - 0.18 * Math.sin(p * Math.PI);
            elbow.rotation.z = 0.85 + 0.35 * Math.sin(p * Math.PI);
            wrist.rotation.z = -0.35;
            tool.rotation.z = 0.08 * Math.sin(clock.elapsedTime * 3);
            target.position.set(0.35, 1.48, -0.72);
            target.scale.setScalar(1 + Math.sin(clock.elapsedTime * 5) * 0.15);
          }
        }

        if (idx === 7) {
          patient.rotation.x = Math.PI / 2; patient.position.set(-0.55, 1.48, -0.5);
          robotRoot.position.set(2.65, 0.95, 0.25);
        }
        if (idx === 8) {
          const stand = clamp((p - 0.18) / 0.48); const joy = clamp((p - 0.66) / 0.34);
          patient.rotation.x = THREE.MathUtils.lerp(Math.PI / 2, 0, ease(stand));
          patient.position.x = -0.55;
          patient.position.y = THREE.MathUtils.lerp(1.48, 0.35, ease(stand));
          patient.position.z = THREE.MathUtils.lerp(-0.5, 1.0, ease(stand));
          armL.rotation.z = -joy * 1.15; armR.rotation.z = joy * 1.15;
          const bounce = joy > 0 ? Math.abs(Math.sin((p - 0.66) * Math.PI * 5)) * 0.28 : 0;
          patient.position.y += bounce;
          patient.rotation.z = Math.sin(clock.elapsedTime * 8) * joy * 0.06;
        }
        if (idx === 9) { patient.rotation.set(0, 0, 0); patient.position.set(0, 0.35, 1.2); }

        const fp: V3 = idx === 0 ? [13, 8, 20] : idx === 1 ? [7, 4.8, 11] : idx === 2 ? [6.5, 4.0, 8] : idx === 3 ? [8.5, 5.0, 6.5] : idx === 4 ? [8.8, 4.6, 7.2] : idx === 5 ? [8.0, 4.4, 6.8] : idx === 6 ? [10.5, 5.8, 8.5] : idx === 7 ? [7.8, 4.6, 7.0] : idx === 8 ? [7.5, 4.8, 7.5] : [11, 7, 13];
        const tp: V3 = idx === 0 ? [8, 5.4, 12] : idx === 1 ? [4.5, 3.5, 6] : idx === 2 ? [5.5, 3.3, 5.5] : idx === 3 ? [6.2, 3.8, 5.0] : idx === 4 ? [7.0, 3.8, 5.4] : idx === 5 ? [5.7, 3.7, 5.2] : idx === 6 ? [7.0, 4.0, 6.4] : idx === 7 ? [6.8, 4.0, 6.4] : idx === 8 ? [6.8, 4.0, 6.8] : [15, 8, 18];
        const fl: V3 = idx === 0 ? [0, 2.4, -5] : idx === 1 ? [0, 2.4, 0] : idx === 2 ? [0, 1.9, -0.2] : idx === 3 ? [0, 1.35, -0.7] : idx === 4 ? [2.3, 2.5, -1.6] : idx === 5 ? [0, 2.8, -4] : idx === 6 ? [0.6, 1.6, -0.6] : idx === 7 ? [0, 1.4, -0.5] : idx === 8 ? [0, 1.5, 0.2] : [0, 2.6, -4];
        const tl: V3 = idx === 0 ? [0, 2.5, -4] : idx === 1 ? [0, 2.4, 0] : idx === 2 ? [0, 2.0, -0.5] : idx === 3 ? [0, 1.35, -0.7] : idx === 4 ? [3.2, 2.7, -2.0] : idx === 5 ? [0, 3.0, -4.1] : idx === 6 ? [0.6, 1.6, -0.6] : idx === 7 ? [0, 1.5, -0.5] : idx === 8 ? [0, 1.6, 0.3] : [0, 2.8, -4];
        moveCamera(p, fp, tp, fl, tl);

        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };

      const resize = () => { const w = Math.max(1, mount.clientWidth); const h = Math.max(1, mount.clientHeight); camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false); };
      window.addEventListener('resize', resize); resize(); animate();
      return () => { dead = true; window.removeEventListener('resize', resize); cancelAnimationFrame(raf); renderer.dispose(); scene.traverse((object) => { const mesh = object as THREE.Mesh; if (mesh.geometry) mesh.geometry.dispose(); if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose()); else if (mesh.material) mesh.material.dispose(); }); if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement); };
    } catch (exception) { console.error('Biomedical City 3D initialization failed:', exception); if (!dead) setError(true); return () => { dead = true; cancelAnimationFrame(raf); }; }
  }, []);

  const jump = (index: number) => { timeline.current = scenes.slice(0, index).reduce((sum, item) => sum + item.duration, 0); setSceneIndex(index); };
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
        <div className="city-progress">{scenes.map((item, index) => <button key={item.title} className={index === sceneIndex ? 'active' : ''} onClick={() => jump(index)} aria-label={item.title} />)}</div>
        <button className="city-play" onClick={toggle}>{isPaused ? 'PLAY JOURNEY' : 'PAUSE JOURNEY'}</button>
      </div>
      {sceneIndex === 9 && <div className="city-signature"><span>ENGINEERING TECHNOLOGY</span><strong>FOR BETTER HEALTHCARE</strong></div>}
      <div className="city-label">FUTURE CARE • 2035</div>
    </section>
  );
};

export default BiomedicalCity;
