// Timeline.jsx
import React from "react";

export default function Timeline({ status, depositAmount }) {
  // Define steps for the deposit-based order lifecycle
  const steps = [
    { key: "pending", label: "Booking Received", desc: "Your booking request is logged and awaiting store review." },
    { key: "approved", label: "Booking Approved", desc: `Store approved. Please discuss and pay the Rs. ${depositAmount?.toLocaleString()} deposit.` },
    { key: "confirmed", label: "Deposit Paid & Confirmed", desc: "Advance deposit received. Your device has been reserved." },
    { key: "shipped", label: "Out for Delivery / Ready", desc: "The device is shipped or ready for pickup. Remaining balance due." },
    { key: "completed", label: "Transaction Completed", desc: "Device received and final balance paid. Thank you!" }
  ];

  if (status === "cancelled") {
    return (
      <div className="glass-panel" style={{ borderLeft: "4px solid var(--rose)", padding: "1rem", marginTop: "1rem" }}>
        <h4 style={{ color: "var(--rose)", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          Booking Cancelled
        </h4>
        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
          This reservation has been cancelled by the store administrator or staff.
        </p>
      </div>
    );
  }

  // Determine current active index
  const getActiveIndex = () => {
    switch (status) {
      case "pending": return 0;
      case "approved": return 1;
      case "confirmed": return 2;
      case "shipped": return 3;
      case "completed": return 4;
      default: return 0;
    }
  };

  const activeIndex = getActiveIndex();

  return (
    <div className="timeline">
      {steps.map((step, idx) => {
        const isCompleted = idx < activeIndex;
        const isActive = idx === activeIndex;
        
        let statusClass = "";
        if (isCompleted) statusClass = "completed";
        else if (isActive) statusClass = "active";

        return (
          <div key={step.key} className={`timeline-item ${statusClass}`}>
            <div className="timeline-badge"></div>
            <div className="timeline-content">
              <h4 style={{ 
                fontSize: "0.95rem", 
                fontWeight: "600",
                color: isActive ? "var(--cyan)" : (isCompleted ? "var(--emerald)" : "var(--text-secondary)"),
                transition: "var(--transition-smooth)"
              }}>
                {step.label}
              </h4>
              <p style={{ 
                fontSize: "0.75rem", 
                color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                marginTop: "0.15rem",
                lineHeight: "1.3"
              }}>
                {step.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
