import React, { useEffect, useRef } from "react";
import "./ScrollReveal.css";

export default function ScrollReveal({ children, variant = "fade-up", delay = 0, className = "", style = {}, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      el.classList.add("revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("revealed");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.08 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={ref} 
      className={`reveal-on-scroll ${variant} ${className}`.trim()} 
      style={{ 
        animationDelay: `${delay}s`,
        transitionDelay: `${delay}s`,
        ...style 
      }} 
      {...rest}
    >
      {children}
    </div>
  );
}
