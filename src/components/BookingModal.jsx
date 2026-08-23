// BookingModal.jsx
import React, { useState } from "react";

export default function BookingModal({ product, storage, price, currentUser, onClose, onBookingSuccess, setCurrentPage }) {
  const [step, setStep] = useState(1); // 1: Confirmation, 2: Success
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) {
    return (
      <div className="modal-overlay">
        <div className="modal-content" style={{ textAlign: "center", maxWidth: "450px" }}>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
          <div style={{ margin: "1.5rem 0" }}>
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(37, 99, 235, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem auto",
              border: "1px solid var(--cyan)",
              boxShadow: "var(--glow-cyan)"
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>Sign In Required</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5", marginBottom: "1.5rem" }}>
              To reserve a device at MOBILE INN, please log in or register a customer account with a valid email and phone number.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { onClose(); setCurrentPage("login"); }}>
                Sign In / Register
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const submitBookingRequest = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      // Calculate estimated advance payment (20% of value, rounded to nearest 1,000 Rs.)
      const estimatedDeposit = Math.round((price * 0.20) / 1000) * 1000;

      const bookingData = {
        customerId: currentUser.uid,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        customerPhone: currentUser.phone,
        productId: product.id,
        productModel: product.model,
        selectedStorage: storage,
        price: price,
        paymentMethod: "pending", // Decided during advance pay
        paymentStatus: "pending",
        advanceRequiredAmount: estimatedDeposit, // Proposed deposit
        advancePaidAmount: 0
      };
      
      onBookingSuccess(bookingData);
      setIsSubmitting(false);
      setStep(2); // Success step
    }, 1200);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "500px" }}>
        <button className="modal-close-btn" onClick={onClose} disabled={isSubmitting}>&times;</button>
        
        {/* STEP 1: Details Confirmation */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: "1.4rem", marginBottom: "1rem", color: "var(--cyan)" }}>Request Booking Slot</h2>
            
            <div className="glass-panel" style={{ background: "rgba(10,18,40,0.25)", marginBottom: "1.25rem", padding: "1rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", textTransform: "uppercase" }}>Selected Device</span>
              <h3 style={{ fontSize: "1.15rem", margin: "0.25rem 0", color: "white" }}>{product.model}</h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontSize: "0.85rem" }}>
                <span>Storage: <b style={{ textTransform: "uppercase" }}>{storage}</b></span>
                <span>Condition: <b style={{ textTransform: "capitalize" }}>{product.condition === "new" ? "Brand New" : "Second Hand"}</b></span>
              </div>
              <div style={{ borderTop: "1px solid var(--border-glass)", marginTop: "0.75rem", paddingTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Total Price</span>
                <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--cyan)" }}>Rs. {price.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.25rem", textTransform: "uppercase" }}>
                Review Contact Details
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.85rem" }}>
                <div>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Name</span>
                  <p style={{ fontWeight: "500", marginTop: "0.1rem" }}>{currentUser.name}</p>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Phone Number</span>
                  <p style={{ fontWeight: "500", marginTop: "0.1rem" }}>{currentUser.phone}</p>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Registered Email Address</span>
                  <p style={{ fontWeight: "500", marginTop: "0.1rem" }}>{currentUser.email}</p>
                </div>
              </div>
              
              <div className="glass-panel" style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)", padding: "0.75rem", borderRadius: "8px", fontSize: "0.75rem", color: "var(--amber)", marginTop: "0.5rem", lineHeight: "1.4" }}>
                ⚠️ <strong>Advance Deposit Required:</strong> You do not need to pay anything now. Once our staff approves your booking, you can contact the shop to discuss and confirm the advance deposit amount, then pay it securely through the site.
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
              <button className="btn btn-primary" onClick={submitBookingRequest} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Booking Request"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Success Screen */}
        {step === 2 && (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <div style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem auto",
              border: "1px solid var(--emerald)",
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)"
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <h2 style={{ fontSize: "1.6rem", fontWeight: "700", marginBottom: "0.75rem", color: "var(--emerald)" }}>
              Inquiry Sent!
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5", marginBottom: "1.5rem", maxWidth: "420px", margin: "0 auto 1.5rem auto" }}>
              Your booking request for the <strong>{product.model}</strong> has been sent to our dashboards. Admin/Staff will review it, set the required deposit, and approve it.
            </p>

            <div className="glass-panel" style={{ padding: "0.75rem 1.25rem", background: "rgba(10,18,40,0.3)", display: "inline-flex", flexDirection: "column", gap: "0.3rem", borderRadius: "8px", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "1.5rem", textAlign: "left" }}>
              <span>Order ID tracking details sent to:</span>
              <span>📧 Email: <b>{currentUser.email}</b></span>
              <span>💬 SMS: <b>{currentUser.phone}</b></span>
            </div>

            <div>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  onClose();
                  setCurrentPage("customer-dashboard");
                }}
              >
                Go to My Bookings
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
