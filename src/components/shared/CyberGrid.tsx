'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'ai' | 'security' | 'threat';
  pulsePhase: number;
}

interface DataPacket {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  encrypted: boolean;
}

export function CyberGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Grid configuration
    const gridSize = 50;
    const nodes: Node[] = [];
    const maxNodes = 60;
    const dataPackets: DataPacket[] = [];
    const threats: { x: number; y: number; radius: number; detected: boolean }[] = [];

    // Initialize nodes with types
    for (let i = 0; i < maxNodes; i++) {
      const rand = Math.random();
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        type: rand < 0.4 ? 'ai' : rand < 0.8 ? 'security' : 'threat',
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Create data packets periodically
    let packetTimer = 0;
    const createDataPacket = () => {
      if (nodes.length < 2) return;
      const source = nodes[Math.floor(Math.random() * nodes.length)];
      const target = nodes[Math.floor(Math.random() * nodes.length)];
      if (!source || !target) return;
      dataPackets.push({
        x: source.x,
        y: source.y,
        targetX: target.x,
        targetY: target.y,
        progress: 0,
        encrypted: Math.random() > 0.5,
      });
    };

    // Create threats periodically
    let threatTimer = 0;
    const createThreat = () => {
      threats.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 5,
        detected: false,
      });
    };

    let time = 0;

    // Animation
    const animate = () => {
      time += 0.016;
      packetTimer += 0.016;
      threatTimer += 0.016;

      // Create new packets
      if (packetTimer > 0.5) {
        createDataPacket();
        packetTimer = 0;
      }

      // Create new threats occasionally
      if (threatTimer > 3 && Math.random() > 0.7) {
        createThreat();
        threatTimer = 0;
      }

      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw animated grid with scan lines
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.04)';
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += gridSize) {
        const scanIntensity = Math.sin(time * 2 + x * 0.01) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(212, 175, 55, ${0.02 + scanIntensity * 0.03})`;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        const scanIntensity = Math.sin(time * 2 + y * 0.01) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(212, 175, 55, ${0.02 + scanIntensity * 0.03})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update and detect threats
      threats.forEach((threat, idx) => {
        // Check if security nodes detect this threat
        nodes.forEach((node) => {
          if (node.type === 'security') {
            const dx = node.x - threat.x;
            const dy = node.y - threat.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
              threat.detected = true;
            }
          }
        });

        // Draw threat
        threat.radius += 0.3;
        const color = threat.detected ? '100, 200, 100' : '255, 100, 100';
        ctx.beginPath();
        ctx.arc(threat.x, threat.y, threat.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${color}, ${0.5 - threat.radius / 100})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Remove old threats
        if (threat.radius > 50) {
          threats.splice(idx, 1);
        }
      });

      // Update and draw data packets
      dataPackets.forEach((packet, idx) => {
        packet.progress += 0.02;
        packet.x += (packet.targetX - packet.x) * 0.02;
        packet.y += (packet.targetY - packet.y) * 0.02;

        // Draw packet
        const size = 3;
        ctx.fillStyle = packet.encrypted
          ? 'rgba(100, 200, 255, 0.8)'
          : 'rgba(212, 175, 55, 0.8)';
        ctx.fillRect(packet.x - size / 2, packet.y - size / 2, size, size);

        // Draw encryption shield
        if (packet.encrypted) {
          ctx.strokeStyle = 'rgba(100, 200, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.strokeRect(packet.x - 5, packet.y - 5, 10, 10);
        }

        // Remove completed packets
        if (packet.progress > 1) {
          dataPackets.splice(idx, 1);
        }
      });

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        node.pulsePhase += 0.05;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Draw node based on type
        const pulse = Math.sin(node.pulsePhase) * 0.3 + 0.7;
        let nodeColor, nodeSize;

        switch (node.type) {
          case 'ai':
            nodeColor = `rgba(138, 43, 226, ${0.7 * pulse})`; // Purple for AI
            nodeSize = 4;
            // AI nodes have pulsing rings
            ctx.beginPath();
            ctx.arc(node.x, node.y, 8 * pulse, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(138, 43, 226, ${0.2 * pulse})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            break;
          case 'security':
            nodeColor = `rgba(100, 200, 100, ${0.7 * pulse})`; // Green for security
            nodeSize = 3.5;
            // Security nodes have shield effect
            break;
          case 'threat':
            nodeColor = `rgba(255, 100, 100, ${0.5 * pulse})`; // Red for threats
            nodeSize = 2.5;
            break;
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // Draw neural network connections
        nodes.forEach((otherNode, j) => {
          if (i >= j) return;
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);

            // Color connections based on node types
            let connectionColor = '212, 175, 55'; // Default gold
            if (node.type === 'ai' && otherNode.type === 'ai') {
              connectionColor = '138, 43, 226'; // Purple for AI-AI
            } else if (
              (node.type === 'security' || otherNode.type === 'security') &&
              (node.type === 'threat' || otherNode.type === 'threat')
            ) {
              connectionColor = '100, 200, 100'; // Green for security-threat (detection)
            }

            ctx.strokeStyle = `rgba(${connectionColor}, ${0.15 * (1 - distance / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
