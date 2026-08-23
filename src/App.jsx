// App.jsx
import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import BackButton from "./components/BackButton";

const CustomerStore = React.lazy(() => import("./pages/CustomerStore"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const RepairBooking = React.lazy(() => import("./pages/RepairBooking"));
const About = React.lazy(() => import("./pages/About"));
const Login = React.lazy(() => import("./pages/Login"));
import { db } from "./mockData";
import MoltenMetal from "./components/MoltenMetal";

export default function App() {
  // Navigation lists for 3D deck transitions
  const PAGES = ["store", "repair-booking", "about", "login", "admin-dashboard"];
  const SCROLLABLE_PAGES = ["store", "repair-booking", "about"];

  // Navigation & Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("store");
  const [pageHistory, setPageHistory] = useState(["store"]);
  const [theme, setTheme] = useState("dark"); // 'dark' or 'light'

  // 3D transition states
  const [transitionState, setTransitionState] = useState({
    activePage: "store",
    prevPage: null,
    direction: "forward"
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isTransitioningRef = useRef(false);

  // Layout Container and Touch Tracking Refs
  const mainContainerRef = useRef(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const panelRefs = {
    store: useRef(null),
    "repair-booking": useRef(null),
    about: useRef(null),
    login: useRef(null),
    "admin-dashboard": useRef(null)
  };

  // Sync isTransitioning state to mutable ref for stable event listener callbacks
  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  const handleNavigate = React.useCallback((newPage) => {
    if (newPage === currentPage) return;
    if (isTransitioning) return;

    const prevIdx = PAGES.indexOf(currentPage);
    const currIdx = PAGES.indexOf(newPage);
    const direction = currIdx >= prevIdx ? "forward" : "backward";

    setTransitionState({
      activePage: newPage,
      prevPage: currentPage,
      direction
    });
    setIsTransitioning(true);
    setPageHistory((prev) => [...prev, newPage]);
    setCurrentPage(newPage);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  }, [currentPage, isTransitioning]);

  const handleGoBack = React.useCallback(() => {
    if (isTransitioning) return;
    let newPage = "store";

    if (pageHistory.length > 1) {
      const nextStack = pageHistory.slice(0, pageHistory.length - 1);
      newPage = nextStack[nextStack.length - 1] || "store";
      setPageHistory(nextStack.length > 0 ? nextStack : ["store"]);
    } else {
      if (currentPage !== "store") {
        setPageHistory(["store"]);
      }
    }

    const prevIdx = PAGES.indexOf(currentPage);
    const currIdx = PAGES.indexOf(newPage);
    const direction = currIdx >= prevIdx ? "forward" : "backward";

    setTransitionState({
      activePage: newPage,
      prevPage: currentPage,
      direction
    });
    setIsTransitioning(true);
    setCurrentPage(newPage);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  }, [currentPage, isTransitioning, pageHistory]);

  const checkScrollBoundary = (direction) => {
    const container = panelRefs[currentPage]?.current;
    if (!container) return false;

    if (direction === "next") {
      // Scrolled to absolute bottom
      const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 8;
      return isAtBottom;
    } else if (direction === "prev") {
      // Scrolled to absolute top
      const isAtTop = container.scrollTop <= 5;
      return isAtTop;
    }
    return false;
  };

  const handleScrollTransition = (dir) => {
    const currentIdx = SCROLLABLE_PAGES.indexOf(currentPage);
    if (currentIdx === -1) return;

    let nextIdx = currentIdx;
    if (dir === "next") {
      nextIdx = currentIdx + 1;
    } else if (dir === "prev") {
      nextIdx = currentIdx - 1;
    }

    if (nextIdx >= 0 && nextIdx < SCROLLABLE_PAGES.length) {
      handleNavigate(SCROLLABLE_PAGES[nextIdx]);
    }
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  // Scroll and touch swipe gesture event listener setup
  useEffect(() => {
    const container = mainContainerRef.current;
    if (!container) return;

    const onWheel = (e) => {
      if (isTransitioningRef.current) {
        e.preventDefault();
        return;
      }
      if (!SCROLLABLE_PAGES.includes(currentPage)) return;

      const threshold = 35; // minimum scroll threshold
      if (Math.abs(e.deltaY) < threshold) return;

      if (e.deltaY > 0) {
        if (checkScrollBoundary("next")) {
          e.preventDefault();
          handleScrollTransition("next");
        }
      } else {
        if (checkScrollBoundary("prev")) {
          e.preventDefault();
          handleScrollTransition("prev");
        }
      }
    };

    const onTouchMove = (e) => {
      if (isTransitioningRef.current) {
        e.preventDefault();
        return;
      }
      if (!SCROLLABLE_PAGES.includes(currentPage)) return;

      const touchY = e.touches[0].clientY;
      const diffY = touchY - touchStartY.current;
      const diffX = e.touches[0].clientX - touchStartX.current;

      // Ensure vertical swipe is prominent and threshold is satisfied (60px)
      if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 60) {
        if (diffY < 0) {
          if (checkScrollBoundary("next")) {
            e.preventDefault();
            handleScrollTransition("next");
          }
        } else {
          if (checkScrollBoundary("prev")) {
            e.preventDefault();
            handleScrollTransition("prev");
          }
        }
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchmove", onTouchMove);
    };
  }, [currentPage, isTransitioning]);

  const getPanelClass = (pageName) => {
    if (pageName === currentPage) {
      return isTransitioning
        ? `page-panel active enter-${transitionState.direction === "forward" ? "next" : "prev"}`
        : "page-panel active";
    }
    if (pageName === transitionState.prevPage && isTransitioning) {
      return `page-panel exit-${transitionState.direction === "forward" ? "prev" : "next"}`;
    }
    return "page-panel";
  };
  
  // Database Synchronization State
  const [products, setProducts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [repairServices, setRepairServices] = useState([]);
  const [repairBookings, setRepairBookings] = useState([]);
  const [simulatedDate, setSimulatedDate] = useState("2026-07-19");

  // WhatsApp Mobile Booking Handler
  const handleWhatsAppBook = React.useCallback((product, storage, price, color) => {
    const message = `Hello Mobile Inn, I'm interested in booking a phone:\n` +
      `- Model: ${product.brand} ${product.model}\n` +
      `- Condition: ${product.condition === "new" ? "Brand New" : "Second Hand"}\n` +
      `- Storage: ${storage ? storage.toUpperCase() : "128GB"}\n` +
      `- Color: ${color && color.name ? color.name : "Standard"}\n` +
      `- Price: Rs. ${price ? price.toLocaleString() : "N/A"}`;
    
    const url = `https://wa.me/94772519160?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }, []);
  
  // Toast Alert State
  const [toasts, setToasts] = useState([]); // [{ id, text, type }]

  // Initial Seed & State Sync
  useEffect(() => {
    // Force cache bust if Samsung Cobalt Violet is missing
    const cachedProducts = localStorage.getItem("mobile_inn_products");
    if (cachedProducts) {
      try {
        const parsed = JSON.parse(cachedProducts);
        const hasCobaltViolet = parsed.some(p => p.id === "samsung-s26-ultra" && p.image === "/26ultra.png") && parsed.some(p => p.id === "samsung-s26-plus" && p.image === "/26+.png");
        if (!hasCobaltViolet) {
          console.log("Purging old cached database to update Samsung colors...");
          localStorage.removeItem("mobile_inn_products");
          localStorage.removeItem("mobile_inn_upcoming");
          localStorage.removeItem("mobile_inn_bookings");
          localStorage.removeItem("mobile_inn_notifications");
          window.location.reload();
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }
    syncState();
    setSimulatedDate(db.getSimulatedDate());
  }, []);

  // Theme Sync Hook
  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  }, [theme]);

  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const syncState = () => {
    setProducts(db.getProducts());
    setBookings(db.getBookings());
    setUsers(db.getUsers());
    setNotifications(db.getNotifications());
    setRepairServices(db.getRepairServices());
    setRepairBookings(db.getRepairBookings());
  };

  // Toast Dispatcher
  const showToast = (text, type = "info") => {
    const id = "toast-" + Math.floor(Math.random() * 1000000);
    setToasts((prev) => [...prev, { id, text, type }]);
    
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // User Actions
  const handleLogin = (user) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}! Logged in as ${user.role}.`, "success");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    handleNavigate("store");
    showToast("Successfully logged out of profile.", "info");
  };

  // Phone Booking Handler
  const handleBookingSuccess = (bookingData) => {
    const updatedBookings = db.saveBooking(bookingData);
    setBookings(updatedBookings);
    
    const orderId = updatedBookings[updatedBookings.length - 1].id;
    
    // 1. To Customer
    db.addNotification({
      title: "Booking Confirmation",
      message: `Booking confirmation #${orderId} generated for ${bookingData.productModel}.`,
      type: "booking",
      targetRoles: ["customer"],
      emailSent: true,
      emailDetails: {
        to: bookingData.customerEmail,
        subject: `Mobile Inn Booking Confirmation - #${orderId}`,
        body: `Dear ${bookingData.customerName},\n\nWe have received your booking reservation for the ${bookingData.productModel} (${bookingData.selectedStorage.toUpperCase()}).\n\nOrder Total: Rs. ${bookingData.price.toLocaleString()}\nPayment Mode: ${bookingData.paymentMethod === "card" ? "Credit Card (Paid)" : "Pay on Store Pickup"}\n\nOur staff is currently reviewing the allocation queue. You can track this booking progress live on your Mobile Inn Customer Dashboard.\n\nThank you for choosing MOBILE INN!`
      },
      smsSent: true,
      smsDetails: {
        to: bookingData.customerPhone,
        body: `MOBILE INN: Booking confirmation received for ${bookingData.productModel}. Total: Rs. ${bookingData.price.toLocaleString()}. Ticket: ${orderId}`
      }
    });

    // 2. To Shop/Admin
    db.addNotification({
      title: "New Phone Order Alert",
      message: `Alert sent to Admin & Staff inbox for Order #${orderId}.`,
      type: "booking",
      targetRoles: ["admin", "staff"],
      emailSent: true,
      emailDetails: {
        to: "sales@mobileinn.lk",
        subject: `New Reservation Request - #${orderId}`,
        body: `Admin Alert:\n\nA new reservation has been logged by customer ${bookingData.customerName} (${bookingData.customerPhone}).\n\nDevice: ${bookingData.productModel}\nPrice: Rs. ${bookingData.price.toLocaleString()}`
      }
    });

    showToast("Phone reservation registered successfully!", "success");
    syncState();
  };

  // Repair Booking Handler
  const handleRepairBookingSuccess = (repairData) => {
    const newTicket = db.saveRepairBooking(repairData);
    
    // 1. Live In-App Notification to Customer
    db.addNotification({
      title: "Booking Confirmation: Repair Ticket Created",
      message: `Repair Ticket #${newTicket.id} created for ${repairData.deviceBrand} ${repairData.phoneModel}. Services: ${repairData.selectedServices.map(s => s.serviceName).join(", ")}.`,
      type: "repair",
      targetRoles: ["customer"],
      emailSent: true,
      emailDetails: {
        to: repairData.customerEmail,
        subject: `Mobile Inn Repair Booking Confirmation - Ticket #${newTicket.id}`,
        body: `Dear ${repairData.customerName},\n\nThank you for booking a repair service with MOBILE INN Certified Workshop!\n\nRepair Ticket Details:\nTicket ID: ${newTicket.id}\nDevice: ${repairData.deviceBrand} ${repairData.phoneModel} (${repairData.deviceType})\nSelected Repair Services: ${repairData.selectedServices.map(s => s.serviceName).join(", ")}\nTotal Estimated Repair Cost: Rs. ${repairData.pricingBreakdown.grandTotalRepairCost.toLocaleString()}\nFulfillment Option: ${repairData.fulfillmentType === "drop-off" ? repairData.preferredShowroom : `Doorstep Courier Pickup (${repairData.pickupAddress})`}\n\nYou can track live diagnostic and repair progress on your Customer Dashboard.\n\nBest regards,\nMOBILE INN Repair Center`
      },
      smsSent: true,
      smsDetails: {
        to: repairData.customerPhone,
        body: `MOBILE INN: Repair Booking Confirmation #${newTicket.id} for ${repairData.deviceBrand} ${repairData.phoneModel}. Est. Cost: Rs. ${repairData.pricingBreakdown.grandTotalRepairCost.toLocaleString()}`
      }
    });

    // 2. Notification to Admin & Technicians
    db.addNotification({
      title: "New Repair Booking Registered",
      message: `New repair ticket #${newTicket.id} registered for ${repairData.customerName} (${repairData.deviceBrand} ${repairData.phoneModel}).`,
      type: "repair",
      targetRoles: ["admin", "staff"],
      emailSent: true,
      emailDetails: {
        to: "workshop@mobileinn.lk",
        subject: `Workshop Queue: New Ticket #${newTicket.id}`,
        body: `Admin Alert:\n\nCustomer ${repairData.customerName} (${repairData.customerPhone}) submitted repair booking #${newTicket.id}.\nDevice: ${repairData.deviceBrand} ${repairData.phoneModel}\nSymptoms: ${repairData.issueDescription}`
      }
    });

    showToast(`Repair Ticket #${newTicket.id} submitted successfully!`, "success");
    syncState();
    
    // Redirect to WhatsApp with complete repair ticket details
    const servicesText = repairData.selectedServices.map(s => s.serviceName).join(", ");
    const waMessage = `Hello Mobile Inn, I'd like to book a mobile repair service:\n` +
      `- Ticket ID: #${newTicket.id}\n` +
      `- Device: ${repairData.deviceBrand} ${repairData.phoneModel} (${repairData.deviceType})\n` +
      `- IMEI/Serial: ${repairData.imeiOrSerial || "N/A"}\n` +
      `- Services Needed: ${servicesText}\n` +
      `- Symptoms: ${repairData.issueDescription}\n` +
      `- Fulfillment: ${repairData.fulfillmentType === "drop-off" ? `Drop-off at ${repairData.preferredShowroom}` : `Courier Pickup at ${repairData.pickupAddress}`}\n` +
      `- Estimated Cost: Rs. ${repairData.pricingBreakdown.grandTotalRepairCost.toLocaleString()}\n` +
      `- Customer Name: ${repairData.customerName}\n` +
      `- Customer Phone: ${repairData.customerPhone}\n` +
      `- Customer Email: ${repairData.customerEmail}`;

    const waUrl = `https://wa.me/94772519160?text=${encodeURIComponent(waMessage)}`;
    window.open(waUrl, "_blank");

    // Redirect to customer dashboard or login
    if (currentUser) {
      handleNavigate("customer-dashboard");
    } else {
      handleNavigate("login");
    }
  };

  // Staff & Admin Phone Booking Status Update
  const handleUpdateBookingStatus = (bookingId, status, depositAmount) => {
    const updated = db.updateBookingStatus(bookingId, status, depositAmount);
    if (updated) {
      showToast(`Reservation #${bookingId} status updated to ${status}.`, "success");

      db.addNotification({
        title: `Order Status Update: ${status.toUpperCase()}`,
        message: `Order status updated to ${status.toUpperCase()} for Order #${bookingId}.`,
        type: "booking",
        targetRoles: ["customer", "admin", "staff"],
        emailSent: true,
        emailDetails: {
          to: updated.customerEmail,
          subject: `Mobile Inn Order Update - #${bookingId}`,
          body: `Dear ${updated.customerName},\n\nYour order #${bookingId} for the ${updated.productModel} status has been updated to: ${status.toUpperCase()}.\n\nBest regards,\nMOBILE INN`
        },
        smsSent: true,
        smsDetails: {
          to: updated.customerPhone,
          body: `MOBILE INN: Order #${bookingId} status updated to ${status.toUpperCase()}.`
        }
      });

      syncState();
    }
  };

  // Staff & Admin Repair Ticket Status Update
  const handleUpdateRepairBookingStatus = (bookingId, status, notes) => {
    const updated = db.updateRepairBookingStatus(bookingId, status, notes);
    if (updated) {
      showToast(`Repair Ticket #${bookingId} status updated to ${status.toUpperCase()}!`, "success");

      let notifTitle = "Repair Booking Update";
      let emailSubject = `Mobile Inn Repair Status Update - Ticket #${bookingId}`;
      let bodyText = `Dear ${updated.customerName},\n\nYour repair ticket #${bookingId} for ${updated.deviceBrand} ${updated.phoneModel} status is updated to: ${status.toUpperCase()}.\n\nTrack progress on your Customer Dashboard.\n\nBest regards,\nMOBILE INN Certified Workshop`;

      if (status === "ready") {
        notifTitle = "Delivery or Pickup Notification";
        emailSubject = `Repair Completed: Ready for Pickup / Delivery - Ticket #${bookingId}`;
        bodyText = `Dear ${updated.customerName},\n\nGreat news! The repair work on your ${updated.deviceBrand} ${updated.phoneModel} is now fully COMPLETED and passed quality testing.\n\nYour device is now READY FOR PICKUP at our showroom or out for courier delivery.\n\nBest regards,\nMOBILE INN Team`;
      } else if (status === "completed") {
        notifTitle = "Repair Completion Notification";
        emailSubject = `Repair Ticket #${bookingId} Marked Completed`;
        bodyText = `Dear ${updated.customerName},\n\nThank you for choosing MOBILE INN! Repair ticket #${bookingId} is completed and verified.\n\nBest regards,\nMOBILE INN Team`;
      }

      db.addNotification({
        title: notifTitle,
        message: `Repair Ticket #${bookingId} updated to ${status.toUpperCase()} for Customer ${updated.customerName}.`,
        type: "repair",
        targetRoles: ["customer", "admin", "staff"],
        emailSent: true,
        emailDetails: {
          to: updated.customerEmail,
          subject: emailSubject,
          body: bodyText
        },
        smsSent: true,
        smsDetails: {
          to: updated.customerPhone,
          body: `MOBILE INN: Repair Ticket #${bookingId} update: ${status.toUpperCase()}. ${status === "ready" ? "Ready for pickup/delivery!" : ""}`
        }
      });

      syncState();
    }
  };

  const handlePayDeposit = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const updated = db.updateBookingStatus(bookingId, "confirmed", null, booking.advanceRequiredAmount);
    if (updated) {
      showToast(`Advance payment of Rs. ${booking.advanceRequiredAmount.toLocaleString()} processed successfully!`, "success");

      db.addNotification({
        title: "Payment Confirmation",
        message: `Payment confirmation: Received Rs. ${updated.advancePaidAmount.toLocaleString()} deposit for Order #${bookingId}.`,
        type: "booking",
        targetRoles: ["customer", "admin", "staff"],
        emailSent: true,
        emailDetails: {
          to: updated.customerEmail,
          subject: `Payment Receipt: Deposit Received - Order #${bookingId}`,
          body: `Dear ${updated.customerName},\n\nWe have successfully received your advance deposit payment of Rs. ${updated.advancePaidAmount.toLocaleString()} for your ${updated.productModel} booking reservation.\n\nThank you for shopping at MOBILE INN!`,
          smsSent: true,
          smsDetails: {
            to: updated.customerPhone,
            body: `MOBILE INN: Received Rs. ${updated.advancePaidAmount.toLocaleString()} deposit for #${bookingId}. Payment confirmed!`
          }
        }
      });

      syncState();
    }
  };

  const handleSaveProduct = (product) => {
    db.saveProduct(product);
    showToast(`${product.brand} ${product.model} saved to store catalog.`, "success");
    syncState();
  };

  const handleDeleteProduct = (productId) => {
    db.deleteProduct(productId);
    showToast("Product deleted from storefront inventory.", "warning");
    syncState();
  };

  const handleSaveRepairService = (service) => {
    db.saveRepairService(service);
    showToast(`Repair service '${service.serviceName}' updated in catalog.`, "success");
    syncState();
  };

  const handleDeleteRepairService = (serviceId) => {
    db.deleteRepairService(serviceId);
    showToast("Repair service removed from catalog.", "warning");
    syncState();
  };

  const handleMarkAllNotificationsRead = () => {
    db.markAllNotificationsRead();
    syncState();
  };

  const handleMarkNotificationRead = (id) => {
    db.markNotificationRead(id);
    syncState();
  };

  const handleAddStaff = (staffData) => {
    const usersList = db.getUsers();
    if (usersList.some((u) => u.email.toLowerCase() === staffData.email.toLowerCase())) {
      return false;
    }
    
    localStorage.setItem(`pw_${staffData.email.toLowerCase()}`, staffData.password);
    db.saveUser({
      ...staffData,
      role: "staff"
    });
    
    showToast(`Staff member ${staffData.name} registered.`, "success");
    syncState();
    return true;
  };

  const handleAdvanceDate = (days) => {
    const currentDate = new Date(simulatedDate);
    currentDate.setDate(currentDate.getDate() + days);
    const newDateStr = currentDate.toISOString().split("T")[0];
    
    const result = db.setSimulatedDate(newDateStr);
    setSimulatedDate(newDateStr);
    
    if (result.releasedCount > 0) {
      showToast(`Advanced calendar by ${days} days. Released ${result.releasedCount} upcoming phones! Check store tab.`, "accent");
    } else {
      showToast(`Advanced calendar by ${days} days to ${newDateStr}.`, "info");
    }
    syncState();
  };

  const Footer = () => (
    <footer style={{ padding: "2rem 0", textAlign: "center", borderTop: "1px solid var(--border-glass)", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4rem" }}>
      <div className="container">
        <p>© 2026 MOBILE INN Retails & Certified Repair Center.</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "0.5rem" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "1px", color: "var(--cyan)", fontWeight: "bold" }}>POWERED BY</span>
          <img 
            src="/logoour1.png" 
            alt="DXA Software Solutions" 
            style={{ 
              height: "36px", 
              width: "auto", 
              borderRadius: "4px",
              padding: "2px 4px"
            }} 
          />
        </div>
      </div>
    </footer>
  );

  return (
    <div className="app-container">
      {/* Dynamic Background Fluid Shader */}
      <div className="app-bg-animation">
        <MoltenMetal
          color1={theme === "light" ? "#ffffff" : "#020617"}
          color2={theme === "light" ? "#a5f3fc" : "#0052d4"}
          color3={theme === "light" ? "#0284c7" : "#00f2fe"}
          speed={0.25}
          scale={3.5}
          detail={4}
          glow={1.4}
          coreSize={0.08}
          swirl={0.8}
          fold={-0.15}
          blackPoint={theme === "light" ? 0.02 : 0.06}
          brightness={theme === "light" ? 1.0 : 1.2}
          colorMode="molten"
          grain={true}
          grainIntensity={0.04}
          mouseInteraction={true}
          mouseStrength={0.25}
          opacity={1.0}
        />
      </div>
      {/* Navigation Header */}
      <Navbar 
        currentUser={currentUser} 
        onLogout={handleLogout} 
        currentPage={currentPage}
        setCurrentPage={handleNavigate}
        simulatedDate={simulatedDate}
        onAdvanceDate={handleAdvanceDate}
        theme={theme}
        onToggleTheme={toggleTheme}
        notifications={notifications}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onMarkNotificationRead={handleMarkNotificationRead}
      />

      {/* Main Pages Router with 3D Transition Deck */}
      <main className="main-content three-d-deck-container" ref={mainContainerRef} onTouchStart={handleTouchStart}>
        
        {/* Page panel: Store */}
        <div 
          className={getPanelClass("store")}
          ref={panelRefs["store"]}
        >
          <div className="page-panel-scroll-content" style={{ padding: "0 0 2rem 0" }}>
            <React.Suspense fallback={<div className="loading-fallback">Loading Store catalog...</div>}>
              <CustomerStore 
                products={products} 
                onBookNow={handleWhatsAppBook}
              />
            </React.Suspense>
            <Footer />
          </div>
        </div>

        {/* Page panel: Repair Booking */}
        <div 
          className={getPanelClass("repair-booking")}
          ref={panelRefs["repair-booking"]}
        >
          <div className="page-panel-scroll-content" style={{ padding: "0.5rem 0 2rem 0" }}>
            {currentPage === "repair-booking" && (
              <BackButton onGoBack={handleGoBack} currentPage={currentPage} />
            )}
            <React.Suspense fallback={<div className="loading-fallback">Loading Repair services...</div>}>
              <RepairBooking 
                currentUser={currentUser}
                repairServices={repairServices}
                onRepairBookingSuccess={handleRepairBookingSuccess}
                setCurrentPage={handleNavigate}
              />
            </React.Suspense>
            <Footer />
          </div>
        </div>

        {/* Page panel: About */}
        <div 
          className={getPanelClass("about")}
          ref={panelRefs["about"]}
        >
          <div className="page-panel-scroll-content" style={{ padding: "0.5rem 0 2rem 0" }}>
            {currentPage === "about" && (
              <BackButton onGoBack={handleGoBack} currentPage={currentPage} />
            )}
            <React.Suspense fallback={<div className="loading-fallback">Loading About details...</div>}>
              <About simulatedDate={simulatedDate} />
            </React.Suspense>
            <Footer />
          </div>
        </div>

        {/* Page panel: Login */}
        <div 
          className={getPanelClass("login")}
          ref={panelRefs["login"]}
        >
          <div className="page-panel-scroll-content" style={{ padding: "0.5rem 0 2rem 0" }}>
            {currentPage === "login" && (
              <BackButton onGoBack={handleGoBack} currentPage={currentPage} />
            )}
            <React.Suspense fallback={<div className="loading-fallback">Loading Login portal...</div>}>
              <Login 
                onLoginSuccess={handleLogin} 
                setCurrentPage={handleNavigate} 
              />
            </React.Suspense>
            <Footer />
          </div>
        </div>

        {/* Page panel: Admin Dashboard */}
        {currentUser && currentUser.role === "admin" && (
          <div 
            className={getPanelClass("admin-dashboard")}
            ref={panelRefs["admin-dashboard"]}
          >
            <div className="page-panel-scroll-content" style={{ padding: "0.5rem 0 2rem 0" }}>
              {currentPage === "admin-dashboard" && (
                <BackButton onGoBack={handleGoBack} currentPage={currentPage} />
              )}
              <React.Suspense fallback={<div className="loading-fallback">Loading Admin console...</div>}>
                <AdminDashboard 
                  products={products}
                  bookings={bookings}
                  users={users}
                  notifications={notifications}
                  repairServices={repairServices}
                  repairBookings={repairBookings}
                  onSaveProduct={handleSaveProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onUpdateBookingStatus={handleUpdateBookingStatus}
                  onAddStaff={handleAddStaff}
                  onSaveRepairService={handleSaveRepairService}
                  onDeleteRepairService={handleDeleteRepairService}
                  onUpdateRepairBookingStatus={handleUpdateRepairBookingStatus}
                />
              </React.Suspense>
              <Footer />
            </div>
          </div>
        )}
      </main>

      {/* Toast notifications container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <div>
              {t.type === "success" && "🟢 "}
              {t.type === "info" && "🔵 "}
              {t.type === "warning" && "🟡 "}
              {t.type === "error" && "🔴 "}
              {t.type === "accent" && "✨ "}
              {t.text}
            </div>
            <button 
              style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "0.9rem" }}
              onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
