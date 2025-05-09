import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

const ROTATION_RANGE = 20;
const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;

const HolographicCard = ({ children, className = "", innerClassName = "", style = {}, innerStyle = {} }) => {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const shineX = useMotionValue(0);
    const shineY = useMotionValue(0);
  
    const xSpring = useSpring(x, { stiffness: 200, damping: 20 });
    const ySpring = useSpring(y, { stiffness: 200, damping: 20 });
  
    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;
  
    const handleMouseMove = (e) => {
      if (!ref.current) return;
  
      const rect = ref.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
  
      const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
      const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;
  
      const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
      const rY = mouseX / width - HALF_ROTATION_RANGE;
  
      x.set(rX);
      y.set(rY);
  
      shineX.set(e.clientX - rect.left);
      shineY.set(e.clientY - rect.top);
    };
  
    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };
  
    const darkShine = useMotionTemplate`
      radial-gradient(
        400px circle at ${shineX}px ${shineY}px,
        rgba(0, 200, 10, 0.8),
        transparent 100%
        z-100
      )
    `;
  
    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
          transform,
          ...style,
        }}
        className={`relative overflow-hidden rounded-xl ${className}`}
      >
        {/* Brillo negro */}
        <motion.div
          style={{ background: darkShine }}
          className="absolute inset-0 pointer-events-none z-10 transition-all duration-300"
        />
  
        {/* Contenido en 3D */}
        <div
          style={{
            transform: "translateZ(75px)",
            transformStyle: "preserve-3d",
            ...innerStyle,
          }}
          className={`relative z-20 ${innerClassName}`}
        >
          {children}
        </div>
      </motion.div>
    );
  };
  
export default HolographicCard;
