// CustomerStore.jsx - Apple Store Showcase Grid Page
import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import Tilt from "../components/Tilt";
import ScrollReveal from "../components/ScrollReveal";
import FloatingShapes from "../components/FloatingShapes";
import ThreeDImage from "../components/ThreeDImage";

const CustomerStore = React.memo(function CustomerStore({ products, onBookNow }) {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = React.useDeferredValue(searchTerm);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("all"); // 'all', 'new', 'second-hand'
  const [sortBy, setSortBy] = useState("default"); // 'default', 'price-asc', 'price-desc'

  // Modal State for "Learn More"
  const [learnMoreProduct, setLearnMoreProduct] = useState(null);

  const brands = ["All", "Apple", "Samsung", "Redmi", "Honor", "Nubia"];

  // Filter products
  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      // Brand release filter
      if (!product.isReleased) return false;

      // Search query matches brand or model
      const matchesSearch = 
        product.model.toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(deferredSearchTerm.toLowerCase());
      
      // Brand filter
      const matchesBrand = selectedBrand === "All" || product.brand.toLowerCase() === selectedBrand.toLowerCase();
      
      // Condition filter
      const matchesCondition = selectedCondition === "all" || product.condition === selectedCondition;

      return matchesSearch && matchesBrand && matchesCondition;
    });
  }, [products, deferredSearchTerm, selectedBrand, selectedCondition]);

  // Sort products based on their starting prices (lowest available storage capacity)
  const sortedProducts = React.useMemo(() => {
    const getMinPrice = (p) => {
      const prices = Object.values(p.prices || {});
      return prices.length > 0 ? Math.min(...prices) : 0;
    };

    return [...filteredProducts].sort((a, b) => {
      if (sortBy === "price-asc") {
        return getMinPrice(a) - getMinPrice(b);
      } else if (sortBy === "price-desc") {
        return getMinPrice(b) - getMinPrice(a);
      }
      return 0; // Default sort
    });
  }, [filteredProducts, sortBy]);

  const marqueeText = "✨📱 வணக்கம்! Mobile INN-க்கு உங்களை அன்புடன் வரவேற்கிறோம்! 💙     🌟 உங்கள் அடுத்த தலைமுறை Smartphone அனுபவம் இங்கே தொடங்குகிறது.     📱 Premium Mobiles • 🔥 Latest Models • 💎 Best Deals";

  return (
    <>
      {/* Tamil Scrolling Marquee Banner */}
      <div className="tamil-marquee-container">
        <div className="tamil-marquee-content">
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
        </div>
      </div>

      <div className="container">
        {/* High-Impact Interactive Store Promo Banner */}
        <ScrollReveal variant="fade-up">
          <Tilt 
            intensity={4}
            className="glass-panel animated-banner-entrance" 
            style={{ 
              margin: "0 auto 2.5rem auto", 
              padding: "0", 
              borderRadius: "24px", 
              overflow: "hidden", 
              border: "1px solid var(--border-glass-bright)",
              position: "relative",
              background: "linear-gradient(135deg, rgba(0, 113, 227, 0.1) 0%, rgba(0, 242, 254, 0.05) 100%)",
              boxShadow: "0 15px 35px rgba(0, 113, 227, 0.15)",
              transformStyle: "preserve-3d"
            }}
          >
            <FloatingShapes />
            <div className="store-promo-banner-grid">
              <div style={{ padding: "3rem", zIndex: 2, textAlign: "left" }}>
                <span className="badge badge-new" style={{ fontSize: "0.8rem", marginBottom: "1rem", letterSpacing: "1px" }}>
                  ✨ EXCLUSIVE LAUNCH OFFER
                </span>
                <h1 style={{ 
                  fontSize: "2.8rem", 
                  fontWeight: "800", 
                  background: "var(--gradient-cyan-blue)", 
                  WebkitBackgroundClip: "text", 
                  WebkitTextFillColor: "transparent", 
                  lineHeight: "1.2", 
                  marginBottom: "1rem" 
                }}>
                  Upgrade to the Future Today
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                  Get unparalleled deals on the newest iPhone 17 Pro, iPhone Air, and Samsung Galaxy flagships. Enjoy our certified Mobile Inn warranty.
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <button 
                    onClick={() => {
                      const el = document.getElementById("catalog-showcase");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }} 
                    className="btn btn-primary"
                    style={{ borderRadius: "9999px", padding: "0.7rem 1.8rem" }}
                  >
                    Browse Store Catalog
                  </button>
                  <a 
                    href="https://wa.me/94772519160?text=Hello%20Mobile%20Inn%2C%20I'd%20like%20to%20know%20more%20about%20your%20current%20store%20promotions%20and%20offers." 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-secondary"
                    style={{ borderRadius: "9999px", padding: "0.7rem 1.8rem" }}
                  >
                    Chat with S. Banushan
                  </a>
                </div>
              </div>
              <div style={{ 
                height: "100%", 
                minHeight: "380px", 
                position: "relative", 
                overflow: "hidden", 
                display: "flex", 
                alignItems: "flex-end", 
                justifyContent: "center",
                paddingBottom: "2.5rem",
                background: "radial-gradient(circle at center, rgba(0, 113, 227, 0.15) 0%, transparent 70%)"
              }}>
                {/* Glowing Pedestals Container */}
                <div className="promo-pedestals-container">
                  
                  {/* Pedestal 1: iPhone 17 Pro Max */}
                  <div className="promo-pedestal">
                    {/* Floating Phone Image */}
                    <ThreeDImage 
                      src="/iphone_17_pro_max.png" 
                      alt="iPhone 17 Pro Max" 
                      className="promo-phone-img"
                      intensity={1.1}
                      glow={true}
                      glowColor="rgba(0, 242, 254, 0.25)"
                    />
                    {/* Neon Pedestal Base */}
                    <div className="promo-pedestal-base">
                      {/* Beam Glow */}
                      <div className="promo-beam-glow" />
                    </div>
                    {/* Text Label */}
                    <span className="promo-label">
                      iPhone 17 Pro Max
                    </span>
                  </div>
  
                  {/* Pedestal 2: Galaxy S26 Ultra */}
                  <div className="promo-pedestal">
                    {/* Floating Phone Image */}
                    <ThreeDImage 
                      src="/26ultra.png" 
                      alt="Galaxy S26 Ultra" 
                      className="promo-phone-img galaxy"
                      intensity={1.1}
                      glow={true}
                      glowColor="rgba(0, 113, 227, 0.25)"
                    />
                    {/* Neon Pedestal Base */}
                    <div className="promo-pedestal-base galaxy">
                      {/* Beam Glow */}
                      <div className="promo-beam-glow galaxy" />
                    </div>
                    {/* Text Label */}
                    <span className="promo-label galaxy">
                      Galaxy S26 Ultra
                    </span>
                  </div>
  
                </div>
                
                {/* Subtle grid pattern background for high tech look */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "center",
                  opacity: 0.5,
                  pointerEvents: "none"
                }} />
              </div>
            </div>
          </Tilt>
        </ScrollReveal>

        {/* Flagship Hero Sections */}
      <div className="apple-hero-container">
        <ScrollReveal variant="fade-up" style={{ width: "100%" }}>
          <Tilt intensity={4} className="apple-hero-block" style={{ width: "100%", borderRadius: "28px" }}>
            <div style={{ zIndex: 2 }}>
              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--amber)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "0.5rem" }}>
                New Release
              </span>
              <h2 className="apple-hero-title" style={{ fontSize: "3rem", lineHeight: "1.1" }}>
                iPhone 17 Pro
              </h2>
              <p className="apple-hero-subtitle" style={{ fontSize: "1.2rem", marginTop: "0.5rem" }}>
                Innovative design for ultimate performance and battery life.
              </p>
              <div className="apple-hero-links" style={{ marginTop: "1rem" }}>
                <button 
                  onClick={() => {
                    const p = products.find(x => x.id === "iphone-17-pro");
                    if (p) onBookNow(p, "128gb", p.prices["128gb"]);
                  }} 
                  className="btn btn-primary"
                  style={{ 
                    fontSize: "0.82rem", 
                    padding: "0.45rem 1.25rem",
                    background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
                    borderColor: "#22c55e",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem"
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.432.001 9.851-4.409 9.854-9.842.002-2.632-1.022-5.105-2.885-6.97C16.48 1.94 14.02 .916 11.397.915 5.96.915 1.548 5.326 1.545 10.76c-.001 1.624.425 3.21 1.232 4.614l-.98 3.579 3.662-.96-.002.001zM17.486 14.37c-.322-.162-1.908-.942-2.203-1.049-.296-.108-.51-.162-.725.162-.215.324-.834 1.049-1.022 1.265-.188.216-.376.243-.698.082-.323-.162-1.36-.5-2.593-1.6-.96-.855-1.607-1.912-1.795-2.237-.188-.324-.02-.5-.182-.661-.146-.146-.323-.378-.484-.567-.16-.189-.215-.324-.323-.541-.108-.216-.054-.405-.027-.567.027-.162.215-.513.323-.675.108-.162.146-.27.215-.405.068-.135.033-.256-.013-.351-.047-.095-.405-1.022-.555-1.38-.147-.354-.296-.307-.406-.313-.105-.005-.226-.007-.348-.007-.122 0-.323.046-.492.23-.169.183-.645.63-.645 1.537 0 .907.66 1.784.752 1.907.093.123 1.299 1.984 3.148 2.782.44.19 1.037.38 1.413.498.414.13.79.112 1.08.069.324-.047 1.908-.78 2.178-1.535.269-.756.269-1.403.189-1.537-.08-.135-.296-.216-.618-.378z" />
                  </svg>
                  <span>Book via WhatsApp</span>
                </button>
                <button 
                  onClick={() => {
                    const p = products.find(x => x.id === "iphone-17-pro");
                    if (p) {
                      const activeCol = p.colors ? p.colors[0] : null;
                      setLearnMoreProduct({ product: p, storage: "128gb", price: p.prices["128gb"], activeColor: activeCol });
                    }
                  }} 
                  className="apple-hero-link"
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.88rem" }}
                >
                  Learn more &gt;
                </button>
              </div>
            </div>
            <div className="apple-hero-img-box" style={{ height: "320px", alignItems: "center", justifyContent: "center", overflow: "visible" }}>
              <div className="apple-hero-img-animator" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <ThreeDImage src="/iphone_17_pro.png" alt="iPhone 17 Pro Concept" className="apple-hero-img hero-img-pro" style={{ height: "90%", width: "auto" }} intensity={1.3} glow={true} glowColor="rgba(0, 242, 254, 0.2)" />
              </div>
            </div>
          </Tilt>
        </ScrollReveal>

        <div className="apple-hero-grid">
          <ScrollReveal variant="fade-up" delay={0.05} style={{ width: "100%" }}>
            <Tilt intensity={6} className="apple-hero-block light-hero" style={{ minHeight: "410px", padding: "2.5rem 1.5rem 1rem 1.5rem", width: "100%", borderRadius: "28px" }}>
            <div style={{ zIndex: 2 }}>
              <h3 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "0.25rem" }}>
                iPhone 17
              </h3>
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                Even more delightful. Even more durable. Lavender finishes.
              </p>
              <div className="apple-hero-links">
                <button 
                  onClick={() => {
                    const p = products.find(x => x.id === "iphone-17");
                    if (p) onBookNow(p, "128gb", p.prices["128gb"]);
                  }} 
                  className="btn btn-primary"
                  style={{ 
                    fontSize: "0.78rem", 
                    padding: "0.35rem 1rem", 
                    borderRadius: "9999px",
                    background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
                    borderColor: "#22c55e",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem"
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.432.001 9.851-4.409 9.854-9.842.002-2.632-1.022-5.105-2.885-6.97C16.48 1.94 14.02 .916 11.397.915 5.96.915 1.548 5.326 1.545 10.76c-.001 1.624.425 3.21 1.232 4.614l-.98 3.579 3.662-.96-.002.001zM17.486 14.37c-.322-.162-1.908-.942-2.203-1.049-.296-.108-.51-.162-.725.162-.215.324-.834 1.049-1.022 1.265-.188.216-.376.243-.698.082-.323-.162-1.36-.5-2.593-1.6-.96-.855-1.607-1.912-1.795-2.237-.188-.324-.02-.5-.182-.661-.146-.146-.323-.378-.484-.567-.16-.189-.215-.324-.323-.541-.108-.216-.054-.405-.027-.567.027-.162.215-.513.323-.675.108-.162.146-.27.215-.405.068-.135.033-.256-.013-.351-.047-.095-.405-1.022-.555-1.38-.147-.354-.296-.307-.406-.313-.105-.005-.226-.007-.348-.007-.122 0-.323.046-.492.23-.169.183-.645.63-.645 1.537 0 .907.66 1.784.752 1.907.093.123 1.299 1.984 3.148 2.782.44.19 1.037.38 1.413.498.414.13.79.112 1.08.069.324-.047 1.908-.78 2.178-1.535.269-.756.269-1.403.189-1.537-.08-.135-.296-.216-.618-.378z" />
                  </svg>
                  <span>Book via WhatsApp</span>
                </button>
                <button 
                  onClick={() => {
                    const p = products.find(x => x.id === "iphone-17");
                    if (p) {
                       const activeCol = p.colors ? p.colors[0] : null;
                       setLearnMoreProduct({ product: p, storage: "128gb", price: p.prices["128gb"], activeColor: activeCol });
                    }
                  }} 
                  className="apple-hero-link"
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem" }}
                >
                  Learn more &gt;
                </button>
              </div>
            </div>
            <div className="apple-hero-img-box" style={{ height: "250px", alignItems: "center", justifyContent: "center", overflow: "visible" }}>
              <div className="apple-hero-img-animator" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <ThreeDImage src="/iphone_17.png" alt="iPhone 17 Concept" className="apple-hero-img hero-img-standard" style={{ height: "90%", width: "auto" }} intensity={1.2} glow={true} glowColor="rgba(168, 85, 247, 0.15)" />
              </div>
            </div>
          </Tilt>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={0.1} style={{ width: "100%" }}>
          <Tilt intensity={6} className="apple-hero-block" style={{ minHeight: "410px", padding: "2.5rem 1.5rem 1rem 1.5rem", background: "linear-gradient(180deg, #1c1c1e 0%, #000000 100%)", width: "100%", borderRadius: "28px" }}>
            <div style={{ zIndex: 2 }}>
              <h3 style={{ fontSize: "1.8rem", fontWeight: "600", color: "#f5f5f7", marginBottom: "0.25rem" }}>
                Certified Refurbished
              </h3>
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                Apple quality check. Fully verified battery health & warranty.
              </p>
              <div className="apple-hero-links">
                <button 
                  onClick={() => {
                    setSelectedCondition("second-hand");
                    setSelectedBrand("Apple");
                    const el = document.getElementById("catalog-showcase");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }} 
                  className="apple-hero-link"
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem" }}
                >
                  Shop Refurbished &gt;
                </button>
              </div>
            </div>
            <div className="apple-hero-img-box" style={{ height: "250px", alignItems: "center", justifyContent: "center", overflow: "visible" }}>
              <div className="apple-hero-img-animator" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <ThreeDImage src="/iphone_17_pro.png" alt="Refurbished Concept" className="apple-hero-img hero-img-refurbished" style={{ height: "90%", opacity: 0.85, width: "auto" }} intensity={1.1} glow={true} />
              </div>
            </div>
          </Tilt>
        </ScrollReveal>
        </div>
      </div>

      {/* Mobile Inn Intelligence Animated Banner */}
      <ScrollReveal variant="fade-up">
        <Tilt intensity={4} className="apple-hero-block intelligence-banner" style={{ marginTop: "1.5rem", minHeight: "220px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: "2rem 3rem", textAlign: "left", background: "var(--bg-secondary)", border: "1px solid var(--border-glass)", borderRadius: "28px" }}>
          <div style={{ zIndex: 2 }}>
            <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--cyan)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "0.25rem" }}>Mobile Inn Intelligence</span>
            <h3 style={{ fontSize: "2.4rem", fontWeight: "700", marginTop: "0.25rem", fontFamily: "var(--font-display)", letterSpacing: "-0.02em", backgroundImage: "linear-gradient(90deg, var(--cyan), var(--blue), var(--cyan), var(--blue))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% auto", animation: "shimmerText 5s ease infinite" }}>
              Hello, Apple Intelligence.
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "0.6rem", maxWidth: "450px", lineHeight: "1.5" }}>
              Experience personal, private, and powerful artificial intelligence built directly into the new iPhone 17 Pro, iPhone Air, and iPhone 16 lineup.
            </p>
          </div>
          <div className="intelligence-glow-ring" />
        </Tilt>
      </ScrollReveal>

      {/* Owner Banner Section */}
      <ScrollReveal variant="fade-up">
        <Tilt intensity={3} className="owner-banner-container animated-banner-entrance" style={{ borderRadius: "24px", overflow: "hidden" }}>
          {/* Left Side: Owner Photo */}
          <div className="owner-banner-img-wrapper" style={{ display: "block" }}>
            <ThreeDImage 
              src="/owner.jpg" 
              alt="Banushan - Founder & Owner of Mobile Inn" 
              className="owner-banner-img" 
              style={{ width: "100%", height: "100%" }}
              imgStyle={{ objectFit: "cover" }}
              intensity={1.0}
              glow={true}
              glowColor="rgba(255, 190, 11, 0.18)"
            />
          </div>
          {/* Right Side: Owner Content */}
          <div className="owner-banner-content">
            <div className="owner-title">
              <span>🚀 Founder & Owner</span>
            </div>
            <h2 className="owner-name">
              👤 Banushan
            </h2>
            <div className="owner-motto">
              ✨ உங்கள் நம்பிக்கை… எங்கள் பொறுப்பு
            </div>
            <div style={{ width: "80px", height: "3px", background: "var(--gradient-cyan-blue)", borderRadius: "2px", margin: "0.5rem 0" }} />
            <div className="owner-highlights">
              <div className="owner-highlight-item">
                <span className="owner-highlight-icon">📱</span>
                <strong>Genuine Mobiles</strong>
              </div>
              <div className="owner-highlight-item">
                <span className="owner-highlight-icon">💎</span>
                <strong>Best Prices</strong>
              </div>
              <div className="owner-highlight-item">
                <span className="owner-highlight-icon">🛡️</span>
                <strong>Trusted Service</strong>
              </div>
            </div>
          </div>
        </Tilt>
      </ScrollReveal>

      {/* Official Mobile Inn Promotional Video */}
      <ScrollReveal variant="fade-up">
        <Tilt intensity={2} className="apple-hero-block video-showcase-banner" style={{ marginTop: "1.5rem", padding: "2.5rem", background: "linear-gradient(180deg, #1c1c1e 0%, #0a0a0b 100%)", border: "1px solid var(--border-glass)", borderRadius: "28px", display: "flex", flexDirection: "column", alignItems: "center", width: "100%", minHeight: "auto" }}>
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--cyan)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block" }}>Official Showcase</span>
            <h3 style={{ fontSize: "2.2rem", fontWeight: "700", marginTop: "0.35rem", color: "#f5f5f7", fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>Mobile Inn Promotional Video</h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "0.5rem", maxWidth: "550px", margin: "0.5rem auto 0 auto", lineHeight: "1.4" }}>
              Experience the genuine flagships, certified pre-owned deals, and professional repair services of MOBILE INN, curated by founder S. Banushan.
            </p>
          </div>
          <div style={{ width: "100%", maxWidth: "840px", position: "relative", borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(255, 255, 255, 0.12)", boxShadow: "0 20px 45px rgba(0, 0, 0, 0.65)" }}>
            <video 
              src="/promo.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
              controls
              style={{ 
                width: "100%", 
                height: "auto",
                display: "block",
                backgroundColor: "#000"
              }} 
            />
          </div>
        </Tilt>
      </ScrollReveal>

      {/* Cinematic iPhone Showcase Video */}
      <ScrollReveal variant="fade-up">
        <Tilt intensity={2} className="apple-hero-block video-showcase-banner" style={{ marginTop: "1.5rem", padding: "2.5rem", background: "linear-gradient(180deg, #1c1c1e 0%, #0a0a0b 100%)", border: "1px solid var(--border-glass)", borderRadius: "28px", display: "flex", flexDirection: "column", alignItems: "center", width: "100%", minHeight: "auto" }}>
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--cyan)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block" }}>Experience iPhone</span>
            <h3 style={{ fontSize: "2.2rem", fontWeight: "700", marginTop: "0.35rem", color: "#f5f5f7", fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>iPhone Cinematic Showcase</h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "0.5rem", maxWidth: "550px", margin: "0.5rem auto 0 auto", lineHeight: "1.4" }}>
              Watch the beautiful craftsmanship, advanced camera system, and incredible performance of the next-generation iPhone series in motion.
            </p>
          </div>
          <div style={{ width: "100%", maxWidth: "840px", position: "relative", borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(255, 255, 255, 0.12)", boxShadow: "0 20px 45px rgba(0, 0, 0, 0.65)" }}>
            <video 
              src="/iphone.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
              controls
              style={{ 
                width: "100%", 
                height: "auto",
                display: "block",
                backgroundColor: "#000"
              }} 
            />
          </div>
        </Tilt>
      </ScrollReveal>


      {/* Promo & Highlights Ads Grid */}
      <div className="promo-ads-grid">
        <ScrollReveal variant="fade-up" delay={0.05} style={{ display: "flex", flex: 1 }}>
          <Tilt intensity={5} className="promo-ad-card" style={{ width: "100%", borderRadius: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", margin: 0 }}>
            <div>
              <div className="promo-ad-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                  <line x1="12" y1="4" x2="12" y2="20" />
                </svg>
              </div>
              <h4 style={{ fontSize: "1.3rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                Mobile Inn Trade In
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                Trade in your current device and get up to Rs. 35,000 in instant credit towards a brand new iPhone 17.
              </p>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <button 
                onClick={() => {
                  const el = document.getElementById("catalog-showcase");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn btn-secondary" 
                style={{ fontSize: "0.78rem", padding: "0.45rem 1rem", borderRadius: "9999px" }}
              >
                Estimate Trade-in Value &gt;
              </button>
            </div>
          </Tilt>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={0.1} style={{ display: "flex", flex: 1 }}>
          <Tilt intensity={5} className="promo-ad-card" style={{ width: "100%", borderRadius: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", margin: 0 }}>
            <div>
              <div className="promo-ad-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h4 style={{ fontSize: "1.3rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                Mobile Inn Care+ Protection
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                Get unlimited diagnostic repairs, screen damage protection, and official battery replacement guarantees.
              </p>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <a 
                href="#repair"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = "#repair";
                  window.location.reload();
                }}
                className="btn btn-secondary" 
                style={{ fontSize: "0.78rem", padding: "0.45rem 1rem", borderRadius: "9999px", textDecoration: "none", display: "inline-block" }}
              >
                Book Service Online &gt;
              </a>
            </div>
          </Tilt>
        </ScrollReveal>
      </div>

      {/* Catalog Showcase Title Section */}
      <div id="catalog-showcase" style={{ margin: "3.5rem 0 1.5rem 0", textAlign: "left" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "600", fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
          Store. <span style={{ color: "var(--text-secondary)", fontWeight: "400" }}>Choose flagship models or pre-owned deals.</span>
        </h2>
      </div>

      {/* Catalog Search & Filtering controls */}
      <div className="glass-panel" style={{ marginBottom: "2rem", padding: "1.25rem 1.5rem" }}>
        <div className="catalog-filters-grid">
          
          {/* Search bar */}
          <div className="form-group" style={{ marginBottom: "0" }}>
            <label className="form-label">Search Models</label>
            <div style={{ position: "relative" }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search e.g. iPhone 17 Pro, iPhone Air, Galaxy..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: "2.5rem" }}
              />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)" }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          {/* Condition Select */}
          <div className="form-group" style={{ marginBottom: "0" }}>
            <label className="form-label">Condition</label>
            <select 
              className="form-select" 
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
            >
              <option value="all">All Conditions</option>
              <option value="new">Brand New Only</option>
              <option value="second-hand">Second Hand Only</option>
            </select>
          </div>

          {/* Sorting Select */}
          <div className="form-group" style={{ marginBottom: "0" }}>
            <label className="form-label">Sort By Price</label>
            <select 
              className="form-select" 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default Catalog</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Brand selection tabs */}
        <div className="tabs-container" style={{ marginTop: "1.25rem", marginBottom: "0", borderBottom: "none" }}>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`tab-btn ${selectedBrand === brand ? "active" : ""}`}
              style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Product Cards */}
      {sortedProducts.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-secondary)" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ marginBottom: "1rem" }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <h3>No Models Found</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
            Try expanding your search criteria or select another brand tab.
          </p>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600" }}>
              SHOWING {sortedProducts.length} MODELS
            </span>
          </div>
          <div className="apple-grid" key={`${selectedBrand}-${selectedCondition}-${sortBy}-${searchTerm}`}>
            {sortedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onBookNow={onBookNow} 
                onLearnMore={(prod, storage, price, activeColor) => {
                  setLearnMoreProduct({ product: prod, storage, price, activeColor });
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Happy Customers Testimonials Section */}
      <div style={{ margin: "5rem 0 2.5rem 0", textAlign: "center" }}>
        <ScrollReveal variant="fade-up">
          <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--cyan)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "0.5rem" }}>
            Community & Trust
          </span>
          <h2 style={{ fontSize: "2.4rem", fontWeight: "700", fontFamily: "var(--font-display)", letterSpacing: "-0.02em", color: "#f5f5f7" }}>
            Loved by Apple Enthusiasts
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: "600px", margin: "0.5rem auto 2.5rem auto", lineHeight: "1.5" }}>
            See why hundreds of customers choose MOBILE INN for their premium flagship upgrades and certified second-hand iPhones.
          </p>
        </ScrollReveal>

        <div className="testimonial-grid">
          {/* Testimonial 1 */}
          <ScrollReveal variant="fade-up" delay={0.05} style={{ display: "flex" }}>
            <Tilt intensity={4} className="testimonial-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", width: "100%", borderRadius: "20px" }}>
              <div style={{ display: "flex", gap: "4px", color: "var(--amber)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                ★★★★★
              </div>
              <p style={{ fontSize: "0.9rem", fontStyle: "italic", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "0.75rem" }}>
                "Upgraded my phone at MOBILE INN. S. Banushan gave me a fantastic trade-in deal. The transaction was seamless, and the device is absolutely flawless. Highly recommended!"
              </p>
              <div>
                <strong style={{ color: "var(--text-primary)", fontSize: "0.95rem" }}>Anand K.</strong>
                <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginLeft: "8px" }}>Verified Buyer</span>
              </div>
            </Tilt>
          </ScrollReveal>

          {/* Testimonial 2 */}
          <ScrollReveal variant="fade-up" delay={0.1} style={{ display: "flex" }}>
            <Tilt intensity={4} className="testimonial-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", width: "100%", borderRadius: "20px" }}>
              <div style={{ display: "flex", gap: "4px", color: "var(--amber)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                ★★★★★
              </div>
              <p style={{ fontSize: "0.9rem", fontStyle: "italic", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "0.75rem" }}>
                "I bought a pre-owned iPhone 15 Pro. The battery was at 100% capacity, and the showroom warranty gives so much peace of mind. Excellent customer support!"
              </p>
              <div>
                <strong style={{ color: "var(--text-primary)", fontSize: "0.95rem" }}>Dilani S.</strong>
                <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginLeft: "8px" }}>Verified Buyer</span>
              </div>
            </Tilt>
          </ScrollReveal>
        </div>
      </div>

      {/* Learn More Specification Modal */}
      {learnMoreProduct && (
        <div className="modal-overlay" onClick={() => setLearnMoreProduct(null)}>
          <div 
            className="modal-content" 
            style={{ maxWidth: "680px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={() => setLearnMoreProduct(null)}>&times;</button>
            
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <span className={`badge ${learnMoreProduct.product.condition === "new" ? "badge-new" : "badge-used"}`} style={{ marginBottom: "0.5rem" }}>
                {learnMoreProduct.product.condition === "new" ? "Brand New Flagship" : "Certified Pre-Owned"}
              </span>
              <h2 style={{ fontSize: "2rem", fontWeight: "800", marginTop: "0.25rem" }}>
                {learnMoreProduct.product.model}
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "500px", margin: "0.4rem auto 0 auto" }}>
                {learnMoreProduct.product.tagline || learnMoreProduct.product.description}
              </p>
            </div>

            {/* Hero Image Box inside Modal */}
            <div style={{
              background: learnMoreProduct.activeColor?.bgGrad || "rgba(10, 15, 30, 0.8)",
              borderRadius: "16px",
              padding: "2rem",
              textAlign: "center",
              marginBottom: "1.5rem",
              border: "1px solid var(--border-glass)",
              display: "flex",
              justifyContent: "center"
            }}>
              <ThreeDImage 
                src={learnMoreProduct.product.image} 
                alt={learnMoreProduct.product.model} 
                style={{ maxHeight: "320px", maxWidth: "100%", width: "auto", height: "auto", borderRadius: "12px" }}
                imgStyle={{ maxHeight: "320px", width: "auto", objectFit: "contain" }}
                intensity={1.0}
                glow={true}
              />
              <div style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--cyan)", fontWeight: "600", position: "absolute", bottom: "2.5rem" }}>
                Selected Finish: {learnMoreProduct.activeColor?.name || "Standard Finish"} ({learnMoreProduct.storage.toUpperCase()})
              </div>
            </div>

            {/* Gallery finishes selection inside modal */}
            {learnMoreProduct.product.colors && learnMoreProduct.product.colors.length > 0 && (
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem", letterSpacing: "0.05em", fontWeight: "600" }}>AVAILABLE FINISHES GALLERY</span>
                <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  {learnMoreProduct.product.colors.map((col, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLearnMoreProduct(prev => ({ 
                        ...prev, 
                        activeColor: col 
                      }))}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: col.hex,
                        border: learnMoreProduct.activeColor?.name === col.name ? "2px solid #ffffff" : "1px solid rgba(255,255,255,0.25)",
                        cursor: "pointer",
                        outline: "none",
                        transition: "all 0.2s ease",
                        transform: learnMoreProduct.activeColor?.name === col.name ? "scale(1.15)" : "scale(1)",
                        boxShadow: learnMoreProduct.activeColor?.name === col.name ? "0 0 8px rgba(255, 255, 255, 0.4)" : "none"
                      }}
                      title={col.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Spec Highlights Grid */}
            <div className="spec-highlights-grid">
              <div className="glass-panel" style={{ padding: "1rem", margin: "0" }}>
                <h4 style={{ fontSize: "0.85rem", color: "var(--cyan)", marginBottom: "0.3rem" }}>⚡ Processor & Performance</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {learnMoreProduct.product.brand === "Apple" ? "Next-Gen Apple Silicon A-Series Bionic Engine with 6-core GPU." : "Qualcomm Snapdragon High Performance Octa-Core Processor."}
                </p>
              </div>

              <div className="glass-panel" style={{ padding: "1rem", margin: "0" }}>
                <h4 style={{ fontSize: "0.85rem", color: "var(--cyan)", marginBottom: "0.3rem" }}>📸 Camera Array</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  Advanced Fusion Camera System with 4K Dolby Vision, Smart HDR 5, and 5x Telephoto Optical Zoom.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: "1rem", margin: "0" }}>
                <h4 style={{ fontSize: "0.85rem", color: "var(--cyan)", marginBottom: "0.3rem" }}>🔋 Battery & Charging</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  Up to 29 hours video playback. Fast charging (50% in 30 mins) & MagSafe Wireless support.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: "1rem", margin: "0" }}>
                <h4 style={{ fontSize: "0.85rem", color: "var(--cyan)", marginBottom: "0.3rem" }}>🛡️ Warranty & Guarantee</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {learnMoreProduct.product.condition === "new" ? "1-Year Official Apple / Manufacturer Global Warranty." : "6-Month Mobile Inn Certified Showroom Warranty + 100% Battery Guarantee."}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", borderTop: "1px solid var(--border-glass)", paddingTop: "1.25rem" }}>
              <div>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>PRICE ({learnMoreProduct.storage.toUpperCase()})</span>
                <span style={{ fontSize: "1.4rem", fontWeight: "800", color: "white" }}>
                  Rs. {learnMoreProduct.price.toLocaleString()}
                </span>
              </div>

              <button 
                className="btn btn-primary"
                style={{ 
                  borderRadius: "9999px", 
                  padding: "0.6rem 1.75rem",
                  background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
                  borderColor: "#22c55e",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem"
                }}
                onClick={() => {
                  const { product: prod, storage, price, activeColor } = learnMoreProduct;
                  setLearnMoreProduct(null);
                  onBookNow(prod, storage, price, activeColor);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.432.001 9.851-4.409 9.854-9.842.002-2.632-1.022-5.105-2.885-6.97C16.48 1.94 14.02 .916 11.397.915 5.96.915 1.548 5.326 1.545 10.76c-.001 1.624.425 3.21 1.232 4.614l-.98 3.579 3.662-.96-.002.001zM17.486 14.37c-.322-.162-1.908-.942-2.203-1.049-.296-.108-.51-.162-.725.162-.215.324-.834 1.049-1.022 1.265-.188.216-.376.243-.698.082-.323-.162-1.36-.5-2.593-1.6-.96-.855-1.607-1.912-1.795-2.237-.188-.324-.02-.5-.182-.661-.146-.146-.323-.378-.484-.567-.16-.189-.215-.324-.323-.541-.108-.216-.054-.405-.027-.567.027-.162.215-.513.323-.675.108-.162.146-.27.215-.405.068-.135.033-.256-.013-.351-.047-.095-.405-1.022-.555-1.38-.147-.354-.296-.307-.406-.313-.105-.005-.226-.007-.348-.007-.122 0-.323.046-.492.23-.169.183-.645.63-.645 1.537 0 .907.66 1.784.752 1.907.093.123 1.299 1.984 3.148 2.782.44.19 1.037.38 1.413.498.414.13.79.112 1.08.069.324-.047 1.908-.78 2.178-1.535.269-.756.269-1.403.189-1.537-.08-.135-.296-.216-.618-.378z" />
                </svg>
                <span>Book via WhatsApp</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
    </>
  );
});

export default CustomerStore;
