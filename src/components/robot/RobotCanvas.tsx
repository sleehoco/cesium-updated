'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

interface RobotCanvasProps {
  chatOpen: boolean;
  onClick: () => void;
}

interface ThreeState {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  group: THREE.Group;
  leftEye: THREE.Mesh;
  rightEye: THREE.Mesh;
  eyeMat: THREE.MeshStandardMaterial;
  eyeBrightMat: THREE.MeshStandardMaterial;
}

function initThree(canvas: HTMLCanvasElement, size: number): ThreeState {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(size, size);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0.2, 2.5);

  const group = new THREE.Group();
  scene.add(group);

  // Materials
  const violetMat = new THREE.MeshStandardMaterial({
    color: '#8B5CF6', metalness: 0.8, roughness: 0.2,
    emissive: new THREE.Color('#8B5CF6'), emissiveIntensity: 0.3,
  });
  const bodyMat = new THREE.MeshStandardMaterial({
    color: '#1a1a1a', metalness: 0.6, roughness: 0.3,
  });
  const eyeMat = new THREE.MeshStandardMaterial({
    color: '#0EA5E9', emissive: new THREE.Color('#0EA5E9'), emissiveIntensity: 0.8,
  });
  const eyeBrightMat = new THREE.MeshStandardMaterial({
    color: '#0EA5E9', emissive: new THREE.Color('#0EA5E9'), emissiveIntensity: 1.5,
  });
  const shieldMat = new THREE.MeshStandardMaterial({
    color: '#8B5CF6', emissive: new THREE.Color('#8B5CF6'),
    emissiveIntensity: 0.5, transparent: true, opacity: 0.8,
  });
  const antennaMat = new THREE.MeshStandardMaterial({
    color: '#8B5CF6', emissive: new THREE.Color('#8B5CF6'), emissiveIntensity: 1.0,
  });

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 32), violetMat);
  head.position.y = 0.35;
  group.add(head);

  // Eyes
  const leftEye = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.02, 16, 32), eyeMat);
  leftEye.position.set(-0.1, 0.38, 0.22);
  group.add(leftEye);
  const rightEye = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.02, 16, 32), eyeMat);
  rightEye.position.set(0.1, 0.38, 0.22);
  group.add(rightEye);

  // Antenna
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.15, 8), violetMat);
  stem.position.y = 0.7;
  group.add(stem);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), antennaMat);
  tip.position.y = 0.8;
  group.add(tip);

  // Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.4, 0.3), bodyMat);
  body.position.y = -0.05;
  group.add(body);

  // Body edge highlights
  const edgeTop = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.02, 0.31), violetMat);
  edgeTop.position.y = 0.15;
  group.add(edgeTop);
  const edgeBottom = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.02, 0.31), violetMat);
  edgeBottom.position.y = -0.25;
  group.add(edgeBottom);

  // Shield emblem
  const hexShape = new THREE.Shape();
  for (let i = 0; i <= 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    if (i === 0) hexShape.moveTo(Math.cos(a) * 0.15, Math.sin(a) * 0.15);
    else hexShape.lineTo(Math.cos(a) * 0.15, Math.sin(a) * 0.15);
  }
  const holePath = new THREE.Path();
  for (let i = 0; i <= 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    if (i === 0) holePath.moveTo(Math.cos(a) * 0.1, Math.sin(a) * 0.1);
    else holePath.lineTo(Math.cos(a) * 0.1, Math.sin(a) * 0.1);
  }
  hexShape.holes.push(holePath);
  const shield = new THREE.Mesh(
    new THREE.ExtrudeGeometry(hexShape, { depth: 0.02, bevelEnabled: false }),
    shieldMat
  );
  shield.position.set(0, -0.02, 0.16);
  group.add(shield);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const vl = new THREE.PointLight(0x8b5cf6, 0.8, 10);
  vl.position.set(2, 3, 2);
  scene.add(vl);
  const cl = new THREE.PointLight(0x0ea5e9, 0.4, 10);
  cl.position.set(-2, 1, 2);
  scene.add(cl);

  return { renderer, scene, camera, group, leftEye, rightEye, eyeMat, eyeBrightMat };
}

const SIZE = 80;

// Module-level cache: survives React StrictMode double-mount and HMR
let cachedState: { canvas: HTMLCanvasElement; three: ThreeState } | null = null;

export function RobotCanvas({ chatOpen, onClick }: RobotCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const stateRef = useRef({ hovered: false, chatOpen: false, scale: 1 });

  stateRef.current.chatOpen = chatOpen;

  const handlePointerEnter = useCallback(() => { stateRef.current.hovered = true; }, []);
  const handlePointerLeave = useCallback(() => { stateRef.current.hovered = false; }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reuse existing Three.js state if same canvas, otherwise create fresh
    if (!cachedState || cachedState.canvas !== canvas) {
      if (cachedState) {
        cachedState.three.renderer.dispose();
      }
      cachedState = { canvas, three: initThree(canvas, SIZE) };
    }

    const { renderer, scene, camera, group, leftEye, rightEye, eyeMat, eyeBrightMat } = cachedState.three;

    let running = true;

    function animate() {
      if (!running) return;

      const t = performance.now() / 1000;
      const s = stateRef.current;

      // Idle bob — large enough to be visible on 80px canvas
      group.position.y = Math.sin(t * 1.5) * (s.chatOpen ? 0.08 : 0.18);

      // Rotation sway
      group.rotation.z = Math.sin(t * 0.8) * (s.chatOpen ? 0.04 : 0.12);
      group.rotation.y = s.chatOpen ? -0.15 : Math.sin(t * 0.5) * 0.15;

      // Hover scale spring
      const target = s.hovered ? 1.15 : 1.0;
      s.scale += (target - s.scale) * 0.1;
      group.scale.setScalar(s.scale);

      // Eye glow pulse
      const pulse = 0.8 + Math.sin(t * 3) * 0.4;
      eyeMat.emissiveIntensity = pulse;

      // Eye brightness on hover
      leftEye.material = s.hovered ? eyeBrightMat : eyeMat;
      rightEye.material = s.hovered ? eyeBrightMat : eyeMat;

      renderer.render(scene, camera);
      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
      // Do NOT dispose — cached state survives StrictMode remount
    };
  }, []);

  return (
    <div
      className="cursor-pointer"
      style={{ width: SIZE, height: SIZE }}
      onClick={onClick}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      role="button"
      tabIndex={0}
      aria-label={chatOpen ? 'Close security assistant' : 'Open security assistant'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        style={{ width: SIZE, height: SIZE }}
      />
    </div>
  );
}
