'use client';

import React, { useState, useEffect, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);

  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check for touch device only on the client side
    if (typeof window !== 'undefined') {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    let animationFrameId: number;

    const LERP_FACTOR = 0.15; // Reduced for smoother movement

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a, button')
      ) {
        setIsHoveringLink(true);
      } else {
        setIsHoveringLink(false);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    const animate = () => {
      // Use transform instead of left/top for better performance
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
      }

      // Animate outline with smoother interpolation
      outlineX += (mouseX - outlineX) * LERP_FACTOR;
      outlineY += (mouseY - outlineY) * LERP_FACTOR;
      
      if (cursorOutlineRef.current) {
        cursorOutlineRef.current.style.transform = `translate(${outlineX - 15}px, ${outlineY - 15}px)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTouchDevice]);

  // Don't render the custom cursor on touch devices
  if (isTouchDevice) {
    return null;
  }

  const outlineSize = isHoveringLink ? '40px' : '30px';
  const dotSize = isHoveringLink ? '0px' : '6px';
  const outlineColor = isHoveringLink ? 'rgb(236 72 153)' : 'rgb(45 212 191)';

  return (
    <>
    <div
        ref={cursorDotRef}
        className="fixed rounded-full pointer-events-none z-[9999] will-change-transform"
        style={{
          width: dotSize,
          height: dotSize,
          backgroundColor: outlineColor,
          transition: 'width 0.2s ease-out, height 0.2s ease-out, background-color 0.2s ease-out',
        }}
      />
      <div
        ref={cursorOutlineRef}
        className="fixed rounded-full pointer-events-none z-[9999] will-change-transform"
      style={{
          width: outlineSize,
          height: outlineSize,
          border: `2px solid ${outlineColor}`,
          opacity: isHoveringLink ? 0.5 : 1,
          transition: 'width 0.3s ease-out, height 0.3s ease-out, opacity 0.3s ease-out, border-color 0.3s ease-out',
      }}
    />
    </>
  );
};

export default CustomCursor; 