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

const getInitialPage = () => {
  const path = window.location.pathname;
  if (path.startsWith("/about")) return "about";
  if (path.startsWith("/repair-booking")) return "repair-booking";
  if (path.startsWith("/login")) return "login";
  if (path.startsWith("/admin-dashboard")) return "admin-dashboard";
  return "store";
};

const getInitialProductId = () => {
  const path = window.location.pathname;
  if (path.startsWith("/product/")) {
    return path.split("/")[2] || null;
  }
  return null;
};

// Custom Hook for SEO Metadata and Schema Injection
function useSEO({ title, description, canonicalUrl, ogType, ogImage, jsonLd }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    if (description) {
      metaDesc.setAttribute('content', description);
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    if (canonicalUrl) {
      canonical.setAttribute('href', canonicalUrl);
    }

    const ogTags = {
      'og:title': title,
      'og:description': description,
      'og:url': canonicalUrl,
      'og:type': ogType || 'website',
      'og:image': ogImage || 'https://mobileinn.com.lk/logomi.png'
    };

    Object.entries(ogTags).forEach(([property, value]) => {
      if (!value) return;
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', value);
    });

    let jsonLdScript = document.getElementById('seo-json-ld');
    if (jsonLdScript) {
      jsonLdScript.remove();
    }
    if (jsonLd) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'seo-json-ld';
      jsonLdScript.type = 'application/ld+json';
      jsonLdScript.text = JSON.stringify(jsonLd);
      document.head.appendChild(jsonLdScript);
    }

    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      document.head.appendChild(viewport);
    }
  }, [title, description, canonicalUrl, ogType, ogImage, jsonLd]);
}

export default function App() {
  // Navigation lists for 3D deck transitions
  const PAGES = ["store", "repair-booking", "about", "login", "admin-dashboard"];
  const SCROLLABLE_PAGES = ["store", "repair-booking", "about"];

  // Navigation & Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [pageHistory, setPageHistory] = useState([getInitialPage()]);
  const [activeProductId, setActiveProductId] = useState(getInitialProductId);
  const [theme, setTheme] = useState("dark"); // 'dark' or 'light'

  // Database Synchronization State
  const [products, setProducts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [repairServices, setRepairServices] = useState([]);
  const [repairBookings, setRepairBookings] = useState([]);
  const [simulatedDate, setSimulatedDate] = useState("2026-07-19");

  // Toast Alert State
  const [toasts, setToasts] = useState([]); // [{ id, text, type }]

  // 3D transition states
  const [transitionState, setTransitionState] = useState({
    activePage: getInitialPage(),
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
    setActiveProductId(null); // clear active product if changing tabs

    const path = newPage === "store" ? "/" : `/${newPage}`;
    window.history.pushState(null, "", path);

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
    setActiveProductId(null); // clear active product

    const path = newPage === "store" ? "/" : `/${newPage}`;
    window.history.pushState(null, "", path);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  }, [currentPage, isTransitioning, pageHistory]);

  const handleProductModalChange = React.useCallback((productId) => {
    setActiveProductId(productId);
    const path = productId ? `/product/${productId}` : "/";
    window.history.pushState(null, "", path);
  }, []);

  // Popstate URL & Routing Sync
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      let newPage = "store";
      let prodId = null;

      if (path.startsWith("/about")) {
        newPage = "about";
      } else if (path.startsWith("/repair-booking")) {
        newPage = "repair-booking";
      } else if (path.startsWith("/login")) {
        newPage = "login";
      } else if (path.startsWith("/admin-dashboard")) {
        newPage = "admin-dashboard";
      } else if (path.startsWith("/product/")) {
        newPage = "store";
        prodId = path.split("/")[2] || null;
      }

      if (newPage !== currentPage) {
        const prevIdx = PAGES.indexOf(currentPage);
        const currIdx = PAGES.indexOf(newPage);
        const direction = currIdx >= prevIdx ? "forward" : "backward";

        setTransitionState({
          activePage: newPage,
          prevPage: currentPage,
          direction
        });
        setCurrentPage(newPage);
      }
      setActiveProductId(prodId);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentPage]);

  // Get active product details for SEO & schema
  const activeProduct = React.useMemo(() => {
    if (currentPage === "store" && activeProductId) {
      return products.find(p => p.id === activeProductId) || null;
    }
    return null;
  }, [currentPage, activeProductId, products]);

  // Compute dynamic SEO metadata parameters
  const seoParams = React.useMemo(() => {
    const baseTitle = "Mobile Inn | Mobile Phones & Accessories in Sri Lanka";
    const baseDesc = "Mobile Inn is your ultimate destination for brand-new and certified pre-owned Apple iPhones, along with Samsung, Redmi, Honor, and Nubia smartphones in Sri Lanka. Genuine showroom warranty and secure booking in Jaffna.";
    const baseLogo = "https://www.mobileinn.com.lk/logomi.png";

    if (activeProduct) {
      const pricesArr = Object.values(activeProduct.prices || {});
      const minPrice = pricesArr.length > 0 ? Math.min(...pricesArr) : 0;
      const maxPrice = pricesArr.length > 0 ? Math.max(...pricesArr) : 0;
      const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": activeProduct.model,
        "brand": {
          "@type": "Brand",
          "name": activeProduct.brand
        },
        "image": `https://www.mobileinn.com.lk${activeProduct.image}`,
        "description": activeProduct.description || activeProduct.tagline,
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "LKR",
          "lowPrice": minPrice,
          "highPrice": maxPrice,
          "offerCount": Object.keys(activeProduct.prices || {}).length,
          "availability": activeProduct.stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "url": `https://www.mobileinn.com.lk/product/${activeProduct.id}`
        }
      };

      return {
        title: `${activeProduct.brand} ${activeProduct.model} | Mobile Inn Sri Lanka`,
        description: `Buy genuine ${activeProduct.brand} ${activeProduct.model} at Mobile Inn. ${activeProduct.tagline || activeProduct.description}`,
        canonicalUrl: `https://www.mobileinn.com.lk/product/${activeProduct.id}`,
        ogType: "product",
        ogImage: `https://www.mobileinn.com.lk${activeProduct.image}`,
        jsonLd: productSchema
      };
    }

    if (currentPage === "about") {
      return {
        title: "About Us & Contact | Mobile Inn Sri Lanka",
        description: "Learn more about Mobile Inn, founded by S. Banushan. We are Sri Lanka's trusted shop for brand-new flagships and certified second-hand iPhones. Visit our Jaffna branch or contact us.",
        canonicalUrl: "https://www.mobileinn.com.lk/about",
        ogType: "website",
        ogImage: baseLogo,
        jsonLd: null
      };
    }

    if (currentPage === "repair-booking") {
      return {
        title: "Certified Mobile Repair & Support Booking | Mobile Inn",
        description: "Book professional repair services for iPhones and Android devices at Mobile Inn Certified Workshop in Jaffna. Screen replacement, battery repair, Face ID fixes, and micro-soldering.",
        canonicalUrl: "https://www.mobileinn.com.lk/repair-booking",
        ogType: "website",
        ogImage: baseLogo,
        jsonLd: null
      };
    }

    if (currentPage === "login") {
      return {
        title: "Admin Login | Mobile Inn",
        description: "Access the Mobile Inn admin and staff management portal.",
        canonicalUrl: "https://www.mobileinn.com.lk/login",
        ogType: "website",
        ogImage: baseLogo,
        jsonLd: null
      };
    }

    if (currentPage === "admin-dashboard") {
      return {
        title: "Admin Dashboard | Mobile Inn",
        description: "Manage bookings, inventory, and staff at Mobile Inn.",
        canonicalUrl: "https://www.mobileinn.com.lk/admin-dashboard",
        ogType: "website",
        ogImage: baseLogo,
        jsonLd: null
      };
    }

    // Default: Home Page / Store
    const homeSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://www.mobileinn.com.lk/#website",
          "url": "https://www.mobileinn.com.lk/",
          "name": "Mobile Inn"
        },
        {
          "@type": "LocalBusiness",
          "@id": "https://www.mobileinn.com.lk/#localbusiness",
          "name": "Mobile Inn",
          "image": baseLogo,
          "telephone": "+94772519160",
          "email": "mobileinn0000@gmail.com",
          "priceRange": "$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "No. 330A, Kasthuriyar Road",
            "addressLocality": "Jaffna",
            "addressCountry": "LK"
          },
          "url": "https://www.mobileinn.com.lk/"
        }
      ]
    };

    return {
      title: baseTitle,
      description: baseDesc,
      canonicalUrl: "https://www.mobileinn.com.lk/",
      ogType: "website",
      ogImage: baseLogo,
      jsonLd: homeSchema
    };
  }, [currentPage, activeProduct, products]);

  // Run SEO Hook
  useSEO(seoParams);

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

  // Initial Seed & State Sync
  useEffect(() => {
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
    if (!currentUser || currentUser.role !== "admin") {
      showToast("Unauthorized. Only administrators can delete products.", "error");
      throw new Error("Unauthorized delete operation");
    }
    try {
      db.deleteProduct(productId);
      showToast("Product deleted successfully.", "success");
      syncState();
      return true;
    } catch (err) {
      console.error("Error deleting product:", err);
      showToast("Failed to delete product. Please try again.", "error");
      throw err;
    }
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
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginBottom: "1rem" }}>
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); handleNavigate("store"); }} 
            style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.8rem", transition: "color 0.2s" }}
            onMouseOver={(e) => e.target.style.color = "var(--cyan)"}
            onMouseOut={(e) => e.target.style.color = "var(--text-secondary)"}
          >
            Store
          </a>
          <a 
            href="/repair-booking" 
            onClick={(e) => { e.preventDefault(); handleNavigate("repair-booking"); }} 
            style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.8rem", transition: "color 0.2s" }}
            onMouseOver={(e) => e.target.style.color = "var(--cyan)"}
            onMouseOut={(e) => e.target.style.color = "var(--text-secondary)"}
          >
            Support & Repair
          </a>
          <a 
            href="/about" 
            onClick={(e) => { e.preventDefault(); handleNavigate("about"); }} 
            style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.8rem", transition: "color 0.2s" }}
            onMouseOver={(e) => e.target.style.color = "var(--cyan)"}
            onMouseOut={(e) => e.target.style.color = "var(--text-secondary)"}
          >
            About & Contact
          </a>
        </div>
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
                activeProductId={activeProductId}
                onProductModalChange={handleProductModalChange}
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
