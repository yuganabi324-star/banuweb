import React, { useState, useEffect, useRef } from "react";
import "./ThreeDImage.css";

export default function ThreeDImage({
  src,
  alt,
  className = "",
  style = {},
  imgStyle = {},
  imgClassName = "",
  intensity = 1.0,
  parallaxIntensity = 0.1,
  glow = false,
  glowColor = "rgba(0, 242, 254, 0.12)",
  hoverTilt = true,
  onError = null,
  ...rest
}) {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const isInViewportRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [shadowStyle, setShadowStyle] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Detect mobile and screen size changes
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Detect system-wide preference for reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const handleMotionChange = (e) => setReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("resize", checkMobile);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // Combined Viewport Observer: Entrance reveal trigger & visibility ref for scroll optimization
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (reducedMotion) {
      setIsRevealed(true);
      isInViewportRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
        }
        isInViewportRef.current = entry.isIntersecting;
      },
      { threshold: 0.01, rootMargin: "150px" } // trigger slightly before entering viewport
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  // Scroll Tracking for Dynamic Rotation, Parallax, and Float Depth
  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner || reducedMotion) return;

    let rafId = null;
    let ticking = false;

    const handleScroll = () => {
      // PERFORMANCE OPTIMIZATION: Bypasses getBoundingClientRect() and synchronous layout recalculations
      // entirely if the image is currently off-screen (tracked via IntersectionObserver ref)
      if (!isInViewportRef.current) return;
      if (isHovered && !isMobile) return;

      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(() => {
          ticking = false;
          const rect = container.getBoundingClientRect();
          const viewportHeight = window.innerHeight;

          // Double check viewport bounds
          if (rect.bottom < 0 || rect.top > viewportHeight) return;

          const elementCenter = rect.top + rect.height / 2;
          const distanceFromCenter = elementCenter - viewportHeight / 2;
          
          // Normalize: -1 (at top edge of viewport) to 1 (at bottom edge of viewport)
          const normalizedDistance = Math.max(-1, Math.min(1, distanceFromCenter / (viewportHeight / 2)));

          const factorMultiplier = isMobile ? 0.4 : 1.0;
          const intensityFactor = intensity * factorMultiplier;

          // Calculate smooth scroll rotation and parallax values
          const rotateX = normalizedDistance * -8 * intensityFactor; // rotate around horizontal axis
          const translateY = normalizedDistance * -16 * parallaxIntensity * factorMultiplier; // vertical parallax
          const scale = 1 + (1 - Math.abs(normalizedDistance)) * 0.02 * intensityFactor; // float scale peak
          const translateZ = (1 - Math.abs(normalizedDistance)) * 12 * intensityFactor; // dynamic forward depth

          inner.style.transform = `rotateX(${rotateX.toFixed(2)}deg) translateY(${translateY.toFixed(2)}px) scale(${scale.toFixed(3)}) translateZ(${translateZ.toFixed(1)}px)`;

          // Shadow changes in sync with scroll angle and scale/depth
          const shadowBlur = 18 + (1 - Math.abs(normalizedDistance)) * 12 * intensityFactor;
          const shadowOpacity = 0.32 + (1 - Math.abs(normalizedDistance)) * 0.12 * intensityFactor;
          const shadowY = 12 + normalizedDistance * 12 * intensityFactor; // shadow trailing position

          setShadowStyle({
            filter: `blur(${shadowBlur.toFixed(1)}px)`,
            opacity: shadowOpacity.toFixed(2),
            transform: `translateY(${shadowY.toFixed(1)}px) translateZ(-20px) scale(${scale.toFixed(3)})`
          });
        });
      }
    };

    // Run initial positioning
    handleScroll();

    // Use capture: true to catch scrolls inside page-panels as well
    window.addEventListener("scroll", handleScroll, { capture: true, passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isHovered, isMobile, intensity, parallaxIntensity, reducedMotion]);

  // Desktop Mouse Tilt Handlers (Skip if hoverTilt prop is false)
  const handleMouseMove = (e) => {
    if (!hoverTilt || isMobile || reducedMotion) return;

    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = x / rect.width;
    const py = y / rect.height;

    // Normalize coordinates around center: -0.5 to 0.5
    const rx = (0.5 - py) * 12 * intensity; // tilt X axis
    const ry = (px - 0.5) * 12 * intensity; // tilt Y axis

    const scale = 1.04;
    const translateZ = 20 * intensity;

    inner.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${scale}) translateZ(${translateZ}px)`;

    // Update glow background center coordinates
    if (glow) {
      container.style.setProperty("--glow-x", `${(px * 100).toFixed(1)}%`);
      container.style.setProperty("--glow-y", `${(py * 100).toFixed(1)}%`);
    }

    // Shadow moves opposite to mouse angle for depth realism
    const shadowX = (0.5 - px) * 22 * intensity;
    const shadowY = (0.6 - py) * 22 * intensity;
    const shadowBlur = 30;
    const shadowOpacity = 0.45;

    setShadowStyle({
      filter: `blur(${shadowBlur}px)`,
      opacity: shadowOpacity,
      transform: `translateX(${shadowX.toFixed(1)}px) translateY(${shadowY.toFixed(1)}px) translateZ(-10px) scale(1.04)`
    });
  };

  const handleMouseEnter = () => {
    if (!hoverTilt || isMobile || reducedMotion) return;
    setIsHovered(true);
    
    // Clear any active transitions to make mouse following instantaneous
    const inner = innerRef.current;
    if (inner) inner.style.transition = "none";
  };

  const handleMouseLeave = () => {
    if (!hoverTilt || isMobile || reducedMotion) return;
    setIsHovered(false);

    const inner = innerRef.current;
    if (!inner) return;

    // Smoothly restore default layout positioning
    inner.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
    inner.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)`;

    setShadowStyle({
      transition: "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)"
    });

    // Reset styles after transition
    setTimeout(() => {
      if (inner) inner.style.transition = "";
    }, 500);
  };

  // Helper styles for standard tags
  const containerClass = `threed-img-container ${isRevealed ? "revealed" : ""} ${className}`.trim();

  return (
    <div
      ref={containerRef}
      className={containerClass}
      style={{
        transformStyle: "preserve-3d",
        ...style
      }}
      onMouseMove={hoverTilt ? handleMouseMove : null}
      onMouseEnter={hoverTilt ? handleMouseEnter : null}
      onMouseLeave={hoverTilt ? handleMouseLeave : null}
      {...rest}
    >
      {/* Soft dynamic 3D Shadow layer */}
      {!reducedMotion && (
        <div className="threed-img-shadow" style={shadowStyle} />
      )}

      {/* Dynamic reflective glow / lighting sheet */}
      {!reducedMotion && glow && (
        <div
          className="threed-img-glow"
          style={{
            background: `radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), ${glowColor} 0%, transparent 60%)`,
            opacity: isHovered ? 1 : 0
          }}
        />
      )}

      {/* Tilting & Scroll scaling inner wrapper */}
      <div
        ref={innerRef}
        className="threed-img-inner"
      >
        <img
          src={src}
          alt={alt}
          className={imgClassName}
          style={{
            objectFit: "contain",
            ...imgStyle
          }}
          onError={(e) => {
            if (onError) {
              onError(e);
            } else {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop";
            }
          }}
        />
      </div>
    </div>
  );
}
