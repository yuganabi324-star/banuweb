import React from "react";
import "./FloatingShapes.css";

export default function FloatingShapes() {
  return (
    <div className="floating-shapes-container" aria-hidden="true">
      <div className="shape shape-1" />
      <div className="shape shape-2" />
      <div className="shape shape-3" />
      <div className="shape shape-4" />
    </div>
  );
}
