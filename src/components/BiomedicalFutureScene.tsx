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
    let dead = false;
    let raf = 0;

    try {
      const mobile = window.matchMedia('(max-width: 768px)').matches;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x041017);
      scene.fog = new THREE.FogExp2(0x071c25, mobile ? 0.021 : 0.0105);
      const camera = new THREE.PerspectiveCamera(mobile ? 50 : 43, 1, 0.1, 220);
      const renderer = new THREE.WebGLRenderer({ antialias: !mobile, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.15 : 1.35));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = !mobile;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mount.innerHTML = '';
      mount.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xdaf8ff, 0x041017, 2.5));
      const key = new THREE.DirectionalLight(0xffffff, 3.2);
      key.position.set(8, 28, 18);
      key.castShadow = !mobile;
      if (!mobile) key.shadow.mapSize.set(1024, 1024);
      scene.add(key);
      const cyanLight = new THREE.PointLight(0x20e5ff, mobile ? 11 : 20, 68);
      cyanLight.position.set(-16, 9, 12);
      scene.add(cyanLight);
      const violetLight = new THREE.PointLight(0x765cff, mobile ? 7 : 13, 62);
      violetLight.position.set(18, 10, -8);
      scene.add(violetLight);
      const greenLight = new THREE.PointLight(0x52ffb1, mobile ? 5 : 9, 48);
      greenLight.position.set(-4, 8, -16);
      scene.add(greenLight);

      const city = new THREE.Group();
      const tech = new THREE.Group();
      const people = new THREE.Group();
      scene.add(city, tech, people);

      const mat = (color: number, roughness = .45, metalness = .2, emissive = 0, intensity = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive, emissiveIntensity: intensity });
      const dark = mat(0x12252d, .34, .82);
      const graphite = mat(0x27434b, .38, .66);
      const steel = mat(0xc4d3d6, .2, .9);
      const white = mat(0xeaf7f8, .62, .08);
      const cyan = mat(0x39e7ff, .18, .35, 0x12cbe7, 4);
      const cyanSoft = mat(0x168ba2, .34, .3, 0x086274, 2);
      const violet = mat(0x957fff, .22, .42, 0x573de9, 3);
      const green = mat(0x55ffb4, .24, .28, 0x19d18a, 3);
      const red = mat(0xff5574, .32, .16, 0xc51d42, 2.5);
      const robotDark = mat(0x0d1a20, .2, .94);
      const robotWhite = mat(0xd9e8ea, .25, .76);
      const skin = mat(0xc9917c, .7, .02);
      const blue = mat(0x28638e, .5, .25);

      const glass = new THREE.MeshPhysicalMaterial({ color: 0x55cce1, roughness: .08, metalness: .15, transmission: .35, transparent: true, opacity: .23, side: THREE.DoubleSide, emissive: 0x073b48, emissiveIntensity: 1.1 });
      const doorGlass = new THREE.MeshPhysicalMaterial({ color: 0x7defff, roughness: .05, metalness: .12, transmission: .55, transparent: true, opacity: .2, side: THREE.DoubleSide, depthWrite: false, emissive: 0x0b5a6d, emissiveIntensity: 1.6 });

      const box = (parent: THREE.Object3D, pos: V3, size: V3, material: THREE.Material) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
        mesh.position.set(...pos);
        mesh.castShadow = !mobile;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
      };
      const cyl = (parent: THREE.Object3D, pos: V3, radius: number, height: number, material: THREE.Material, segments = 16) => {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, segments), material);
        mesh.position.set(...pos);
        mesh.castShadow = !mobile;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
      };
      const sphere = (parent: THREE.Object3D, pos: V3, radius: number, material: THREE.Material, segments = 16) => {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, Math.max(10, segments - 4)), material);
        mesh.position.set(...pos);
        mesh.castShadow = !mobile;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
      };
      const line = (parent: THREE.Object3D, points: V3[], material: THREE.Material) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(points.map((point) => new THREE.Vector3(...point)));
        const mesh = new THREE.Line(geometry, material);
        parent.add(mesh);
        return mesh;
      };

      box(city, [0, -.55, 0], [82, 1, 62], dark);
      box(city, [0, .02, 0], [78, .08, 58], graphite);
      for (let z = -27; z <= 27; z += 4) box(city, [0, .09, z], [76, .018, .018], cyanSoft);
      for (let x = -36; x <= 36; x += 4) box(city, [x, .09, 0], [.018, .018, 56], cyanSoft);
      box(city, [0, .17, 6], [62, .06, 5], dark);
      box(city, [0, .23, 6], [61, .035, .07], cyan);

      const tower = (x: number, z: number, h: number, width: number) => {
        const building = new THREE.Group();
        building.position.set(x, 0, z);
        city.add(building);
        box(building, [0, h / 2, 0], [width, h, width * .72], dark);
        box(building, [0, h * .58, -width * .37], [width * .72, h * .62, .045], glass);
        for (let y = 1.2; y < h - .4; y += 2.1) box(building, [0, y, -width * .405], [width * .62, .07, .04], cyanSoft);
        box(building, [0, h + .12, 0], [width + .35, .08, width * .75], cyan);
      };
      tower(-28, -14, 18, 6);
      tower(28, -14, 22, 7);
      tower(-26, 4, 12, 5);
      tower(26, 5, 15, 5);

      function createTextPanel(title: string, subtitle: string, width: number, height: number) {
        const group = new THREE.Group();
        const canvas = document.createElement('canvas');
        canvas.width = 768;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'rgba(3,20,28,.76)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = '#62eaff';
          ctx.lineWidth = 3;
          ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
          ctx.font = '700 34px Arial';
          ctx.fillStyle = '#7eeeff';
          ctx.fillText(title, 34, 54);
          ctx.font = '600 19px Arial';
          ctx.fillStyle = '#bdebf2';
          ctx.fillText(subtitle, 34, 88);
          ctx.strokeStyle = '#49e6ff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          const points = [[0, 0], [15, 0], [22, -28], [31, 8], [42, 0], [56, 0], [63, -24], [72, 6], [90, 0], [105, 0]];
          points.forEach(([x, y], index) => index === 0 ? ctx.moveTo(40 + x * 5, 146 + y) : ctx.lineTo(40 + x * 5, 146 + y));
          ctx.stroke();
          ctx.font = '700 17px Arial';
          ctx.fillStyle = '#55ffb4';
          ctx.fillText('HR 72 BPM', 36, 218);
          ctx.fillText('SpO₂ 98%', 200, 218);
          ctx.fillStyle = '#957fff';
          ctx.fillText('AI CONFIDENCE 97.4%', 370, 218);
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: .88, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
        group.add(screen);
        const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(width, height, .02)), new THREE.LineBasicMaterial({ color: 0x65edff, transparent: true, opacity: .75 }));
        group.add(frame);
        group.userData.material = material;
        return group;
      }

      const entrance = new THREE.Group();
      entrance.position.set(0, 0, -20);
      city.add(entrance);
      box(entrance, [0, .6, 0], [28, 1.1, 9], dark);
      box(entrance, [-14, 6, 0], [.35, 12, 9], graphite);
      box(entrance, [14, 6, 0], [.35, 12, 9], graphite);
      box(entrance, [0, 12, 0], [28, .35, 9], graphite);
      box(entrance, [0, 6, 4.45], [27, 11.5, .08], glass);
      for (let x = -12; x <= 12; x += 4) box(entrance, [x, 6, 4.55], [.08, 11, .08], cyanSoft);
      box(entrance, [0, 12.2, 0], [30, .08, 10], cyan);
      const entranceLeft = box(entrance, [-2.15, 3.5, 4.5], [4.1, 6.8, .08], doorGlass);
      const entranceRight = box(entrance, [2.15, 3.5, 4.5], [4.1, 6.8, .08], doorGlass);
      box(entrance, [-4.25, 3.5, 4.48], [.07, 6.9, .12], cyan);
      box(entrance, [4.25, 3.5, 4.48], [.07, 6.9, .12], cyan);
      box(entrance, [0, 7.05, 4.48], [8.55, .07, .12], cyan);
      const entranceDoor: Door = { left: entranceLeft, right: entranceRight };
      const entranceSign = createTextPanel('BIOMEDICAL RESEARCH CENTER', 'ROBOTICS  ·  AI  ·  IMAGING  ·  BIOENGINEERING', 7.8, 1.55);
      entranceSign.position.set(0, 9.4, 4.25);
      entranceSign.rotation.y = Math.PI;
      entrance.add(entranceSign);

      const createSlidingDoors = (parent: THREE.Object3D, z: number, width: number, height: number): Door => {
        const group = new THREE.Group();
        group.position.z = z;
        parent.add(group);
        box(group, [0, height + .12, 0], [width, .09, .08], steel);
        const left = box(group, [-width * .2, height / 2, 0], [width * .38, height, .08], doorGlass);
        const right = box(group, [width * .2, height / 2, 0], [width * .38, height, .08], doorGlass);
        box(group, [-width * .4, height / 2, -.04], [.05, height, .1], cyan);
        box(group, [width * .4, height / 2, -.04], [.05, height, .1], cyan);
        return { left, right };
      };

      const surgery = new THREE.Group();
      surgery.position.set(-14, 0, 8);
      tech.add(surgery);
      box(surgery, [0, .55, 0], [12, .3, 8], graphite);
      box(surgery, [-5.7, 3.3, 0], [.25, 6.6, 8], graphite);
      box(surgery, [5.7, 3.3, 0], [.25, 6.6, 8], graphite);
      box(surgery, [0, 6.5, 0], [12, .25, 8], graphite);
      box(surgery, [0, 3.3, -3.9], [12, 6.4, .12], glass);
      const surgeryDoors = createSlidingDoors(surgery, 4.02, 6.2, 4.9);
      box(surgery, [0, 1.05, 0], [6, .35, 2.5], white);
      box(surgery, [0, 1.34, 0], [4.8, .2, 1.6], robotDark);
      const surgicalJoints: THREE.Object3D[] = [];
      const surgicalTips: THREE.Object3D[] = [];
      const armPositions: Array<[number, number]> = [[-3, -2.25], [-3, 2.25], [3, -2.25], [3, 2.25]];
      armPositions.forEach(([x, z], index) => {
        const arm = new THREE.Group();
        arm.position.set(x, 1.25, z);
        surgery.add(arm);
        cyl(arm, [0, .65, 0], .62, 1.3, robotDark, 20);
        const shoulder = new THREE.Group();
        shoulder.position.y = 1.35;
        shoulder.rotation.z = x > 0 ? -.62 : .62;
        arm.add(shoulder);
        cyl(shoulder, [0, 0, 0], .25, .22, cyan, 16);
        box(shoulder, [0, .95, 0], [.34, 1.9, .34], robotWhite);
        const elbow = new THREE.Group();
        elbow.position.y = 1.9;
        elbow.rotation.z = index % 2 ? .55 : -.55;
        shoulder.add(elbow);
        cyl(elbow, [0, 0, 0], .2, .18, violet, 14);
        box(elbow, [0, .8, 0], [.28, 1.6, .28], robotWhite);
        const wrist = new THREE.Group();
        wrist.position.y = 1.62;
        elbow.add(wrist);
        cyl(wrist, [0, .12, 0], .16, .2, cyan, 12);
        box(wrist, [0, .5, 0], [.22, .8, .22], steel);
        surgicalJoints.push(shoulder, elbow, wrist);
        surgicalTips.push(cyl(wrist, [0, .94, 0], .055, .45, cyan, 10));
      });
      const surgeryScreen = createTextPanel('SURGICAL ROBOT', 'PRECISION ASSIST // STERILE ZONE', 4.7, 1.55);
      surgeryScreen.position.set(0, 5.25, -3.82);
      surgery.add(surgeryScreen);
      const surgeryLight = new THREE.PointLight(0xffffff, mobile ? 4 : 8, 12);
      surgeryLight.position.set(0, 5.5, 0);
      surgery.add(surgeryLight);

      const imaging = new THREE.Group();
      imaging.position.set(0, 0, 12);
      tech.add(imaging);
      cyl(imaging, [0, 2.5, 0], 3.1, 1.1, robotDark, 48);
      const scanRing = new THREE.Mesh(new THREE.TorusGeometry(3, .17, 16, 64), cyan);
      scanRing.position.set(0, 2.5, 0);
      scanRing.rotation.y = Math.PI / 2;
      imaging.add(scanRing);
      const scanCore = new THREE.Mesh(new THREE.TorusGeometry(2.35, .05, 10, 64), violet);
      scanCore.position.set(0, 2.5, 0);
      scanCore.rotation.y = Math.PI / 2;
      imaging.add(scanCore);
      box(imaging, [0, 1.05, 0], [8, .25, 3.7], white);
      const holoBody = new THREE.Group();
      holoBody.position.set(0, 4.25, 0);
      imaging.add(holoBody);
      sphere(holoBody, [0, 1.05, 0], .45, cyan, 16);
      box(holoBody, [0, 0, 0], [.82, 1.7, .4], cyan);
      for (let y = -.8; y <= .8; y += .22) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(.56 - Math.abs(y) * .09, .024, 6, 32), violet);
        ring.position.y = y;
        ring.rotation.x = Math.PI / 2;
        holoBody.add(ring);
      }
      const scanBeam = new THREE.Mesh(new THREE.BoxGeometry(4.9, .025, 2.9), new THREE.MeshBasicMaterial({ color: 0x52f2ff, transparent: true, opacity: .16, depthWrite: false, blending: THREE.AdditiveBlending }));
      scanBeam.position.set(0, 2.3, 0);
      imaging.add(scanBeam);
      const imagingScreen = createTextPanel('IMAGING / CT-MRI', '3D ANATOMICAL RECONSTRUCTION', 5.2, 1.7);
      imagingScreen.position.set(-4.3, 5.4, 0);
      imagingScreen.rotation.y = .15;
      imaging.add(imagingScreen);

      const ai = new THREE.Group();
      ai.position.set(15, 0, 7);
      tech.add(ai);
      box(ai, [0, 4.3, 0], [11, 8.6, .32], graphite);
      box(ai, [0, 4.3, -.2], [10.2, 7.8, .04], dark);
      const aiScreen = createTextPanel('AI DIAGNOSTICS', 'LIVE PATIENT TELEMETRY // NEURAL ANALYSIS', 8.2, 2.8);
      aiScreen.position.set(0, 4.3, -.42);
      ai.add(aiScreen);
      const aiNodes: THREE.Mesh[] = [];
      for (let i = 0; i < 12; i++) aiNodes.push(sphere(ai, [-4 + (i % 4) * 2.7, 1.4 + Math.floor(i / 4) * 1.4, -.45], .075, i % 2 ? violet : cyan, 8) as THREE.Mesh);
      for (let i = 0; i < aiNodes.length - 4; i++) line(ai, [[aiNodes[i].position.x, aiNodes[i].position.y, -.44], [aiNodes[i + 4].position.x, aiNodes[i + 4].position.y, -.44]], cyanSoft);

      const lab = new THREE.Group();
      lab.position.set(-23, 0, 1);
      tech.add(lab);
      box(lab, [0, .55, 0], [10, .3, 6], graphite);
      box(lab, [-4.8, 3.1, 0], [.2, 5.8, 6], graphite);
      box(lab, [4.8, 3.1, 0], [.2, 5.8, 6], graphite);
      box(lab, [0, 5.9, 0], [10, .2, 6], graphite);
      box(lab, [0, 3.1, -2.95], [10, 5.8, .08], glass);
      const labDoors = createSlidingDoors(lab, 3.02, 4.6, 4.2);
      box(lab, [0, 1.15, 0], [8, .3, 4.5], robotDark);
      const carousel = new THREE.Group();
      carousel.position.set(0, 1.5, 0);
      lab.add(carousel);
      cyl(carousel, [0, 0, 0], 1.8, .2, steel, 32);
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        cyl(carousel, [Math.cos(angle) * 1.35, .38, Math.sin(angle) * 1.35], .12, .7, i % 3 === 0 ? red : cyan, 12);
      }
      const pipette = new THREE.Group();
      pipette.position.set(2.7, 2.1, 0);
      lab.add(pipette);
      box(pipette, [0, .8, 0], [.22, 1.7, .22], steel);
      cyl(pipette, [0, 1.7, 0], .13, .28, cyan, 12);

      const humanoid = new THREE.Group();
      humanoid.position.set(-2.7, .9, -1.55);
      lab.add(humanoid);
      cyl(humanoid, [0, 2.25, 0], .55, 1.25, robotWhite, 16);
      sphere(humanoid, [0, 3.15, 0], .46, robotDark, 16);
      box(humanoid, [0, 3.16, -.43], [.45, .12, .04], cyan);
      box(humanoid, [0, 2.55, -.48], [.28, .35, .05], green);
      const humArmL = new THREE.Group();
      const humArmR = new THREE.Group();
      humArmL.position.set(-.62, 2.55, 0);
      humArmR.position.set(.62, 2.55, 0);
      humanoid.add(humArmL, humArmR);
      box(humArmL, [0, -.55, 0], [.24, 1.1, .24], robotWhite);
      box(humArmR, [0, -.55, 0], [.24, 1.1, .24], robotWhite);
      sphere(humanoid, [-.62, 1.92, 0], .14, cyan, 10);
      sphere(humanoid, [.62, 1.92, 0], .14, cyan, 10);
      box(humanoid, [-.23, .65, 0], [.28, 1.2, .28], robotWhite);
      box(humanoid, [.23, .65, 0], [.28, 1.2, .28], robotWhite);
      const labScreen = createTextPanel('LAB ROBOT / UNIT 07', 'AUTONOMOUS SAMPLE HANDLING', 4.8, 1.6);
      labScreen.position.set(0, 4.8, -2.9);
      labScreen.rotation.y = Math.PI;
      lab.add(labScreen);

      const rehab = new THREE.Group();
      rehab.position.set(22, 0, -5);
      tech.add(rehab);
      box(rehab, [0, .55, 0], [7, .3, 5], graphite);
      box(rehab, [-3.3, 3, 0], [.18, 5.2, 5], graphite);
      box(rehab, [3.3, 3, 0], [.18, 5.2, 5], graphite);
      box(rehab, [0, 5.6, 0], [7, .2, 5], graphite);
      const prosthesis = new THREE.Group();
      prosthesis.position.set(0, .7, 0);
      rehab.add(prosthesis);
      sphere(prosthesis, [0, 2.65, 0], .62, steel, 20);
      box(prosthesis, [0, 1.55, 0], [.82, 2.2, .68], steel);
      for (let i = 0; i < 5; i++) {
        const finger = new THREE.Group();
        finger.position.set((i - 2) * .2, .2, 0);
        prosthesis.add(finger);
        box(finger, [0, -.35, 0], [.14, .8, .16], i === 1 ? green : steel);
        sphere(finger, [0, -.8, 0], .07, cyan, 8);
      }
      const rehabScreen = createTextPanel('BIONIC REHABILITATION', 'NEURAL CONTROL // MOTION ANALYSIS', 4.8, 1.55);
      rehabScreen.position.set(0, 4.6, -2.5);
      rehabScreen.rotation.y = Math.PI;
      rehab.add(rehabScreen);

      const patient = new THREE.Group();
      patient.position.set(0, .5, 8.2);
      people.add(patient);
      sphere(patient, [0, 2.65, 0], .42, skin, 18);
      box(patient, [0, 1.55, 0], [1.15, 1.7, .62], blue);
      box(patient, [-.32, .2, 0], [.38, 1.05, .42], robotDark);
      box(patient, [.32, .2, 0], [.38, 1.05, .42], robotDark);
      const wearable = cyl(patient, [0, 1.65, -.36], .14, .05, green, 14);
      wearable.rotation.x = Math.PI / 2;
      const telemetry = new THREE.Group();
      telemetry.position.set(0, 3.6, 0);
      patient.add(telemetry);
      const telemetryRing = new THREE.Mesh(new THREE.TorusGeometry(.72, .025, 8, 36), green);
      telemetry.add(telemetryRing);
      const scanHalo = new THREE.Mesh(new THREE.RingGeometry(1.15, 1.2, 48), new THREE.MeshBasicMaterial({ color: 0x58ecff, transparent: true, opacity: .32, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
      scanHalo.position.y = 1.65;
      scanHalo.rotation.x = Math.PI / 2;
      patient.add(scanHalo);

      const holo1 = createTextPanel('PATIENT STATUS', 'REMOTE MONITORING // SECURE LINK', 4.8, 1.55);
      holo1.position.set(-8, 5.8, 3.5);
      holo1.rotation.y = .25;
      scene.add(holo1);
      const holo2 = createTextPanel('GENOMIC ANALYSIS', 'DNA SEQUENCING // AI MATCH 99.1%', 4.8, 1.55);
      holo2.position.set(8, 6.6, -3.5);
      holo2.rotation.y = -.3;
      scene.add(holo2);

      const helix = new THREE.Group();
      helix.position.set(-7, 7.2, -4);
      tech.add(helix);
      for (let i = 0; i < 28; i++) {
        const y = i * .18;
        const angle = i * .55;
        const x = Math.cos(angle) * 1.05;
        const z = Math.sin(angle) * 1.05;
        sphere(helix, [x, y, z], .05, cyan, 8);
        sphere(helix, [-x, y, -z], .05, violet, 8);
        if (i % 3 === 0) line(helix, [[x, y, z], [-x, y, -z]], cyanSoft);
      }

      const beamMaterials: THREE.MeshStandardMaterial[] = [];
      const beamPairs: Array<[V3, V3]> = [
        [[-21, 4, 1], [-8, 5, 8]],
        [[-8, 5, 8], [1, 5, 12]],
        [[4, 5, 12], [14, 5, 7]],
        [[14, 5, 7], [21, 4, -5]],
      ];
      beamPairs.forEach(([a, b]) => {
        const start = new THREE.Vector3(...a);
        const end = new THREE.Vector3(...b);
        const middle = start.clone().add(end).multiplyScalar(.5);
        const length = start.distanceTo(end);
        const beam = new THREE.Mesh(new THREE.CylinderGeometry(.022, .022, length, 8), cyan);
        beam.position.copy(middle);
        beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize());
        scene.add(beam);
        beamMaterials.push(beam.material as THREE.MeshStandardMaterial);
      });

      const particleCount = mobile ? 90 : 180;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - .5) * 72;
        positions[i * 3 + 1] = .6 + Math.random() * 15;
        positions[i * 3 + 2] = (Math.random() - .5) * 54;
      }
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({ color: 0x73eaff, size: mobile ? .035 : .05, transparent: true, opacity: .48, sizeAttenuation: true });
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      const cameraPaths = [
        { p: [0, 7.2, 27] as V3, l: [0, 4.2, -16] as V3, fov: 45 },
        { p: [-22, 5.2, 17] as V3, l: [-14, 3.1, 8] as V3, fov: 40 },
        { p: [-7, 4.8, 21] as V3, l: [0, 3, 12] as V3, fov: 41 },
        { p: [12, 6.2, 18] as V3, l: [15, 4.1, 7] as V3, fov: 43 },
        { p: [25, 6.4, 3] as V3, l: [22, 3.2, -5] as V3, fov: 40 },
        { p: [-20, 5.2, -1] as V3, l: [-23, 3.1, 1] as V3, fov: 39 },
        { p: [1, 5.2, 1] as V3, l: [0, 2.9, 8] as V3, fov: 42 },
        { p: [0, 13, 25] as V3, l: [0, 3.5, 2] as V3, fov: 48 },
      ];

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
        const segmentDuration = mobile ? 8.5 : 7.2;
        const cycle = cameraPaths.length * segmentDuration;
        const phase = (t % cycle) / segmentDuration;
        const index = Math.floor(phase);
        const next = (index + 1) % cameraPaths.length;
        const blend = phase - index;
        const eased = blend * blend * (3 - 2 * blend);
        const a = cameraPaths[index];
        const b = cameraPaths[next];

        camera.position.set(
          THREE.MathUtils.lerp(a.p[0], b.p[0], eased),
          THREE.MathUtils.lerp(a.p[1], b.p[1], eased) + Math.sin(t * .55) * .16,
          THREE.MathUtils.lerp(a.p[2], b.p[2], eased),
        );
        camera.fov = THREE.MathUtils.lerp(a.fov, b.fov, eased);
        camera.updateProjectionMatrix();
        target.set(
          THREE.MathUtils.lerp(a.l[0], b.l[0], eased),
          THREE.MathUtils.lerp(a.l[1], b.l[1], eased),
          THREE.MathUtils.lerp(a.l[2], b.l[2], eased),
        );
        look.lerp(target, .1);
        camera.lookAt(look);

        const entranceOpen = THREE.MathUtils.smoothstep(Math.sin(t * .25) * .5 + .5, .35, .75);
        entranceDoor.left.position.x = THREE.MathUtils.lerp(-2.15, -4.1, entranceOpen);
        entranceDoor.right.position.x = THREE.MathUtils.lerp(2.15, 4.1, entranceOpen);
        const surgeryOpen = THREE.MathUtils.smoothstep(Math.sin(t * .33 + 1) * .5 + .5, .25, .75);
        surgeryDoors.left.position.x = THREE.MathUtils.lerp(-1.24, -2.4, surgeryOpen);
        surgeryDoors.right.position.x = THREE.MathUtils.lerp(1.24, 2.4, surgeryOpen);
        const labOpen = THREE.MathUtils.smoothstep(Math.sin(t * .29 + 2) * .5 + .5, .25, .75);
        labDoors.left.position.x = THREE.MathUtils.lerp(-.92, -1.8, labOpen);
        labDoors.right.position.x = THREE.MathUtils.lerp(.92, 1.8, labOpen);

        surgicalJoints.forEach((joint, i) => {
          joint.rotation.x = Math.sin(t * .9 + i * .7) * .06;
          joint.rotation.y += Math.sin(t * 1.3 + i) * .002;
        });
        surgicalTips.forEach((tip, i) => { tip.position.z = Math.sin(t * 1.5 + i) * .12; });

        humArmL.rotation.z = -.25 + Math.sin(t * .8) * .18;
        humArmR.rotation.z = .25 - Math.sin(t * .8 + .8) * .18;
        humanoid.rotation.y = Math.sin(t * .35) * .16;
        carousel.rotation.y = t * .65;
        pipette.rotation.z = Math.sin(t * 1.15) * .28;
        scanRing.rotation.z = t * 1.15;
        scanCore.rotation.z = -t * .75;
        scanBeam.position.y = 1.25 + (Math.sin(t * 1.5) * .5 + .5) * 2.7;
        holoBody.rotation.y = t * .75;
        telemetryRing.rotation.z = -t * 1.35;
        scanHalo.scale.setScalar(.9 + Math.sin(t * 2.2) * .1);
        helix.rotation.y = t * .45;
        particles.rotation.y = t * .006;

        aiNodes.forEach((node, i) => node.scale.setScalar(.8 + Math.sin(t * 2.3 + i) * .2));
        beamMaterials.forEach((material, i) => { material.opacity = .32 + (Math.sin(t * 2 + i) + 1) * .16; material.transparent = true; });
        [holo1, holo2, aiScreen, surgeryScreen, imagingScreen, labScreen, rehabScreen].forEach((panel, i) => {
          const material = panel.userData.material as THREE.MeshBasicMaterial | undefined;
          if (material) material.opacity = .72 + Math.sin(t * 2.1 + i) * .12;
        });
        cyanLight.intensity = (mobile ? 11 : 20) + Math.sin(t * 1.1) * 2.5;
        violetLight.intensity = (mobile ? 7 : 13) + Math.cos(t * .9) * 1.8;
        greenLight.intensity = (mobile ? 5 : 9) + Math.sin(t * 1.7) * 1.5;

        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };

      animate();
      return () => {
        dead = true;
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        particleGeometry.dispose();
        particleMaterial.dispose();
        renderer.dispose();
        mount.innerHTML = '';
      };
    } catch (e) {
      console.error('Biomedical future scene failed:', e);
      setError(true);
      return () => {
        dead = true;
        cancelAnimationFrame(raf);
      };
    }
  }, []);

  return (
    <section className="biomedical-future-scene" aria-label="Biomedical City — futuristic medical technology showcase">
      <div ref={mountRef} className="biomedical-future-canvas" />
      <div className="future-scene-overlay">
        <div className="future-scene-hud future-scene-hud-left"><span>BIOMEDICAL CITY</span><strong>RESEARCH CAMPUS // 2035</strong></div>
        <div className="future-scene-hud future-scene-hud-right"><span>LIVE SYSTEMS</span><strong>ROBOTICS · AI · IMAGING · BIOENGINEERING</strong></div>
        <div className="future-scene-title"><span>THE FUTURE OF</span><strong>HEALTHCARE</strong></div>
      </div>
      {error && <div className="future-scene-error"><strong>BIOMEDICAL CITY</strong><span>Visualisation 3D indisponible — interface médicale de secours active.</span></div>}
    </section>
  );
};

export default BiomedicalCity;
