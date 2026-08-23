// About.jsx
import React, { useState } from "react";
import { db } from "../mockData";
import MaskedHeading from "../components/MaskedHeading";
import Tilt from "../components/Tilt";
import ScrollReveal from "../components/ScrollReveal";
import ThreeDImage from "../components/ThreeDImage";

export default function About({ simulatedDate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Please fill out all required fields.");
      return;
    }

    // Register simulated alert mail
    db.addNotification({
      title: "New Contact Form Inquiry",
      message: `Simulated contact email received from ${name} (${email}).`,
      type: "contact",
      targetRoles: ["admin"],
      emailSent: true,
      emailDetails: {
        to: "care@mobileinn.lk",
        subject: `Contact Inquiry from ${name}`,
        body: `Dear Admin Team,\n\nA new customer contact inquiry has been submitted:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "Not Provided"}\nSimulated Date: ${simulatedDate}\n\nMessage:\n"${message}"\n\nPlease follow up accordingly.`
      }
    });

    setSubmitted(true);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="container">
      {/* Page Header */}
      <div 
        style={{ 
          padding: "3.5rem 2rem 2.5rem 2rem", 
          textAlign: "center", 
          marginBottom: "1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <ThreeDImage 
          src="/logomi.png" 
          alt="MOBILE INN Logo" 
          className="premium-animated-logo float-animation"
          style={{
            height: "180px",
            width: "auto",
            marginBottom: "1.5rem"
          }}
          imgStyle={{
            height: "180px",
            width: "auto",
            objectFit: "contain"
          }}
          intensity={1.2}
          glow={true}
          glowColor="rgba(0, 113, 227, 0.25)"
        />
        <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1.5px" }}>Who We Are</span>
        <MaskedHeading
          text="About MOBILE INN"
          mediaType="video"
          src="/iphone.mp4"
          fillScale={1.3}
          parallax={30}
          reveal="wipe"
          trigger="view"
          style={{
            marginTop: "0.5rem",
            marginBottom: "0.5rem"
          }}
        />
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "600px", margin: "0.75rem auto 0 auto", lineHeight: "1.5" }}>
          Sri Lanka's premier destination for original Apple iPhones, brand-new flagships, and certified pre-owned devices.
        </p>
      </div>

      <div className="about-main-grid">
        
        {/* Left: Content summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <ScrollReveal variant="fade-up">
            <Tilt intensity={4} className="glass-panel" style={{ border: "1px solid var(--border-glass)" }}>
              <h3 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.75rem", fontWeight: "600", letterSpacing: "-0.01em" }}>Our Commitment</h3>
              <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "1.25rem" }}>
                At <strong>MOBILE INN</strong>, we bridge the gap between quality and affordability. We specialize in sourcing brand-new products with official manufacturer warranties, alongside a premium tier of rigorously inspected second-hand Apple iPhones.
              </p>
              <div className="grid-2col" style={{ fontSize: "0.85rem", gap: "1rem" }}>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-glass)", margin: "0" }}>
                  <span style={{ color: "var(--cyan)", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>100% Genuine Models</span>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.78rem", lineHeight: "1.4" }}>All devices undergo strict diagnostic evaluations.</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-glass)", margin: "0" }}>
                  <span style={{ color: "var(--cyan)", fontWeight: "600", display: "block", marginBottom: "0.25rem" }}>Variant Customization</span>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.78rem", lineHeight: "1.4" }}>Separate storage categories from 128GB up to 1TB.</span>
                </div>
              </div>
            </Tilt>
          </ScrollReveal>

          {/* Head Office & Management */}
          <ScrollReveal variant="fade-up" delay={0.05}>
            <Tilt intensity={4} className="glass-panel" style={{ border: "1px solid var(--border-glass)", background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)" }}>
              <h3 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "1rem", fontWeight: "600", letterSpacing: "-0.01em" }}>
                🏢 Head Office & Management
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Managing Director */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "rgba(0, 113, 227, 0.08)", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid rgba(0, 113, 227, 0.2)" }}>
                  <div style={{ 
                    background: "var(--gradient-cyan-blue)", 
                    width: "42px", 
                    height: "42px", 
                    borderRadius: "50%", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    boxShadow: "0 4px 15px rgba(0, 113, 227, 0.3)"
                  }}>
                    👤
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--cyan)", fontWeight: "600", display: "block" }}>Managing Director</span>
                    <strong style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>S. BANUSHAN</strong>
                  </div>
                </div>
  
                {/* Contact Details Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem", fontSize: "0.9rem", paddingLeft: "0.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "1.2rem", color: "var(--cyan)", width: "24px", display: "inline-block", textAlign: "center" }}>📞</span>
                    <div>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>Hotline</span>
                      <a href="tel:+94772519160" style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: "500", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "var(--cyan)"} onMouseOut={(e) => e.target.style.color = "var(--text-primary)"}>+94 77 251 9160</a>
                    </div>
                  </div>
  
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "1.2rem", color: "var(--cyan)", width: "24px", display: "inline-block", textAlign: "center" }}>✉️</span>
                    <div>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>Email Address</span>
                      <a href="mailto:mobileinn0000@gmail.com" style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: "500", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "var(--cyan)"} onMouseOut={(e) => e.target.style.color = "var(--text-primary)"}>mobileinn0000@gmail.com</a>
                    </div>
                  </div>
  
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <span style={{ fontSize: "1.2rem", color: "var(--cyan)", width: "24px", display: "inline-block", textAlign: "center", marginTop: "2px" }}>📍</span>
                    <div>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>Address</span>
                      <span style={{ color: "var(--text-primary)", fontWeight: "500", lineHeight: "1.4" }}>
                        No. 330A, Kasthuriyar Road,<br />Jaffna, Sri Lanka.
                      </span>
                    </div>
                  </div>

                  {/* Google Maps Live Location Embed */}
                  <div style={{ marginTop: "0.5rem", borderRadius: "14px", overflow: "hidden", border: "1px solid var(--border-glass-bright)", boxShadow: "0 4px 15px rgba(0,0,0,0.15)" }}>
                    <iframe 
                      title="MOBILE INN Live Location Map"
                      src="https://maps.google.com/maps?q=No.%20330A,%20Kasthuriyar%20Road,%20Jaffna,%20Sri%20Lanka&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                      width="100%" 
                      height="200" 
                      style={{ border: 0, display: "block" }} 
                      allowFullScreen="" 
                      loading="lazy" 
                    />
                  </div>
                </div>
              </div>
            </Tilt>
          </ScrollReveal>
        </div>

        {/* Right: Contact Form */}
        <ScrollReveal variant="fade-up" delay={0.1} style={{ height: "100%" }}>
          <Tilt intensity={3} className="glass-panel" style={{ height: "100%", margin: 0 }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", fontWeight: "700" }}>Inquire With Us</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginBottom: "1.25rem" }}>
              Send us a message and our support staff will contact you via email or phone.
            </p>
  
            {submitted && (
              <div style={{ 
                padding: "0.75rem 1rem", 
                background: "rgba(16, 185, 129, 0.1)", 
                border: "1px solid var(--emerald)", 
                color: "var(--emerald)", 
                borderRadius: "8px", 
                fontSize: "0.8rem",
                marginBottom: "1rem"
              }}>
                ✓ Inquiry sent successfully! Admin log generated in outbox.
              </div>
            )}
  
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group" style={{ marginBottom: "0" }}>
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Anand" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
  
              <div className="form-group" style={{ marginBottom: "0" }}>
                <label className="form-label">Email Address *</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="customer@gmail.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
  
              <div className="form-group" style={{ marginBottom: "0" }}>
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="+94 77 123 4567" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>
  
              <div className="form-group" style={{ marginBottom: "0" }}>
                <label className="form-label">Message *</label>
                <textarea 
                  className="form-textarea" 
                  rows={3} 
                  placeholder="Ask about second hand device warranty terms, stock requests..." 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  required 
                />
              </div>
  
              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>
                Send Inquiry
              </button>
            </form>
          </Tilt>
        </ScrollReveal>

      </div>
    </div>
  );
}
