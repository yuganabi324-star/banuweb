// Navbar.jsx - Header Navigation & Real-time In-App Notification Bell
import React, { useState } from "react";
import "./Navbar.css";

const Navbar = React.memo(function Navbar({ 
  currentUser, 
  onLogout, 
  currentPage, 
  setCurrentPage, 
  simulatedDate, 
  onAdvanceDate,
  theme,
  onToggleTheme,
  notifications = [],
  onMarkAllNotificationsRead,
  onMarkNotificationRead
}) {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter notifications relevant to current user role or specific email
  const userNotifs = React.useMemo(() => {
    return notifications.filter((n) => {
      if (!n.targetRoles) return true;
      if (currentUser) {
        if (currentUser.role === "admin") return true;
        if (currentUser.role === "staff" && (n.targetRoles.includes("staff") || n.targetRoles.includes("admin"))) return true;
        if (currentUser.role === "customer" && n.targetRoles.includes("customer")) {
          if (n.emailDetails && n.emailDetails.to) {
            return n.emailDetails.to.toLowerCase() === currentUser.email.toLowerCase() || n.emailDetails.to.includes("all-users");
          }
          return true;
        }
      } else {
        // Guest: general announcements
        return n.targetRoles.includes("customer");
      }
      return true;
    });
  }, [notifications, currentUser]);

  const unreadCount = React.useMemo(() => {
    return userNotifs.filter((n) => !n.read).length;
  }, [userNotifs]);

  return (
    <>
      <nav className="navbar">
        <div 
          className="nav-logo"
          onClick={() => {
            setCurrentPage("store");
            setMobileMenuOpen(false);
          }}
        >
          <img 
            src="/logomi.png" 
            alt="MOBILE INN Logo" 
            className="premium-animated-logo"
            style={{
              height: "36px",
              width: "auto",
              objectFit: "contain",
              borderRadius: "4px"
            }}
          />
          <div>
            <h1 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
              MOBILE INN
            </h1>
          </div>
        </div>

        {/* Center Navigation Links */}
        <div className="nav-links">
          <button 
            onClick={() => setCurrentPage("store")}
            className={`tab-btn ${currentPage === "store" ? "active" : ""}`}
            style={{ fontSize: "0.82rem", fontWeight: "400" }}
          >
            Store
          </button>

          <button 
            onClick={() => setCurrentPage("repair-booking")}
            className={`tab-btn ${currentPage === "repair-booking" ? "active" : ""}`}
            style={{ fontSize: "0.82rem", fontWeight: "400", display: "flex", alignItems: "center", gap: "0.25rem" }}
          >
            <span>Support & Repair</span>
          </button>

          <button 
            onClick={() => setCurrentPage("about")}
            className={`tab-btn ${currentPage === "about" ? "active" : ""}`}
            style={{ fontSize: "0.82rem", fontWeight: "400" }}
          >
            About
          </button>

          {currentUser && currentUser.role === "admin" && (
            <button 
              onClick={() => setCurrentPage("admin-dashboard")}
              className={`tab-btn ${currentPage === "admin-dashboard" ? "active" : ""}`}
              style={{ fontSize: "0.82rem", fontWeight: "400" }}
            >
              Admin Dashboard
            </button>
          )}
        </div>

        {/* Right controls: Notifications Bell, Theme Switcher, Date Simulator & Auth */}
        <div className="nav-controls">
          
          {/* Real-time In-App Notification Bell */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="btn btn-sm btn-secondary"
              style={{ 
                padding: "0.4rem 0.55rem", 
                borderRadius: "6px", 
                fontSize: "0.8rem", 
                background: "transparent",
                border: "none",
                display: "inline-flex",
                alignItems: "center",
                position: "relative"
              }}
              title="Real-time In-App Notifications"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "0px",
                  right: "0px",
                  background: "var(--rose)",
                  color: "white",
                  fontSize: "0.58rem",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  width: "14px",
                  height: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {unreadCount > 9 ? "9" : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Modal */}
            {showNotifMenu && (
              <div 
                className="glass-panel"
                style={{
                  position: "absolute",
                  top: "40px",
                  right: "0",
                  width: "300px",
                  maxHeight: "380px",
                  overflowY: "auto",
                  zIndex: 1000,
                  padding: "0.85rem",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-glass)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.4rem" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <span>Notifications</span>
                    {unreadCount > 0 && <span className="badge badge-new" style={{ fontSize: "0.55rem", padding: "0.1rem 0.4rem" }}>{unreadCount} new</span>}
                  </h4>
                  
                  {unreadCount > 0 && (
                    <button 
                      onClick={onMarkAllNotificationsRead}
                      style={{ background: "none", border: "none", color: "var(--cyan)", fontSize: "0.68rem", cursor: "pointer" }}
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {userNotifs.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "1.25rem 0", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                    No recent notifications.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {userNotifs.map((n) => (
                      <div 
                        key={n.id}
                        onClick={() => onMarkNotificationRead && onMarkNotificationRead(n.id)}
                        style={{
                          padding: "0.55rem 0.65rem",
                          borderRadius: "8px",
                          background: n.read ? "transparent" : "rgba(41, 151, 255, 0.06)",
                          borderLeft: `2.5px solid ${n.read ? "var(--border-glass)" : "var(--cyan)"}`,
                          fontSize: "0.74rem",
                          cursor: "pointer"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.15rem" }}>
                          <span style={{ fontWeight: "600", color: n.read ? "var(--text-primary)" : "var(--cyan)" }}>{n.title}</span>
                          <span style={{ fontSize: "0.58rem", color: "var(--text-muted)" }}>
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p style={{ color: "var(--text-secondary)", lineHeight: "1.25" }}>
                          {n.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* WhatsApp Top Navigation Button */}
          <a 
            href="https://wa.me/94772519160"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm desktop-only-control"
            style={{ 
              padding: "0.45rem 1rem", 
              borderRadius: "9999px",
              fontSize: "0.82rem", 
              fontWeight: "600",
              background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
              border: "1px solid #22c55e",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "#ffffff",
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.25)",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
            title="Chat with us on WhatsApp"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ display: "block" }}>
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.432.001 9.851-4.409 9.854-9.842.002-2.632-1.022-5.105-2.885-6.97C16.48 1.94 14.02 .916 11.397.915 5.96.915 1.548 5.326 1.545 10.76c-.001 1.624.425 3.21 1.232 4.614l-.98 3.579 3.662-.96-.002.001zM17.486 14.37c-.322-.162-1.908-.942-2.203-1.049-.296-.108-.51-.162-.725.162-.215.324-.834 1.049-1.022 1.265-.188.216-.376.243-.698.082-.323-.162-1.36-.5-2.593-1.6-.96-.855-1.607-1.912-1.795-2.237-.188-.324-.02-.5-.182-.661-.146-.146-.323-.378-.484-.567-.16-.189-.215-.324-.323-.541-.108-.216-.054-.405-.027-.567.027-.162.215-.513.323-.675.108-.162.146-.27.215-.405.068-.135.033-.256-.013-.351-.047-.095-.405-1.022-.555-1.38-.147-.354-.296-.307-.406-.313-.105-.005-.226-.007-.348-.007-.122 0-.323.046-.492.23-.169.183-.645.63-.645 1.537 0 .907.66 1.784.752 1.907.093.123 1.299 1.984 3.148 2.782.44.19 1.037.38 1.413.498.414.13.79.112 1.08.069.324-.047 1.908-.78 2.178-1.535.269-.756.269-1.403.189-1.537-.08-.135-.296-.216-.618-.378z" />
            </svg>
            <span>WhatsApp</span>
          </a>

          {/* Theme Switcher Button */}
          <button 
            onClick={onToggleTheme}
            className="btn btn-sm"
            style={{ 
              padding: "0.4rem 0.55rem", 
              borderRadius: "6px", 
              fontSize: "0.8rem", 
              background: "transparent",
              border: "none",
              display: "inline-flex",
              alignItems: "center"
            }}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="1.8">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="1.8">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>

          {/* Auth Button */}
          {currentUser ? (
            <div className="desktop-only-control" style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "0.78rem", fontWeight: "500" }}>{currentUser.name.split(" ")[0]} ({currentUser.role})</p>
              </div>
              <button onClick={onLogout} className="btn btn-sm btn-secondary" style={{ padding: "0.25rem 0.65rem", fontSize: "0.72rem" }}>
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={() => setCurrentPage("login")} className="btn btn-sm btn-secondary desktop-only-control" style={{ padding: "0.25rem 0.8rem", fontSize: "0.75rem" }}>
              Admin Login
            </button>
          )}

          {/* Hamburger Menu Toggle */}
          <button 
            className={`nav-hamburger ${mobileMenuOpen ? "active" : ""}`} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            title="Toggle Navigation Menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

        </div>
      </nav>

      {/* Mobile Menu Drawer Overlay */}
      <div className={`nav-mobile-drawer ${mobileMenuOpen ? "active" : ""}`}>
        <div className="drawer-links">
          <button 
            onClick={() => {
              setCurrentPage("store");
              setMobileMenuOpen(false);
            }}
            className={`tab-btn ${currentPage === "store" ? "active" : ""}`}
            style={{ fontSize: "1.05rem", fontWeight: "500" }}
          >
            Store
          </button>

          <button 
            onClick={() => {
              setCurrentPage("repair-booking");
              setMobileMenuOpen(false);
            }}
            className={`tab-btn ${currentPage === "repair-booking" ? "active" : ""}`}
            style={{ fontSize: "1.05rem", fontWeight: "500" }}
          >
            Support & Repair
          </button>

          <button 
            onClick={() => {
              setCurrentPage("about");
              setMobileMenuOpen(false);
            }}
            className={`tab-btn ${currentPage === "about" ? "active" : ""}`}
            style={{ fontSize: "1.05rem", fontWeight: "500" }}
          >
            About
          </button>

          {currentUser && currentUser.role === "admin" && (
            <button 
              onClick={() => {
                setCurrentPage("admin-dashboard");
                setMobileMenuOpen(false);
              }}
              className={`tab-btn ${currentPage === "admin-dashboard" ? "active" : ""}`}
              style={{ fontSize: "1.05rem", fontWeight: "500" }}
            >
              Admin Dashboard
            </button>
          )}
        </div>

        <div className="drawer-actions">
          <a 
            href="https://wa.me/94772519160"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm"
            style={{ 
              padding: "0.6rem 1.5rem", 
              borderRadius: "9999px",
              fontSize: "0.85rem", 
              fontWeight: "600",
              background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
              border: "1px solid #22c55e",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#ffffff",
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.25)",
              width: "80%",
              justifyContent: "center"
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ display: "block" }}>
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.432.001 9.851-4.409 9.854-9.842.002-2.632-1.022-5.105-2.885-6.97C16.48 1.94 14.02 .916 11.397.915 5.96.915 1.548 5.326 1.545 10.76c-.001 1.624.425 3.21 1.232 4.614l-.98 3.579 3.662-.96-.002.001zM17.486 14.37c-.322-.162-1.908-.942-2.203-1.049-.296-.108-.51-.162-.725.162-.215.324-.834 1.049-1.022 1.265-.188.216-.376.243-.698.082-.323-.162-1.36-.5-2.593-1.6-.96-.855-1.607-1.912-1.795-2.237-.188-.324-.02-.5-.182-.661-.146-.146-.323-.378-.484-.567-.16-.189-.215-.324-.323-.541-.108-.216-.054-.405-.027-.567.027-.162.215-.513.323-.675.108-.162.146-.27.215-.405.068-.135.033-.256-.013-.351-.047-.095-.405-1.022-.555-1.38-.147-.354-.296-.307-.406-.313-.105-.005-.226-.007-.348-.007-.122 0-.323.046-.492.23-.169.183-.645.63-.645 1.537 0 .907.66 1.784.752 1.907.093.123 1.299 1.984 3.148 2.782.44.19 1.037.38 1.413.498.414.13.79.112 1.08.069.324-.047 1.908-.78 2.178-1.535.269-.756.269-1.403.189-1.537-.08-.135-.296-.216-.618-.378z" />
            </svg>
            <span>WhatsApp Chat</span>
          </a>

          {currentUser ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.55rem", width: "80%" }}>
              <p style={{ fontSize: "0.78rem", fontWeight: "500", color: "var(--text-secondary)" }}>
                {currentUser.name} ({currentUser.role})
              </p>
              <button 
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }} 
                className="btn btn-sm btn-secondary" 
                style={{ padding: "0.45rem 1rem", fontSize: "0.75rem", width: "100%" }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => {
                setCurrentPage("login");
                setMobileMenuOpen(false);
              }} 
              className="btn btn-sm btn-secondary" 
              style={{ padding: "0.45rem 1rem", fontSize: "0.75rem", width: "80%" }}
            >
              Admin Login
            </button>
          )}
        </div>
      </div>
    </>
  );
});

export default Navbar;
