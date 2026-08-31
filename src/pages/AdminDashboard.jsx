// AdminDashboard.jsx - Admin Control Panel with Repair Management & Notification Outbox
import React, { useState } from "react";
import { db } from "../mockData";
import NotificationHub from "../components/NotificationHub";

const PREDEFINED_COLORS = {
  Apple: [
    { name: "Space Gray", hex: "#4b4b4d", bgGrad: "linear-gradient(135deg, rgba(35, 35, 45, 0.75) 0%, rgba(15, 15, 25, 0.95) 100%)" },
    { name: "Silver Steel", hex: "#e2e2e7", bgGrad: "linear-gradient(135deg, rgba(28, 39, 56, 0.75) 0%, rgba(10, 17, 26, 0.95) 100%)" },
    { name: "Starlight", hex: "#f0e6d2", bgGrad: "linear-gradient(135deg, rgba(40, 35, 25, 0.75) 0%, rgba(18, 15, 10, 0.95) 100%)" },
    { name: "Charcoal Black", hex: "#343335", bgGrad: "linear-gradient(135deg, rgba(31, 31, 36, 0.75) 0%, rgba(9, 9, 11, 0.95) 100%)" },
    { name: "Cosmic Orange", hex: "#ff6b35", bgGrad: "linear-gradient(135deg, rgba(255, 107, 53, 0.75) 0%, rgba(50, 15, 5, 0.95) 100%)" },
    { name: "Deep Blue", hex: "#1a2f4c", bgGrad: "linear-gradient(135deg, rgba(26, 47, 76, 0.8) 0%, rgba(8, 15, 26, 0.95) 100%)" },
    { name: "Rose Pink", hex: "#f48fb1", bgGrad: "linear-gradient(135deg, rgba(80, 30, 50, 0.8) 0%, rgba(30, 10, 20, 0.95) 100%)" },
    { name: "Lavender", hex: "#d6cadd", bgGrad: "linear-gradient(135deg, rgba(214, 202, 221, 0.8) 0%, rgba(45, 30, 55, 0.95) 100%)" }
  ],
  Samsung: [
    { name: "Cream", hex: "#f5ece1", bgGrad: "linear-gradient(135deg, rgba(245, 236, 225, 0.85) 0%, rgba(60, 50, 40, 0.95) 100%)" },
    { name: "Graphite", hex: "#3c3d42", bgGrad: "linear-gradient(135deg, rgba(60, 61, 66, 0.85) 0%, rgba(15, 15, 18, 0.95) 100%)" },
    { name: "Lavender", hex: "#e2d5e7", bgGrad: "linear-gradient(135deg, rgba(226, 213, 231, 0.75) 0%, rgba(45, 30, 55, 0.95) 100%)" },
    { name: "Pistachio", hex: "#bce2cf", bgGrad: "linear-gradient(135deg, rgba(188, 226, 207, 0.75) 0%, rgba(30, 55, 45, 0.95) 100%)" },
    { name: "Cobalt Violet", hex: "#4d4b75", bgGrad: "linear-gradient(135deg, rgba(77, 75, 117, 0.75) 0%, rgba(20, 20, 35, 0.95) 100%)" },
    { name: "Sky Blue", hex: "#a2c8ec", bgGrad: "linear-gradient(135deg, rgba(162, 200, 236, 0.75) 0%, rgba(25, 40, 60, 0.95) 100%)" },
    { name: "Titanium Gray", hex: "#8e8e93", bgGrad: "linear-gradient(135deg, rgba(142, 142, 147, 0.75) 0%, rgba(40, 42, 45, 0.95) 100%)" }
  ],
  Redmi: [
    { name: "Aurora Purple", hex: "#b7b2e6", bgGrad: "linear-gradient(135deg, rgba(183, 178, 230, 0.75) 0%, rgba(45, 30, 75, 0.95) 100%)" },
    { name: "Moonlight White", hex: "#f7f7f9", bgGrad: "linear-gradient(135deg, rgba(247, 247, 249, 0.8) 0%, rgba(55, 60, 65, 0.95) 100%)" },
    { name: "Midnight Black", hex: "#1e1e1e", bgGrad: "linear-gradient(135deg, rgba(30, 30, 30, 0.85) 0%, rgba(8, 8, 8, 0.95) 100%)" },
    { name: "Forest Green", hex: "#4a7c59", bgGrad: "linear-gradient(135deg, rgba(74, 124, 89, 0.75) 0%, rgba(20, 35, 25, 0.95) 100%)" }
  ],
  Honor: [
    { name: "Emerald Green", hex: "#0a5c36", bgGrad: "linear-gradient(135deg, rgba(10, 92, 54, 0.75) 0%, rgba(5, 25, 15, 0.95) 100%)" },
    { name: "Midnight Black", hex: "#1e1e1e", bgGrad: "linear-gradient(135deg, rgba(30, 30, 30, 0.85) 0%, rgba(8, 8, 8, 0.95) 100%)" },
    { name: "Glacier Blue", hex: "#d0e1fd", bgGrad: "linear-gradient(135deg, rgba(208, 225, 253, 0.75) 0%, rgba(30, 45, 70, 0.95) 100%)" }
  ],
  Nubia: [
    { name: "Obsidian Black", hex: "#1e1e1e", bgGrad: "linear-gradient(135deg, rgba(30, 30, 30, 0.85) 0%, rgba(8, 8, 8, 0.95) 100%)" },
    { name: "Titanium Gray", hex: "#8e8e93", bgGrad: "linear-gradient(135deg, rgba(142, 142, 147, 0.75) 0%, rgba(40, 42, 45, 0.95) 100%)" },
    { name: "Cyber Yellow", hex: "#ffd000", bgGrad: "linear-gradient(135deg, rgba(255, 208, 0, 0.75) 0%, rgba(60, 45, 5, 0.95) 100%)" }
  ]
};

const AdminDashboard = React.memo(function AdminDashboard({ 
  products, 
  bookings, 
  users, 
  notifications, 
  repairServices = [],
  repairBookings = [],
  onSaveProduct, 
  onDeleteProduct, 
  onUpdateBookingStatus, 
  onAddStaff,
  onSaveRepairService,
  onDeleteRepairService,
  onUpdateRepairBookingStatus
}) {
  const [activeTab, setActiveTab] = useState("stats"); // 'stats', 'inventory', 'repair-services', 'repair-bookings', 'staff', 'bookings', 'notifications'
  
  // Product CRUD Form State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [galleryColors, setGalleryColors] = useState([]);

  // Product Delete Confirmation Modal State
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const hexToRgb = (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return `${r}, ${g}, ${b}, ${alpha}`;
  };

  const [formData, setFormData] = useState({
    id: "",
    brand: "Apple",
    model: "",
    condition: "new",
    description: "",
    image: "",
    p128: "999",
    p256: "1099",
    p512: "1299",
    p1tb: "1499",
    stock: true,
    releaseDate: "2026-07-19",
    isReleased: true
  });

  // Repair Service CRUD Form State
  const [isEditingRepair, setIsEditingRepair] = useState(false);
  const [editingRepair, setEditingRepair] = useState(null);
  const [repairFormData, setRepairFormData] = useState({
    id: "",
    category: "Screen & Display",
    serviceName: "",
    deviceType: "Both",
    sparePartsPrice: "10000",
    laborCharge: "3000",
    serviceFee: "1500",
    estimatedTime: "1 - 2 Hours",
    availability: "Available",
    description: ""
  });

  // Staff Form State
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPhone, setStaffPhone] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [staffMsg, setStaffMsg] = useState({ type: "", text: "" });

  // Filter staff users
  const staffUsers = React.useMemo(() => users.filter(u => u.role === "staff"), [users]);

  // Calculate Metrics
  const { totalSales, totalRepairRevenue, pendingBookings, activeRepairsCount, activeStockCount } = React.useMemo(() => {
    const totalSalesVal = bookings
      .filter(b => b.bookingStatus === "completed" || b.paymentStatus === "paid")
      .reduce((sum, b) => sum + b.price, 0);

    const totalRepairRevenueVal = repairBookings
      .filter(rb => rb.repairStatus === "completed" || rb.paymentStatus === "fully-paid")
      .reduce((sum, rb) => sum + (rb.pricingBreakdown?.grandTotalRepairCost || 0), 0);

    const pendingBookingsVal = bookings.filter(b => b.bookingStatus === "pending").length;
    const activeRepairsCountVal = repairBookings.filter(rb => rb.repairStatus !== "completed" && rb.repairStatus !== "cancelled").length;
    const activeStockCountVal = products.filter(p => p.stock && p.isReleased).length;

    return {
      totalSales: totalSalesVal,
      totalRepairRevenue: totalRepairRevenueVal,
      pendingBookings: pendingBookingsVal,
      activeRepairsCount: activeRepairsCountVal,
      activeStockCount: activeStockCountVal
    };
  }, [bookings, repairBookings, products]);

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    setIsEditingProduct(true);
    setFormData({
      id: product.id,
      brand: product.brand,
      model: product.model,
      condition: product.condition,
      description: product.description,
      image: product.image,
      p128: product.prices["128gb"] || "",
      p256: product.prices["256gb"] || "",
      p512: product.prices["512gb"] || "",
      p1tb: product.prices["1tb"] || "",
      stock: product.stock,
      releaseDate: product.releaseDate || "2026-07-19",
      isReleased: product.hasOwnProperty("isReleased") ? product.isReleased : true
    });
    setGalleryColors(product.colors || []);
  };

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setIsEditingProduct(true);
    setFormData({
      id: "",
      brand: "Apple",
      model: "",
      condition: "new",
      description: "",
      image: "",
      p128: "",
      p256: "",
      p512: "",
      p1tb: "",
      stock: true,
      releaseDate: "2026-07-19",
      isReleased: true
    });
    setGalleryColors([]);
  };

  const handleSaveProductSubmit = (e) => {
    e.preventDefault();
    if (!formData.model) {
      alert("Please specify a phone model name.");
      return;
    }

    const pricesObj = {};
    if (formData.p128) pricesObj["128gb"] = Number(formData.p128);
    if (formData.p256) pricesObj["256gb"] = Number(formData.p256);
    if (formData.p512) pricesObj["512gb"] = Number(formData.p512);
    if (formData.p1tb) pricesObj["1tb"] = Number(formData.p1tb);

    if (Object.keys(pricesObj).length === 0) {
      alert("Please provide pricing details for at least one storage capacity size.");
      return;
    }

    const savedProduct = {
      id: formData.id || "phone-" + Math.floor(Math.random() * 1000000),
      brand: formData.brand,
      model: formData.model,
      condition: formData.condition,
      description: formData.description,
      image: formData.image || "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop",
      prices: pricesObj,
      stock: formData.stock,
      releaseDate: formData.releaseDate,
      isReleased: formData.isReleased,
      colors: galleryColors
    };

    onSaveProduct(savedProduct);
    setIsEditingProduct(false);

    db.addNotification({
      title: editingProduct ? "Product Updated" : "New Product Added",
      message: `Admin ${editingProduct ? "modified" : "registered"} ${savedProduct.brand} ${savedProduct.model} in store database.`,
      type: "inventory",
      targetRoles: ["admin", "staff"],
      emailSent: false
    });
  };

  const handleOpenDeleteModal = (product) => {
    setDeleteConfirmProduct(product);
    setDeleteError("");
  };

  const handleConfirmDelete = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!deleteConfirmProduct) return;
    setIsDeletingProduct(true);
    setDeleteError("");
    try {
      await onDeleteProduct(deleteConfirmProduct.id);
      db.addNotification({
        title: "Product Deleted",
        message: `Admin deleted ${deleteConfirmProduct.brand} ${deleteConfirmProduct.model} from storefront catalog.`,
        type: "inventory",
        targetRoles: ["admin", "staff"],
        emailSent: false
      });
      if (editingProduct && String(editingProduct.id) === String(deleteConfirmProduct.id)) {
        setIsEditingProduct(false);
        setEditingProduct(null);
      }
      setDeleteConfirmProduct(null);
    } catch (err) {
      console.error(err);
      setDeleteError("An error occurred while deleting the product. Please try again.");
    } finally {
      setIsDeletingProduct(false);
    }
  };

  // Repair Service Handlers
  const handleEditRepairClick = (service) => {
    setEditingRepair(service);
    setIsEditingRepair(true);
    setRepairFormData({
      id: service.id,
      category: service.category,
      serviceName: service.serviceName,
      deviceType: service.deviceType,
      sparePartsPrice: service.sparePartsPrice.toString(),
      laborCharge: service.laborCharge.toString(),
      serviceFee: service.serviceFee.toString(),
      estimatedTime: service.estimatedTime,
      availability: service.availability,
      description: service.description
    });
  };

  const handleAddNewRepairClick = () => {
    setEditingRepair(null);
    setIsEditingRepair(true);
    setRepairFormData({
      id: "",
      category: "Screen & Display",
      serviceName: "",
      deviceType: "Both",
      sparePartsPrice: "10000",
      laborCharge: "3000",
      serviceFee: "1500",
      estimatedTime: "1 - 2 Hours",
      availability: "Available",
      description: ""
    });
  };

  const handleSaveRepairSubmit = (e) => {
    e.preventDefault();
    if (!repairFormData.serviceName) {
      alert("Please specify a repair service name.");
      return;
    }

    const savedService = {
      id: repairFormData.id || "rep-" + Math.floor(Math.random() * 1000000),
      category: repairFormData.category,
      serviceName: repairFormData.serviceName,
      deviceType: repairFormData.deviceType,
      sparePartsPrice: Number(repairFormData.sparePartsPrice) || 0,
      laborCharge: Number(repairFormData.laborCharge) || 0,
      serviceFee: Number(repairFormData.serviceFee) || 0,
      estimatedTime: repairFormData.estimatedTime,
      availability: repairFormData.availability,
      description: repairFormData.description
    };

    onSaveRepairService(savedService);
    setIsEditingRepair(false);

    db.addNotification({
      title: editingRepair ? "Repair Pricing Updated" : "New Repair Service Registered",
      message: `Admin adjusted pricing index for ${savedService.serviceName} (Parts: Rs. ${savedService.sparePartsPrice}, Labor: Rs. ${savedService.laborCharge}, Service Fee: Rs. ${savedService.serviceFee}).`,
      type: "repair",
      targetRoles: ["admin", "staff"],
      emailSent: false
    });
  };

  const handleDeleteRepairClick = (id, serviceName) => {
    if (window.confirm(`Are you sure you want to delete repair service '${serviceName}'?`)) {
      onDeleteRepairService(id);
    }
  };

  const handleRegisterStaff = (e) => {
    e.preventDefault();
    setStaffMsg({ type: "", text: "" });

    if (!staffName || !staffEmail || !staffPhone || !staffPassword) {
      setStaffMsg({ type: "error", text: "Please fill out all fields." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(staffEmail)) {
      setStaffMsg({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    const success = onAddStaff({
      name: staffName,
      email: staffEmail,
      phone: staffPhone,
      password: staffPassword
    });

    if (success) {
      setStaffMsg({ type: "success", text: "Staff account successfully created!" });
      setStaffName("");
      setStaffEmail("");
      setStaffPhone("");
      setStaffPassword("");
      
      db.addNotification({
        title: "Staff Account Registered",
        message: `New staff profile ${staffName} (${staffEmail}) registered by Administrator.`,
        type: "registration",
        targetRoles: ["admin", "staff"],
        emailSent: true,
        emailDetails: {
          to: staffEmail,
          subject: "Welcome to MOBILE INN Staff Portal",
          body: `Dear ${staffName},\n\nYou have been registered as a Staff member at MOBILE INN by the administrator.\n\nYou can now log in using this email address to manage client repair tickets and adjust store catalog indices.\n\nBest regards,\nMOBILE INN Admin Team`
        }
      });
    } else {
      setStaffMsg({ type: "error", text: "Email address already registered." });
    }
  };

  return (
    <div className="container">
      <div className="dashboard-shell">
        
        {/* Navigation Sidebar */}
        <div className="dashboard-sidebar">
          <div className="glass-panel" style={{ padding: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", color: "var(--cyan)", paddingLeft: "0.5rem" }}>
              Admin Panel
            </h3>
            
            <button 
              onClick={() => setActiveTab("stats")}
              className={`sidebar-link ${activeTab === "stats" ? "active" : ""}`}
              style={{ border: "none", background: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
            >
              📊 Statistics Dashboard
            </button>

            <button 
              onClick={() => setActiveTab("repair-services")}
              className={`sidebar-link ${activeTab === "repair-services" ? "active" : ""}`}
              style={{ border: "none", background: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
            >
              🛠️ Repair Services & Pricing
            </button>

            <button 
              onClick={() => setActiveTab("repair-bookings")}
              className={`sidebar-link ${activeTab === "repair-bookings" ? "active" : ""}`}
              style={{ border: "none", background: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
            >
              🔧 Repair Bookings Queue
            </button>

            <button 
              onClick={() => setActiveTab("inventory")}
              className={`sidebar-link ${activeTab === "inventory" ? "active" : ""}`}
              style={{ border: "none", background: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
            >
              📱 Phone Storefront Catalog
            </button>

            <button 
              onClick={() => setActiveTab("staff")}
              className={`sidebar-link ${activeTab === "staff" ? "active" : ""}`}
              style={{ border: "none", background: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
            >
              👥 Manage Staff Members
            </button>

            <button 
              onClick={() => setActiveTab("bookings")}
              className={`sidebar-link ${activeTab === "bookings" ? "active" : ""}`}
              style={{ border: "none", background: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
            >
              📋 Phone Orders Log
            </button>

            <button 
              onClick={() => setActiveTab("notifications")}
              className={`sidebar-link ${activeTab === "notifications" ? "active" : ""}`}
              style={{ border: "none", background: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
            >
              📧 Outbox Alert Logger
            </button>
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="dashboard-content">
          
          {/* TAB 1: Statistics Overview */}
          {activeTab === "stats" && (
            <div>
              <div className="metrics-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
                <div className="glass-panel metric-card" style={{ borderLeft: "4px solid var(--emerald)" }}>
                  <div className="metric-title">Phone Sales Revenue</div>
                  <div className="metric-value" style={{ fontSize: "1.3rem" }}>Rs. {totalSales.toLocaleString()}</div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Simulated completed sales</span>
                </div>

                <div className="glass-panel metric-card" style={{ borderLeft: "4px solid var(--cyan)" }}>
                  <div className="metric-title">Repair Revenue</div>
                  <div className="metric-value" style={{ fontSize: "1.3rem" }}>Rs. {totalRepairRevenue.toLocaleString()}</div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Completed repair services</span>
                </div>

                <div className="glass-panel metric-card" style={{ borderLeft: "4px solid var(--amber)" }}>
                  <div className="metric-title">Active Repair Tickets</div>
                  <div className="metric-value">{activeRepairsCount}</div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>In diagnosis or repair</span>
                </div>

                <div className="glass-panel metric-card" style={{ borderLeft: "4px solid var(--purple)" }}>
                  <div className="metric-title">Store Inventory</div>
                  <div className="metric-value">{activeStockCount}</div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Active phone models</span>
                </div>
              </div>

              <div className="glass-panel" style={{ height: "300px", display: "flex", flexDirection: "column", justifyContent: "space-between", marginTop: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem" }}>Mobile Inn Store & Repair Activity Forecast (2026)</h3>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Visual tracking chart for phone sales and repair workshop throughput.</p>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem", flex: 1, margin: "2rem 0 1rem 0", borderBottom: "1px solid var(--border-glass)", borderLeft: "1px solid var(--border-glass)", padding: "1rem" }}>
                  <div style={{ flex: 1, height: "45%", background: "var(--gradient-cyan-blue)", borderRadius: "4px 4px 0 0", position: "relative" }} title="Q1"><span style={{ position: "absolute", bottom: "-20px", left: "50%", transform: "translateX(-50%)", fontSize: "0.65rem", color: "var(--text-muted)" }}>Q1</span></div>
                  <div style={{ flex: 1, height: "65%", background: "var(--gradient-cyan-blue)", borderRadius: "4px 4px 0 0", position: "relative" }} title="Q2"><span style={{ position: "absolute", bottom: "-20px", left: "50%", transform: "translateX(-50%)", fontSize: "0.65rem", color: "var(--text-muted)" }}>Q2</span></div>
                  <div style={{ flex: 1, height: "80%", background: "var(--gradient-cyan-blue)", borderRadius: "4px 4px 0 0", position: "relative" }} title="Q3"><span style={{ position: "absolute", bottom: "-20px", left: "50%", transform: "translateX(-50%)", fontSize: "0.65rem", color: "var(--text-muted)" }}>Q3 (Current)</span></div>
                  <div style={{ flex: 1, height: "95%", background: "var(--gradient-purple-pink)", borderRadius: "4px 4px 0 0", position: "relative" }} title="Q4 Projection"><span style={{ position: "absolute", bottom: "-20px", left: "50%", transform: "translateX(-50%)", fontSize: "0.65rem", color: "var(--text-muted)" }}>Q4 (Est)</span></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Repair Services Management (Admin CRUD for charges, parts, labor, time, availability) */}
          {activeTab === "repair-services" && (
            <div className="glass-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.75rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.4rem", fontWeight: "700" }}>Manage Repair Services & Charges</h2>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Admin control panel to configure service fees, spare parts prices, labor charges, estimated repair times, and availability for iPhone and Android repairs.
                  </p>
                </div>
                {!isEditingRepair && (
                  <button className="btn btn-sm btn-primary" onClick={handleAddNewRepairClick}>
                    + Add Repair Service
                  </button>
                )}
              </div>

              {isEditingRepair ? (
                /* Repair CRUD Form */
                <form onSubmit={handleSaveRepairSubmit} className="glass-panel" style={{ background: "rgba(10,10,18,0.4)" }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--cyan)" }}>
                    {editingRepair ? `Edit Repair: ${editingRepair.serviceName}` : "Register New Repair Service Item"}
                  </h3>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select 
                        className="form-select"
                        value={repairFormData.category}
                        onChange={(e) => setRepairFormData({ ...repairFormData, category: e.target.value })}
                      >
                        <option value="Screen & Display">Screen & Display</option>
                        <option value="Power & Battery">Power & Battery</option>
                        <option value="Camera & Optics">Camera & Optics</option>
                        <option value="Audio & Sound">Audio & Sound</option>
                        <option value="Biometrics & Chipsets">Biometrics & Chipsets</option>
                        <option value="Motherboard & Micro-soldering">Motherboard & Micro-soldering</option>
                        <option value="Body & Glass">Body & Glass</option>
                        <option value="Software & Firmware">Software & Firmware</option>
                        <option value="Specialized & General">Specialized & General</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Repair Service Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Screen Replacement (OLED)" 
                        value={repairFormData.serviceName}
                        onChange={(e) => setRepairFormData({ ...repairFormData, serviceName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Device Type Compatibility</label>
                      <select 
                        className="form-select"
                        value={repairFormData.deviceType}
                        onChange={(e) => setRepairFormData({ ...repairFormData, deviceType: e.target.value })}
                      >
                        <option value="Both">Both (iPhone & Android)</option>
                        <option value="iPhone">iPhone Only</option>
                        <option value="Android">Android Only</option>
                      </select>
                    </div>
                  </div>

                  {/* Financial & Charges Fields */}
                  <div style={{ borderTop: "1px dashed var(--border-glass)", paddingTop: "1rem", marginTop: "1rem" }}>
                    <label className="form-label" style={{ fontWeight: "700" }}>REPAIR FINANCIAL PRICING INDEX (LKR / Rs.)</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
                      
                      <div className="form-group">
                        <label className="form-label">Repair Charge (Service Fee)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="e.g. 2500" 
                          value={repairFormData.serviceFee} 
                          onChange={(e) => setRepairFormData({ ...repairFormData, serviceFee: e.target.value })} 
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Spare Parts Price</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="e.g. 20000" 
                          value={repairFormData.sparePartsPrice} 
                          onChange={(e) => setRepairFormData({ ...repairFormData, sparePartsPrice: e.target.value })} 
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Labor Charge</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="e.g. 4500" 
                          value={repairFormData.laborCharge} 
                          onChange={(e) => setRepairFormData({ ...repairFormData, laborCharge: e.target.value })} 
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Estimated Total Price</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={`Rs. ${(Number(repairFormData.serviceFee) + Number(repairFormData.sparePartsPrice) + Number(repairFormData.laborCharge)).toLocaleString()}`} 
                          disabled
                          style={{ color: "var(--cyan)", fontWeight: "bold" }}
                        />
                      </div>

                    </div>
                  </div>

                  {/* Time & Availability */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", borderTop: "1px dashed var(--border-glass)", paddingTop: "1rem" }}>
                    <div className="form-group">
                      <label className="form-label">Estimated Repair Time</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. 1 - 2 Hours, Same Day, 24 - 48 Hours" 
                        value={repairFormData.estimatedTime}
                        onChange={(e) => setRepairFormData({ ...repairFormData, estimatedTime: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Availability Status</label>
                      <select 
                        className="form-select"
                        value={repairFormData.availability}
                        onChange={(e) => setRepairFormData({ ...repairFormData, availability: e.target.value })}
                      >
                        <option value="Available">Available (In Stock)</option>
                        <option value="By Appointment">By Appointment Only</option>
                        <option value="Out of Stock">Out of Parts / Stock</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description / Scope of Work</label>
                    <textarea 
                      className="form-textarea"
                      rows={2}
                      placeholder="Enter repair specifications, component details, warranty terms..."
                      value={repairFormData.description}
                      onChange={(e) => setRepairFormData({ ...repairFormData, description: e.target.value })}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "1.5rem", justifyContent: "flex-end", marginTop: "1rem" }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditingRepair(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Repair Pricing</button>
                  </div>
                </form>
              ) : (
                /* Repair Services Table View */
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Service & Category</th>
                        <th>Device Type</th>
                        <th>Pricing Breakdown (Parts + Labor + Fee)</th>
                        <th>Total Price</th>
                        <th>Est. Time</th>
                        <th>Availability</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {repairServices.map((service) => {
                        const totalCost = service.sparePartsPrice + service.laborCharge + service.serviceFee;

                        return (
                          <tr key={service.id}>
                            <td>
                              <div style={{ fontWeight: "700" }}>{service.serviceName}</div>
                              <span className="badge badge-used" style={{ fontSize: "0.65rem" }}>{service.category}</span>
                            </td>
                            <td>
                              <span className="badge badge-new" style={{ fontSize: "0.65rem" }}>
                                {service.deviceType}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                                Parts: Rs. {service.sparePartsPrice.toLocaleString()} | Labor: Rs. {service.laborCharge.toLocaleString()} | Fee: Rs. {service.serviceFee.toLocaleString()}
                              </div>
                            </td>
                            <td>
                              <div style={{ fontWeight: "800", color: "var(--cyan)", fontSize: "0.95rem" }}>
                                Rs. {totalCost.toLocaleString()}
                              </div>
                            </td>
                            <td style={{ fontSize: "0.75rem" }}>{service.estimatedTime}</td>
                            <td>
                              <span style={{
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                color: service.availability === "Available" ? "var(--emerald)" : service.availability === "By Appointment" ? "var(--amber)" : "var(--rose)"
                              }}>
                                ● {service.availability}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "0.4rem" }}>
                                <button className="btn btn-sm btn-secondary" style={{ padding: "0.3rem 0.5rem" }} onClick={() => handleEditRepairClick(service)}>
                                  Edit
                                </button>
                                <button className="btn btn-sm btn-danger" style={{ padding: "0.3rem 0.5rem" }} onClick={() => handleDeleteRepairClick(service.id, service.serviceName)}>
                                  Delete
                                </button>
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

          {/* TAB 3: Repair Bookings Queue & Status Updating */}
          {activeTab === "repair-bookings" && (
            <div className="glass-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.75rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.4rem", fontWeight: "700" }}>Repair Booking Tickets Queue</h2>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Manage customer repair jobs, track diagnostic inspection, update repair workflow stages, and send real-time SMS & email notifications.
                  </p>
                </div>
                <span className="badge badge-new" style={{ fontSize: "0.75rem" }}>
                  {repairBookings.length} Repair Tickets Total
                </span>
              </div>

              {repairBookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}>
                  No repair bookings placed yet.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Customer</th>
                        <th>Device Model</th>
                        <th>Selected Repairs</th>
                        <th>Est. Total</th>
                        <th>Repair Status Workflow</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...repairBookings].reverse().map((rb) => (
                        <tr key={rb.id}>
                          <td style={{ fontFamily: "monospace", fontWeight: "bold", fontSize: "0.8rem", color: "var(--cyan)" }}>
                            {rb.id}
                          </td>
                          <td style={{ maxWidth: "150px" }}>
                            <div style={{ fontWeight: "600", fontSize: "0.82rem" }}>{rb.customerName}</div>
                            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>📞 {rb.customerPhone}</div>
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", wordBreak: "break-all" }}>📧 {rb.customerEmail}</div>
                          </td>
                          <td style={{ maxWidth: "140px" }}>
                            <div style={{ fontWeight: "600", fontSize: "0.82rem", whiteSpace: "normal" }}>{rb.deviceBrand} {rb.phoneModel}</div>
                            <span className="badge badge-used" style={{ fontSize: "0.6rem", marginTop: "0.2rem", display: "inline-block" }}>{rb.fulfillmentType === "drop-off" ? "Showroom Drop-off" : "Courier Pickup"}</span>
                          </td>
                          <td style={{ maxWidth: "180px" }}>
                            <div style={{ fontSize: "0.72rem", whiteSpace: "normal", wordBreak: "break-word", lineHeight: "1.3" }}>
                              {rb.selectedServices.map(s => s.serviceName).join(", ")}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: "800", color: "var(--text-primary)" }}>
                              Rs. {rb.pricingBreakdown?.grandTotalRepairCost.toLocaleString()}
                            </div>
                            <span style={{ fontSize: "0.65rem", color: "var(--cyan)" }}>
                              {rb.paymentMethod === "WhatsApp" ? "WhatsApp Booking" : "Pay on Pickup"}
                            </span>
                          </td>
                          <td>
                            <span style={{
                              fontSize: "0.75rem",
                              fontWeight: "700",
                              textTransform: "uppercase",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "4px",
                              background: rb.repairStatus === "completed" ? "rgba(16, 185, 129, 0.15)" : rb.repairStatus === "ready" ? "rgba(0, 242, 254, 0.15)" : "rgba(245, 158, 11, 0.15)",
                              color: rb.repairStatus === "completed" ? "var(--emerald)" : rb.repairStatus === "ready" ? "var(--cyan)" : "var(--amber)",
                              border: `1px solid ${rb.repairStatus === "completed" ? "var(--emerald)" : rb.repairStatus === "ready" ? "var(--cyan)" : "var(--amber)"}`
                            }}>
                              {rb.repairStatus}
                            </span>
                          </td>
                          <td>
                            <select 
                              className="form-select"
                              style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", width: "135px" }}
                              value={rb.repairStatus}
                              onChange={(e) => {
                                const newStatus = e.target.value;
                                onUpdateRepairBookingStatus(rb.id, newStatus);
                              }}
                            >
                              <option value="booked">Booked</option>
                              <option value="received">Received at Store</option>
                              <option value="diagnosing">Diagnosing</option>
                              <option value="repairing">In Repair</option>
                              <option value="testing">Quality Testing</option>
                              <option value="ready">Ready for Pickup/Delivery</option>
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

          {/* TAB 4: Catalog CRUD */}
          {activeTab === "inventory" && (
            <div className="glass-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.75rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.4rem", fontWeight: "700" }}>Manage Phone Catalog</h2>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Register new phones, modify specifications, or delete devices from the store listing.</p>
                </div>
                {!isEditingProduct && (
                  <button className="btn btn-sm btn-primary" onClick={handleAddNewClick}>
                    + Add New Device
                  </button>
                )}
              </div>

              {isEditingProduct && (
                <form onSubmit={handleSaveProductSubmit} className="glass-panel" style={{ background: "rgba(10,10,18,0.4)" }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--cyan)" }}>
                    {editingProduct ? `Edit ${editingProduct.model}` : "Register New Smartphone"}
                  </h3>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                    <div className="form-group">
                      <label className="form-label">Brand Name</label>
                      <select 
                        className="form-select" 
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      >
                        <option value="Apple">Apple</option>
                        <option value="Samsung">Samsung</option>
                        <option value="Redmi">Redmi</option>
                        <option value="Honor">Honor</option>
                        <option value="Nubia">Nubia</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Model Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. iPhone 17 Pro Max" 
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Condition</label>
                      <select 
                        className="form-select" 
                        value={formData.condition}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      >
                        <option value="new">Brand New</option>
                        <option value="second-hand">Second Hand</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description / Specs</label>
                    <textarea 
                      className="form-textarea" 
                      rows={2} 
                      placeholder="Enter details, camera specs, chip processors..." 
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Product Device Image (URL or Upload File)</label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="https://images.unsplash.com/..." 
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                      <label 
                        className="btn btn-secondary" 
                        style={{ fontSize: "0.78rem", padding: "0.5rem 1rem", borderRadius: "8px", whiteSpace: "nowrap", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                      >
                        Upload File
                        <input 
                          type="file" 
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setFormData({ ...formData, image: event.target.result });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {formData.image && (
                      <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: "80px", height: "80px", borderRadius: "8px", border: "1px solid var(--border-glass)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.2)", overflow: "hidden" }}>
                          <img src={formData.image} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Device Image Preview</span>
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: "1px dashed var(--border-glass)", paddingTop: "1rem", marginTop: "1rem" }}>
                    <label className="form-label" style={{ fontWeight: "700" }}>STORAGE VARIANT PRICING (LKR / Rs.)</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
                      <div className="form-group">
                        <label className="form-label">128GB Price</label>
                        <input type="number" className="form-input" placeholder="e.g. 239000" value={formData.p128} onChange={(e) => setFormData({ ...formData, p128: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">256GB Price</label>
                        <input type="number" className="form-input" placeholder="e.g. 269000" value={formData.p256} onChange={(e) => setFormData({ ...formData, p256: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">512GB Price</label>
                        <input type="number" className="form-input" placeholder="e.g. 329000" value={formData.p512} onChange={(e) => setFormData({ ...formData, p512: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">1TB Price</label>
                        <input type="number" className="form-input" placeholder="e.g. 389000" value={formData.p1tb} onChange={(e) => setFormData({ ...formData, p1tb: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  {/* Gallery / Finishes Management */}
                  <div style={{ borderTop: "1px dashed var(--border-glass)", paddingTop: "1rem", marginTop: "1rem" }}>
                    {/* Modern Predefined Color Selection Swatches */}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label className="form-label" style={{ fontWeight: "700", marginBottom: "0.25rem" }}>AVAILABLE COLOR SELECTION PRESETS ({formData.brand.toUpperCase()})</label>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>Select one or multiple colors below to add/remove them from this product's active color configurations:</p>
                      
                      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                        {(PREDEFINED_COLORS[formData.brand] || []).map((c) => {
                          const isSelected = galleryColors.some(gc => gc.name.toLowerCase() === c.name.toLowerCase());
                          return (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setGalleryColors(galleryColors.filter(gc => gc.name.toLowerCase() !== c.name.toLowerCase()));
                                } else {
                                  setGalleryColors([...galleryColors, { name: c.name, hex: c.hex, bgGrad: c.bgGrad, image: formData.image || "" }]);
                                }
                              }}
                              className="glass-panel"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.6rem",
                                padding: "0.5rem 0.85rem",
                                margin: "0",
                                borderRadius: "12px",
                                border: isSelected ? "2px solid var(--cyan)" : "1px solid var(--border-glass)",
                                cursor: "pointer",
                                background: isSelected ? "rgba(0, 242, 254, 0.08)" : "rgba(255, 255, 255, 0.02)",
                                boxShadow: isSelected ? "0 0 10px rgba(0, 242, 254, 0.2)" : "none",
                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                              }}
                            >
                              <span style={{ 
                                width: "16px", 
                                height: "16px", 
                                borderRadius: "50%", 
                                backgroundColor: c.hex, 
                                border: "1px solid rgba(255,255,255,0.25)",
                                display: "inline-block",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.15)"
                              }} />
                              <span style={{ 
                                fontSize: "0.8rem", 
                                fontWeight: isSelected ? "600" : "400", 
                                color: isSelected ? "white" : "var(--text-secondary)" 
                              }}>
                                {c.name} {isSelected && " ✓"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", borderTop: "1px dashed rgba(255,255,255,0.06)", paddingTop: "1rem" }}>
                      <label className="form-label" style={{ fontWeight: "700", margin: "0" }}>PRODUCT GALLERY / COLOR FINISHES DETAILS</label>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        style={{ fontSize: "0.78rem", padding: "0.35rem 0.75rem", borderRadius: "8px" }}
                        onClick={() => setGalleryColors([...galleryColors, { name: "New Finish", hex: "#7a7a7a", image: "", bgGrad: "linear-gradient(135deg, rgba(122, 122, 122, 0.7) 0%, rgba(10, 10, 12, 0.95) 100%)" }])}
                      >
                        + Add Custom Color Finish
                      </button>
                    </div>

                    {galleryColors.length === 0 ? (
                      <div style={{ padding: "1rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", border: "1px dashed var(--border-glass)", borderRadius: "12px", background: "rgba(255,255,255,0.01)" }}>
                        No variant color gallery images added yet. Click "+ Add Color Finish Image" to customize.
                      </div>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.75rem" }}>
                        {galleryColors.map((color, index) => (
                          <div key={index} className="glass-panel" style={{ display: "flex", gap: "1rem", alignItems: "center", background: "rgba(255,255,255,0.015)", padding: "1rem", margin: "0", flexWrap: "wrap" }}>
                            
                            <div className="form-group" style={{ marginBottom: "0", flex: "1 1 180px" }}>
                              <label className="form-label" style={{ fontSize: "0.75rem" }}>Finish / Color Name</label>
                              <input 
                                type="text" 
                                className="form-input" 
                                placeholder="e.g. Natural Titanium"
                                value={color.name}
                                onChange={(e) => {
                                  const next = [...galleryColors];
                                  next[index].name = e.target.value;
                                  setGalleryColors(next);
                                }}
                                required
                              />
                            </div>

                            <div className="form-group" style={{ marginBottom: "0", width: "120px" }}>
                              <label className="form-label" style={{ fontSize: "0.75rem" }}>Hex Code</label>
                              <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                                <input 
                                  type="color" 
                                  value={color.hex || "#7a7a7a"}
                                  onChange={(e) => {
                                    const next = [...galleryColors];
                                    next[index].hex = e.target.value;
                                    next[index].bgGrad = `linear-gradient(135deg, rgba(${hexToRgb(e.target.value, 0.7)}) 0%, rgba(10, 10, 12, 0.95) 100%)`;
                                    setGalleryColors(next);
                                  }}
                                  style={{ width: "28px", height: "28px", border: "none", borderRadius: "4px", cursor: "pointer", padding: "0", background: "none" }}
                                />
                                <span style={{ fontSize: "0.75rem", fontFamily: "monospace" }}>{color.hex}</span>
                              </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: "0", flex: "2 1 250px" }}>
                              <label className="form-label" style={{ fontSize: "0.75rem" }}>Finish Image (URL or Upload File)</label>
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <input 
                                  type="text" 
                                  className="form-input" 
                                  placeholder="Image URL"
                                  value={color.image}
                                  onChange={(e) => {
                                    const next = [...galleryColors];
                                    next[index].image = e.target.value;
                                    setGalleryColors(next);
                                  }}
                                />
                                <label 
                                  className="btn btn-secondary" 
                                  style={{ fontSize: "0.75rem", padding: "0.5rem 0.75rem", borderRadius: "8px", whiteSpace: "nowrap", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                                >
                                  Upload
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                          const next = [...galleryColors];
                                          next[index].image = event.target.result;
                                          setGalleryColors(next);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>

                            {color.image && (
                              <div style={{ width: "40px", height: "40px", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border-glass)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.2)" }}>
                                <img src={color.image} alt={color.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                              </div>
                            )}

                            <button 
                              type="button" 
                              className="btn btn-danger btn-sm" 
                              style={{ padding: "0.35rem 0.5rem", borderRadius: "8px", height: "34px", width: "34px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                              onClick={() => setGalleryColors(galleryColors.filter((_, i) => i !== index))}
                              title="Delete Color Finish"
                            >
                              🗑️
                            </button>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", borderTop: "1px dashed var(--border-glass)", paddingTop: "1rem" }}>
                    <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem", height: "45px" }}>
                      <input 
                        type="checkbox" 
                        id="inStockCheck"
                        checked={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.checked })}
                        style={{ width: "18px", height: "18px", accentColor: "var(--cyan)" }}
                      />
                      <label htmlFor="inStockCheck" className="form-label" style={{ margin: "0", cursor: "pointer" }}>Device is In Stock</label>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Simulated Release Date</label>
                      <input 
                        type="date" 
                        className="form-input" 
                        value={formData.releaseDate}
                        onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem", height: "45px" }}>
                      <input 
                        type="checkbox" 
                        id="releasedCheck"
                        checked={formData.isReleased}
                        onChange={(e) => setFormData({ ...formData, isReleased: e.target.checked })}
                        style={{ width: "18px", height: "18px", accentColor: "var(--cyan)" }}
                      />
                      <label htmlFor="releasedCheck" className="form-label" style={{ margin: "0", cursor: "pointer" }}>Released (Visible on Storefront)</label>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", justifyContent: "flex-end", marginTop: "1.25rem" }}>
                    {editingProduct && (
                      <button 
                        type="button" 
                        className="btn btn-danger" 
                        style={{ marginRight: "auto", display: "inline-flex", alignItems: "center", gap: "0.4rem" }} 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleOpenDeleteModal(editingProduct);
                        }}
                      >
                        🗑️ Delete Product
                      </button>
                    )}
                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditingProduct(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Product</button>
                  </div>
                </form>
              )}

              {/* Existing Products List / Table Section */}
              <div style={{ marginTop: isEditingProduct ? "2rem" : "0", borderTop: isEditingProduct ? "1px solid var(--border-glass)" : "none", paddingTop: isEditingProduct ? "1.5rem" : "0" }}>
                {isEditingProduct && (
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", color: "var(--cyan)" }}>
                    Existing Products Inventory ({products.length})
                  </h3>
                )}
                
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Details</th>
                        <th>Condition</th>
                        <th>Pricing By Storage Variant</th>
                        <th>Stock</th>
                        <th>Release Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                              <img src={product.image} alt={product.model} style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover" }} />
                              <div>
                                <div style={{ fontWeight: "600" }}>{product.model}</div>
                                <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{product.brand}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${product.condition === "new" ? "badge-new" : "badge-used"}`}>
                              {product.condition === "new" ? "New" : "Used"}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontSize: "0.75rem", display: "flex", gap: "0.5rem" }}>
                              {Object.keys(product.prices).map((st) => (
                                <span key={st}><b>{st.toUpperCase()}:</b> Rs. {product.prices[st].toLocaleString()}</span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <span style={{ color: product.stock ? "var(--emerald)" : "var(--rose)", fontWeight: "600" }}>
                              {product.stock ? "In Stock" : "Out of Stock"}
                            </span>
                          </td>
                          <td>
                            <span className="badge" style={{ 
                              background: product.isReleased ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                              color: product.isReleased ? "var(--emerald)" : "var(--amber)",
                              borderColor: product.isReleased ? "var(--emerald)" : "var(--amber)"
                            }}>
                              {product.isReleased ? "Released" : `Upcoming (${product.releaseDate})`}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <button 
                                type="button" 
                                className="btn btn-sm btn-secondary" 
                                style={{ padding: "0.3rem 0.5rem" }} 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleEditProductClick(product);
                                }}
                              >
                                Edit
                              </button>
                              <button 
                                type="button" 
                                className="btn btn-sm btn-danger" 
                                style={{ padding: "0.3rem 0.5rem" }} 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleOpenDeleteModal(product);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Staff Management */}
          {activeTab === "staff" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "2rem" }}>
              <div className="glass-panel">
                <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "1rem" }}>Add New Staff Profile</h3>
                
                {staffMsg.text && (
                  <div style={{ 
                    padding: "0.75rem 1rem", 
                    background: staffMsg.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(244,63,94,0.1)",
                    border: `1px solid ${staffMsg.type === "success" ? "var(--emerald)" : "var(--rose)"}`,
                    color: staffMsg.type === "success" ? "var(--emerald)" : "var(--rose)",
                    borderRadius: "8px", 
                    fontSize: "0.8rem",
                    marginBottom: "1rem"
                  }}>
                    {staffMsg.text}
                  </div>
                )}

                <form onSubmit={handleRegisterStaff} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className="form-group" style={{ marginBottom: "0" }}>
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" placeholder="e.g. Ramesh Babu" value={staffName} onChange={(e) => setStaffName(e.target.value)} />
                  </div>
                  
                  <div className="form-group" style={{ marginBottom: "0" }}>
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-input" placeholder="e.g. ramesh@mobileinn.com" value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)} />
                  </div>

                  <div className="form-group" style={{ marginBottom: "0" }}>
                    <label className="form-label">Phone Number</label>
                    <input type="text" className="form-input" placeholder="e.g. +91 95556 12345" value={staffPhone} onChange={(e) => setStaffPhone(e.target.value)} />
                  </div>

                  <div className="form-group" style={{ marginBottom: "0" }}>
                    <label className="form-label">Temporary Password</label>
                    <input type="password" className="form-input" placeholder="••••••••" value={staffPassword} onChange={(e) => setStaffPassword(e.target.value)} />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>
                    Register Staff Account
                  </button>
                </form>
              </div>

              <div className="glass-panel">
                <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "1rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.75rem" }}>
                  Registered Staff List
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "350px", overflowY: "auto", paddingRight: "0.5rem" }}>
                  {staffUsers.map(st => (
                    <div key={st.uid} className="glass-panel" style={{ background: "rgba(255,255,255,0.02)", padding: "0.75rem 1rem", margin: "0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>{st.name}</span>
                        <span className="badge badge-used" style={{ fontSize: "0.6rem" }}>Staff</span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>
                        <div>📧 {st.email}</div>
                        <div>📞 {st.phone}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Booking Override Queue */}
          {activeTab === "bookings" && (
            <div className="glass-panel">
              <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "1.25rem" }}>Admin Master Bookings Log</h2>
              
              {bookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}>
                  No phone bookings found in system registers.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Client</th>
                        <th>Requested Phone</th>
                        <th>Bill Info</th>
                        <th>Status</th>
                        <th>Override Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...bookings].reverse().map(b => (
                        <tr key={b.id}>
                          <td style={{ fontFamily: "monospace", fontSize: "0.75rem" }}>{b.id}</td>
                          <td>
                            <div style={{ fontWeight: "600" }}>{b.customerName}</div>
                            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{b.customerPhone}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: "600" }}>{b.productModel}</div>
                            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--text-secondary)" }}>{b.selectedStorage}</span>
                          </td>
                          <td>
                            <div style={{ fontWeight: "700" }}>Rs. {b.price.toLocaleString()}</div>
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{b.paymentMethod === "WhatsApp" ? "💬 WhatsApp Booking" : "🏪 COD Pickup"}</div>
                          </td>
                          <td>
                            <span style={{ 
                              fontSize: "0.75rem", 
                              fontWeight: "600",
                              color: b.bookingStatus === "completed" ? "var(--emerald)" : b.bookingStatus === "cancelled" ? "var(--rose)" : "var(--cyan)"
                            }}>
                              {b.bookingStatus.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <select 
                              className="form-select" 
                              style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", width: "120px" }}
                              value={b.bookingStatus}
                              onChange={(e) => {
                                const newStatus = e.target.value;
                                if (newStatus === "approved") {
                                  const defaultDeposit = Math.round((b.price * 0.20) / 1000) * 1000;
                                  const amt = window.prompt(`Approve booking and request advance deposit. (Phone price: Rs. ${b.price.toLocaleString()})\n\nEnter Required Deposit (Rs.):`, defaultDeposit);
                                  if (amt !== null) {
                                    onUpdateBookingStatus(b.id, "approved", Number(amt));
                                  }
                                } else {
                                  onUpdateBookingStatus(b.id, newStatus);
                                }
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved (Wait Deposit)</option>
                              <option value="confirmed">Confirmed (Paid)</option>
                              <option value="shipped">Shipped</option>
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

          {/* TAB 7: Email & SMS Alert Logs */}
          {activeTab === "notifications" && (
            <div>
              <NotificationHub notifications={notifications} />
            </div>
          )}

        </div>

        {/* Delete Confirmation Modal Overlay */}
        {deleteConfirmProduct && (
          <div 
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "1rem"
            }}
          >
            <div 
              className="glass-panel" 
              style={{
                maxWidth: "460px",
                width: "100%",
                background: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(244, 63, 94, 0.4)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(244, 63, 94, 0.15)",
                borderRadius: "16px",
                padding: "1.75rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "rgba(244, 63, 94, 0.15)",
                  border: "1px solid var(--rose)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  flexShrink: 0
                }}>
                  ⚠️
                </div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "700", margin: 0, color: "var(--text-primary)" }}>
                    Delete Product
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Confirm catalog removal</span>
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "0.5rem" }}>
                  Are you sure you want to delete this product?
                </p>
                
                <div style={{
                  padding: "0.75rem 1rem",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-glass)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginTop: "0.75rem"
                }}>
                  {deleteConfirmProduct.image && (
                    <img 
                      src={deleteConfirmProduct.image} 
                      alt={deleteConfirmProduct.model} 
                      style={{ width: "45px", height: "45px", borderRadius: "6px", objectFit: "cover" }} 
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "var(--cyan)" }}>
                      {deleteConfirmProduct.brand} {deleteConfirmProduct.model}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Condition: {deleteConfirmProduct.condition === "new" ? "Brand New" : "Second Hand"}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: "0.75rem", color: "var(--rose)", marginTop: "0.75rem", margin: "0.75rem 0 0 0" }}>
                  This item will be permanently removed from the store database and customer store view.
                </p>

                {deleteError && (
                  <div style={{ 
                    marginTop: "0.75rem",
                    padding: "0.5rem 0.75rem", 
                    background: "rgba(244,63,94,0.15)", 
                    border: "1px solid var(--rose)", 
                    borderRadius: "6px", 
                    fontSize: "0.78rem", 
                    color: "var(--rose)" 
                  }}>
                    {deleteError}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    if (!isDeletingProduct) {
                      setDeleteConfirmProduct(null);
                      setDeleteError("");
                    }
                  }}
                  disabled={isDeletingProduct}
                  style={{ padding: "0.5rem 1.25rem" }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleConfirmDelete}
                  disabled={isDeletingProduct}
                  style={{ padding: "0.5rem 1.25rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                >
                  {isDeletingProduct ? (
                    <>Deleting...</>
                  ) : (
                    <>Delete</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
});

export default AdminDashboard;
