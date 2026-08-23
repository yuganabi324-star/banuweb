import React, { useRef, useEffect } from "react";

export default function Tilt({ children, className = "", style = {}, intensity = 12, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const px = x / rect.width;
      const py = y / rect.height;
      
      const rx = (0.5 - py) * intensity;
      const ry = (px - 0.5) * intensity;

      el.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Dynamic glossy glare shine & dynamic shadow offset based on mouse position
      const dx = (px - 0.5) * 15;
      const dy = (py - 0.5) * 15;
      el.style.boxShadow = `
        ${-dx.toFixed(1)}px ${-dy.toFixed(1)}px 30px rgba(0, 0, 0, 0.35),
        0 15px 35px rgba(0, 242, 254, 0.08)
      `;
      
      // Update custom properties for inner elements to parallax
      el.style.setProperty("--mouse-x", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--mouse-y", `${(py * 100).toFixed(1)}%`);
    };

    const handleMouseLeave = () => {
      el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      el.style.boxShadow = "";
      el.style.setProperty("--mouse-x", "50%");
      el.style.setProperty("--mouse-y", "50%");
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [intensity]);

  return (
    <div 
      ref={ref} 
      className={className} 
      style={{ 
        transition: "transform 0.1s ease-out, box-shadow 0.15s ease-out", 
        transformStyle: "preserve-3d", 
        ...style 
      }} 
      {...rest}
    >
      {children}
    </div>
  );
}
