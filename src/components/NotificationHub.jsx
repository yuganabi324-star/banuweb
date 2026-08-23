// NotificationHub.jsx
import React, { useState } from "react";

export default function NotificationHub({ notifications }) {
  const [selectedNotif, setSelectedNotif] = useState(null);

  return (
    <div className="glass-panel" style={{ marginTop: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.75rem" }}>
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "var(--cyan)", boxShadow: "var(--glow-cyan)" }}></span>
            SMTP Mail & SMS Dispatcher Hub
          </h3>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
            Real-time simulated email and mobile notifications sent to Customers, Staff, and Admins.
          </p>
        </div>
        <span className="badge badge-new" style={{ fontSize: "0.7rem" }}>
          {notifications.length} Logs
        </span>
      </div>

      {notifications.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
          No notifications triggered yet. Book a phone or update status to see email notifications.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* List of dispatches */}
          <div style={{ maxHeight: "350px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.5rem", paddingRight: "0.5rem" }}>
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => setSelectedNotif(notif)}
                className={`glass-panel notif-item ${notif.type}`}
                style={{ 
                  padding: "0.75rem", 
                  cursor: "pointer", 
                  background: selectedNotif && selectedNotif.id === notif.id ? "rgba(255,255,255,0.06)" : "rgba(10,10,18,0.3)",
                  borderColor: selectedNotif && selectedNotif.id === notif.id ? "var(--cyan)" : "var(--border-glass)",
                  margin: "0"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: "600", fontSize: "0.85rem" }}>{notif.title}</span>
                  <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {notif.message}
                </p>
                <div style={{ marginTop: "0.4rem", display: "flex", gap: "0.5rem", fontSize: "0.65rem" }}>
                  {notif.emailSent && <span style={{ color: "var(--cyan)" }}>📧 Email Sent</span>}
                  {notif.smsSent && <span style={{ color: "var(--emerald)" }}>💬 SMS Sent</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Mail Content Viewer */}
          <div className="glass-panel" style={{ background: "rgba(5,5,10,0.5)", border: "1px dashed var(--border-glass-bright)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "250px" }}>
            {selectedNotif ? (
              <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                <div>
                  <div style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.5rem", marginBottom: "0.75rem", fontSize: "0.8rem" }}>
                    <div style={{ marginBottom: "0.25rem" }}><span style={{ color: "var(--text-muted)" }}>Type: </span><span style={{ textTransform: "capitalize", color: "white", fontWeight: "600" }}>{selectedNotif.type}</span></div>
                    <div style={{ marginBottom: "0.25rem" }}><span style={{ color: "var(--text-muted)" }}>To: </span><span style={{ color: "var(--cyan)" }}>{selectedNotif.emailDetails?.to || "N/A"}</span></div>
                    <div><span style={{ color: "var(--text-muted)" }}>Subject: </span><span style={{ color: "white", fontWeight: "500" }}>{selectedNotif.emailDetails?.subject || "N/A"}</span></div>
                  </div>
                  <div style={{ 
                    whiteSpace: "pre-wrap", 
                    fontFamily: "monospace", 
                    fontSize: "0.75rem", 
                    color: "var(--text-secondary)", 
                    maxHeight: "180px", 
                    overflowY: "auto",
                    background: "#08080f",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    border: "1px solid rgba(255,255,255,0.03)"
                  }}>
                    {selectedNotif.emailDetails?.body || "No email body template."}
                  </div>
                </div>
                
                {selectedNotif.smsDetails && (
                  <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "0.5rem", marginTop: "0.5rem", fontSize: "0.75rem" }}>
                    <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.65rem", textTransform: "uppercase" }}>💬 SMS Dispatch Payload ({selectedNotif.smsDetails.to})</span>
                    <p style={{ color: "var(--emerald)", fontStyle: "italic", marginTop: "0.15rem" }}>"{selectedNotif.smsDetails.body}"</p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center", padding: "1.5rem" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: "0.5rem", opacity: "0.5" }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Select a dispatch log from the list on the left to read the generated email templates.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
