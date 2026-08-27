import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './BiomedicalCity.scss';

type Scene = {
  title: string;
  subtitle: string;
  duration: number;
};

type V3 = [number, number, number];

const scenes: Scene[] = [
  {
    title: 'ARRIVAL',
    subtitle: 'The patient approaches the smart hospital.',
    duration: 4200,
  },
  {
    title: 'ENTRY',
    subtitle: 'The automatic doors open and the patient enters.',
    duration: 3800,
  },
  {
    title: 'CHECK-IN',
    subtitle: 'The patient is registered at the biometric station.',
    duration: 5000,
  },
  {
    title: 'EXAMINATION',
    subtitle: 'The patient is positioned correctly on the examination bed.',
    duration: 5200,
  },
  {
    title: 'BIOSIGNALS',
    subtitle: 'ECG, oxygen saturation and temperature are monitored live.',
    duration: 6200,
  },
  {
    title: 'AI ANALYSIS',
    subtitle: 'Artificial intelligence analyses the patient data in real time.',
    duration: 6200,
  },
  {
    title: 'ROBOTIC ASSIST',
    subtitle: 'A medical robot assists the examination.',
    duration: 5200,
  },
  {
    title: 'RESULT',
    subtitle: 'The clinical assessment is stable and reassuring.',
    duration: 3600,
  },
  {
    title: 'JOY',
    subtitle: 'The patient gets up after the examination.',
    duration: 4500,
  },
  {
    title: 'SIGNATURE',
    subtitle: 'Engineering technology for better healthcare.',
    duration: 4200,
  },
];

const totalDuration = scenes.reduce(
  (sum, scene) => sum + scene.duration,
  0
);

const clamp = (value: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, value));

const ease = (value: number) =>
  value * value * (3 - 2 * value);

const BiomedicalCity: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const timeline = useRef(0);
  const paused = useRef(false);

  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    let dead = false;
    let raf = 0;

    try {
      /* =========================================================
         THREE.JS SCENE
      ========================================================= */

      const scene = new THREE.Scene();

      scene.background = new THREE.Color(0x071116);

      scene.fog = new THREE.Fog(
        0x071116,
        34,
        110
      );

      const camera = new THREE.PerspectiveCamera(
        42,
        1,
        0.1,
        160
      );

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      });

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 1.5)
      );

      renderer.outputColorSpace = THREE.SRGBColorSpace;

      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;

      mount.innerHTML = '';
      mount.appendChild(renderer.domElement);

      /* =========================================================
         LIGHTING
      ========================================================= */

      scene.add(
        new THREE.HemisphereLight(
          0xf5fbff,
          0x1a2529,
          2.7
        )
      );

      const key = new THREE.DirectionalLight(
        0xffffff,
        3.2
      );

      key.position.set(12, 18, 14);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);

      scene.add(key);

      const cyanLight = new THREE.PointLight(
        0x39dfff,
        16,
        50
      );

      cyanLight.position.set(
        -8,
        7,
        10
      );

      scene.add(cyanLight);

      const greenLight = new THREE.PointLight(
        0x42e59a,
        9,
        30
      );

      greenLight.position.set(
        8,
        5,
        -5
      );

      scene.add(greenLight);

      /* =========================================================
         GROUPS
      ========================================================= */

      const groups: Record<string, THREE.Group> = {};

      [
        'hospital',
        'entry',
        'reception',
        'exam',
        'patient',
        'monitor',
        'analysis',
        'robot',
        'result',
      ].forEach((name) => {
        groups[name] = new THREE.Group();
        scene.add(groups[name]);
      });

      /* =========================================================
         MATERIALS
      ========================================================= */

      const material = (
        color: number,
        roughness = 0.5,
        metalness = 0.15,
        emissive = 0,
        intensity = 0
      ) =>
        new THREE.MeshStandardMaterial({
          color,
          roughness,
          metalness,
          emissive,
          emissiveIntensity: intensity,
        });

      const floor = material(
        0x465257,
        0.88,
        0.04
      );

      const wall = material(
        0xd9dedc,
        0.84,
        0.02
      );

      const dark = material(
        0x101b20,
        0.3,
        0.8
      );

      const steel = material(
        0xb9c5c7,
        0.2,
        0.9
      );

      const blue = material(
        0x2b6278,
        0.38,
        0.4
      );

      const white = material(
        0xf3f5f0,
        0.88,
        0.03
      );

      const cyan = material(
        0x40ddff,
        0.22,
        0.18,
        0x17b9df,
        2.8
      );

      const green = material(
        0x45e49a,
        0.3,
        0.18,
        0x149e5d,
        2.2
      );

      const red = material(
        0xe45b63,
        0.34,
        0.2,
        0x8d1821,
        1.5
      );

      const skin = material(
        0xc88d73,
        0.72,
        0.02
      );

      const shirt = material(
        0x3974a7,
        0.58,
        0.08
      );

      const pants = material(
        0x263238,
        0.72,
        0.14
      );

      const shoe = material(
        0x10171a,
        0.28,
        0.78
      );

      const glass =
        new THREE.MeshPhysicalMaterial({
          color: 0x9ed9e4,
          transparent: true,
          opacity: 0.28,
          roughness: 0.06,
          metalness: 0.1,
        });

      /* =========================================================
         HELPERS
      ========================================================= */

      const box = (
        parent: THREE.Object3D,
        position: V3,
        size: V3,
        materialValue: THREE.Material
      ) => {
        const object = new THREE.Mesh(
          new THREE.BoxGeometry(
            ...size
          ),
          materialValue
        );

        object.position.set(
          ...position
        );

        object.castShadow = true;
        object.receiveShadow = true;

        parent.add(object);

        return object;
      };

      const cyl = (
        parent: THREE.Object3D,
        position: V3,
        radius: number,
        height: number,
        materialValue: THREE.Material
      ) => {
        const object = new THREE.Mesh(
          new THREE.CylinderGeometry(
            radius,
            radius,
            height,
            24
          ),
          materialValue
        );

        object.position.set(
          ...position
        );

        object.castShadow = true;
        object.receiveShadow = true;

        parent.add(object);

        return object;
      };

      const sphere = (
        parent: THREE.Object3D,
        position: V3,
        radius: number,
        materialValue: THREE.Material
      ) => {
        const object = new THREE.Mesh(
          new THREE.SphereGeometry(
            radius,
            24,
            18
          ),
          materialValue
        );

        object.position.set(
          ...position
        );

        object.castShadow = true;
        object.receiveShadow = true;

        parent.add(object);

        return object;
      };

      /* =========================================================
         SCREEN SYSTEM
      ========================================================= */

      const makeScreen = (
        width: number,
        height: number
      ) => {
        const canvas =
          document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        const texture =
          new THREE.CanvasTexture(canvas);

        texture.colorSpace =
          THREE.SRGBColorSpace;

        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(
            width / 220,
            height / 220
          ),
          new THREE.MeshBasicMaterial({
            map: texture,
            transparent: false,
          })
        );

        return {
          canvas,
          texture,
          mesh,
        };
      };

      const write = (
        ctx: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        size: number,
        color: string,
        align: CanvasTextAlign = 'left'
      ) => {
        ctx.fillStyle = color;
        ctx.font = `700 ${size}px Arial`;
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
      };

      const clearScreen = (
        screen: {
          canvas: HTMLCanvasElement;
          texture: THREE.CanvasTexture;
        },
        title: string
      ) => {
        const ctx =
          screen.canvas.getContext('2d');

        if (!ctx) {
          return;
        }

        ctx.fillStyle = '#06151c';
        ctx.fillRect(
          0,
          0,
          screen.canvas.width,
          screen.canvas.height
        );

        ctx.strokeStyle = '#1f5260';
        ctx.lineWidth = 8;

        ctx.strokeRect(
          8,
          8,
          screen.canvas.width - 16,
          screen.canvas.height - 16
        );

        write(
          ctx,
          title,
          45,
          48,
          28,
          '#59e6ff'
        );

        screen.texture.needsUpdate = true;
      };

      /* =========================================================
         HOSPITAL EXTERIOR
      ========================================================= */

      box(
        groups.hospital,
        [0, -0.35, 0],
        [48, 0.55, 36],
        floor
      );

      box(
        groups.hospital,
        [0, 5.1, -10],
        [31, 10.2, 7],
        wall
      );

      box(
        groups.hospital,
        [-12, 3.1, -6],
        [4, 6.2, 11],
        blue
      );

      box(
        groups.hospital,
        [12, 3.1, -6],
        [4, 6.2, 11],
        blue
      );

      for (
        let x = -9;
        x <= 9;
        x += 3
      ) {
        for (
          let y = 2;
          y <= 8;
          y += 2
        ) {
          box(
            groups.hospital,
            [x, y, -6.45],
            [1.9, 1.25, 0.08],
            glass
          );
        }
      }

      box(
        groups.hospital,
        [0, 2.7, -6.05],
        [7.4, 5.7, 0.4],
        dark
      );

      box(
        groups.hospital,
        [0, 9.9, -6.5],
        [12, 0.16, 0.16],
        cyan
      );

      box(
        groups.hospital,
        [-3.5, 0.9, -2.8],
        [5.5, 0.2, 5],
        steel
      );

      box(
        groups.hospital,
        [3.5, 0.9, -2.8],
        [5.5, 0.2, 5],
        steel
      );

      /* =========================================================
         AUTOMATIC ENTRY
      ========================================================= */

      box(
        groups.entry,
        [-3.4, 3.1, -0.4],
        [2.5, 6.2, 1.7],
        dark
      );

      box(
        groups.entry,
        [3.4, 3.1, -0.4],
        [2.5, 6.2, 1.7],
        dark
      );

      box(
        groups.entry,
        [0, 5.95, -0.4],
        [7.3, 0.3, 1.7],
        dark
      );

      const doorL = box(
        groups.entry,
        [-1.35, 2.65, 0.3],
        [2.35, 5.15, 0.1],
        glass
      );

      const doorR = box(
        groups.entry,
        [1.35, 2.65, 0.3],
        [2.35, 5.15, 0.1],
        glass
      );

      box(
        groups.entry,
        [0, 5.4, 0.35],
        [6.8, 0.12, 0.14],
        cyan
      );

      /* =========================================================
         CHECK-IN
      ========================================================= */

      box(
        groups.reception,
        [0, 1.4, -0.2],
        [3.0, 2.8, 1.15],
        dark
      );

      box(
        groups.reception,
        [0, 0.25, -0.2],
        [1.45, 0.35, 0.8],
        steel
      );

      const kioskScreen =
        makeScreen(900, 600);

      kioskScreen.mesh.position.set(
        0,
        2.55,
        -0.8
      );

      kioskScreen.mesh.scale.set(
        0.88,
        0.88,
        0.88
      );

      groups.reception.add(
        kioskScreen.mesh
      );

      cyl(
        groups.reception,
        [0, 3.7, -0.25],
        0.38,
        0.18,
        steel
      );

      const scanRing =
        new THREE.Mesh(
          new THREE.TorusGeometry(
            0.28,
            0.045,
            12,
            40
          ),
          cyan
        );

      scanRing.rotation.x =
        Math.PI / 2;

      scanRing.position.set(
        0,
        3.7,
        -0.48
      );

      groups.reception.add(
        scanRing
      );

      const scanPad = box(
        groups.reception,
        [0, 0.55, -0.85],
        [0.9, 0.08, 0.6],
        cyan
      );

      clearScreen(
        kioskScreen,
        'PATIENT REGISTRATION'
      );

      /* =========================================================
         PATIENT
         
         IMPORTANT:
         The patient uses an anatomical hierarchy.
         
         patient
           └── bodyRoot
                ├── torso
                │    ├── neck
                │    │    └── head
                │    ├── armL
                │    └── armR
                ├── legL
                └── legR
         
         This makes the transition to the examination bed
         much more coherent.
      ========================================================= */

      const patient =
        groups.patient;

      const bodyRoot =
        new THREE.Group();

      patient.add(bodyRoot);

      /* Pelvis / lower body */

      const pelvis =
        new THREE.Group();

      pelvis.position.set(
        0,
        0,
        0
      );

      bodyRoot.add(pelvis);

      box(
        pelvis,
        [0, 0, 0],
        [0.92, 0.58, 0.58],
        pants
      );

      /* Torso */

      const torso =
        new THREE.Group();

      torso.position.set(
        0,
        0.82,
        0
      );

      pelvis.add(torso);

      box(
        torso,
        [0, 0.35, 0],
        [0.95, 1.35, 0.55],
        shirt
      );

      /* Neck */

      const neck =
        new THREE.Group();

      neck.position.set(
        0,
        1.12,
        0
      );

      torso.add(neck);

      cyl(
        neck,
        [0, 0, 0],
        0.14,
        0.28,
        skin
      );

      /* Head */

      const head =
        new THREE.Group();

      head.position.set(
        0,
        0.48,
        0
      );

      neck.add(head);

      sphere(
        head,
        [0, 0, 0],
        0.39,
        skin
      );

      /* Hair */

      sphere(
        head,
        [0, 0.19, -0.02],
        0.34,
        dark
      );

      /* Eyes */

      sphere(
        head,
        [-0.13, -0.04, -0.35],
        0.035,
        dark
      );

      sphere(
        head,
        [0.13, -0.04, -0.35],
        0.035,
        dark
      );

      /* Left arm */

      const armL =
        new THREE.Group();

      armL.position.set(
        -0.58,
        0.85,
        0
      );

      torso.add(armL);

      box(
        armL,
        [0, -0.38, 0],
        [0.2, 0.78, 0.2],
        skin
      );

      sphere(
        armL,
        [0, -0.82, 0],
        0.12,
        skin
      );

      /* Right arm */

      const armR =
        new THREE.Group();

      armR.position.set(
        0.58,
        0.85,
        0
      );

      torso.add(armR);

      box(
        armR,
        [0, -0.38, 0],
        [0.2, 0.78, 0.2],
        skin
      );

      sphere(
        armR,
        [0, -0.82, 0],
        0.12,
        skin
      );

      /* Left leg */

      const legL =
        new THREE.Group();

      legL.position.set(
        -0.25,
        -0.45,
        0
      );

      pelvis.add(legL);

      box(
        legL,
        [0, -0.55, 0],
        [0.3, 1.1, 0.32],
        pants
      );

      box(
        legL,
        [0, -1.1, -0.1],
        [0.38, 0.22, 0.65],
        shoe
      );

      /* Right leg */

      const legR =
        new THREE.Group();

      legR.position.set(
        0.25,
        -0.45,
        0
      );

      pelvis.add(legR);

      box(
        legR,
        [0, -0.55, 0],
        [0.3, 1.1, 0.32],
        pants
      );

      box(
        legR,
        [0, -1.1, -0.1],
        [0.38, 0.22, 0.65],
        shoe
      );

      patient.scale.setScalar(
        0.88
      );

      /* =========================================================
         EXAMINATION ROOM
      ========================================================= */

      box(
        groups.exam,
        [0, 0.15, -1],
        [12, 0.3, 9],
        floor
      );

      box(
        groups.exam,
        [0, 4, -5.2],
        [12, 8, 0.25],
        wall
      );

      box(
        groups.exam,
        [-5.7, 3.5, -1],
        [0.3, 7, 8],
        wall
      );

      box(
        groups.exam,
        [5.7, 3.5, -1],
        [0.3, 7, 8],
        wall
      );

      /* Examination bed */

      box(
        groups.exam,
        [0, 0.82, -0.7],
        [7.2, 0.35, 2.8],
        steel
      );

      box(
        groups.exam,
        [0, 1.02, -0.7],
        [6.6, 0.28, 2.45],
        white
      );

      /* Pillow */

      box(
        groups.exam,
        [0, 1.22, -1.55],
        [2.2, 0.22, 0.72],
        white
      );

      /* Mattress head support */

      box(
        groups.exam,
        [0, 1.28, -1.55],
        [5.8, 0.42, 0.28],
        wall
      );

      box(
        groups.exam,
        [-3.1, 1.5, -0.7],
        [0.12, 1.2, 2.4],
        steel
      );

      box(
        groups.exam,
        [3.1, 1.5, -0.7],
        [0.12, 1.2, 2.4],
        steel
      );

      /* Examination lamp */

      const lamp =
        new THREE.Mesh(
          new THREE.TorusGeometry(
            1.25,
            0.1,
            14,
            48
          ),
          cyan
        );

      lamp.position.set(
        0,
        4.6,
        -0.7
      );

      lamp.rotation.x =
        Math.PI / 2;

      groups.exam.add(lamp);

      /* =========================================================
         PATIENT MONITOR
      ========================================================= */

      box(
        groups.monitor,
        [3.9, 2.75, -1.95],
        [3.2, 4.7, 0.48],
        dark
      );

      const vitalScreen =
        makeScreen(1100, 850);

      vitalScreen.mesh.position.set(
        3.9,
        2.85,
        -2.21
      );

      vitalScreen.mesh.scale.set(
        0.95,
        0.95,
        0.95
      );

      groups.monitor.add(
        vitalScreen.mesh
      );

      cyl(
        groups.monitor,
        [3.9, 0.25, -1.95],
        0.65,
        0.18,
        dark
      );

      clearScreen(
        vitalScreen,
        'PATIENT VITALS'
      );

      /* =========================================================
         PATIENT SENSORS
      ========================================================= */

      const sensorGroup =
        new THREE.Group();

      /*
       * Sensors are positioned relative to the patient's
       * examination position.
       */
      sensorGroup.position.set(
        -0.55,
        1.42,
        -0.65
      );

      groups.exam.add(
        sensorGroup
      );

      /* ECG electrodes */

      const electrodePositions: V3[] = [
        [-0.48, 0.08, -0.34],
        [-0.16, 0.08, -0.36],
        [0.16, 0.08, -0.36],
        [0.48, 0.08, -0.34],
      ];

      electrodePositions.forEach(
        (position, index) => {
          const electrode =
            new THREE.Mesh(
              new THREE.CylinderGeometry(
                0.085,
                0.085,
                0.04,
                18
              ),
              index % 2 === 0
                ? red
                : green
            );

          electrode.rotation.x =
            Math.PI / 2;

          electrode.position.set(
            ...position
          );

          sensorGroup.add(
            electrode
          );
        }
      );

      /* Finger SpO2 probe */

      const fingerProbe =
        box(
          sensorGroup,
          [0.68, -0.02, -0.04],
          [0.22, 0.18, 0.15],
          red
        );

      /* Temperature sensor */

      const tempProbe =
        box(
          sensorGroup,
          [-0.76, -0.02, -0.02],
          [0.16, 0.12, 0.16],
          cyan
        );

      fingerProbe.visible = true;
      tempProbe.visible = true;

      /* Visible cables */

      const cableMat =
        new THREE.LineBasicMaterial({
          color: 0x43dfff,
        });

      const cablePoints: V3[] = [
        [-0.48, 0.08, -0.34],
        [-1.0, -0.08, -0.25],
        [-1.45, -0.25, -0.12],
        [-1.95, -0.12, 0.02],
        [-2.4, 0.05, 0.12],
      ];

      const cable =
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(
            cablePoints.map(
              (point) =>
                new THREE.Vector3(
                  ...point
                )
            )
          ),
          cableMat
        );

      sensorGroup.add(
        cable
      );

      /* =========================================================
         AI ANALYSIS SCREEN
      ========================================================= */

      box(
        groups.analysis,
        [0, 3.0, -4.0],
        [10.5, 6.3, 0.35],
        dark
      );

      const aiScreen =
        makeScreen(1400, 850);

      aiScreen.mesh.position.set(
        0,
        3.0,
        -4.22
      );

      aiScreen.mesh.scale.set(
        0.96,
        0.96,
        0.96
      );

      groups.analysis.add(
        aiScreen.mesh
      );

      clearScreen(
        aiScreen,
        'AI CLINICAL ANALYSIS'
      );

      /* =========================================================
         MEDICAL ROBOT
      ========================================================= */

      const robotRoot =
        new THREE.Group();

      robotRoot.position.set(
        3.0,
        0.95,
        0.2
      );

      groups.robot.add(
        robotRoot
      );

      cyl(
        robotRoot,
        [0, 0, 0],
        0.9,
        0.55,
        dark
      );

      cyl(
        robotRoot,
        [0, 0.42, 0],
        0.52,
        0.32,
        steel
      );

      const shoulder =
        new THREE.Group();

      shoulder.position.set(
        0,
        0.62,
        0
      );

      robotRoot.add(
        shoulder
      );

      sphere(
        shoulder,
        [0, 0, 0],
        0.38,
        steel
      );

      box(
        shoulder,
        [0, 0.65, 0],
        [0.48, 1.35, 0.48],
        blue
      );

      const elbow =
        new THREE.Group();

      elbow.position.set(
        0,
        1.3,
        0
      );

      shoulder.add(
        elbow
      );

      sphere(
        elbow,
        [0, 0, 0],
        0.34,
        steel
      );

      box(
        elbow,
        [0, 0.72, 0],
        [0.4, 1.45, 0.4],
        steel
      );

      const wrist =
        new THREE.Group();

      wrist.position.set(
        0,
        1.45,
        0
      );

      elbow.add(
        wrist
      );

      sphere(
        wrist,
        [0, 0, 0],
        0.27,
        cyan
      );

      box(
        wrist,
        [0, 0.44, 0],
        [0.3, 0.82, 0.3],
        steel
      );

      const tool =
        new THREE.Group();

      tool.position.set(
        0,
        0.88,
        0
      );

      wrist.add(
        tool
      );

      box(
        tool,
        [0, 0, 0],
        [0.34, 0.2, 0.34],
        dark
      );

      cyl(
        tool,
        [0, -0.3, 0],
        0.065,
        0.56,
        steel
      );

      cyl(
        tool,
        [0, -0.64, 0],
        0.095,
        0.15,
        red
      );

      const workLight =
        new THREE.PointLight(
          0x55e8ff,
          14,
          8
        );

      workLight.position.set(
        0,
        -0.5,
        0.45
      );

      tool.add(
        workLight
      );

      const target =
        new THREE.Mesh(
          new THREE.RingGeometry(
            0.35,
            0.44,
            32
          ),
          red
        );

      target.rotation.x =
        Math.PI / 2;

      target.position.set(
        0,
        1.5,
        -0.55
      );

      groups.robot.add(
        target
      );

      /* =========================================================
         RESULT ROOM
      ========================================================= */

      box(
        groups.result,
        [0, 0.15, 0],
        [14, 0.3, 9],
        floor
      );

      box(
        groups.result,
        [0, 4, -5],
        [14, 8, 0.25],
        wall
      );

      box(
        groups.result,
        [0, 0.82, -0.5],
        [7.2, 0.35, 2.8],
        steel
      );

      box(
        groups.result,
        [0, 1.02, -0.5],
        [6.6, 0.28, 2.45],
        white
      );

      box(
        groups.result,
        [0, 1.28, -1.35],
        [5.8, 0.42, 0.28],
        wall
      );

      const resultLight =
        new THREE.PointLight(
          0x45e49a,
          12,
          18
        );

      resultLight.position.set(
        0,
        3.5,
        1
      );

      groups.result.add(
        resultLight
      );

      /* =========================================================
         CAMERA
      ========================================================= */

      const clock =
        new THREE.Clock();

      const camPos =
        new THREE.Vector3();

      const camLook =
        new THREE.Vector3();

      const fromPos =
        new THREE.Vector3();

      const toPos =
        new THREE.Vector3();

      const fromLook =
        new THREE.Vector3();

      const toLook =
        new THREE.Vector3();

      const moveCamera = (
        progress: number,
        fromPosition: V3,
        toPosition: V3,
        fromTarget: V3,
        toTarget: V3
      ) => {
        camPos.lerpVectors(
          fromPos.set(
            ...fromPosition
          ),
          toPos.set(
            ...toPosition
          ),
          progress
        );

        camLook.lerpVectors(
          fromLook.set(
            ...fromTarget
          ),
          toLook.set(
            ...toTarget
          ),
          progress
        );

        camera.position.copy(
          camPos
        );

        camera.lookAt(
          camLook
        );
      };

      const show = (
        visible: string[]
      ) => {
        Object.keys(groups).forEach(
          (name) => {
            groups[name].visible =
              visible.includes(name);
          }
        );
      };

      /* =========================================================
         VITAL SIGNS DISPLAY
      ========================================================= */

      const drawVitals = (
        time: number
      ) => {
        const ctx =
          vitalScreen.canvas.getContext(
            '2d'
          );

        if (!ctx) {
          return;
        }

        const width = 1100;
        const height = 850;

        ctx.fillStyle = '#06151c';

        ctx.fillRect(
          0,
          0,
          width,
          height
        );

        write(
          ctx,
          'PATIENT VITALS',
          45,
          48,
          30,
          '#59e6ff'
        );

        /* Top values */

        write(
          ctx,
          'HR',
          55,
          115,
          22,
          '#a8c9d0'
        );

        write(
          ctx,
          '72 BPM',
          55,
          153,
          34,
          '#55e8a2'
        );

        write(
          ctx,
          'SpO₂',
          330,
          115,
          22,
          '#a8c9d0'
        );

        write(
          ctx,
          '98 %',
          330,
          153,
          34,
          '#59e6ff'
        );

        write(
          ctx,
          'TEMP',
          560,
          115,
          22,
          '#a8c9d0'
        );

        write(
          ctx,
          '36.7 °C',
          560,
          153,
          34,
          '#f1cf68'
        );

        write(
          ctx,
          'STATUS',
          835,
          115,
          22,
          '#a8c9d0'
        );

        write(
          ctx,
          'STABLE',
          835,
          153,
          34,
          '#55e8a2'
        );

        /* ECG area */

        ctx.strokeStyle =
          '#1e4852';

        ctx.lineWidth = 3;

        ctx.strokeRect(
          40,
          220,
          1020,
          530
        );

        /* Grid */

        ctx.strokeStyle =
          'rgba(89,230,255,0.10)';

        ctx.lineWidth = 1;

        for (
          let x = 55;
          x < 1050;
          x += 50
        ) {
          ctx.beginPath();
          ctx.moveTo(
            x,
            230
          );
          ctx.lineTo(
            x,
            740
          );
          ctx.stroke();
        }

        for (
          let y = 250;
          y < 740;
          y += 50
        ) {
          ctx.beginPath();
          ctx.moveTo(
            45,
            y
          );
          ctx.lineTo(
            1055,
            y
          );
          ctx.stroke();
        }

        /* ECG */

        ctx.beginPath();

        ctx.strokeStyle =
          '#55e8a2';

        ctx.lineWidth = 5;

        for (
          let i = 0;
          i < 220;
          i++
        ) {
          const x =
            55 + i * 4.55;

          const phase =
            i +
            time * 7;

          let wave =
            Math.sin(
              phase * 0.12
            ) * 7;

          const beat =
            i % 46;

          if (
            beat > 20 &&
            beat < 26
          ) {
            const spike = [
              0,
              -28,
              75,
              -52,
              18,
              0,
            ];

            wave +=
              spike[
                beat - 20
              ] || 0;
          }

          const y =
            365 + wave;

          if (i === 0) {
            ctx.moveTo(
              x,
              y
            );
          } else {
            ctx.lineTo(
              x,
              y
            );
          }
        }

        ctx.stroke();

        /* SpO2 trace */

        ctx.beginPath();

        ctx.strokeStyle =
          '#59e6ff';

        ctx.lineWidth = 4;

        for (
          let i = 0;
          i < 220;
          i++
        ) {
          const x =
            55 + i * 4.55;

          const y =
            535 +
            Math.sin(
              (i + time * 4) *
                0.14
            ) *
              18;

          if (i === 0) {
            ctx.moveTo(
              x,
              y
            );
          } else {
            ctx.lineTo(
              x,
              y
            );
          }
        }

        ctx.stroke();

        write(
          ctx,
          'ECG',
          70,
          285,
          22,
          '#55e8a2'
        );

        write(
          ctx,
          'SpO₂',
          70,
          455,
          22,
          '#59e6ff'
        );

        write(
          ctx,
          'LIVE MONITORING',
          1040,
          790,
          20,
          '#55e8a2',
          'right'
        );

        vitalScreen.texture.needsUpdate =
          true;
      };

      /* =========================================================
         AI ANALYSIS DISPLAY
      ========================================================= */

      const drawAnalysis = (
        progress: number,
        time: number
      ) => {
        const ctx =
          aiScreen.canvas.getContext(
            '2d'
          );

        if (!ctx) {
          return;
        }

        const width = 1400;
        const height = 850;

        ctx.fillStyle =
          '#06151c';

        ctx.fillRect(
          0,
          0,
          width,
          height
        );

        write(
          ctx,
          'AI CLINICAL ANALYSIS',
          55,
          58,
          38,
          '#59e6ff'
        );

        write(
          ctx,
          'REAL-TIME PATIENT DATA INTERPRETATION',
          55,
          105,
          18,
          '#7397a0'
        );

        /* Input data panel */

        ctx.strokeStyle =
          '#1e4852';

        ctx.lineWidth = 3;

        ctx.strokeRect(
          45,
          145,
          520,
          540
        );

        write(
          ctx,
          'INPUT SIGNALS',
          75,
          185,
          25,
          '#59e6ff'
        );

        const rows = [
          [
            'ECG',
            'NORMAL',
          ],
          [
            'HEART RATE',
            '72 BPM',
          ],
          [
            'OXYGENATION',
            '98 %',
          ],
          [
            'TEMPERATURE',
            '36.7 °C',
          ],
        ];

        rows.forEach(
          (row, index) => {
            const threshold =
              index * 0.15;

            if (
              progress >=
              threshold
            ) {
              const y =
                260 +
                index * 85;

              ctx.fillStyle =
                '#102a31';

              ctx.fillRect(
                70,
                y - 27,
                450,
                58
              );

              write(
                ctx,
                '✓',
                95,
                y,
                25,
                '#55e8a2'
              );

              write(
                ctx,
                row[0],
                135,
                y,
                22,
                '#dffaff'
              );

              write(
                ctx,
                row[1],
                470,
                y,
                22,
                '#55e8a2',
                'right'
              );
            }
          }
        );

        /* Assessment */

        if (
          progress > 0.58
        ) {
          write(
            ctx,
            'AI ASSESSMENT',
            75,
            620,
            25,
            '#59e6ff'
          );

          write(
            ctx,
            'NO ABNORMAL PATTERN DETECTED',
            75,
            660,
            21,
            '#55e8a2'
          );
        }

        /* Right graph */

        ctx.strokeStyle =
          '#1e4852';

        ctx.lineWidth = 3;

        ctx.strokeRect(
          620,
          145,
          725,
          540
        );

        write(
          ctx,
          'ECG SIGNAL ANALYSIS',
          650,
          185,
          25,
          '#59e6ff'
        );

        /* Grid */

        ctx.strokeStyle =
          'rgba(89,230,255,0.10)';

        ctx.lineWidth = 1;

        for (
          let x = 640;
          x < 1325;
          x += 50
        ) {
          ctx.beginPath();

          ctx.moveTo(
            x,
            220
          );

          ctx.lineTo(
            x,
            650
          );

          ctx.stroke();
        }

        for (
          let y = 230;
          y < 650;
          y += 50
        ) {
          ctx.beginPath();

          ctx.moveTo(
            630,
            y
          );

          ctx.lineTo(
            1330,
            y
          );

          ctx.stroke();
        }

        /* Animated signal */

        ctx.beginPath();

        ctx.strokeStyle =
          '#59e6ff';

        ctx.lineWidth = 5;

        for (
          let i = 0;
          i < 230;
          i++
        ) {
          const x =
            645 + i * 2.9;

          const phase =
            i +
            time * 5;

          let y =
            425 +
            Math.sin(
              phase * 0.12
            ) *
              35;

          const beat =
            i % 48;

          if (
            beat > 21 &&
            beat < 27
          ) {
            const spike = [
              0,
              -30,
              80,
              -55,
              20,
              0,
            ];

            y +=
              spike[
                beat - 21
              ] || 0;
          }

          if (i === 0) {
            ctx.moveTo(
              x,
              y
            );
          } else {
            ctx.lineTo(
              x,
              y
            );
          }
        }

        ctx.stroke();

        /* Final conclusion */

        if (
          progress > 0.82
        ) {
          ctx.fillStyle =
            'rgba(69,228,154,0.12)';

          ctx.fillRect(
            620,
            700,
            725,
            100
          );

          write(
            ctx,
            'AI CONCLUSION',
            650,
            730,
            20,
            '#7397a0'
          );

          write(
            ctx,
            'PATIENT STATUS: STABLE',
            650,
            770,
            30,
            '#55e8a2'
          );

          write(
            ctx,
            'CONFIDENCE 98.4%',
            1320,
            770,
            22,
            '#55e8a2',
            'right'
          );
        }

        aiScreen.texture.needsUpdate =
          true;
      };

      /* =========================================================
         ANIMATION
      ========================================================= */

      const animate = () => {
        if (dead) {
          return;
        }

        const dt =
          Math.min(
            clock.getDelta(),
            0.05
          );

        if (
          !paused.current
        ) {
          timeline.current =
            (
              timeline.current +
              dt * 1000
            ) %
            totalDuration;
        }

        let local =
          timeline.current;

        let idx = 0;

        while (
          idx <
            scenes.length - 1 &&
          local >=
            scenes[idx].duration
        ) {
          local -=
            scenes[idx].duration;

          idx += 1;
        }

        const progress =
          ease(
            clamp(
              local /
                scenes[idx]
                  .duration
            )
          );

        setSceneIndex(
          (value) =>
            value === idx
              ? value
              : idx
        );

        /* =====================================================
           STORY VISIBILITY
        ===================================================== */

        if (idx === 0) {
          show([
            'hospital',
            'patient',
          ]);
        } else if (idx === 1) {
          show([
            'entry',
            'patient',
          ]);
        } else if (idx === 2) {
          show([
            'reception',
            'patient',
          ]);
        } else if (idx >= 3 && idx <= 6) {
          show([
            'exam',
            'patient',
            'monitor',
            'analysis',
            'robot',
          ]);
        } else {
          show([
            'result',
            'patient',
          ]);
        }

        /* =====================================================
           PATIENT ARRIVAL
        ===================================================== */

        if (idx === 0) {
          patient.position.set(
            -7 + progress * 5,
            0,
            3 - progress * 3
          );

          patient.rotation.set(
            0,
            0,
            0
          );

          bodyRoot.rotation.set(
            0,
            0,
            0
          );
        }

        /* =====================================================
           ENTRY
        ===================================================== */

        if (idx === 1) {
          patient.position.set(
            -2 + progress * 2,
            0,
            1.2
          );

          patient.rotation.set(
            0,
            0,
            0
          );

          bodyRoot.rotation.set(
            0,
            0,
            0
          );

          const doorDistance =
            progress * 1.7;

          doorL.position.x =
            -1.35 -
            doorDistance;

          doorR.position.x =
            1.35 +
            doorDistance;
        }

        /* =====================================================
           CHECK-IN
        ===================================================== */

        if (idx === 2) {
          patient.position.set(
            0,
            0,
            1.25
          );

          patient.rotation.set(
            0,
            Math.PI * 0.05,
            0
          );

          bodyRoot.rotation.set(
            0,
            0,
            0
          );

          let state = 0;

          if (progress >= 0.28) {
            state = 1;
          }

          if (progress >= 0.55) {
            state = 2;
          }

          if (progress >= 0.78) {
            state = 3;
          }

          const ctx =
            kioskScreen.canvas.getContext(
              '2d'
            );

          if (ctx) {
            clearScreen(
              kioskScreen,
              [
                'PATIENT REGISTRATION',
                'SCANNING...',
                'IDENTITY DETECTED',
                'CHECK-IN COMPLETE ✓',
              ][state]
            );

            if (
              progress > 0.28
            ) {
              ctx.fillStyle =
                '#55e8a2';

              ctx.fillRect(
                110,
                460,
                680 *
                  clamp(
                    (progress -
                      0.28) /
                      0.72
                  ),
                24
              );
            }

            kioskScreen.texture.needsUpdate =
              true;
          }

          scanRing.scale.setScalar(
            1 +
              Math.sin(
                clock.elapsedTime * 6
              ) *
                0.12
          );

          scanPad.material =
            progress > 0.55
              ? green
              : cyan;
        }

        /* =====================================================
           EXAMINATION + BIOSIGNALS + AI + ROBOT
           
           The patient is now physically aligned with the bed.
        ===================================================== */

        if (
          idx >= 3 &&
          idx <= 6
        ) {
          /*
           * Patient root position.
           *
           * The patient is rotated around Z because the
           * anatomical model is constructed vertically.
           *
           * This rotation puts the body horizontally on the
           * examination mattress.
           */
          patient.rotation.set(
            0,
            0,
            -Math.PI / 2
          );

          /*
           * Position adjusted so the pelvis, torso and head
           * remain on the mattress.
           */
          patient.position.set(
            -0.25,
            1.52,
            -0.68
          );

          /* Small natural head elevation */

          head.rotation.set(
            0,
            0,
            -0.035
          );

          /* Arms resting along body */

          armL.rotation.set(
            0,
            0,
            -0.06
          );

          armR.rotation.set(
            0,
            0,
            0.06
          );

          /*
           * During the EXAMINATION scene the patient is
           * progressively moved onto the bed.
           */
          if (idx === 3) {
            patient.position.x =
              -1.8 +
              progress * 1.55;

            patient.position.z =
              -0.68;

            drawVitals(
              clock.elapsedTime
            );
          }

          /* ===================================================
             BIOSIGNALS
          =================================================== */

          if (idx === 4) {
            drawVitals(
              clock.elapsedTime
            );

            /*
             * Make the sensor area subtly pulse so the viewer
             * understands that measurements are active.
             */
            const pulse =
              1 +
              Math.sin(
                clock.elapsedTime * 5
              ) *
                0.06;

            sensorGroup.scale.setScalar(
              pulse
            );
          }

          /* ===================================================
             AI ANALYSIS
          =================================================== */

          if (idx === 5) {
            drawAnalysis(
              progress,
              clock.elapsedTime
            );

            sensorGroup.scale.setScalar(
              1
            );
          }

          /* ===================================================
             ROBOTIC ASSIST
          =================================================== */

          if (idx === 6) {
            const approach =
              0.72 +
              0.28 *
                Math.sin(
                  progress *
                    Math.PI
                );

            robotRoot.position.set(
              2.65 -
                approach * 0.35,
              0.95,
              0.25
            );

            shoulder.rotation.z =
              -0.55 -
              0.18 *
                Math.sin(
                  progress *
                    Math.PI
                );

            elbow.rotation.z =
              0.85 +
              0.35 *
                Math.sin(
                  progress *
                    Math.PI
                );

            wrist.rotation.z =
              -0.35;

            tool.rotation.z =
              0.08 *
              Math.sin(
                clock.elapsedTime * 3
              );

            target.position.set(
              0.35,
              1.48,
              -0.72
            );

            target.scale.setScalar(
              1 +
                Math.sin(
                  clock.elapsedTime * 5
                ) *
                  0.15
            );
          }
        }

        /* =====================================================
           RESULT
        ===================================================== */

        if (idx === 7) {
          patient.rotation.set(
            0,
            0,
            -Math.PI / 2
          );

          patient.position.set(
            -0.25,
            1.52,
            -0.68
          );

          bodyRoot.rotation.set(
            0,
            0,
            0
          );

          robotRoot.position.set(
            2.65,
            0.95,
            0.25
          );
        }

        /* =====================================================
           PATIENT STANDS UP
        ===================================================== */

        if (idx === 8) {
          const stand =
            clamp(
              (progress -
                0.18) /
                0.48
            );

          const joy =
            clamp(
              (progress -
                0.66) /
                0.34
            );

          /*
           * Smoothly bring the patient back to vertical.
           */
          patient.rotation.z =
            THREE.MathUtils.lerp(
              -Math.PI / 2,
              0,
              ease(stand)
            );

          patient.position.x =
            THREE.MathUtils.lerp(
              -0.25,
              -0.25,
              ease(stand)
            );

          patient.position.y =
            THREE.MathUtils.lerp(
              1.52,
              0.35,
              ease(stand)
            );

          patient.position.z =
            THREE.MathUtils.lerp(
              -0.68,
              1.0,
              ease(stand)
            );

          armL.rotation.z =
            -joy * 1.15;

          armR.rotation.z =
            joy * 1.15;

          const bounce =
            joy > 0
              ? Math.abs(
                  Math.sin(
                    (progress -
                      0.66) *
                      Math.PI *
                      5
                  )
                ) * 0.28
              : 0;

          patient.position.y +=
            bounce;

          patient.rotation.y =
            Math.sin(
              clock.elapsedTime * 8
            ) *
            joy *
            0.06;
        }

        /* =====================================================
           SIGNATURE
        ===================================================== */

        if (idx === 9) {
          patient.rotation.set(
            0,
            0,
            0
          );

          patient.position.set(
            0,
            0.35,
            1.2
          );

          bodyRoot.rotation.set(
            0,
            0,
            0
          );
        }

        /* =====================================================
           CAMERA POSITIONS
        ===================================================== */

        let fp: V3;
        let tp: V3;
        let fl: V3;
        let tl: V3;

        if (idx === 0) {
          fp = [13, 8, 20];
          tp = [8, 5.4, 12];
          fl = [0, 2.4, -5];
          tl = [0, 2.5, -4];
        } else if (idx === 1) {
          fp = [7, 4.8, 11];
          tp = [4.5, 3.5, 6];
          fl = [0, 2.4, 0];
          tl = [0, 2.4, 0];
        } else if (idx === 2) {
          fp = [6.5, 4.0, 8];
          tp = [5.5, 3.3, 5.5];
          fl = [0, 1.9, -0.2];
          tl = [0, 2.0, -0.5];
        } else if (idx === 3) {
          fp = [8.5, 5.0, 6.5];
          tp = [6.2, 3.8, 5.0];
          fl = [0, 1.35, -0.7];
          tl = [0, 1.35, -0.7];
        } else if (idx === 4) {
          /*
           * IMPORTANT:
           * This is the BIOSIGNALS camera.
           *
           * It deliberately frames:
           * - patient
           * - ECG electrodes
           * - cables
           * - monitor
           *
           * The monitor is no longer hidden outside the frame.
           */
          fp = [8.6, 4.3, 6.6];
          tp = [5.8, 3.15, 3.8];

          fl = [0.8, 1.45, -0.9];
          tl = [2.9, 2.65, -1.85];
        } else if (idx === 5) {
          /*
           * AI camera moves toward the analysis display.
           */
          fp = [7.6, 4.5, 7.2];
          tp = [4.6, 3.4, 5.0];

          fl = [0, 2.8, -3.4];
          tl = [0, 3.0, -4.15];
        } else if (idx === 6) {
          fp = [10.5, 5.8, 8.5];
          tp = [7.0, 4.0, 6.4];

          fl = [0.6, 1.6, -0.6];
          tl = [0.6, 1.6, -0.6];
        } else if (idx === 7) {
          fp = [7.8, 4.6, 7.0];
          tp = [6.8, 4.0, 6.4];

          fl = [0, 1.4, -0.5];
          tl = [0, 1.5, -0.5];
        } else if (idx === 8) {
          fp = [7.5, 4.8, 7.5];
          tp = [6.8, 4.0, 6.8];

          fl = [0, 1.5, 0.2];
          tl = [0, 1.6, 0.3];
        } else {
          fp = [11, 7, 13];
          tp = [15, 8, 18];

          fl = [0, 2.6, -4];
          tl = [0, 2.8, -4];
        }

        moveCamera(
          progress,
          fp,
          tp,
          fl,
          tl
        );

        renderer.render(
          scene,
          camera
        );

        raf =
          requestAnimationFrame(
            animate
          );
      };

      /* =========================================================
         RESIZE
      ========================================================= */

      const resize = () => {
        const width =
          Math.max(
            1,
            mount.clientWidth
          );

        const height =
          Math.max(
            1,
            mount.clientHeight
          );

        camera.aspect =
          width / height;

        camera.updateProjectionMatrix();

        renderer.setSize(
          width,
          height,
          false
        );
      };

      window.addEventListener(
        'resize',
        resize
      );

      resize();

      animate();

      /* =========================================================
         CLEANUP
      ========================================================= */

      return () => {
        dead = true;

        window.removeEventListener(
          'resize',
          resize
        );

        cancelAnimationFrame(
          raf
        );

        renderer.dispose();

        scene.traverse(
          (object) => {
            const mesh =
              object as THREE.Mesh;

            if (
              mesh.geometry
            ) {
              mesh.geometry.dispose();
            }

            if (
              Array.isArray(
                mesh.material
              )
            ) {
              mesh.material.forEach(
                (materialValue) =>
                  materialValue.dispose()
              );
            } else if (
              mesh.material
            ) {
              mesh.material.dispose();
            }
          }
        );

        if (
          renderer.domElement
            .parentElement ===
          mount
        ) {
          mount.removeChild(
            renderer.domElement
          );
        }
      };
    } catch (exception) {
      console.error(
        'Biomedical City 3D initialization failed:',
        exception
      );

      if (!dead) {
        setError(true);
      }

      return () => {
        dead = true;
        cancelAnimationFrame(
          raf
        );
      };
    }
  }, []);

  /* =========================================================
     CONTROLS
  ========================================================= */

  const jump = (
    index: number
  ) => {
    timeline.current =
      scenes
        .slice(0, index)
        .reduce(
          (sum, item) =>
            sum + item.duration,
          0
        );

    setSceneIndex(index);
  };

  const toggle = () => {
    paused.current =
      !paused.current;

    setIsPaused(
      paused.current
    );
  };

  const current =
    scenes[sceneIndex];

  /* =========================================================
     UI
  ========================================================= */

  return (
    <section
      className="biomedical-city"
      id="city"
      aria-label="Biomedical City — A Patient's Journey"
    >
      <div
        ref={mountRef}
        className="biomedical-city-canvas"
      />

      {error && (
        <div className="city-error">
          Biomedical City 3D could not
          initialize. Please reload the
          page.
        </div>
      )}

      <div className="city-vignette" />

      <div className="city-hud">
        <div className="city-kicker">
          BIOMEDICAL CITY • 2035
        </div>

        <h2>
          Biomedical City
        </h2>

        <div className="city-story">
          <span className="city-scene-number">
            {String(
              sceneIndex + 1
            ).padStart(2, '0')}
          </span>

          <div>
            <strong>
              {current.title}
            </strong>

            <p>
              {current.subtitle}
            </p>
          </div>
        </div>

        <div className="city-progress">
          {scenes.map(
            (
              item,
              index
            ) => (
              <button
                key={item.title}
                className={
                  index ===
                  sceneIndex
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  jump(index)
                }
                aria-label={
                  item.title
                }
              />
            )
          )}
        </div>

        <button
          className="city-play"
          onClick={toggle}
        >
          {isPaused
            ? 'PLAY JOURNEY'
            : 'PAUSE JOURNEY'}
        </button>
      </div>

      {sceneIndex === 9 && (
        <div className="city-signature">
          <span>
            ENGINEERING TECHNOLOGY
          </span>

          <strong>
            FOR BETTER HEALTHCARE
          </strong>
        </div>
      )}

      <div className="city-label">
        FUTURE CARE • 2035
      </div>
    </section>
  );
};

export default BiomedicalCity;
