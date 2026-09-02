import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './BiomedicalFutureScene.scss';

type V3 = [number, number, number];

const BiomedicalCity: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let dead = false;
    let raf = 0;

    try {
      const mobile = window.matchMedia('(max-width: 768px)').matches;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x06131b);
      scene.fog = new THREE.FogExp2(0x08202a, mobile ? 0.02 : 0.012);
      const camera = new THREE.PerspectiveCamera(mobile ? 50 : 42, 1, 0.1, 240);
      const renderer = new THREE.WebGLRenderer({ antialias: !mobile, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.15 : 1.4));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = !mobile;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mount.innerHTML = '';
      mount.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xdff8ff, 0x061016, 2.5));
      const key = new THREE.DirectionalLight(0xffffff, 3.4);
      key.position.set(12, 30, 18);
      key.castShadow = !mobile;
      if (!mobile) key.shadow.mapSize.set(1024, 1024);
      scene.add(key);
      const cyanLight = new THREE.PointLight(0x20e5ff, mobile ? 13 : 23, 72);
      cyanLight.position.set(-16, 10, 10);
      scene.add(cyanLight);
      const violetLight = new THREE.PointLight(0x765cff, mobile ? 9 : 15, 68);
      violetLight.position.set(18, 12, -8);
      scene.add(violetLight);
      const greenLight = new THREE.PointLight(0x52ffb1, mobile ? 6 : 11, 48);
      greenLight.position.set(-3, 7, 18);
      scene.add(greenLight);

      const root = new THREE.Group();
      const city = new THREE.Group();
      const tech = new THREE.Group();
      const patient = new THREE.Group();
      root.add(city, tech, patient);
      scene.add(root);

      const mat = (color: number, roughness = .5, metalness = .15, emissive = 0, ei = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive, emissiveIntensity: ei });
      const dark = mat(0x0b1b23, .3, .85);
      const graphite = mat(0x203942, .34, .7);
      const glass = new THREE.MeshPhysicalMaterial({ color: 0x3d8fa2, roughness: .08, metalness: .15, transmission: .35, transparent: true, opacity: .24, side: THREE.DoubleSide, emissive: 0x0a3540, emissiveIntensity: 1.2 });
      const glassDoor = new THREE.MeshPhysicalMaterial({ color: 0x74eaff, roughness: .06, metalness: .18, transmission: .5, transparent: true, opacity: .2, side: THREE.DoubleSide, emissive: 0x0a596b, emissiveIntensity: 1.7, depthWrite: false });
      const steel = mat(0xb5c5c9, .16, .92);
      const white = mat(0xeaf4f5, .68, .08);
      const cyan = mat(0x32e4ff, .18, .35, 0x12c6e6, 4);
      const cyanSoft = mat(0x178ca5, .35, .25, 0x0a6679, 2);
      const violet = mat(0x8d78ff, .24, .4, 0x5439e8, 3);
      const green = mat(0x54ffb3, .24, .25, 0x1ccf84, 3);
      const red = mat(0xff496e, .3, .15, 0xc51d42, 2.5);
      const skin = mat(0xc9917c, .7, .02);
      const blue = mat(0x2f75a8, .55, .18);
      const robotDark = mat(0x101f27, .22, .9);
      const robotWhite = mat(0xcfe4e8, .28, .72);

      const box = (p: THREE.Object3D, pos: V3, size: V3, m: THREE.Material) => { const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), m); mesh.position.set(...pos); mesh.castShadow = !mobile; mesh.receiveShadow = true; p.add(mesh); return mesh; };
      const cyl = (p: THREE.Object3D, pos: V3, r: number, h: number, m: THREE.Material, segments = 20) => { const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, segments), m); mesh.position.set(...pos); mesh.castShadow = !mobile; mesh.receiveShadow = true; p.add(mesh); return mesh; };
      const sphere = (p: THREE.Object3D, pos: V3, r: number, m: THREE.Material, segments = 18) => { const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, segments, Math.max(12, segments - 4)), m); mesh.position.set(...pos); mesh.castShadow = !mobile; mesh.receiveShadow = true; p.add(mesh); return mesh; };
      const line = (p: THREE.Object3D, points: V3[], m: THREE.Material) => { const geometry = new THREE.BufferGeometry().setFromPoints(points.map(v => new THREE.Vector3(...v))); const mesh = new THREE.Line(geometry, m); p.add(mesh); return mesh; };

      box(city, [0, -.55, 0], [84, 1, 66], dark);
      box(city, [0, .02, 0], [78, .08, 60], graphite);
      for (let z = -28; z <= 28; z += 4) box(city, [0, .09, z], [76, .025, .025], cyanSoft);
      for (let x = -36; x <= 36; x += 4) box(city, [x, .1, 0], [.025, .025, 58], cyanSoft);
      box(city, [0, .2, 6], [66, .06, 5], dark);
      box(city, [0, .25, 6], [64, .04, .08], cyan);
      for (let x = -30; x <= 30; x += 3) cyl(city, [x, .32, 6], .055, .1, cyan, 10);

      const tower = (x: number, z: number, h: number, w: number, m = dark) => {
        box(city, [x, h / 2, z], [w, h, w * .7], m);
        box(city, [x, h * .62, z - w * .36], [w * .72, h * .42, .04], glass);
        for (let y = 1.2; y < h - .3; y += 2) box(city, [x, y, z - w * .36], [w * .68, .8, .05], cyanSoft);
        box(city, [x, h + .1, z], [w + .4, .08, w * .75], cyan);
      };
      tower(-28, -15, 19, 6);
      tower(27, -14, 23, 7);
      tower(-25, 5, 12, 5, graphite);
      tower(25, 5, 15, 5, graphite);

      const atrium = new THREE.Group(); atrium.position.set(0, 0, -20); city.add(atrium);
      box(atrium, [0, 7, 0], [30, 14, 10], graphite);
      box(atrium, [0, 7, 5.08], [27, 13, .08], glass);
      box(atrium, [0, 14.2, 0], [31, .12, 10], cyanSoft);
      for (let x = -12; x <= 12; x += 4) box(atrium, [x, 7, 5.18], [.08, 12, .05], cyan);
      for (let y = 2; y <= 12; y += 2.5) box(atrium, [0, y, 5.18], [25, .05, .04], cyanSoft);

      const createSlidingDoors = (p: THREE.Object3D, z: number, width: number, height: number) => {
        const doors = new THREE.Group(); doors.position.z = z; p.add(doors);
        box(doors, [-width * .26, height + .16, 0], [width * .98, .08, .08], steel);
        box(doors, [-width * .26, .12, 0], [width * .98, .06, .06], cyanSoft);
        const left = box(doors, [-width * .18, height / 2, 0], [width * .32, height, .07], glassDoor);
        const right = box(doors, [width * .18, height / 2, 0], [width * .32, height, .07], glassDoor);
        const leftFrame = box(doors, [-width * .34, height / 2, -.05], [.045, height, .08], cyan);
        const rightFrame = box(doors, [width * .34, height / 2, -.05], [.045, height, .08], cyan);
        return { doors, left, right, leftFrame, rightFrame };
      };

      const surgery = new THREE.Group(); surgery.position.set(-14, 0, 9); tech.add(surgery);
      box(surgery, [0, .55, 0], [12, .3, 8], graphite);
      box(surgery, [-5.7, 3.3, 0], [.25, 6.6, 8], graphite);
      box(surgery, [5.7, 3.3, 0], [.25, 6.6, 8], graphite);
      box(surgery, [0, 6.5, 0], [12, .25, 8], graphite);
      box(surgery, [0, 3.3, -3.9], [12, 6.4, .2], glass);
      const surgeryDoors = createSlidingDoors(surgery, 4.05, 6.2, 4.9);
      box(surgery, [0, 1.05, 0], [6, .35, 2.5], white);
      box(surgery, [0, 1.35, 0], [4.8, .25, 1.6], dark);
      const surgicalTips: THREE.Object3D[] = [];
      const armPositions: Array<[number, number]> = [[-3, -2.2], [-3, 2.2], [3, -2.2], [3, 2.2]];
      armPositions.forEach(([x, z]) => {
        const arm = new THREE.Group(); arm.position.set(x, 1.2, z); surgery.add(arm);
        cyl(arm, [0, .8, 0], .6, 1.6, robotDark, 24);
        const joint = new THREE.Group(); joint.position.set(0, 1.6, 0); arm.add(joint); joint.rotation.z = x > 0 ? -.55 : .55;
        box(joint, [0, 1.25, 0], [.32, 2.5, .32], steel);
        cyl(joint, [0, 2.5, 0], .22, .2, cyan, 18);
        box(joint, [0, 2.9, 0], [.5, .3, .5], robotDark);
        surgicalTips.push(cyl(joint, [0, 3.15, 0], .09, .65, cyan, 14));
      });
      box(surgery, [0, 5.1, 0], [2.2, .12, 2.2], white);
      const surgeryLight = new THREE.PointLight(0xffffff, mobile ? 4 : 8, 12); surgeryLight.position.set(0, 5.4, 0); surgery.add(surgeryLight);

      const imaging = new THREE.Group(); imaging.position.set(1, 0, 12); tech.add(imaging);
      cyl(imaging, [0, 2.5, 0], 3.2, 1.2, dark, 48);
      const scanRing = new THREE.Mesh(new THREE.TorusGeometry(3, .18, 16, 64), cyan); scanRing.position.set(0, 2.5, 0); scanRing.rotation.y = Math.PI / 2; imaging.add(scanRing);
      const scanCore = new THREE.Mesh(new THREE.TorusGeometry(2.35, .055, 10, 64), violet); scanCore.position.set(0, 2.5, 0); scanCore.rotation.y = Math.PI / 2; imaging.add(scanCore);
      box(imaging, [0, 1.1, 0], [8, .3, 3.8], white);
      const holoBody = new THREE.Group(); holoBody.position.set(0, 4.4, 0); imaging.add(holoBody);
      sphere(holoBody, [0, 1.1, 0], .48, cyan, 18); box(holoBody, [0, 0, 0], [.9, 1.7, .45], cyan);
      for (let y = -.85; y <= .85; y += .22) { const ring = new THREE.Mesh(new THREE.TorusGeometry(.58 - Math.abs(y) * .1, .025, 6, 36), violet); ring.position.y = y; ring.rotation.x = Math.PI / 2; holoBody.add(ring); }
      const mri = new THREE.Group(); mri.position.set(5.8, 0, -1.5); imaging.add(mri);
      box(mri, [0, 2.4, 0], [3.5, 4.8, 3.5], graphite);
      const mriRing = new THREE.Mesh(new THREE.TorusGeometry(1.65, .13, 12, 48), violet); mriRing.position.set(0, 2.4, 1.8); mriRing.rotation.x = Math.PI / 2; mri.add(mriRing);

      const createHologramPanel = (p: THREE.Object3D, pos: V3, size: V3, accent: THREE.Material) => {
        const holo = new THREE.Group(); holo.position.set(...pos); p.add(holo);
        const accentColor = accent instanceof THREE.MeshStandardMaterial ? accent.color.getHex() : 0x32e4ff;
        const panelMat = new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: .13, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
        const panel = new THREE.Mesh(new THREE.PlaneGeometry(size[0], size[1]), panelMat);
        panel.rotation.x = Math.PI / 2; holo.add(panel);
        const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(size[0], .02, size[1])), new THREE.LineBasicMaterial({ color: 0x63edff, transparent: true, opacity: .75 }));
        frame.rotation.x = Math.PI / 2; holo.add(frame);
        for (let i = 0; i < 5; i++) {
          const scan = new THREE.Mesh(new THREE.BoxGeometry(size[0] * (.55 + (i % 2) * .25), .012, .018), accent);
          scan.position.set(0, 0, -size[1] * .32 + i * size[1] * .15); holo.add(scan);
        }
        return { holo, panel, panelMat };
      };

      const ai = new THREE.Group(); ai.position.set(15, 0, 7); tech.add(ai);
      box(ai, [0, 4, 0], [11, 8, .35], dark); box(ai, [0, 4, -.22], [10.2, 6.8, .05], cyanSoft);
      const ecgPoints: V3[] = [];
      for (let i = 0; i < 120; i++) { const x = -4.5 + i * .075; const p = i % 30; let y = 4; if (p === 10) y = 4.1; else if (p === 11) y = 4.8; else if (p === 12) y = 3.3; else if (p === 13) y = 4.9; ecgPoints.push([x, y, -.3]); }
      const ecg = line(ai, ecgPoints, green);
      const oxygen = line(ai, Array.from({ length: 80 }, (_, i) => [-4.5 + i * .085, 2.25 + Math.sin(i * .3) * .18, -.3] as V3), cyan);
      const nodes: THREE.Mesh[] = [];
      for (let i = 0; i < 12; i++) nodes.push(sphere(ai, [-4.2 + (i % 4) * 2.8, 5.9 - Math.floor(i / 4) * 1.7, -.45], .08, i % 2 ? violet : cyan, 8) as THREE.Mesh);
      for (let i = 0; i < nodes.length - 4; i++) line(ai, [[nodes[i].position.x, nodes[i].position.y, -.45], [nodes[i + 4].position.x, nodes[i + 4].position.y, -.45]], cyanSoft);
      const diagnosticHolo = createHologramPanel(ai, [0, 6.2, .45], [7.6, 3.1, 0], cyan);
      const aiHolo = createHologramPanel(ai, [0, 5.9, .25], [6.4, 2.4, 0], violet);

      const lab = new THREE.Group(); lab.position.set(-23, 0, 1); tech.add(lab);
      box(lab, [0, .55, 0], [10, .3, 6], graphite); box(lab, [-4.7, 2.8, 0], [.2, 5.6, 6], graphite); box(lab, [4.7, 2.8, 0], [.2, 5.6, 6], graphite); box(lab, [0, 5.5, 0], [10, .2, 6], graphite); box(lab, [0, 2.8, -2.9], [10, 5.2, .12], glass);
      const labDoors = createSlidingDoors(lab, 3.02, 5.5, 4.1);
      const carousel = new THREE.Group(); carousel.position.set(0, 1.55, 0); lab.add(carousel);
      cyl(carousel, [0, 0, 0], 2, .22, steel, 36);
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; cyl(carousel, [Math.cos(a) * 1.55, .42, Math.sin(a) * 1.55], .13, .85, i % 3 === 0 ? red : cyan, 12); }
      const pipette = new THREE.Group(); pipette.position.set(2.7, 2.2, 0); lab.add(pipette);
      box(pipette, [0, .9, 0], [.25, 2, .25], steel); cyl(pipette, [0, 1.9, 0], .16, .3, cyan, 12);
      const labBeam = new THREE.Mesh(new THREE.BoxGeometry(5.5, .035, .035), green); labBeam.position.set(0, 4.8, -3.05); lab.add(labBeam);

      const prosthesis = new THREE.Group(); prosthesis.position.set(22, 0, -5); tech.add(prosthesis);
      box(prosthesis, [0, .6, 0], [7, .3, 5], graphite); box(prosthesis, [-3.3, 2.8, 0], [.2, 5.6, 5], graphite); box(prosthesis, [3.3, 2.8, 0], [.2, 5.6, 5], graphite);
      sphere(prosthesis, [0, 3.2, 0], .65, steel, 20); box(prosthesis, [0, 1.9, 0], [.85, 2.6, .7], steel);
      for (let i = 0; i < 5; i++) { const finger = new THREE.Group(); finger.position.set((i - 2) * .2, .45, 0); prosthesis.add(finger); box(finger, [0, -.35, 0], [.14, .9, .16], i === 1 ? green : steel); sphere(finger, [0, -.85, 0], .09, cyan, 10); }
      const exo = new THREE.Group(); exo.position.set(-1.9, 1.1, 0); prosthesis.add(exo);
      box(exo, [0, .9, 0], [.42, 2.1, .42], steel); box(exo, [0, -.25, 0], [1.2, .3, .4], graphite); cyl(exo, [0, -1, 0], .24, 1.1, cyan, 16);

      const nano = new THREE.Group(); nano.position.set(-1, 0, -1); tech.add(nano);
      sphere(nano, [0, 5.2, 0], .7, violet, 20);
      const nanoRing = new THREE.Mesh(new THREE.TorusGeometry(1.5, .035, 8, 64), cyan); nanoRing.position.set(0, 5.2, 0); nanoRing.rotation.x = Math.PI / 2; nano.add(nanoRing);
      const nanoParticles: THREE.Object3D[] = [];
      const nanoCount = mobile ? 28 : 55;
      for (let i = 0; i < nanoCount; i++) { const a = Math.random() * Math.PI * 2; const r = .8 + Math.random() * 2.1; nanoParticles.push(sphere(nano, [Math.cos(a) * r, 5.2 + (Math.random() - .5) * 2.4, Math.sin(a) * r], .045, i % 3 ? cyan : green, 8)); }

      const monitor = new THREE.Group(); monitor.position.set(7, 0, -3); tech.add(monitor);
      box(monitor, [0, 2.5, 0], [8, 5, 5], graphite); box(monitor, [0, 4, 2.45], [5.8, 2.6, .08], dark);
      line(monitor, Array.from({ length: 100 }, (_, i) => { const p = i % 25; let y = 4; if (p === 8) y = 4.1; if (p === 9) y = 4.65; if (p === 10) y = 3.1; if (p === 11) y = 4.9; return [-2.6 + i * .053, y, 2.38] as V3; }), green);
      line(monitor, Array.from({ length: 80 }, (_, i) => [-2.6 + i * .066, 2.55 + Math.sin(i * .32) * .15, 2.38] as V3), cyan);

      const person = new THREE.Group(); person.position.set(0, .5, 7); patient.add(person);
      sphere(person, [0, 2.7, 0], .42, skin, 20); box(person, [0, 1.5, 0], [1.15, 1.7, .62], blue); box(person, [-.32, .2, 0], [.38, 1.05, .42], dark); box(person, [.32, .2, 0], [.38, 1.05, .42], dark);
      const wearable = cyl(person, [0, 1.65, -.36], .14, .05, green, 16); wearable.rotation.x = Math.PI / 2;
      const telemetry = new THREE.Group(); telemetry.position.set(0, 3.8, 0); person.add(telemetry);
      const telemetryRing = new THREE.Mesh(new THREE.TorusGeometry(.75, .025, 8, 40), green); telemetry.add(telemetryRing);

      const scanBeamMat = new THREE.MeshBasicMaterial({ color: 0x52efff, transparent: true, opacity: .2, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
      const scanBeam = new THREE.Mesh(new THREE.BoxGeometry(1.8, .035, 3.1), scanBeamMat);
      scanBeam.position.set(0, 3.05, 7); scanBeam.rotation.x = Math.PI / 2; patient.add(scanBeam);
      const scanBeamGlow = new THREE.Mesh(new THREE.BoxGeometry(2.8, .018, 3.4), new THREE.MeshBasicMaterial({ color: 0x32e4ff, transparent: true, opacity: .07, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
      scanBeamGlow.position.copy(scanBeam.position); scanBeamGlow.rotation.copy(scanBeam.rotation); patient.add(scanBeamGlow);

      const createRobot = (p: THREE.Object3D, pos: V3, scale = 1) => {
        const robot = new THREE.Group(); robot.position.set(...pos); robot.scale.setScalar(scale); p.add(robot);
        const body = box(robot, [0, 1.25, 0], [1.05, 1.35, .68], robotWhite); body.rotation.z = .02;
        box(robot, [0, 2.2, 0], [.72, .72, .62], robotDark);
        const visor = box(robot, [0, 2.25, .33], [.54, .2, .025], cyan);
        cyl(robot, [0, 1.9, 0], .18, .2, steel, 12);
        const wheelBase = cyl(robot, [0, .45, 0], .62, .22, robotDark, 20); wheelBase.rotation.x = Math.PI / 2;
        [-.38, .38].forEach(x => cyl(robot, [x, .42, .35], .13, .28, cyan, 12));
        const armL = new THREE.Group(); armL.position.set(-.72, 1.55, 0); robot.add(armL);
        const armR = new THREE.Group(); armR.position.set(.72, 1.55, 0); robot.add(armR);
        box(armL, [0, -.32, 0], [.18, .72, .18], steel); box(armR, [0, -.32, 0], [.18, .72, .18], steel);
        sphere(armL, [0, -.72, .02], .14, cyan, 12); sphere(armR, [0, -.72, .02], .14, cyan, 12);
        const headLight = new THREE.PointLight(0x2feaff, mobile ? .8 : 1.5, 5); headLight.position.set(0, 2.2, .5); robot.add(headLight);
        return { robot, visor, armL, armR };
      };

      const robots = [
        createRobot(city, [-10, .15, -9], .72),
        createRobot(city, [10, .15, -4], .82),
        createRobot(city, [18, .15, 15], .68),
      ];
      const serviceRobot = createRobot(tech, [-7, .5, 2], .62);

      const dataBeams: THREE.MeshStandardMaterial[] = [];
      const beamPairs: Array<[V3, V3]> = [[[-20, 4, 5], [-10, 4, 9]], [[-8, 5, 9], [2, 5, 12]], [[5, 5, 12], [14, 5, 7]], [[14, 4, 7], [21, 4, -4]], [[-21, 3, 1], [-2, 5, -1]]];
      beamPairs.forEach(([a, b]) => { const start = new THREE.Vector3(...a); const end = new THREE.Vector3(...b); const mid = start.clone().add(end).multiplyScalar(.5); const length = start.distanceTo(end); const beam = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, length, 8), cyan); beam.position.copy(mid); beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize()); scene.add(beam); dataBeams.push(beam.material as THREE.MeshStandardMaterial); });

      const helixGroup = new THREE.Group(); helixGroup.position.set(-7, 8, -3); tech.add(helixGroup);
      for (let i = 0; i < 32; i++) { const y = i * .18; const a = i * .55; const x = Math.cos(a) * 1.1; const z = Math.sin(a) * 1.1; sphere(helixGroup, [x, y, z], .055, cyan, 8); sphere(helixGroup, [-x, y, -z], .055, violet, 8); if (i % 3 === 0) line(helixGroup, [[x, y, z], [-x, y, -z]], cyanSoft); }

      const count = mobile ? 150 : 340;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) { positions[i * 3] = (Math.random() - .5) * 78; positions[i * 3 + 1] = .4 + Math.random() * 17; positions[i * 3 + 2] = (Math.random() - .5) * 56; }
      const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const pm = new THREE.PointsMaterial({ color: 0x73eaff, size: mobile ? .035 : .05, transparent: true, opacity: .58, sizeAttenuation: true });
      const particles = new THREE.Points(pg, pm); scene.add(particles);

      const cameraPaths = [
        { p: [-38, 8, 25] as V3, l: [-12, 2.8, 10] as V3, fov: 43 },
        { p: [-20, 5.4, 15] as V3, l: [-14, 3, 11] as V3, fov: 38 },
        { p: [-7, 4.8, 17] as V3, l: [1, 2.8, 12] as V3, fov: 40 },
        { p: [10, 6, 19] as V3, l: [14, 4, 7] as V3, fov: 42 },
        { p: [29, 6.5, 8] as V3, l: [22, 3.3, -4] as V3, fov: 44 },
        { p: [17, 5.8, -9] as V3, l: [7, 3, -3] as V3, fov: 39 },
        { p: [-1, 8, -15] as V3, l: [-7, 5.5, -3] as V3, fov: 45 },
        { p: [-27, 6, -7] as V3, l: [-23, 2.8, 1] as V3, fov: 40 },
        { p: [0, 12, 24] as V3, l: [0, 2.8, 7] as V3, fov: 47 },
        { p: [0, 4.2, 3] as V3, l: [0, 2.7, 7] as V3, fov: 36 },
      ];
      const clock = new THREE.Clock(); const look = new THREE.Vector3(); const target = new THREE.Vector3();
      const resize = () => { const width = Math.max(1, mount.clientWidth); const height = Math.max(1, mount.clientHeight); camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false); };
      window.addEventListener('resize', resize); resize();
      const animate = () => {
        if (dead) return;
        const t = clock.getElapsedTime(); const duration = 6.2; const cycle = cameraPaths.length * duration; const phase = (t % cycle) / duration; const index = Math.floor(phase); const next = (index + 1) % cameraPaths.length; const blend = phase - index; const eased = blend * blend * (3 - 2 * blend); const a = cameraPaths[index]; const b = cameraPaths[next];
        camera.position.set(THREE.MathUtils.lerp(a.p[0], b.p[0], eased), THREE.MathUtils.lerp(a.p[1], b.p[1], eased) + Math.sin(t * .55) * .22, THREE.MathUtils.lerp(a.p[2], b.p[2], eased));
        camera.fov = THREE.MathUtils.lerp(a.fov, b.fov, eased) + Math.sin(t * .45) * .35; camera.updateProjectionMatrix();
        target.set(THREE.MathUtils.lerp(a.l[0], b.l[0], eased), THREE.MathUtils.lerp(a.l[1], b.l[1], eased), THREE.MathUtils.lerp(a.l[2], b.l[2], eased)); look.lerp(target, .12); camera.lookAt(look); camera.rotation.z = Math.sin(t * .18) * .008 + Math.sin(t * .53) * .003;

        scanRing.rotation.z = t * 1.2; scanCore.rotation.z = -t * .8; mriRing.rotation.z = t * .6; carousel.rotation.y = t * .8; pipette.rotation.z = Math.sin(t * 1.3) * .35; holoBody.rotation.y = t * .8; nanoRing.rotation.z = t * 1.4; helixGroup.rotation.y = t * .55; telemetryRing.rotation.z = -t * 1.5;
        surgeryDoors.left.position.x = THREE.MathUtils.lerp(-1.12, -1.75, (Math.sin(t * .7) + 1) * .5);
        surgeryDoors.right.position.x = THREE.MathUtils.lerp(1.12, 1.75, (Math.sin(t * .7) + 1) * .5);
        labDoors.left.position.x = THREE.MathUtils.lerp(-1, -1.55, (Math.sin(t * .6 + 1) + 1) * .5);
        labDoors.right.position.x = THREE.MathUtils.lerp(1, 1.55, (Math.sin(t * .6 + 1) + 1) * .5);
        diagnosticHolo.holo.rotation.z = Math.sin(t * .7) * .04; aiHolo.holo.rotation.z = -Math.sin(t * .55) * .035;
        diagnosticHolo.panelMat.opacity = .1 + (Math.sin(t * 2.2) + 1) * .035; aiHolo.panelMat.opacity = .09 + (Math.cos(t * 2.7) + 1) * .035;
        scanBeam.position.y = 1.2 + ((t * .75) % 3.8); scanBeamGlow.position.y = scanBeam.position.y;
        nodes.forEach((node, i) => { node.scale.setScalar(.8 + Math.sin(t * 2.5 + i) * .22); });
        surgicalTips.forEach((o, i) => { o.position.z = Math.sin(t * 1.5 + i) * .15; });
        nanoParticles.forEach((o, i) => { const ang = t * (.35 + (i % 5) * .03) + i; const r = 1 + (i % 7) * .18; o.position.x = Math.cos(ang) * r; o.position.z = Math.sin(ang) * r; o.position.y = 5.2 + Math.sin(ang * 1.7) * 1.1; });
        robots.forEach((unit, i) => { unit.robot.position.x += Math.sin(t * .22 + i) * .0015; unit.robot.rotation.y = Math.sin(t * .45 + i) * .12; unit.armL.rotation.z = Math.sin(t * 1.2 + i) * .18; unit.armR.rotation.z = -Math.sin(t * 1.1 + i) * .16; });
        serviceRobot.robot.position.x = -7 + Math.sin(t * .45) * 1.8; serviceRobot.robot.position.z = 2 + Math.cos(t * .45) * .9; serviceRobot.robot.rotation.y = Math.sin(t * .45) * .5;
        ecg.material.opacity = .65 + Math.sin(t * 4) * .25; oxygen.material.opacity = .55 + Math.sin(t * 2.5) * .2;
        dataBeams.forEach((material, i) => { material.opacity = .35 + (Math.sin(t * 2 + i) + 1) * .2; });
        cyanLight.intensity = (mobile ? 13 : 23) + Math.sin(t * 1.3) * 3; violetLight.intensity = (mobile ? 9 : 15) + Math.cos(t * 1.1) * 2; greenLight.intensity = (mobile ? 6 : 11) + Math.sin(t * 2) * 2;
        particles.rotation.y = t * .008;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      animate();
      return () => { dead = true; cancelAnimationFrame(raf); window.removeEventListener('resize', resize); renderer.dispose(); pg.dispose(); pm.dispose(); mount.innerHTML = ''; };
    } catch (e) { console.error('Biomedical future scene failed:', e); setError(true); return () => { dead = true; cancelAnimationFrame(raf); }; }
  }, []);

  return (
    <section className="biomedical-future-scene" aria-label="Biomedical City — medical technology showcase">
      <div ref={mountRef} className="biomedical-future-canvas" />
      <div className="future-scene-overlay">
        <div className="future-scene-hud future-scene-hud-left"><span>BIOMEDICAL CITY</span><strong>MEDICAL TECHNOLOGY // 2035</strong></div>
        <div className="future-scene-hud future-scene-hud-right"><span>LIVE SYSTEMS</span><strong>ROBOTICS · AI · IMAGING · BIOENGINEERING</strong></div>
        <div className="future-scene-title"><span>THE FUTURE OF</span><strong>HEALTHCARE</strong></div>
      </div>
      {error && <div className="future-scene-error"><strong>BIOMEDICAL CITY</strong><span>Visualisation 3D indisponible — interface médicale de secours active.</span></div>}
    </section>
  );
};

export default BiomedicalCity;
