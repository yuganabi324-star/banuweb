// CustomerDashboard.jsx - Customer Dashboard with Phone Reservations & Repair Bookings Tracking
import React, { useState } from "react";
import Timeline from "../components/Timeline";

const CustomerDashboard = React.memo(function CustomerDashboard({ 
  currentUser, 
  bookings = [], 
  repairBookings = [],
  onPayDeposit, 
  setCurrentPage 
}) {
  const [activeTab, setActiveTab] = useState("repairs"); // 'repairs' or 'phones'
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  
  // No local card payment state needed - bookings handled via WhatsApp

  // Filter bookings for this logged-in customer only
  const userBookings = React.useMemo(() => {
    return bookings.filter((b) => b.customerId === currentUser?.uid || b.customerEmail?.toLowerCase() === currentUser?.email?.toLowerCase());
  }, [bookings, currentUser]);

  const userRepairBookings = React.useMemo(() => {
    return repairBookings.filter((rb) => rb.customerId === currentUser?.uid || rb.customerEmail?.toLowerCase() === currentUser?.email?.toLowerCase());
  }, [repairBookings, currentUser]);

  const toggleTimeline = (id) => {
    if (expandedBookingId === id) {
      setExpandedBookingId(null);
    } else {
      setExpandedBookingId(id);
    }
  };

  // Helper for Repair Status Step index
  const getRepairStepIndex = (status) => {
    const stages = ["booked", "received", "diagnosing", "repairing", "testing", "ready", "completed"];
    const idx = stages.indexOf(status?.toLowerCase());
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="container">
      <div className="dashboard-shell">
        
        {/* Left Profile Summary Pane */}
        <div className="dashboard-sidebar">
          <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "var(--gradient-cyan-blue)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "1.5rem",
                color: "#ffffff",
                margin: "0 auto 0.75rem auto",
                boxShadow: "var(--glow-cyan)"
              }}>
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "C"}
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>{currentUser?.name}</h3>
              <span className="badge badge-new" style={{ fontSize: "0.6rem", marginTop: "0.25rem" }}>Verified Customer</span>
            </div>

            <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Email address</span>
                <span style={{ color: "var(--text-primary)", fontWeight: "500", wordBreak: "break-word" }}>{currentUser?.email}</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Mobile Phone</span>
                <span style={{ color: "var(--text-primary)", fontWeight: "500" }}>{currentUser?.phone}</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Joined on</span>
                <span style={{ color: "var(--text-primary)" }}>
                  {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                </span>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button 
                onClick={() => setActiveTab("repairs")}
                className={`btn btn-sm ${activeTab === "repairs" ? "btn-primary" : "btn-secondary"}`}
                style={{ width: "100%", textAlign: "left" }}
              >
                🛠️ My Repair Tickets ({userRepairBookings.length})
              </button>

              <button 
                onClick={() => setActiveTab("phones")}
                className={`btn btn-sm ${activeTab === "phones" ? "btn-primary" : "btn-secondary"}`}
                style={{ width: "100%", textAlign: "left" }}
              >
                📱 Phone Reservations ({userBookings.length})
              </button>
            </div>
          </div>
        </div>

        {/* Right Bookings & Repair Tickets History Pane */}
        <div className="dashboard-content">
          
          {/* TAB 1: Mobile Repair Tickets */}
          {activeTab === "repairs" && (
            <div className="glass-panel" style={{ minHeight: "380px" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "700", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.75rem", marginBottom: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>🛠️ My Mobile Repair Tickets</span>
                <button className="btn btn-sm btn-primary" onClick={() => setCurrentPage("repair-booking")}>
                  + Book New Repair
                </button>
              </h2>

              {userRepairBookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: "1rem", opacity: "0.5" }}>
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                  <h3 style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>No active repair bookings</h3>
                  <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", marginBottom: "1.5rem" }}>
                    Have a cracked screen, battery issue, or software problem on your iPhone or Android? Book certified repair online.
                  </p>
                  <button className="btn btn-primary" onClick={() => setCurrentPage("repair-booking")}>
                    Book Repair Service
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {userRepairBookings.map((rb) => {
                    const isExpanded = expandedBookingId === rb.id;
                    const stepIdx = getRepairStepIndex(rb.repairStatus);

                    return (
                      <div 
                        key={rb.id}
                        className="glass-panel"
                        style={{
                          background: "rgba(10,18,40,0.3)",
                          borderColor: isExpanded ? "var(--cyan)" : "var(--border-glass)"
                        }}
                      >
                        {/* Summary Header Row */}
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <span style={{ fontSize: "0.68rem", color: "var(--cyan)", fontWeight: "bold", fontFamily: "monospace" }}>
                                TICKET #{rb.id}
                              </span>
                              <span className="badge badge-new" style={{ fontSize: "0.6rem" }}>
                                {rb.deviceBrand} ({rb.deviceType})
                              </span>
                            </div>

                            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginTop: "0.2rem" }}>
                              {rb.deviceBrand} {rb.phoneModel}
                            </h3>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                              Repairs: <b>{rb.selectedServices.map(s => s.serviceName).join(", ")}</b>
                            </p>
                          </div>

                          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                            <div>
                              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", display: "block", textAlign: "right" }}>REPAIR TOTAL</span>
                              <span style={{ fontSize: "1.05rem", fontWeight: "800", color: "white" }}>
                                Rs. {rb.pricingBreakdown?.grandTotalRepairCost.toLocaleString()}
                              </span>
                            </div>

                            <div style={{ textAlign: "right" }}>
                              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", display: "block" }}>WORKFLOW STAGE</span>
                              <span style={{ 
                                fontSize: "0.8rem", 
                                fontWeight: "700",
                                color: rb.repairStatus === "completed" ? "var(--emerald)" : rb.repairStatus === "ready" ? "var(--cyan)" : "var(--amber)",
                                textTransform: "uppercase"
                              }}>
                                {rb.repairStatus}
                              </span>
                            </div>

                            <button 
                              className="btn btn-sm btn-secondary" 
                              onClick={() => toggleTimeline(rb.id)}
                            >
                              {isExpanded ? "Hide Details" : "Track Progress"}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Progress Timeline & Detailed Price Breakdown */}
                        {isExpanded && (
                          <div style={{ marginTop: "1.25rem", borderTop: "1px solid var(--border-glass)", paddingTop: "1.25rem" }}>
                            
                            {/* Live Repair Workflow Bar */}
                            <div style={{ marginBottom: "1.5rem" }}>
                              <h4 style={{ fontSize: "0.85rem", color: "var(--cyan)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                                🛠️ Certified Workshop Repair Progress Tracker
                              </h4>

                              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
                                {[
                                  { label: "Booked", stage: "booked" },
                                  { label: "Received", stage: "received" },
                                  { label: "Diagnosing", stage: "diagnosing" },
                                  { label: "In Repair", stage: "repairing" },
                                  { label: "Testing", stage: "testing" },
                                  { label: "Ready", stage: "ready" },
                                  { label: "Completed", stage: "completed" }
                                ].map((st, i) => {
                                  const isPassed = stepIdx >= i;
                                  const isCurrent = stepIdx === i;

                                  return (
                                    <div key={st.stage} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: "80px", textAlign: "center" }}>
                                      <div style={{
                                        width: "28px",
                                        height: "28px",
                                        borderRadius: "50%",
                                        background: isCurrent ? "var(--cyan)" : isPassed ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.05)",
                                        color: isCurrent ? "#030712" : isPassed ? "var(--emerald)" : "var(--text-muted)",
                                        border: isCurrent ? "2px solid white" : isPassed ? "1px solid var(--emerald)" : "1px solid var(--border-glass)",
                                        fontWeight: "bold",
                                        fontSize: "0.75rem",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: "0.35rem"
                                      }}>
                                        {isPassed ? (isCurrent ? "⚙️" : "✓") : (i + 1)}
                                      </div>
                                      <span style={{ fontSize: "0.7rem", fontWeight: isCurrent ? "700" : "500", color: isCurrent ? "var(--cyan)" : isPassed ? "white" : "var(--text-muted)" }}>
                                        {st.label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Detailed Pricing & Fulfillment Details */}
                            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.5rem" }}>
                                     <div className="glass-panel" style={{ background: "var(--bg-primary)", padding: "1rem" }}>
                                <h4 style={{ fontSize: "0.85rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>Service Request Particulars</h4>
                                <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                  <div><span style={{ color: "var(--text-muted)" }}>Fulfillment Method:</span> <b>{rb.fulfillmentType === "drop-off" ? rb.preferredShowroom : `Doorstep Pickup (${rb.pickupAddress})`}</b></div>
                                  <div><span style={{ color: "var(--text-muted)" }}>Problem Description:</span> <i>"{rb.issueDescription}"</i></div>
                                  {rb.imeiOrSerial && <div><span style={{ color: "var(--text-muted)" }}>IMEI/Serial:</span> <code>{rb.imeiOrSerial}</code></div>}
                                </div>
                              </div>
 
                              <div className="glass-panel" style={{ background: "var(--bg-primary)", padding: "1rem" }}>
                                <h4 style={{ fontSize: "0.85rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>Itemized Cost Statement</h4>
                                <div style={{ fontSize: "0.78rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "var(--text-secondary)" }}>Spare Parts Total</span>
                                    <span>Rs. {rb.pricingBreakdown?.totalPartsPrice.toLocaleString()}</span>
                                  </div>
                                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "var(--text-secondary)" }}>Labor & Diagnostics</span>
                                    <span>Rs. {rb.pricingBreakdown?.totalLaborCharge.toLocaleString()}</span>
                                  </div>
                                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "var(--text-secondary)" }}>Service Charge</span>
                                    <span>Rs. {rb.pricingBreakdown?.totalServiceFee.toLocaleString()}</span>
                                  </div>
                                  <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "0.4rem", marginTop: "0.3rem", display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontWeight: "700" }}>Total Repair Bill</span>
                                    <span style={{ fontWeight: "800", color: "var(--cyan)" }}>Rs. {rb.pricingBreakdown?.grandTotalRepairCost.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>

                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Phone Sales Reservations */}
          {activeTab === "phones" && (
            <div className="glass-panel" style={{ minHeight: "380px" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "700", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.75rem", marginBottom: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>📱 My Phone Reservations</span>
                <span className="badge badge-new" style={{ fontSize: "0.75rem" }}>{userBookings.length} bookings</span>
              </h2>

              {userBookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}>
                  <h3 style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>No reservations made yet</h3>
                  <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", marginBottom: "1.5rem" }}>
                    Check out our store page to secure brand new and second-hand iPhones and Android devices.
                  </p>
                  <button className="btn btn-primary" onClick={() => setCurrentPage("store")}>
                    Browse Store Devices
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {userBookings.map((booking) => {
                    const isExpanded = expandedBookingId === booking.id;
                    
                    let statusColor = "var(--text-secondary)";
                    if (booking.bookingStatus === "approved") statusColor = "var(--amber)";
                    if (booking.bookingStatus === "confirmed") statusColor = "var(--cyan)";
                    if (booking.bookingStatus === "shipped") statusColor = "var(--violet)";
                    if (booking.bookingStatus === "completed") statusColor = "var(--emerald)";
                    if (booking.bookingStatus === "cancelled") statusColor = "var(--rose)";

                    return (
                      <div 
                        key={booking.id} 
                        className="glass-panel" 
                        style={{ 
                          background: "rgba(10,18,40,0.25)",
                          borderColor: isExpanded ? "rgba(255,255,255,0.15)" : "var(--border-glass)"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
                          <div>
                            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", display: "block" }}>
                              RESERVATION ID: {booking.id}
                            </span>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginTop: "0.15rem" }}>
                              {booking.productModel}{" "}
                              <span style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-secondary)" }}>
                                ({booking.selectedStorage})
                              </span>
                            </h3>
                          </div>

                          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                            <div>
                              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", display: "block", textAlign: "right" }}>PHONE VALUE</span>
                              <span style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-primary)" }}>Rs. {booking.price.toLocaleString()}</span>
                            </div>

                            <div style={{ textAlign: "right" }}>
                              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", display: "block" }}>STATUS</span>
                              <span style={{ fontSize: "0.8rem", fontWeight: "600", color: statusColor, textTransform: "uppercase" }}>
                                {booking.bookingStatus}
                              </span>
                            </div>

                            <button className="btn btn-sm btn-secondary" onClick={() => toggleTimeline(booking.id)}>
                              {isExpanded ? "Hide Details" : "Track Order"}
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div style={{ marginTop: "1.25rem", borderTop: "1px solid var(--border-glass)", paddingTop: "1.25rem" }}>
                            {booking.bookingStatus === "approved" && (
                              <div className="glass-panel" style={{ background: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.2)", padding: "1rem", borderRadius: "10px", marginBottom: "1rem" }}>
                                <h4 style={{ color: "var(--amber)", fontSize: "0.95rem" }}>✓ Booking Approved!</h4>
                                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                                  Required Deposit: <b>Rs. {booking.advanceRequiredAmount?.toLocaleString()}</b>. Please coordinate your payment directly with us on WhatsApp.
                                </p>
                                <a 
                                  href={`https://wa.me/94772519160?text=Hi%20Mobile%20Inn%2C%20my%20booking%20%23${booking.id}%20for%20the%20${booking.productModel}%20has%20been%20approved.%20I'd%20like%20to%20confirm%20the%20advance%20deposit.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-primary btn-sm" 
                                  style={{ 
                                    marginTop: "0.5rem",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.35rem",
                                    background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
                                    borderColor: "#22c55e",
                                    color: "white",
                                    textDecoration: "none"
                                  }}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.432.001 9.851-4.409 9.854-9.842.002-2.632-1.022-5.105-2.885-6.97C16.48 1.94 14.02 .916 11.397.915 5.96.915 1.548 5.326 1.545 10.76c-.001 1.624.425 3.21 1.232 4.614l-.98 3.579 3.662-.96-.002.001zM17.486 14.37c-.322-.162-1.908-.942-2.203-1.049-.296-.108-.51-.162-.725.162-.215.324-.834 1.049-1.022 1.265-.188.216-.376.243-.698.082-.323-.162-1.36-.5-2.593-1.6-.96-.855-1.607-1.912-1.795-2.237-.188-.324-.02-.5-.182-.661-.146-.146-.323-.378-.484-.567-.16-.189-.215-.324-.323-.541-.108-.216-.054-.405-.027-.567.027-.162.215-.513.323-.675.108-.162.146-.27.215-.405.068-.135.033-.256-.013-.351-.047-.095-.405-1.022-.555-1.38-.147-.354-.296-.307-.406-.313-.105-.005-.226-.007-.348-.007-.122 0-.323.046-.492.23-.169.183-.645.63-.645 1.537 0 .907.66 1.784.752 1.907.093.123 1.299 1.984 3.148 2.782.44.19 1.037.38 1.413.498.414.13.79.112 1.08.069.324-.047 1.908-.78 2.178-1.535.269-.756.269-1.403.189-1.537-.08-.135-.296-.216-.618-.378z" />
                                  </svg>
                                  <span>Coordinate Deposit on WhatsApp</span>
                                </a>
                              </div>
                            )}

                            <Timeline status={booking.bookingStatus} depositAmount={booking.advanceRequiredAmount} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
});

export default CustomerDashboard;
