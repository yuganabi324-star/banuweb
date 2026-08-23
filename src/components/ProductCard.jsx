// ProductCard.jsx - Apple Store Showcase Style Card Component
import React, { useState } from "react";
import Tilt from "./Tilt";
import ThreeDImage from "./ThreeDImage";

const ProductCard = React.memo(function ProductCard({ product, onBookNow, onLearnMore }) {
  // Available storage options
  const storageOptions = Object.keys(product.prices || {});
  const [selectedStorage, setSelectedStorage] = useState(storageOptions[0] || "128gb");
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  // Active price
  const price = product.prices[selectedStorage] || 0;

  // Color options (fallback defaults if not provided)
  const defaultColors = product.condition === "new" ? [
    { name: "Copper Titanium", hex: "#cfa683", bgGrad: "linear-gradient(135deg, rgba(61, 35, 20, 0.7) 0%, rgba(23, 13, 7, 0.9) 100%)" },
    { name: "Silver Steel", hex: "#e2e2e7", bgGrad: "linear-gradient(135deg, rgba(28, 39, 56, 0.7) 0%, rgba(10, 17, 26, 0.9) 100%)" },
    { name: "Black Titanium", hex: "#343335", bgGrad: "linear-gradient(135deg, rgba(31, 31, 36, 0.7) 0%, rgba(9, 9, 11, 0.9) 100%)" }
  ] : [
    { name: "Space Gray", hex: "#4b4b4d", bgGrad: "linear-gradient(135deg, rgba(35, 35, 45, 0.7) 0%, rgba(15, 15, 25, 0.95) 100%)" },
    { name: "Starlight", hex: "#f0e6d2", bgGrad: "linear-gradient(135deg, rgba(40, 35, 25, 0.7) 0%, rgba(18, 15, 10, 0.95) 100%)" },
    { name: "Pacific Blue", hex: "#2c4c6e", bgGrad: "linear-gradient(135deg, rgba(20, 40, 65, 0.7) 0%, rgba(8, 18, 30, 0.9) 100%)" }
  ];

  const colors = (product.colors && product.colors.length > 0) ? product.colors : defaultColors;
  const activeColor = colors[selectedColorIdx] || colors[0] || {};

  return (
    <Tilt intensity={8} className="apple-card" style={{ animationDelay: "inherit" }}>
      {/* Top Image Hero Box */}
      <div 
        className="apple-card-image-wrapper"
        style={{ 
          background: activeColor.bgGrad || "linear-gradient(135deg, rgba(20, 25, 45, 0.8) 0%, rgba(10, 12, 22, 0.95) 100%)" 
        }}
      >
        <ThreeDImage 
          src={product.image} 
          alt={`${product.brand} ${product.model}`}
          className="apple-card-img"
          imgStyle={{ maxHeight: "250px", width: "auto" }}
          intensity={0.8}
          glow={false}
          hoverTilt={false}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop";
          }}
        />

        {/* Badges Overlay */}
        <div className="apple-card-badges">
          <span className={`badge ${product.condition === "new" ? "badge-new" : "badge-used"}`}>
            {product.condition === "new" ? "Brand New" : "Second Hand"}
          </span>
          {!product.stock && (
            <span className="badge badge-danger">Out of Stock</span>
          )}
        </div>
      </div>

      {/* Color Selection Dots */}
      <div className="apple-color-dots">
        {colors.map((c, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedColorIdx(idx)}
            title={c.name}
            className={`color-dot ${selectedColorIdx === idx ? "active" : ""}`}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>

      {/* Product Content & Typography */}
      <div className="apple-card-body">
        <h3 className="apple-card-title">{product.model}</h3>

        <p className="apple-card-tagline">
          {product.tagline || product.description}
        </p>

        {/* Storage Capacity Selector */}
        <div className="apple-storage-container">
          {storageOptions.map((storage) => (
            <button
              key={storage}
              onClick={() => setSelectedStorage(storage)}
              className={`apple-storage-pill ${selectedStorage === storage ? "active" : ""}`}
            >
              {storage.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Price & Monthly Installment Line */}
        <div className="apple-card-price-row">
          <div className="apple-card-price-main">
            From <strong>Rs. {price.toLocaleString()}</strong>
          </div>

        </div>

        {/* Action Buttons: Learn More & Buy > */}
        <div className="apple-card-actions">
          <button 
            type="button"
            onClick={() => onLearnMore && onLearnMore(product, selectedStorage, price, activeColor)}
            className="btn-apple-learn"
          >
            Learn more
          </button>

          <button 
            type="button"
            onClick={() => onBookNow(product, selectedStorage, price, activeColor)}
            disabled={!product.stock}
            className={`btn-apple-buy ${!product.stock ? "disabled" : ""}`}
            style={{
              background: product.stock ? "linear-gradient(135deg, #22c55e 0%, #15803d 100%)" : "var(--bg-secondary)",
              borderColor: product.stock ? "#22c55e" : "var(--border-glass)",
              color: product.stock ? "white" : "var(--text-muted)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem"
            }}
          >
            {product.stock ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ display: "block" }}>
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.432.001 9.851-4.409 9.854-9.842.002-2.632-1.022-5.105-2.885-6.97C16.48 1.94 14.02 .916 11.397.915 5.96.915 1.548 5.326 1.545 10.76c-.001 1.624.425 3.21 1.232 4.614l-.98 3.579 3.662-.96-.002.001zM17.486 14.37c-.322-.162-1.908-.942-2.203-1.049-.296-.108-.51-.162-.725.162-.215.324-.834 1.049-1.022 1.265-.188.216-.376.243-.698.082-.323-.162-1.36-.5-2.593-1.6-.96-.855-1.607-1.912-1.795-2.237-.188-.324-.02-.5-.182-.661-.146-.146-.323-.378-.484-.567-.16-.189-.215-.324-.323-.541-.108-.216-.054-.405-.027-.567.027-.162.215-.513.323-.675.108-.162.146-.27.215-.405.068-.135.033-.256-.013-.351-.047-.095-.405-1.022-.555-1.38-.147-.354-.296-.307-.406-.313-.105-.005-.226-.007-.348-.007-.122 0-.323.046-.492.23-.169.183-.645.63-.645 1.537 0 .907.66 1.784.752 1.907.093.123 1.299 1.984 3.148 2.782.44.19 1.037.38 1.413.498.414.13.79.112 1.08.069.324-.047 1.908-.78 2.178-1.535.269-.756.269-1.403.189-1.537-.08-.135-.296-.216-.618-.378z" />
                </svg>
                <span>Book via WhatsApp</span>
              </>
            ) : "Sold Out"}
          </button>
        </div>
      </div>
    </Tilt>
  );
});

export default ProductCard;
