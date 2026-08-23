// StaffDashboard.jsx - Technician & Staff Operational Console
import React, { useState } from "react";
import { db } from "../mockData";

const StaffDashboard = React.memo(function StaffDashboard({ 
  products, 
  bookings, 
  repairBookings = [],
  onUpdateBookingStatus, 
  onUpdateRepairBookingStatus,
  onSaveProduct, 
  simulatedDate 
}) {
  const [activeTab, setActiveTab] = useState("repairs"); // 'repairs', 'bookings', or 'catalog'
  const [editingPricesProductId, setEditingPricesProductId] = useState(null);
  const [tempPrices, setTempPrices] = useState({ "128gb": "", "256gb": "", "512gb": "", "1tb": "" });

  const reversedRepairBookings = React.useMemo(() => {
    return [...repairBookings].reverse();
  }, [repairBookings]);

  const reversedBookings = React.useMemo(() => {
    return [...bookings].reverse();
  }, [bookings]);

  const handleStartEditPrices = (product) => {
    setEditingPricesProductId(product.id);
    setTempPrices({
      "128gb": product.prices["128gb"] || "",
      "256gb": product.prices["256gb"] || "",
      "512gb": product.prices["512gb"] || "",
      "1tb": product.prices["1tb"] || ""
    });
  };

  const handleSavePrices = (product) => {
    const updatedPrices = {};
    Object.keys(tempPrices).forEach((key) => {
      if (tempPrices[key] !== "") {
        updatedPrices[key] = Number(tempPrices[key]);
      }
    });

    const updatedProduct = {
      ...product,
      prices: updatedPrices
    };

    onSaveProduct(updatedProduct);
    setEditingPricesProductId(null);
    
    db.addNotification({
      title: "Product Pricing Modified",
      message: `Staff adjusted pricing tiers for ${product.brand} ${product.model}.`,
      type: "inventory",
      targetRoles: ["admin", "staff"],
      emailSent: false
    });
  };

  const handleToggleStock = (product) => {
    const updatedProduct = {
      ...product,
      stock: !product.stock
    };
    onSaveProduct(updatedProduct);

    db.addNotification({
      title: "Stock Availability Changed",
      message: `Staff toggled ${product.brand} ${product.model} availability to: ${!product.stock ? "Out of Stock" : "In Stock"}.`,
      type: "inventory",
      targetRoles: ["admin", "staff"],
      emailSent: false
    });
  };

  return (
    <div className="container">
      <div className="dashboard-shell">
        
        {/* Left Side Tab Navigation */}
        <div className="dashboard-sidebar">
          <div className="glass-panel" style={{ padding: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", color: "var(--cyan)", paddingLeft: "0.5rem" }}>
              Staff Controls
            </h3>
            
            <button 
              onClick={() => setActiveTab("repairs")}
              className={`sidebar-link ${activeTab === "repairs" ? "active" : ""}`}
              style={{ border: "none", background: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
            >
              🛠️ Workshop Repair Queue
            </button>

            <button 
              onClick={() => setActiveTab("bookings")}
              className={`sidebar-link ${activeTab === "bookings" ? "active" : ""}`}
              style={{ border: "none", background: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
            >
              📋 Phone Order Processing
            </button>

            <button 
              onClick={() => setActiveTab("catalog")}
              className={`sidebar-link ${activeTab === "catalog" ? "active" : ""}`}
              style={{ border: "none", background: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
            >
              🏷️ Catalog & Price Sheets
            </button>
          </div>
        </div>

        {/* Right Side Work Panel */}
        <div className="dashboard-content">
          
          {/* TAB 1: Workshop Repair Queue */}
          {activeTab === "repairs" && (
            <div className="glass-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.75rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.4rem", fontWeight: "700" }}>Workshop Repair Queue</h2>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                    Diagnose, replace hardware components, and advance repair ticket status for customers.
                  </p>
                </div>
                <span className="badge badge-new" style={{ fontSize: "0.75rem" }}>
                  {repairBookings.length} Active Tickets
                </span>
              </div>

              {repairBookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}>
                  No repair jobs registered.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Customer</th>
                        <th>Device</th>
                        <th>Services Required</th>
                        <th>Repair Stage</th>
                        <th>Advance Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reversedRepairBookings.map((rb) => (
                        <tr key={rb.id}>
                          <td style={{ fontFamily: "monospace", color: "var(--cyan)", fontWeight: "bold", fontSize: "0.8rem", width: "80px" }}>
                            {rb.id}
                          </td>
                          <td style={{ maxWidth: "140px" }}>
                            <div style={{ fontWeight: "600", fontSize: "0.82rem" }}>{rb.customerName}</div>
                            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>📞 {rb.customerPhone}</div>
                          </td>
                          <td style={{ maxWidth: "140px" }}>
                            <div style={{ fontWeight: "600", fontSize: "0.82rem", whiteSpace: "normal" }}>{rb.deviceBrand} {rb.phoneModel}</div>
                            <span className="badge badge-used" style={{ fontSize: "0.6rem", marginTop: "0.2rem", display: "inline-block" }}>{rb.fulfillmentType}</span>
                          </td>
                          <td style={{ maxWidth: "180px" }}>
                            <div style={{ fontSize: "0.72rem", whiteSpace: "normal", wordBreak: "break-word", lineHeight: "1.3" }}>
                              {rb.selectedServices.map(s => s.serviceName).join(", ")}
                            </div>
                          </td>
                          <td>
                            <span style={{ 
                              fontSize: "0.75rem", 
                              fontWeight: "700",
                              textTransform: "uppercase",
                              color: rb.repairStatus === "completed" ? "var(--emerald)" : "var(--amber)"
                            }}>
                              {rb.repairStatus}
                            </span>
                          </td>
                          <td>
                            <select 
                              className="form-select"
                              style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", width: "135px" }}
                              value={rb.repairStatus}
                              onChange={(e) => onUpdateRepairBookingStatus && onUpdateRepairBookingStatus(rb.id, e.target.value)}
                            >
                              <option value="booked">Booked</option>
                              <option value="received">Received</option>
                              <option value="diagnosing">Diagnosing</option>
                              <option value="repairing">In Repair</option>
                              <option value="testing">Quality Testing</option>
                              <option value="ready">Ready for Pickup</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Phone Order processing */}
          {activeTab === "bookings" && (
            <div className="glass-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.75rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.4rem", fontWeight: "700" }}>Client Phone Orders List</h2>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                    Verify credit payments, review, confirm and update shipping timelines.
                  </p>
                </div>
                <span className="badge badge-new" style={{ fontSize: "0.75rem" }}>
                  {bookings.length} Total Bookings
                </span>
              </div>

              {bookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}>
                  No bookings registered in local logs database.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Client Details</th>
                        <th>Device Requested</th>
                        <th>Amount / Type</th>
                        <th>Status</th>
                        <th>Update Dispatch Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reversedBookings.map((booking) => {
                        return (
                          <tr key={booking.id}>
                            <td>
                              <div style={{ fontWeight: "600" }}>{booking.customerName}</div>
                              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>📧 {booking.customerEmail}</div>
                              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>📞 {booking.customerPhone}</div>
                            </td>
                            <td>
                              <div style={{ fontWeight: "600" }}>{booking.productModel}</div>
                              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)" }}>Storage: {booking.selectedStorage}</div>
                              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>ID: {booking.id}</div>
                            </td>
                            <td>
                              <div style={{ fontWeight: "700" }}>Rs. {booking.price.toLocaleString()}</div>
                              <div style={{ fontSize: "0.75rem" }}>
                                {booking.paymentMethod === "WhatsApp" ? "💬 WhatsApp Booking" : "🏪 Pickup (COD)"}
                              </div>
                            </td>
                            <td>
                              <span style={{ 
                                fontSize: "0.75rem", 
                                fontWeight: "600", 
                                color: booking.bookingStatus === "completed" ? "var(--emerald)" : 
                                       booking.bookingStatus === "cancelled" ? "var(--rose)" : "var(--cyan)",
                                textTransform: "uppercase"
                              }}>
                                {booking.bookingStatus}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "0.3rem" }}>
                                {booking.bookingStatus === "pending" && (
                                  <button 
                                    className="btn btn-sm btn-primary" 
                                    style={{ fontSize: "0.7rem", padding: "0.3rem 0.5rem" }}
                                    onClick={() => {
                                      const defaultDeposit = Math.round((booking.price * 0.20) / 1000) * 1000;
                                      const amt = window.prompt(`Approve booking and request advance deposit. (Phone price: Rs. ${booking.price.toLocaleString()})\n\nEnter Required Deposit (Rs.):`, defaultDeposit);
                                      if (amt !== null) {
                                        onUpdateBookingStatus(booking.id, "approved", Number(amt));
                                      }
                                    }}
                                  >
                                    Approve & Set Deposit
                                  </button>
                                )}
                                {booking.bookingStatus === "approved" && (
                                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                                    Awaiting Rs. {booking.advanceRequiredAmount?.toLocaleString()} Deposit
                                  </span>
                                )}
                                {booking.bookingStatus === "confirmed" && (
                                  <button 
                                    className="btn btn-sm btn-accent" 
                                    style={{ fontSize: "0.7rem", padding: "0.3rem 0.5rem" }}
                                    onClick={() => onUpdateBookingStatus(booking.id, "shipped")}
                                  >
                                    Ship Order
                                  </button>
                                )}
                                {booking.bookingStatus === "shipped" && (
                                  <button 
                                    className="btn btn-sm" 
                                    style={{ background: "var(--emerald)", color: "white", fontSize: "0.7rem", padding: "0.3rem 0.5rem" }}
                                    onClick={() => onUpdateBookingStatus(booking.id, "completed")}
                                  >
                                    Complete Handover
                                  </button>
                                )}
                                {booking.bookingStatus !== "completed" && booking.bookingStatus !== "cancelled" && (
                                  <button 
                                    className="btn btn-sm btn-danger" 
                                    style={{ fontSize: "0.7rem", padding: "0.3rem 0.5rem" }}
                                    onClick={() => onUpdateBookingStatus(booking.id, "cancelled")}
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Catalog list */}
          {activeTab === "catalog" && (
            <div className="glass-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.75rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.4rem", fontWeight: "700" }}>Product Sheets & Pricing</h2>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                    Modify variant pricing and toggle active storefront stock.
                  </p>
                </div>
                <span className="badge badge-new" style={{ fontSize: "0.75rem" }}>
                  {products.length} Products listed
                </span>
              </div>

              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Device Detail</th>
                      <th>Condition</th>
                      <th>Variant Pricing</th>
                      <th>Stock availability</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const isEditing = editingPricesProductId === product.id;

                      return (
                        <tr key={product.id}>
                          <td>
                            <div style={{ fontWeight: "600" }}>{product.model}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{product.brand}</div>
                          </td>
                          <td>
                            <span className={`badge ${product.condition === "new" ? "badge-new" : "badge-used"}`}>
                              {product.condition === "new" ? "Brand New" : "Second Hand"}
                            </span>
                          </td>
                          <td>
                            {isEditing ? (
                              <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", maxWidth: "260px" }}>
                                {["128gb", "256gb", "512gb", "1tb"].map((storage) => (
                                  <div key={storage} style={{ display: "flex", flexDirection: "column", gap: "0.15rem", width: "55px" }}>
                                    <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase" }}>{storage}</span>
                                    <input 
                                      type="number" 
                                      className="form-input" 
                                      style={{ padding: "0.25rem 0.4rem", fontSize: "0.75rem", textAlign: "center" }}
                                      value={tempPrices[storage]}
                                      onChange={(e) => setTempPrices({ ...tempPrices, [storage]: e.target.value })}
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                {Object.keys(product.prices).map((storage) => (
                                  <span key={storage}>
                                    <strong style={{ textTransform: "uppercase", color: "var(--text-primary)" }}>{storage}:</strong> Rs. {product.prices[storage].toLocaleString()}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td>
                            <button 
                              onClick={() => handleToggleStock(product)}
                              className="btn btn-sm btn-secondary"
                              style={{ 
                                fontSize: "0.75rem", 
                                color: product.stock ? "var(--emerald)" : "var(--rose)",
                                borderColor: product.stock ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)",
                                padding: "0.3rem 0.6rem"
                              }}
                            >
                              {product.stock ? "🟢 In Stock" : "🔴 Out of Stock"}
                            </button>
                          </td>
                          <td>
                            {isEditing ? (
                              <div style={{ display: "flex", gap: "0.25rem" }}>
                                <button 
                                  className="btn btn-sm btn-primary" 
                                  style={{ fontSize: "0.7rem", padding: "0.3rem 0.5rem" }}
                                  onClick={() => handleSavePrices(product)}
                                >
                                  Save
                                </button>
                                <button 
                                  className="btn btn-sm btn-secondary" 
                                  style={{ fontSize: "0.7rem", padding: "0.3rem 0.5rem" }}
                                  onClick={() => setEditingPricesProductId(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button 
                                className="btn btn-sm btn-secondary" 
                                style={{ fontSize: "0.7rem", padding: "0.3rem 0.5rem" }}
                                onClick={() => handleStartEditPrices(product)}
                              >
                                Edit Prices
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
});

export default StaffDashboard;
