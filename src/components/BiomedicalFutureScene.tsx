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
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x050b10);
      scene.fog = new THREE.FogExp2(0x07131b, 0.022);

      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);

      const camera = new THREE.PerspectiveCamera(isMobile ? 46 : 40, width / height, 0.1, 120);
      camera.position.set(18, 10, 24);

      const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: false, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.15 : 1.5));
      renderer.setSize(width, height);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = !isMobile;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mount.appendChild(renderer.domElement);

      const hemi = new THREE.HemisphereLight(0x9beeff, 0x081018, 1.35);
      scene.add(hemi);

      const key = new THREE.DirectionalLight(0xcdefff, 2.3);
      key.position.set(10, 20, 8);
      key.castShadow = !isMobile;
      scene.add(key);

      const cyanLight = new THREE.PointLight(0x35e4ff, 18, 28, 2);
      cyanLight.position.set(-8, 7, 4);
      scene.add(cyanLight);

      const violetLight = new THREE.PointLight(0x8b72ff, 15, 24, 2);
      violetLight.position.set(11, 8, -4);
      scene.add(violetLight);

      const mat = (color: number, roughness = 0.5, metalness = 0.1, emissive = 0, intensity = 0) =>
        new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive, emissiveIntensity: intensity });

      const glass = mat(0x123244, 0.15, 0.8, 0x062d3c, 1.5);
      const steel = mat(0x526673, 0.28, 0.82);
      const dark = mat(0x071017, 0.22, 0.75);
      const cyan = mat(0x35e4ff, 0.2, 0.35, 0x35e4ff, 3.5);
      const violet = mat(0x8b72ff, 0.25, 0.35, 0x4c2ed8, 2.5);
      const skin = mat(0xc98e76, 0.68, 0.03);
      const white = mat(0xdffaff, 0.3, 0.45, 0x5adfff, 1.2);

      const box = (size: V3, position: V3, material: THREE.Material, parent = scene) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
        mesh.position.set(...position);
        mesh.castShadow = !isMobile;
        mesh.receiveShadow = !isMobile;
        parent.add(mesh);
        return mesh;
      };

      const cylinder = (radius: number, heightValue: number, position: V3, material: THREE.Material, parent = scene, segments = 24) => {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, heightValue, segments), material);
        mesh.position.set(...position);
        mesh.castShadow = !isMobile;
        mesh.receiveShadow = !isMobile;
        parent.add(mesh);
        return mesh;
      };

      const sphere = (radius: number, position: V3, material: THREE.Material, parent = scene, segments = 24) => {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), material);
        mesh.position.set(...position);
        mesh.castShadow = !isMobile;
        mesh.receiveShadow = !isMobile;
        parent.add(mesh);
        return mesh;
      };

      // Ground / smart-city plaza.
      box([44, 0.35, 34], [0, -0.2, 0], dark);
      const grid = new THREE.GridHelper(42, 42, 0x184b5b, 0x0c2631);
      grid.position.y = 0.01;
      scene.add(grid);

      // Main hospital tower.
      const hospital = new THREE.Group();
      hospital.position.set(-2, 0, -3);
      scene.add(hospital);
      box([10, 16, 8], [0, 8, 0], dark, hospital);
      box([9.2, 14.8, 7.2], [0, 8.1, 0], glass, hospital);
      box([10.8, 0.45, 8.8], [0, 16.2, 0], steel, hospital);
      box([10.8, 0.35, 8.8], [0, 0.2, 0], steel, hospital);

      for (let y = 1.4; y < 15.2; y += 1.45) {
        for (let x = -3.5; x <= 3.5; x += 1.75) {
          const window = box([1.15, 0.82, 0.08], [x, y, 3.64], cyan, hospital);
          window.scale.z = 0.6;
        }
      }

      const hospitalCore = cylinder(1.8, 18, [0, 9, 0], dark, hospital, 8);
      hospitalCore.scale.x = 0.65;
      hospitalCore.scale.z = 0.65;
      cylinder(1.95, 0.18, [0, 17.2, 0], cyan, hospital, 32);

      // Research towers.
      const tower1 = new THREE.Group();
      tower1.position.set(10, 0, -7);
      scene.add(tower1);
      box([5, 11, 5], [0, 5.5, 0], steel, tower1);
      box([4.2, 9.8, 4.2], [0, 5.6, 0], glass, tower1);
      for (let y = 1.4; y < 10; y += 1.4) box([3.2, 0.7, 0.08], [0, y, 2.12], cyan, tower1);

      const tower2 = new THREE.Group();
      tower2.position.set(-12, 0, -8);
      scene.add(tower2);
      box([5.5, 9, 5.5], [0, 4.5, 0], dark, tower2);
      box([4.7, 7.8, 4.7], [0, 4.6, 0], glass, tower2);
      for (let y = 1.2; y < 8; y += 1.3) box([3.7, 0.65, 0.08], [0, y, 2.38], violet, tower2);

      // Entrance canopy and sliding doors.
      box([7.5, 0.35, 4], [-2, 2.6, 4.8], steel);
      box([7, 0.14, 3.6], [-2, 2.82, 4.8], cyan);
      const doorLeft = box([2.2, 3.2, 0.18], [-4.15, 1.6, 5.0], glass);
      const doorRight = box([2.2, 3.2, 0.18], [0.15, 1.6, 5.0], glass);

      // Diagnostic bay.
      const bay = new THREE.Group();
      bay.position.set(-2, 0.25, 8);
      scene.add(bay);
      box([7.5, 0.25, 5.2], [0, 0, 0], steel, bay);
      box([0.25, 3.5, 5.2], [-3.7, 1.75, 0], steel, bay);
      box([0.25, 3.5, 5.2], [3.7, 1.75, 0], steel, bay);
      box([7.2, 0.2, 0.2], [0, 3.5, -2.5], cyan, bay);

      // Exam bed.
      box([3.2, 0.35, 1.25], [-0.6, 1.1, 0], white, bay);
      box([0.5, 0.8, 0.5], [-1.75, 0.7, 0], steel, bay);
      box([0.5, 0.8, 0.5], [0.55, 0.7, 0], steel, bay);
      box([0.3, 1.2, 1.25], [-2.15, 1.55, 0], steel, bay);

      // Diagnostic monitor.
      const monitor = new THREE.Group();
      monitor.position.set(2.35, 2.4, 0);
      bay.add(monitor);
      box([1.9, 1.3, 0.14], [0, 0, 0], dark, monitor);
      box([1.55, 0.92, 0.06], [0, 0.02, 0.08], cyan, monitor);
      box([0.16, 1.25, 0.16], [0, -0.95, 0], steel, monitor);
      box([0.8, 0.16, 0.6], [0, -1.56, 0], steel, monitor);

      // Holographic AI ring and nodes.
      const holo = new THREE.Group();
      holo.position.set(-0.3, 4.2, 0);
      bay.add(holo);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.07, 12, 72), cyan);
      ring.rotation.x = Math.PI / 2;
      holo.add(ring);
      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.045, 10, 64), violet);
      ring2.rotation.x = Math.PI / 2;
      holo.add(ring2);
      const nodes: THREE.Mesh[] = [];
      for (let i = 0; i < 10; i += 1) {
        const angle = (i / 10) * Math.PI * 2;
        const node = sphere(0.09, [Math.cos(angle) * 1.85, 0, Math.sin(angle) * 1.85], cyan, holo, 12);
        nodes.push(node);
      }
      const core = sphere(0.38, [0, 0, 0], violet, holo, 20);

      // Medical robot arm.
      const robot = new THREE.Group();
      robot.position.set(5.2, 0.3, 7.2);
      scene.add(robot);
      cylinder(0.8, 0.5, [0, 0.25, 0], steel, robot, 32);
      const arm1 = new THREE.Group();
      arm1.position.set(0, 0.5, 0);
      robot.add(arm1);
      box([0.42, 2.8, 0.42], [0, 1.4, 0], steel, arm1);
      cylinder(0.48, 0.35, [0, 2.85, 0], cyan, arm1, 24);
      const arm2 = new THREE.Group();
      arm2.position.set(0, 2.85, 0);
      arm1.add(arm2);
      box([0.36, 2.3, 0.36], [0, 1.15, 0], steel, arm2);
      cylinder(0.4, 0.3, [0, 2.3, 0], cyan, arm2, 24);
      const gripper = new THREE.Group();
      gripper.position.set(0, 2.42, 0);
      arm2.add(gripper);
      box([0.16, 0.65, 0.16], [-0.18, -0.2, 0], white, gripper);
      box([0.16, 0.65, 0.16], [0.18, -0.2, 0], white, gripper);

      // Patient.
      const patient = new THREE.Group();
      patient.position.set(-0.8, 1.5, 8);
      scene.add(patient);
      sphere(0.36, [0, 1.55, 0], skin, patient, 20);
      box([0.7, 1.25, 0.38], [0, 0.8, 0], white, patient);
      box([0.25, 1.05, 0.25], [-0.55, 0.1, 0], skin, patient);
      box([0.25, 1.05, 0.25], [0.55, 0.1, 0], skin, patient);
      box([0.22, 1.05, 0.22], [-0.2, -0.75, 0], skin, patient);
      box([0.22, 1.05, 0.22], [0.2, -0.75, 0], skin, patient);

      // Floating medical data ribbons.
      const ribbons: THREE.Mesh[] = [];
      for (let i = 0; i < 6; i += 1) {
        const ribbon = new THREE.Mesh(new THREE.TorusGeometry(2.6 + i * 0.4, 0.025, 6, 100), i % 2 ? violet : cyan);
        ribbon.rotation.x = Math.PI / 2 + i * 0.08;
        ribbon.rotation.z = i * 0.22;
        ribbon.position.set(0, 5 + i * 0.55, -1);
        scene.add(ribbon);
        ribbons.push(ribbon);
      }

      // Ambient particles.
      const particleCount = isMobile ? 320 : 700;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i += 1) {
        positions[i * 3] = (Math.random() - 0.5) * 38;
        positions[i * 3 + 1] = Math.random() * 18 + 0.3;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      }
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({ color: 0x56ddff, size: isMobile ? 0.035 : 0.045, transparent: true, opacity: 0.7, sizeAttenuation: true });
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      const clock = new THREE.Clock();
      const initialCamera = camera.position.clone();

      const animate = () => {
        if (dead) return;
        raf = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        doorLeft.position.x = -4.15 - Math.min(0.7, elapsed * 0.06);
        doorRight.position.x = 0.15 + Math.min(0.7, elapsed * 0.06);
        ring.rotation.z = elapsed * 0.25;
        ring2.rotation.z = -elapsed * 0.38;
        core.scale.setScalar(1 + Math.sin(elapsed * 2.5) * 0.12);
        nodes.forEach((node, index) => {
          node.position.y = Math.sin(elapsed * 1.6 + index) * 0.18;
        });
        arm1.rotation.z = Math.sin(elapsed * 0.55) * 0.16;
        arm2.rotation.z = Math.sin(elapsed * 0.7 + 1) * 0.24;
        patient.rotation.y = Math.sin(elapsed * 0.45) * 0.08;
        ribbons.forEach((ribbon, index) => {
          ribbon.rotation.y = elapsed * (0.08 + index * 0.012);
          ribbon.position.y += Math.sin(elapsed * 0.6 + index) * 0.0008;
        });
        particles.rotation.y = elapsed * 0.008;

        const orbit = elapsed * 0.055;
        const radius = isMobile ? 27 : 31;
        camera.position.x = initialCamera.x + Math.sin(orbit) * 3.5;
        camera.position.y = initialCamera.y + Math.sin(elapsed * 0.18) * 0.65;
        camera.position.z = radius + Math.cos(orbit) * 2.5;
        camera.lookAt(-1, 6.2, 0);

        cyanLight.intensity = 16 + Math.sin(elapsed * 1.7) * 2.5;
        violetLight.intensity = 13 + Math.sin(elapsed * 1.2 + 1) * 2;
        renderer.render(scene, camera);
      };

      const onResize = () => {
        const nextWidth = Math.max(1, mount.clientWidth);
        const nextHeight = Math.max(1, mount.clientHeight);
        camera.aspect = nextWidth / nextHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(nextWidth, nextHeight);
      };

      window.addEventListener('resize', onResize);
      animate();

      return () => {
        dead = true;
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const material = object.material;
            if (Array.isArray(material)) material.forEach((item) => item.dispose());
            else material.dispose();
          }
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
