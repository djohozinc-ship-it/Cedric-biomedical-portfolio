import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './BiomedicalFutureScene.scss';

type V3 = [number, number, number];

const BiomedicalFutureScene: React.FC = () => {
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

      scene.add(new THREE.HemisphereLight(0xdff8ff, 0x061016, 2.3));
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
      const dark = mat(0x071218, .22, .92);
      const graphite = mat(0x172a32, .3, .78);
      const glass = mat(0x173d49, .12, .45, 0x07313c, 1.5);
      const steel = mat(0xb5c5c9, .16, .92);
      const white = mat(0xeaf4f5, .68, .08);
      const cyan = mat(0x32e4ff, .18, .35, 0x12c6e6, 4);
      const cyanSoft = mat(0x178ca5, .35, .25, 0x0a6679, 2);
      const violet = mat(0x8d78ff, .24, .4, 0x5439e8, 3);
      const green = mat(0x54ffb3, .24, .25, 0x1ccf84, 3);
      const red = mat(0xff496e, .3, .15, 0xc51d42, 2.5);
      const skin = mat(0xc9917c, .7, .02);
      const blue = mat(0x2f75a8, .55, .18);

      const box = (p: THREE.Object3D, pos: V3, size: V3, m: THREE.Material) => { const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), m); mesh.position.set(...pos); mesh.castShadow = !mobile; mesh.receiveShadow = true; p.add(mesh); return mesh; };
      const cyl = (p: THREE.Object3D, pos: V3, r: number, h: number, m: THREE.Material, segments = 20) => { const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, segments), m); mesh.position.set(...pos); mesh.castShadow = !mobile; mesh.receiveShadow = true; p.add(mesh); return mesh; };
      const sphere = (p: THREE.Object3D, pos: V3, r: number, m: THREE.Material, segments = 18) => { const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, segments, Math.max(12, segments - 4)), m); mesh.position.set(...pos); mesh.castShadow = !mobile; mesh.receiveShadow = true; p.add(mesh); return mesh; };
      const line = (p: THREE.Object3D, points: V3[], m: THREE.Material) => { const geometry = new THREE.BufferGeometry().setFromPoints(points.map(v => new THREE.Vector3(...v))); const mesh = new THREE.Line(geometry, m); p.add(mesh); return mesh; };

      // City foundation and illuminated transit grid.
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

      // Central biomedical research atrium.
      const atrium = new THREE.Group(); atrium.position.set(0, 0, -20); city.add(atrium);
      box(atrium, [0, 7, 0], [30, 14, 10], graphite);
      box(atrium, [0, 7, 5.08], [27, 13, .08], glass);
      box(atrium, [0, 14.2, 0], [31, .12, 10], cyanSoft);
      for (let x = -12; x <= 12; x += 4) box(atrium, [x, 7, 5.18], [.08, 12, .05], cyan);
      for (let y = 2; y <= 12; y += 2.5) box(atrium, [0, y, 5.18], [25, .05, .04], cyanSoft);

      // Robotic surgery theatre.
      const surgery = new THREE.Group(); surgery.position.set(-14, 0, 9); tech.add(surgery);
      box(surgery, [0, 3.3, 0], [12, 6.6, 8], glass);
      box(surgery, [0, 6.55, 0], [10, .08, 6], cyanSoft);
      box(surgery, [0, 1.05, 0], [6, .35, 2.5], white);
      box(surgery, [0, 1.35, 0], [4.8, .25, 1.6], dark);
      const surgicalTips: THREE.Object3D[] = [];
      const armPositions: Array<[number, number]> = [[-3, -2.2], [-3, 2.2], [3, -2.2], [3, 2.2]];
      armPositions.forEach(([x, z]) => {
        const arm = new THREE.Group(); arm.position.set(x, 1.2, z); surgery.add(arm);
        cyl(arm, [0, .8, 0], .6, 1.6, dark, 24);
        const joint = new THREE.Group(); joint.position.set(0, 1.6, 0); arm.add(joint); joint.rotation.z = x > 0 ? -.55 : .55;
        box(joint, [0, 1.25, 0], [.32, 2.5, .32], steel);
        cyl(joint, [0, 2.5, 0], .22, .2, cyan, 18);
        box(joint, [0, 2.9, 0], [.5, .3, .5], dark);
        surgicalTips.push(cyl(joint, [0, 3.15, 0], .09, .65, cyan, 14));
      });
      box(surgery, [0, 5.1, 0], [2.2, .12, 2.2], white);
      const surgeryLight = new THREE.PointLight(0xffffff, mobile ? 4 : 8, 12); surgeryLight.position.set(0, 5.4, 0); surgery.add(surgeryLight);

      // Imaging suite: CT ring + MRI-style secondary bore + reconstructed anatomy.
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

      // AI diagnostics wall with ECG, SpO2 and neural network nodes.
      const ai = new THREE.Group(); ai.position.set(15, 0, 7); tech.add(ai);
      box(ai, [0, 4, 0], [11, 8, .35], dark); box(ai, [0, 4, -.22], [10.2, 6.8, .05], cyanSoft);
      const ecgPoints: V3[] = [];
      for (let i = 0; i < 120; i++) { const x = -4.5 + i * .075; const p = i % 30; let y = 4; if (p === 10) y = 4.1; else if (p === 11) y = 4.8; else if (p === 12) y = 3.3; else if (p === 13) y = 4.9; ecgPoints.push([x, y, -.3]); }
      const ecg = line(ai, ecgPoints, green);
      const oxygen = line(ai, Array.from({ length: 80 }, (_, i) => [-4.5 + i * .085, 2.25 + Math.sin(i * .3) * .18, -.3] as V3), cyan);
      const nodes: THREE.Mesh[] = [];
      for (let i = 0; i < 12; i++) nodes.push(sphere(ai, [-4.2 + (i % 4) * 2.8, 5.9 - Math.floor(i / 4) * 1.7, -.45], .08, i % 2 ? violet : cyan, 8) as THREE.Mesh);
      for (let i = 0; i < nodes.length - 4; i++) line(ai, [[nodes[i].position.x, nodes[i].position.y, -.45], [nodes[i + 4].position.x, nodes[i + 4].position.y, -.45]], cyanSoft);

      // Automated laboratory and sample-processing carousel.
      const lab = new THREE.Group(); lab.position.set(-23, 0, 1); tech.add(lab);
      box(lab, [0, 2.8, 0], [10, 5.6, 6], glass); box(lab, [0, 1.2, 0], [8.2, .35, 4.6], dark);
      const carousel = new THREE.Group(); carousel.position.set(0, 1.55, 0); lab.add(carousel);
      cyl(carousel, [0, 0, 0], 2, .22, steel, 36);
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; cyl(carousel, [Math.cos(a) * 1.55, .42, Math.sin(a) * 1.55], .13, .85, i % 3 === 0 ? red : cyan, 12); }
      const pipette = new THREE.Group(); pipette.position.set(2.7, 2.2, 0); lab.add(pipette);
      box(pipette, [0, .9, 0], [.25, 2, .25], steel); cyl(pipette, [0, 1.9, 0], .16, .3, cyan, 12);
      const labBeam = new THREE.Mesh(new THREE.BoxGeometry(5.5, .035, .035), green); labBeam.position.set(0, 4.8, -3.05); lab.add(labBeam);

      // Smart prosthesis and rehabilitation exoskeleton.
      const prosthesis = new THREE.Group(); prosthesis.position.set(22, 0, -5); tech.add(prosthesis);
      box(prosthesis, [0, 2.8, 0], [7, 5.6, 5], dark); sphere(prosthesis, [0, 3.2, 0], .65, steel, 20); box(prosthesis, [0, 1.9, 0], [.85, 2.6, .7], steel);
      for (let i = 0; i < 5; i++) { const finger = new THREE.Group(); finger.position.set((i - 2) * .2, .45, 0); prosthesis.add(finger); box(finger, [0, -.35, 0], [.14, .9, .16], i === 1 ? green : steel); sphere(finger, [0, -.85, 0], .09, cyan, 10); }
      const exo = new THREE.Group(); exo.position.set(-1.9, 1.1, 0); prosthesis.add(exo);
      box(exo, [0, .9, 0], [.42, 2.1, .42], steel); box(exo, [0, -.25, 0], [1.2, .3, .4], graphite); cyl(exo, [0, -1, 0], .24, 1.1, cyan, 16);

      // Nanotechnology visualization and DNA.
      const nano = new THREE.Group(); nano.position.set(-1, 0, -1); tech.add(nano);
      sphere(nano, [0, 5.2, 0], .7, violet, 20);
      const nanoRing = new THREE.Mesh(new THREE.TorusGeometry(1.5, .035, 8, 64), cyan); nanoRing.position.set(0, 5.2, 0); nanoRing.rotation.x = Math.PI / 2; nano.add(nanoRing);
      const nanoParticles: THREE.Object3D[] = [];
      const nanoCount = mobile ? 28 : 55;
      for (let i = 0; i < nanoCount; i++) { const a = Math.random() * Math.PI * 2; const r = .8 + Math.random() * 2.1; nanoParticles.push(sphere(nano, [Math.cos(a) * r, 5.2 + (Math.random() - .5) * 2.4, Math.sin(a) * r], .045, i % 3 ? cyan : green, 8)); }

      const monitor = new THREE.Group(); monitor.position.set(7, 0, -3); tech.add(monitor);
      box(monitor, [0, 2.5, 0], [8, 5, 5], graphite); box(monitor, [0, 4, 2.45], [5.8, 2.6, .08], dark);
      const pulse = line(monitor, Array.from({ length: 100 }, (_, i) => { const p = i % 25; let y = 4; if (p === 8) y = 4.1; if (p === 9) y = 4.65; if (p === 10) y = 3.1; if (p === 11) y = 4.9; return [-2.6 + i * .053, y, 2.38] as V3; }), green);
      const spo2 = line(monitor, Array.from({ length: 80 }, (_, i) => [-2.6 + i * .066, 2.55 + Math.sin(i * .32) * .15, 2.38] as V3), cyan);

      const person = new THREE.Group(); person.position.set(0, .5, 7); patient.add(person);
      sphere(person, [0, 2.7, 0], .42, skin, 20); box(person, [0, 1.5, 0], [1.15, 1.7, .62], blue); box(person, [-.32, .2, 0], [.38, 1.05, .42], dark); box(person, [.32, .2, 0], [.38, 1.05, .42], dark);
      const wearable = cyl(person, [0, 1.65, -.36], .14, .05, green, 16); wearable.rotation.x = Math.PI / 2;
      const telemetry = new THREE.Group(); telemetry.position.set(0, 3.8, 0); person.add(telemetry);
      const telemetryRing = new THREE.Mesh(new THREE.TorusGeometry(.75, .025, 8, 40), green); telemetry.add(telemetryRing);

      // Floating data streams make the city feel like one connected clinical system.
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
        { p: [-36, 11, 30] as V3, l: [-8, 3, 8] as V3 }, { p: [-22, 8, 18] as V3, l: [-14, 3, 9] as V3 }, { p: [-6, 7, 22] as V3, l: [1, 3, 12] as V3 }, { p: [16, 7, 19] as V3, l: [15, 4, 7] as V3 },
        { p: [29, 8, 5] as V3, l: [22, 3, -5] as V3 }, { p: [18, 9, -11] as V3, l: [7, 3, -3] as V3 }, { p: [-2, 9, -14] as V3, l: [-7, 6, -3] as V3 }, { p: [-26, 8, -9] as V3, l: [-23, 3, 1] as V3 },
        { p: [0, 15, 28] as V3, l: [0, 3, 6] as V3 }, { p: [0, 5, 2] as V3, l: [0, 3, 7] as V3 },
      ];
      const clock = new THREE.Clock(); const look = new THREE.Vector3(); const target = new THREE.Vector3();
      const resize = () => { const width = Math.max(1, mount.clientWidth); const height = Math.max(1, mount.clientHeight); camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false); };
      window.addEventListener('resize', resize); resize();
      const animate = () => {
        if (dead) return;
        const t = clock.getElapsedTime(); const duration = 7.5; const cycle = cameraPaths.length * duration; const phase = (t % cycle) / duration; const index = Math.floor(phase); const next = (index + 1) % cameraPaths.length; const blend = phase - index; const eased = blend * blend * (3 - 2 * blend); const a = cameraPaths[index]; const b = cameraPaths[next];
        camera.position.set(THREE.MathUtils.lerp(a.p[0], b.p[0], eased), THREE.MathUtils.lerp(a.p[1], b.p[1], eased) + Math.sin(t * .7) * .35, THREE.MathUtils.lerp(a.p[2], b.p[2], eased));
        target.set(THREE.MathUtils.lerp(a.l[0], b.l[0], eased), THREE.MathUtils.lerp(a.l[1], b.l[1], eased), THREE.MathUtils.lerp(a.l[2], b.l[2], eased)); look.lerp(target, .12); camera.lookAt(look);
        scanRing.rotation.z = t * 1.2; scanCore.rotation.z = -t * .8; mriRing.rotation.z = t * .6; carousel.rotation.y = t * .8; pipette.rotation.z = Math.sin(t * 1.3) * .35; holoBody.rotation.y = t * .8; nanoRing.rotation.z = t * 1.4; helixGroup.rotation.y = t * .55; telemetryRing.rotation.z = -t * 1.5;
        nodes.forEach((node, i) => { node.scale.setScalar(.8 + Math.sin(t * 2.5 + i) * .22); });
        surgicalTips.forEach((o, i) => { o.position.z = Math.sin(t * 1.5 + i) * .15; });
        nanoParticles.forEach((o, i) => { const ang = t * (.35 + (i % 5) * .03) + i; const r = 1 + (i % 7) * .18; o.position.x = Math.cos(ang) * r; o.position.z = Math.sin(ang) * r; o.position.y = 5.2 + Math.sin(ang * 1.7) * 1.1; });
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

export default BiomedicalFutureScene;
