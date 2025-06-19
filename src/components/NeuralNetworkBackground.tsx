'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  connections: number[];
  size: number;
  opacity: number;
  pulsePhase: number;
  layer: number;
}

interface Connection {
  from: number;
  to: number;
  strength: number;
  active: boolean;
  pulseProgress: number;
}

const NeuralNetworkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Initialize nodes and connections
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    // Create nodes with distinct 3D layers
    const layers = 4; // Reduced layers
    const totalNodes = Math.max(25, Math.floor((dimensions.width * dimensions.height) / 30000)); // Fewer particles
    const newNodes: Node[] = [];
    
    // Create nodes in structured layers for better 3D effect
    for (let layer = 0; layer < layers; layer++) {
      const nodesInLayer = Math.floor(totalNodes / layers) + (layer === 0 ? totalNodes % layers : 0);
      
      for (let i = 0; i < nodesInLayer; i++) {
        const z = layer / (layers - 1);
        const perspectiveScale = 0.3 + z * 0.7;
        
        newNodes.push({
          id: newNodes.length,
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          z: z,
          vx: (Math.random() - 0.5) * 0.05 * perspectiveScale, // Slower movement
          vy: (Math.random() - 0.5) * 0.05 * perspectiveScale,
          vz: (Math.random() - 0.5) * 0.02,
          connections: [],
          size: (Math.random() * 3 + 2) * perspectiveScale * (1.5 + z),
          opacity: (Math.random() * 0.4 + 0.6) * perspectiveScale,
          pulsePhase: Math.random() * Math.PI * 2,
          layer: layer,
        });
      }
    }

    // Create connections
    const newConnections: Connection[] = [];
    const maxDistance = 150;
    const maxConnections = 4;

    newNodes.forEach((node, i) => {
      let connectionCount = 0;
      newNodes.forEach((otherNode, j) => {
        if (i !== j && connectionCount < maxConnections) {
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
          );
          
          if (distance < maxDistance && Math.random() > 0.7) {
            const connectionExists = newConnections.some(
              conn => (conn.from === i && conn.to === j) || (conn.from === j && conn.to === i)
            );
            
            if (!connectionExists) {
              newConnections.push({
                from: i,
                to: j,
                strength: Math.random() * 0.8 + 0.2,
                active: Math.random() > 0.5,
                pulseProgress: Math.random(),
              });
              node.connections.push(j);
              connectionCount++;
            }
          }
        }
      });
    });

    setNodes(newNodes);
    setConnections(newConnections);
  }, [dimensions]);

  // Mouse movement handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Update nodes
      const updatedNodes = nodes.map(node => {
        // Mouse interaction
        const mouseDistance = Math.sqrt(
          Math.pow(node.x - mouseRef.current.x, 2) + 
          Math.pow(node.y - mouseRef.current.y, 2)
        );
        
        const mouseInfluence = Math.max(0, 1 - mouseDistance / 200);
        const attractionForce = mouseInfluence * 0.02;
        
        if (mouseDistance < 200) {
          const angle = Math.atan2(mouseRef.current.y - node.y, mouseRef.current.x - node.x);
          node.vx += Math.cos(angle) * attractionForce;
          node.vy += Math.sin(angle) * attractionForce;
        }

        // Update position with 3D movement
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        // Boundary wrapping
        if (node.x < 0) node.x = dimensions.width;
        if (node.x > dimensions.width) node.x = 0;
        if (node.y < 0) node.y = dimensions.height;
        if (node.y > dimensions.height) node.y = 0;
        if (node.z < 0) node.z = 1;
        if (node.z > 1) node.z = 0;

        // Add some damping
        node.vx *= 0.995;
        node.vy *= 0.995;
        node.vz *= 0.995;

        // Update pulse (even slower)
        node.pulsePhase += 0.003; // Slower pulse
        const baseOpacity = (0.4 + Math.sin(node.pulsePhase) * 0.3) * (1 + node.z * 0.8);
        node.opacity = Math.max(0.2, baseOpacity);

        return node;
      });

      // Update connections (slower pulse)
      const updatedConnections = connections.map(conn => {
        conn.pulseProgress += 0.005; // Slower connection pulses
        if (conn.pulseProgress > 1) {
          conn.pulseProgress = 0;
          conn.active = Math.random() > 0.2;
        }
        return conn;
      });

      // Draw connections with 3D perspective
      const connectionsWithZ = updatedConnections.map(conn => {
        const fromNode = updatedNodes[conn.from];
        const toNode = updatedNodes[conn.to];
        const avgZ = fromNode && toNode ? (fromNode.z + toNode.z) / 2 : 0;
        return { ...conn, avgZ };
      });
      
      const sortedConnections = connectionsWithZ.sort((a, b) => a.avgZ - b.avgZ);

      sortedConnections.forEach(conn => {
        const fromNode = updatedNodes[conn.from];
        const toNode = updatedNodes[conn.to];
        
        if (!fromNode || !toNode) return;

        // Apply perspective transformation
        const fromX = fromNode.x + (fromNode.x - dimensions.width / 2) * fromNode.z * 0.1;
        const fromY = fromNode.y + (fromNode.y - dimensions.height / 2) * fromNode.z * 0.1;
        const toX = toNode.x + (toNode.x - dimensions.width / 2) * toNode.z * 0.1;
        const toY = toNode.y + (toNode.y - dimensions.height / 2) * toNode.z * 0.1;

        const distance = Math.sqrt(Math.pow(fromX - toX, 2) + Math.pow(fromY - toY, 2));

        if (distance < 250) {
          const avgZ = conn.avgZ;
          const depthScale = 0.5 + avgZ * 1.5;
          
          // Create gradient line
          const gradient = ctx.createLinearGradient(fromX, fromY, toX, toY);
          const fromR = Math.floor(80 + fromNode.z * 175);
          const fromG = Math.floor(120 + fromNode.z * 135);
          const toR = Math.floor(80 + toNode.z * 175);
          const toG = Math.floor(120 + toNode.z * 135);
          
          gradient.addColorStop(0, `rgba(${fromR}, ${fromG}, 255, ${fromNode.opacity * 0.6})`);
          gradient.addColorStop(1, `rgba(${toR}, ${toG}, 255, ${toNode.opacity * 0.6})`);
          
          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          ctx.lineTo(toX, toY);
          
          const baseOpacity = conn.active ? 
            (0.3 + Math.sin(conn.pulseProgress * Math.PI * 2) * 0.5) * (1 - distance / 250) * depthScale :
            0.15 * (1 - distance / 250) * depthScale;
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = conn.strength * depthScale;
          const oldAlpha = ctx.globalAlpha;
          ctx.globalAlpha = Math.min(baseOpacity, 0.9);
          ctx.stroke();
          ctx.globalAlpha = oldAlpha;

          // Enhanced pulse effect
          if (conn.active && conn.pulseProgress < 0.9) {
            const pulseX = fromX + (toX - fromX) * conn.pulseProgress;
            const pulseY = fromY + (toY - fromY) * conn.pulseProgress;
            const pulseZ = fromNode.z + (toNode.z - fromNode.z) * conn.pulseProgress;
            const pulseSize = (2 + pulseZ * 3) * depthScale;
            
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, pulseSize, 0, Math.PI * 2);
            const pulseOpacity = (0.9 - conn.pulseProgress) * depthScale;
            ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
            ctx.fill();
            
            // Pulse glow
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, pulseSize * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(150, 200, 255, ${pulseOpacity * 0.3})`;
            ctx.fill();
          }
        }
      });

      // Draw nodes by depth layers
      const sortedNodes = updatedNodes.slice().sort((a, b) => a.z - b.z);
      
      sortedNodes.forEach(node => {
        const perspectiveX = node.x + (node.x - dimensions.width / 2) * node.z * 0.1;
        const perspectiveY = node.y + (node.y - dimensions.height / 2) * node.z * 0.1;
        
        // Shadow effect for back layers
        if (node.z < 0.8) {
          ctx.beginPath();
          ctx.arc(perspectiveX + 2, perspectiveY + 2, node.size * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 0, 50, ${(1 - node.z) * 0.3})`;
          ctx.fill();
        }

        // Enhanced 3D glow effect
        const glowRadius = node.size * (2 + node.z * 3);
        const gradient = ctx.createRadialGradient(
          perspectiveX, perspectiveY, 0,
          perspectiveX, perspectiveY, glowRadius
        );
        
        // Dynamic color palette based on depth
        const r = Math.floor(100 + node.z * 155);
        const g = Math.floor(150 + node.z * 105);
        const b = 255;
        
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${node.opacity * 0.8})`);
        gradient.addColorStop(0.3, `rgba(${Math.floor(r * 0.7)}, ${Math.floor(g * 0.7)}, ${b}, ${node.opacity * 0.4})`);
        gradient.addColorStop(1, `rgba(50, 100, 255, 0)`);
        
        ctx.beginPath();
        ctx.arc(perspectiveX, perspectiveY, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Main node core
        ctx.beginPath();
        ctx.arc(perspectiveX, perspectiveY, node.size, 0, Math.PI * 2);
        const coreOpacity = node.opacity * (0.8 + node.z * 0.2);
        ctx.fillStyle = `rgba(255, 255, 255, ${coreOpacity})`;
        ctx.fill();

        // Inner highlight for 3D effect
        ctx.beginPath();
        const highlightOffset = node.size * 0.25;
        ctx.arc(perspectiveX - highlightOffset, perspectiveY - highlightOffset, node.size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${node.opacity * 0.9})`;
        ctx.fill();

        // Outer ring for depth perception
        if (node.z > 0.6) {
          ctx.beginPath();
          ctx.arc(perspectiveX, perspectiveY, node.size + 1, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(150, 200, 255, ${node.opacity * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      setNodes(updatedNodes);
      setConnections(updatedConnections);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [nodes, connections, dimensions]);

  return (
    <motion.div 
      className="fixed inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 bg-black"
        style={{ filter: 'blur(0.5px)' }}
      />
    </motion.div>
  );
};

export default NeuralNetworkBackground; 