// Login.jsx
import React, { useState } from "react";


export default function Login({ onLoginSuccess, setCurrentPage }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password !== "admin123") {
      setError("Incorrect password for Admin account.");
      return;
    }

    const adminUser = {
      uid: "admin-uid",
      name: "Admin User",
      email: "admin@mobileinn.com",
      role: "admin",
      createdAt: new Date().toISOString()
    };

    onLoginSuccess(adminUser);
    setCurrentPage("admin-dashboard");
  };

  return (
    <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 120px)", padding: "2rem 0" }}>
      <div className="glass-panel" style={{ width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "800", background: "var(--gradient-cyan-blue)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.25rem" }}>
            Admin Portal
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Sign in to access your Mobile Inn administrative dashboard.
          </p>
        </div>

        {error && (
          <div style={{ 
            padding: "0.75rem 1rem", 
            background: "rgba(244, 63, 94, 0.1)", 
            border: "1px solid var(--rose)", 
            color: "var(--rose)", 
            borderRadius: "8px", 
            fontSize: "0.8rem" 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="form-group" style={{ marginBottom: "0" }}>
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>
            Sign In
          </button>
        </form>

      </div>
    </div>
  );
}
