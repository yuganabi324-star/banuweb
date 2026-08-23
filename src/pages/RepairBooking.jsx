// RepairBooking.jsx - WhatsApp-Only Mobile Repair Booking System
import React from "react";
import Tilt from "../components/Tilt";
import ScrollReveal from "../components/ScrollReveal";
import ThreeDImage from "../components/ThreeDImage";

export default function RepairBooking({ currentUser, repairServices, onRepairBookingSuccess, setCurrentPage }) {
  return (
    <div className="container" style={{ padding: "1.5rem 1.5rem 4rem 1.5rem" }}>

      {/* Promotional Ads Banner Section (Page Topper) */}
      <div style={{ marginBottom: "2.5rem" }}>
        <ScrollReveal variant="fade-up">
          <h3 style={{ 
            fontSize: "1.1rem", 
            fontWeight: "700", 
            marginBottom: "1.25rem", 
            color: "var(--cyan)", 
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "1.5px"
          }}>
            Special Promotions & Offers
          </h3>
        </ScrollReveal>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
          gap: "1.5rem",
          maxWidth: "960px",
          margin: "0 auto"
        }}>
          {/* Ad Banner 1 */}
          <ScrollReveal variant="fade-up" delay={0.05}>
            <Tilt intensity={6} className="glass-panel ad-banner-card ad-float-1" style={{ padding: "0.5rem", borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", margin: 0 }}>
              <ThreeDImage 
                src="/banner1.jpg" 
                alt="Promo Banner 1" 
                style={{ width: "100%", height: "auto", display: "block" }} 
                imgStyle={{ borderRadius: "8px", objectFit: "cover" }}
                intensity={1.0}
                glow={true}
                glowColor="rgba(0, 242, 254, 0.15)"
              />
            </Tilt>
          </ScrollReveal>
          {/* Ad Banner 2 */}
          <ScrollReveal variant="fade-up" delay={0.1}>
            <Tilt intensity={6} className="glass-panel ad-banner-card ad-float-2" style={{ padding: "0.5rem", borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", margin: 0 }}>
              <ThreeDImage 
                src="/banner2.jpg" 
                alt="Promo Banner 2" 
                style={{ width: "100%", height: "auto", display: "block" }} 
                imgStyle={{ borderRadius: "8px", objectFit: "cover" }}
                intensity={1.0}
                glow={true}
                glowColor="rgba(0, 242, 254, 0.15)"
              />
            </Tilt>
          </ScrollReveal>
        </div>
      </div>
      
      {/* Header Banner */}
      <ScrollReveal variant="fade-up" delay={0.15}>
        <Tilt intensity={4} className="glass-panel" style={{ textAlign: "center", padding: "3.5rem 2rem", maxWidth: "800px", margin: "0 auto", border: "1px solid var(--border-glass-bright)", borderRadius: "28px" }}>
          <span className="badge badge-new" style={{ fontSize: "0.75rem", marginBottom: "0.75rem" }}>
            🛠️ Expert Certified Repair Center
          </span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: "800", background: "var(--gradient-cyan-blue)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem" }}>
            Mobile Phone Repair Booking
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: "650px", margin: "0.5rem auto 1.5rem auto", lineHeight: "1.6" }}>
            Book certified repair services for <strong>iPhones</strong> and <strong>Android smartphones</strong>. Connect with our expert technicians instantly via WhatsApp for quick diagnosis, transparent repair quotes, and booking confirmation.
          </p>
  
          <div style={{ marginTop: "2rem" }}>
            <a 
              href="https://wa.me/94772519160?text=Hello%20Mobile%20Inn%2C%20I'd%20like%20to%20book%20a%20mobile%20repair%20service."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ 
                background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
                borderColor: "#22c55e",
                color: "white",
                fontSize: "1.05rem",
                padding: "0.85rem 2rem",
                borderRadius: "9999px",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                textDecoration: "none",
                boxShadow: "0 6px 20px rgba(34, 197, 94, 0.3)",
                fontWeight: "700",
                transition: "transform 0.2s ease"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.432.001 9.851-4.409 9.854-9.842.002-2.632-1.022-5.105-2.885-6.97C16.48 1.94 14.02 .916 11.397.915 5.96.915 1.548 5.326 1.545 10.76c-.001 1.624.425 3.21 1.232 4.614l-.98 3.579 3.662-.96-.002.001zM17.486 14.37c-.322-.162-1.908-.942-2.203-1.049-.296-.108-.51-.162-.725.162-.215.324-.834 1.049-1.022 1.265-.188.216-.376.243-.698.082-.323-.162-1.36-.5-2.593-1.6-.96-.855-1.607-1.912-1.795-2.237-.188-.324-.02-.5-.182-.661-.146-.146-.323-.378-.484-.567-.16-.189-.215-.324-.323-.541-.108-.216-.054-.405-.027-.567.027-.162.215-.513.323-.675.108-.162.146-.27.215-.405.068-.135.033-.256-.013-.351-.047-.095-.405-1.022-.555-1.38-.147-.354-.296-.307-.406-.313-.105-.005-.226-.007-.348-.007-.122 0-.323.046-.492.23-.169.183-.645.63-.645 1.537 0 .907.66 1.784.752 1.907.093.123 1.299 1.984 3.148 2.782.44.19 1.037.38 1.413.498.414.13.79.112 1.08.069.324-.047 1.908-.78 2.178-1.535.269-.756.269-1.403.189-1.537-.08-.135-.296-.216-.618-.378z" />
              </svg>
              <span>Quick Booking via WhatsApp</span>
            </a>
          </div>
        </Tilt>
      </ScrollReveal>

    </div>
  );
}
