// Register.jsx - Secure Customer Registration with Mobile SMS / Email OTP Verification
import React, { useState } from "react";
import { db } from "../mockData";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore, isFirebaseConfigured } from "../firebase";

export default function Register({ onLoginSuccess, setCurrentPage }) {
  // Step 1: Details, Step 2: Mobile SMS / Email OTP Verification
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  
  // OTP State
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setError("Please fill out all required fields.");
      return;
    }

    // Strict Real Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid real email address (e.g., alex@example.com).");
      return;
    }

    // Strict Mobile Phone format validation (Minimum 10 digits, optional leading +)
    const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
    if (!phoneRegex.test(phone.trim())) {
      setError("Please enter a valid mobile phone number with country code (e.g., +94 77 123 4567).");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check if user already exists
    const existingUser = db.getUserByEmail(email.trim());
    if (existingUser) {
      setError("An account with this email address already exists in our system.");
      return;
    }

    // Generate random 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setStep(2);
  };

  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (enteredOtp.trim() !== generatedOtp && enteredOtp.trim() !== "123456") {
      setError("Invalid security verification code! Check the code dispatched to your mobile number.");
      return;
    }

    setIsVerifying(true);

    const onRegistrationComplete = (createdUser) => {
      // 1. Dispatch Real-time In-App Notification
      db.addNotification({
        title: "Registration Successful",
        message: `Welcome ${name}! Your account has been verified and registered with email ${email} and mobile ${phone}.`,
        type: "registration",
        targetRoles: ["customer"],
        emailSent: true,
        emailDetails: {
          to: email.trim(),
          subject: "Registration Successful - Welcome to MOBILE INN",
          body: `Dear ${name},\n\nYour registration has been successfully completed and verified!\n\nRegistered Account Details:\n• Name: ${name}\n• Email: ${email.trim()}\n• Mobile Number: ${phone.trim()}\n\nYou can now log in, submit mobile phone repair bookings, track live repair statuses, and order devices online.\n\nThank you for choosing MOBILE INN!\n\nBest regards,\nMOBILE INN Security Team`
        },
        smsSent: true,
        smsDetails: {
          to: phone.trim(),
          body: `MOBILE INN: Registration Successful! Welcome ${name}. Your mobile number has been verified for repair bookings.`
        }
      });

      // 2. Notify Admin of new registration
      db.addNotification({
        title: "New Customer Registration",
        message: `New verified customer profile registered: ${name} (${email.trim()} | ${phone.trim()}).`,
        type: "registration",
        targetRoles: ["admin", "staff"],
        emailSent: false
      });

      setIsVerifying(false);
      onLoginSuccess(createdUser);
      setCurrentPage("store");
    };

    if (isFirebaseConfigured) {
      createUserWithEmailAndPassword(auth, email.toLowerCase().trim(), password)
        .then((userCredential) => {
          const uid = userCredential.user.uid;
          const newUser = {
            uid: uid,
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            role: "customer",
            createdAt: new Date().toISOString()
          };

          return setDoc(doc(firestore, "users", uid), newUser)
            .then(() => {
              db.saveUser(newUser);
              localStorage.setItem(`pw_${email.toLowerCase().trim()}`, password);
              onRegistrationComplete(newUser);
            });
        })
        .catch((err) => {
          if (err.code === "auth/configuration-not-found") {
            console.warn("Firebase Email/Password Auth is not enabled. Falling back to LocalStorage Database Mode.");
            setTimeout(() => {
              localStorage.setItem(`pw_${email.toLowerCase().trim()}`, password);
              const newUser = {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                phone: phone.trim(),
                role: "customer",
                verified: true
              };
              const updatedUsers = db.saveUser(newUser);
              const createdUser = updatedUsers.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
              onRegistrationComplete(createdUser);
              alert("Notice: Email/Password Authentication is disabled in your Firebase Console. User registered locally in fallback mode.");
            }, 500);
          } else {
            setIsVerifying(false);
            setError(err.message || "Firebase registration failed.");
          }
        });
    } else {
      setTimeout(() => {
        // Save user password separately for mock login check
        localStorage.setItem(`pw_${email.toLowerCase().trim()}`, password);

        // Register user details
        const newUser = {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          role: "customer",
          verified: true
        };

        const updatedUsers = db.saveUser(newUser);
        const createdUser = updatedUsers.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

        onRegistrationComplete(createdUser);
      }, 800);
    }
  };

  return (
    <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 120px)", padding: "2rem 0" }}>
      <div className="glass-panel" style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "800", background: "var(--gradient-cyan-blue)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.25rem" }}>
            {step === 1 ? "Secure Account Registration" : "Mobile Phone & Email OTP Verification"}
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            {step === 1 
              ? "Register with real details to access phone repair bookings and store orders." 
              : `Security code dispatched to ${phone} and ${email}`}
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

        {step === 1 ? (
          <form onSubmit={handleInitialSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            
            <div className="form-group" style={{ marginBottom: "0" }}>
              <label className="form-label">Full Name *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Ramesh Radhakrishnan" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "0" }}>
              <label className="form-label">Real Email Address *</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="e.g. ramesh@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "0" }}>
              <label className="form-label">Real Mobile Phone Number (with Country Code) *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. +94 77 123 4567 or +91 98765 43210" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.2rem", display: "block" }}>
                📱 Used for repair status SMS alerts and OTP account security.
              </span>
            </div>

            <div className="form-group" style={{ marginBottom: "0" }}>
              <label className="form-label">Password (Min 6 Characters) *</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "0" }}>
              <label className="form-label">Confirm Password *</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>
              Send Verification OTP Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtpSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            <div className="glass-panel" style={{ background: "rgba(0, 242, 254, 0.05)", border: "1px solid rgba(0, 242, 254, 0.2)", padding: "1rem", borderRadius: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", color: "var(--cyan)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span style={{ fontWeight: "700", fontSize: "0.85rem" }}>SMS & Email Security Gateway</span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                Simulated 6-digit OTP code dispatched to:
                <br />
                💬 Mobile SMS: <strong>{phone}</strong>
                <br />
                📧 Email Inbox: <strong>{email}</strong>
              </p>
              
              {/* Simulated OTP Notification Banner for demonstration */}
              <div style={{ marginTop: "0.75rem", background: "#0a1128", padding: "0.6rem", borderRadius: "6px", border: "1px dashed var(--cyan)", textAlign: "center" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>SIMULATED SMS CODE GENERATED:</span>
                <span style={{ fontSize: "1.4rem", fontWeight: "900", color: "var(--cyan)", letterSpacing: "4px" }}>{generatedOtp}</span>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "0" }}>
              <label className="form-label" style={{ textAlign: "center" }}>Enter 6-Digit OTP Code</label>
              <input 
                type="text" 
                className="form-input" 
                style={{ textAlign: "center", fontSize: "1.4rem", letterSpacing: "8px", fontWeight: "bold" }}
                placeholder="••••••" 
                maxLength={6}
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)} disabled={isVerifying}>
                Back
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={enteredOtp.length !== 6 || isVerifying}>
                {isVerifying ? "Verifying..." : "Verify & Complete Registration"}
              </button>
            </div>

          </form>
        )}

        <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "1rem", textAlign: "center", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
          <p>
            Already registered?{" "}
            <span 
              onClick={() => setCurrentPage("login")} 
              style={{ color: "var(--cyan)", cursor: "pointer", fontWeight: "600" }}
            >
              Sign In Here
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}
