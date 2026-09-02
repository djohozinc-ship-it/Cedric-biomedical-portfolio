import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './BiomedicalFutureScene.scss';

// Futuristic biomedical city scene.
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
      scene.background = new THREE.Color(0x050b10);
      scene.fog = new THREE.FogExp2(0x07131a, mobile ? 0.026 : 0.019);

      const camera = new THREE.PerspectiveCamera(mobile ? 48 : 40, 1, 0.1, 180);
      const renderer = new THREE.WebGLRenderer({ antialias: !mobile, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.15 : 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = !mobile;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mount.innerHTML = '';
      mount.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xcfefff, 0x071017, 1.8));
      const key = new THREE.DirectionalLight(0xffffff, 2.8);
      key.position.set(18, 28, 12);
      key.castShadow = !mobile;
      if (!mobile) key.shadow.mapSize.set(1024, 1024);
      scene.add(key);

      const cyanLight = new THREE.PointLight(0x20dfff, mobile ? 10 : 18, 55);
      cyanLight.position.set(-12, 7, 10);
      scene.add(cyanLight);
      const violetLight = new THREE.PointLight(0x765cff, mobile ? 7 : 12, 42);
      violetLight.position.set(12, 9, -8);
      scene.add(violetLight);

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
      const violet = mat(0x8b72ff, .25, .35, 0x4c2ed8, 2.5);
      const red = mat(0xff5965, .3, .3, 0x9c1623, 2.2);
      const skin = mat(0xc98e76, .68, .03);
      const fabric = mat(0x326e9f, .62, .1);
      const darkFabric = mat(0x18232a, .68, .15);

      const box = (p: THREE.Object3D, pos: V3, size: V3, m: THREE.Material) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), m);
        mesh.position.set(...pos); mesh.castShadow = !mobile; mesh.receiveShadow = true; p.add(mesh); return mesh;
      };
      const cyl = (p: THREE.Object3D, pos: V3, r: number, h: number, m: THREE.Material, segments = 20) => {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, segments), m);
        mesh.position.set(...pos); mesh.castShadow = !mobile; mesh.receiveShadow = true; p.add(mesh); return mesh;
      };
      const sphere = (p: THREE.Object3D, pos: V3, r: number, m: THREE.Material, segments = 18) => {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, segments, Math.max(12, segments - 4)), m);
        mesh.position.set(...pos); mesh.castShadow = !mobile; mesh.receiveShadow = true; p.add(mesh); return mesh;
      };
      const line = (p: THREE.Object3D, points: V3[], m: THREE.Material) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(points.map(v => new THREE.Vector3(...v)));
        const mesh = new THREE.Line(geometry, m); p.add(mesh); return mesh;
      };

      // Ground: wet, reflective smart-city plaza.
      box(exterior, [0, -.5, 0], [72, 1, 58], black);
      box(exterior, [0, .02, 0], [66, .08, 52], concrete);
      for (let z = -22; z <= 22; z += 4) box(exterior, [0, .08, z], [64, .025, .025], cyanSoft);
      for (let x = -30; x <= 30; x += 4) box(exterior, [x, .09, 0], [.025, .025, 50], cyanSoft);
      box(exterior, [0, .16, 7], [62, .04, 5.2], black);
      box(exterior, [0, .2, 7], [60, .04, .08], cyan);

      // Main hospital tower and secondary research towers.
      box(exterior, [0, 6.4, -13], [34, 12.8, 8], graphite);
      box(exterior, [0, 5.5, -8.6], [29, 9.8, .35], glass);
      for (let x = -13; x <= 13; x += 3.25) {
        for (let y = 2; y <= 11; y += 2.15) box(exterior, [x, y, -8.82], [2.45, 1.55, .08], glass);
      }
      box(exterior, [0, 12.9, -13], [38, .2, 8.5], cyanSoft);
      box(exterior, [0, 10.1, -8.95], [9, 3.9, .12], black);
      box(exterior, [0, 8.5, -9.05], [7, .06, .06], cyan);

      const tower = (x: number, z: number, h: number, w: number, m: THREE.Material) => {
        box(exterior, [x, h / 2, z], [w, h, w * .72], m);
        for (let y = 1.2; y < h - .4; y += 1.8) box(exterior, [x, y, z - w * .37], [w * .72, .75, .05], glass);
        box(exterior, [x, h + .12, z], [w + .5, .08, w * .78], cyanSoft);
      };
      tower(-25, -15, 15, 6, black);
      tower(24, -14, 19, 7, graphite);
      tower(-25, 2, 10, 5, graphite);
      tower(25, 3, 12, 5, black);
      tower(-18, -27, 8, 4.5, black);
      tower(18, -27, 11, 5, graphite);

      // Entrance canopy, sliding doors and landing lights.
      box(exterior, [0, 4.1, -3.6], [15, .35, 6], black);
      box(exterior, [0, 2.8, -3.55], [13, 5.5, .22], glass);
      const doorL = box(exterior, [-1.65, 2.65, -3.72], [3.1, 4.9, .12], glass);
      const doorR = box(exterior, [1.65, 2.65, -3.72], [3.1, 4.9, .12], glass);
      for (let x = -6; x <= 6; x += 2) cyl(exterior, [x, .3, -1], .07, .12, cyan, 12);
      box(exterior, [0, 6.0, -3.7], [11, .06, .06], cyan);

      // Interior diagnostic bay.
      box(interior, [0, .45, 5], [24, .35, 18], darkFabric);
      box(interior, [0, 4.5, 13], [24, 8, .25], graphite);
      box(interior, [-11.7, 4, 7], [.25, 7, 13], graphite);
      for (let x = -9; x <= 9; x += 3) box(interior, [x, 7.7, 5], [2.2, .08, 5], glass);

      // Examination bed.
      box(interior, [0, 1.35, 5], [5.8, .38, 2.25], white);
      box(interior, [0, 1.05, 5], [4.8, .25, 1.65], black);
      cyl(interior, [-2.35, .65, 5], .18, 1.4, steel);
      cyl(interior, [2.35, .65, 5], .18, 1.4, steel);
      box(interior, [0, 2.1, 3.9], [6.1, .15, .12], cyan);

      // Diagnostic monitor + holographic AI panel.
      box(interior, [6.4, 3.6, 3.4], [3.8, 3.1, .28], black);
      box(interior, [6.4, 3.6, 3.22], [3.25, 2.55, .05], cyanSoft);
      box(interior, [6.4, 1.75, 3.5], [.18, 3.5, .18], steel);
      box(interior, [6.4, .25, 3.5], [1.7, .16, 1.1], steel);
      const holo = new THREE.Mesh(new THREE.TorusGeometry(1.55, .035, 8, 64), new THREE.MeshBasicMaterial({ color: 0x36e2ff, transparent: true, opacity: .8 }));
      holo.position.set(-6.1, 4.1, 4.2); holo.rotation.x = Math.PI / 2; interior.add(holo);
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * Math.PI * 2;
        sphere(interior, [-6.1 + Math.cos(a) * 1.25, 4.1 + Math.sin(a) * 1.25, 4.2], .055, cyan, 12);
      }

      // Medical robot arm.
      const robotBase = new THREE.Group(); robotBase.position.set(4.2, .25, 6.7); robotGroup.add(robotBase);
      cyl(robotBase, [0, .55, 0], 1.05, 1.1, black, 24);
      cyl(robotBase, [0, 1.2, 0], .65, .28, steel, 24);
      const upper = new THREE.Group(); upper.position.set(0, 1.35, 0); robotBase.add(upper);
      box(upper, [0, 1.5, 0], [.45, 3.0, .45], steel);
      const elbow = new THREE.Group(); elbow.position.set(0, 2.9, 0); upper.add(elbow);
      elbow.rotation.z = -.45;
      box(elbow, [0, 1.25, 0], [.38, 2.5, .38], steel);
      cyl(elbow, [0, 2.55, 0], .32, .25, cyan, 20);
      box(elbow, [0, 2.9, 0], [.8, .3, .8], black);
      cyl(elbow, [0, 3.15, 0], .13, .65, cyan, 16);

      // Patient, built from articulated primitives.
      const patient = new THREE.Group(); patient.position.set(-7, .9, 7); patientGroup.add(patient);
      const torso = box(patient, [0, 1.25, 0], [1.0, 1.5, .55], fabric);
      sphere(patient, [0, 2.35, 0], .38, skin, 20);
      box(patient, [-.27, .25, 0], [.35, 1.0, .4], darkFabric);
      box(patient, [.27, .25, 0], [.35, 1.0, .4], darkFabric);
      box(patient, [-.27, -.32, -.12], [.42, .2, .65], black);
      box(patient, [.27, -.32, -.12], [.42, .2, .65], black);
      const armA = box(patient, [-.72, 1.25, 0], [.22, 1.15, .24], skin);
      const armB = box(patient, [.72, 1.25, 0], [.22, 1.15, .24], skin);
      torso.castShadow = armA.castShadow = armB.castShadow = !mobile;

      // Floating medical data ribbons.
      for (let i = 0; i < 5; i++) {
        const pts: V3[] = [];
        for (let j = 0; j < 18; j++) pts.push([-8 + j * .45, 4.8 + i * .55 + Math.sin(j * .7) * .12, 7.2]);
        line(interior, pts, i % 2 ? violet : cyan);
      }

      // Atmospheric particles.
      const count = mobile ? 180 : 420;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - .5) * 65;
        positions[i * 3 + 1] = Math.random() * 18 + .3;
        positions[i * 3 + 2] = (Math.random() - .5) * 48;
      }
      const particleGeometry = new THREE.BufferGeometry(); particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({ color: 0x66ddff, size: mobile ? .035 : .045, transparent: true, opacity: .55, sizeAttenuation: true });
      const particles = new THREE.Points(particleGeometry, particleMaterial); scene.add(particles);

      const clock = new THREE.Clock();
      const look = new THREE.Vector3();
      const target = new THREE.Vector3();

      const resize = () => {
        const width = Math.max(1, mount.clientWidth);
        const height = Math.max(1, mount.clientHeight);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };
      window.addEventListener('resize', resize);
      resize();

      const animate = () => {
        if (dead) return;
        const t = clock.getElapsedTime();
        const phase = (t % 34) / 34;

        doorL.position.x = -1.65 - Math.max(0, Math.sin(t * .55)) * .65;
        doorR.position.x = 1.65 + Math.max(0, Math.sin(t * .55)) * .65;
        holo.rotation.z = t * .35;
        holo.rotation.y = Math.sin(t * .7) * .3;
        particles.rotation.y = t * .008;
        patient.position.x = -7 + Math.min(1, phase * 3.2) * 5.2;
        patient.position.z = 7 - Math.min(1, phase * 3.2) * 2.2;
        patient.position.y = .9 + Math.sin(t * 2.1) * .025;
        patient.rotation.y = Math.sin(t * 1.2) * .04;
        robotBase.rotation.y = Math.sin(t * .65) * .2;
        elbow.rotation.z = -.45 + Math.sin(t * .8) * .16;
        cyanLight.intensity = (mobile ? 9 : 16) + Math.sin(t * 1.7) * 2;
        violetLight.intensity = (mobile ? 6 : 10) + Math.sin(t * 1.2 + 1) * 2;

        // Slow cinematic orbit with a deliberate push-in around the entrance.
        const orbit = phase * Math.PI * 2;
        const radius = 31 - Math.sin(phase * Math.PI) * 6;
        const desired = new THREE.Vector3(Math.cos(orbit) * radius, 8.2 + Math.sin(phase * Math.PI) * 2.5, Math.sin(orbit) * radius - 1);
        camera.position.lerp(desired, .025);
        target.set(0, 4.1, -2 + Math.sin(phase * Math.PI * 2) * 1.5);
        look.lerp(target, .035);
        camera.lookAt(look);
        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      animate();

      return () => {
        dead = true;
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(raf);
        renderer.dispose();
        scene.traverse(object => {
          const mesh = object as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          const materialValue = mesh.material;
          if (Array.isArray(materialValue)) materialValue.forEach(m => m.dispose());
          else if (materialValue) materialValue.dispose();
        });
        if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
      };
    } catch (exception) {
      console.error('Biomedical Future Scene initialization failed:', exception);
      setError(true);
      return () => { dead = true; cancelAnimationFrame(raf); };
    }
  }, []);

  return (
    <section className="biomedical-future-scene" aria-label="Biomedical City — futuristic biomedical environment">
      <div ref={mountRef} className="biomedical-future-canvas" />
      {error && <div className="future-scene-error">Biomedical City 3D could not initialize. Please reload the page.</div>}
      <div className="future-scene-overlay">
        <span>BIOMEDICAL CITY • 2035</span>
        <strong>THE FUTURE OF HEALTHCARE</strong>
      </div>
    </section>
  );
};

type V3 = [number, number, number];

export default BiomedicalFutureScene;
