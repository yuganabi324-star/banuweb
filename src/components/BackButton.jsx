// BackButton.jsx - Global Back Button Component for Mobile Inn
import React from "react";

export default function BackButton({ onGoBack, currentPage }) {
  return (
    <div className="container" style={{ marginBottom: "1rem", marginTop: "0.25rem" }}>
      <button 
        onClick={onGoBack} 
        className="btn back-btn-custom"
        title="Go back to previous page"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.55rem",
          padding: "0.45rem 1.1rem",
          borderRadius: "10px",
          fontSize: "0.85rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Back</span>
      </button>
    </div>
  );
}
