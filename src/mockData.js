// mockData.js - Preloaded catalog in LKR (Rs.) and localStorage database fallback

export const INITIAL_PRODUCTS = [
  // Brand New iPhones
  {
    id: "iphone-17-pro",
    brand: "Apple",
    model: "iPhone 17 Pro",
    condition: "new",
    tagline: "Innovative design for ultimate performance and battery life.",
    description: "Pro performance on the iPhone 17. 120Hz ProMotion, under-display Face ID, and A19 Pro powerhouse.",
    image: "/iphone_17_pro.png",
    colors: [
      { name: "Cosmic Orange", hex: "#ff6b35", bgGrad: "linear-gradient(135deg, rgba(255, 107, 53, 0.75) 0%, rgba(50, 15, 5, 0.95) 100%)", image: "/iphone_17_pro.png" },
      { name: "Deep Blue", hex: "#1a2f4c", bgGrad: "linear-gradient(135deg, rgba(26, 47, 76, 0.8) 0%, rgba(8, 15, 26, 0.95) 100%)", image: "/iphone_17_pro.png" },
      { name: "Silver", hex: "#e3e4e6", bgGrad: "linear-gradient(135deg, rgba(227, 228, 230, 0.7) 0%, rgba(40, 42, 45, 0.9) 100%)", image: "/iphone_17_pro.png" }
    ],
    prices: { "128gb": 329000, "256gb": 359000, "512gb": 409000, "1tb": 469000 },
    stock: true,
    releaseDate: "2025-09-19",
    isReleased: true
  },
  {
    id: "iphone-air",
    brand: "Apple",
    model: "iPhone Air",
    condition: "new",
    tagline: "The thinnest iPhone ever. With the power of pro inside.",
    description: "The thinnest iPhone ever, featuring an ultra-slim chassis, A19 processor, and single sleek camera lens.",
    image: "/iphone_air.png",
    colors: [
      { name: "Light Blue", hex: "#a4c2e6", bgGrad: "linear-gradient(135deg, rgba(20, 45, 75, 0.8) 0%, rgba(8, 18, 32, 0.95) 100%)", image: "/iphone_air.png" },
      { name: "Silver Steel", hex: "#e2e2e7", bgGrad: "linear-gradient(135deg, rgba(28, 39, 56, 0.7) 0%, rgba(10, 17, 26, 0.9) 100%)", image: "/iphone_air.png" },
      { name: "Charcoal Black", hex: "#343335", bgGrad: "linear-gradient(135deg, rgba(31, 31, 36, 0.7) 0%, rgba(9, 9, 11, 0.9) 100%)", image: "/iphone_air.png" }
    ],
    prices: { "128gb": 299000, "256gb": 329000, "512gb": 389000, "1tb": 449000 },
    stock: true,
    releaseDate: "2025-09-19",
    isReleased: true
  },
  {
    id: "iphone-17",
    brand: "Apple",
    model: "iPhone 17",
    condition: "new",
    tagline: "Even more delightful. Even more durable.",
    description: "Brand new Apple iPhone 17 featuring dual vertical cameras, vibrant colors, and durable aerospace-grade design.",
    image: "/iphone_17.png",
    colors: [
      { name: "Black", hex: "#1c1d21", bgGrad: "linear-gradient(135deg, rgba(28, 29, 33, 0.75) 0%, rgba(8, 8, 10, 0.95) 100%)", image: "/iphone_17.png" },
      { name: "Lavender", hex: "#d6cadd", bgGrad: "linear-gradient(135deg, rgba(214, 202, 221, 0.8) 0%, rgba(45, 30, 55, 0.95) 100%)", image: "/iphone_17.png" },
      { name: "Mist Blue", hex: "#c5d0e6", bgGrad: "linear-gradient(135deg, rgba(197, 208, 230, 0.8) 0%, rgba(35, 45, 65, 0.95) 100%)", image: "/iphone_17.png" },
      { name: "Sage", hex: "#b8c4b9", bgGrad: "linear-gradient(135deg, rgba(184, 196, 185, 0.8) 0%, rgba(35, 45, 35, 0.95) 100%)", image: "/iphone_17.png" },
      { name: "White", hex: "#fafafa", bgGrad: "linear-gradient(135deg, rgba(250, 250, 250, 0.85) 0%, rgba(70, 72, 75, 0.95) 100%)", image: "/iphone_17.png" }
    ],
    prices: { "128gb": 239000, "256gb": 269000, "512gb": 329000, "1tb": 389000 },
    stock: true,
    releaseDate: "2025-09-19",
    isReleased: true
  },
  {
    id: "iphone-17e",
    brand: "Apple",
    model: "iPhone 17e",
    condition: "new",
    tagline: "Feature stacked. Value packed.",
    description: "The value-packed model with a single round camera lens, lightweight design, and modern features.",
    image: "/iphone_17e.png",
    colors: [
      { name: "Rose Pink", hex: "#f48fb1", bgGrad: "linear-gradient(135deg, rgba(80, 30, 50, 0.8) 0%, rgba(30, 10, 20, 0.95) 100%)", image: "/iphone_17e.png" },
      { name: "Soft White", hex: "#f5f5f7", bgGrad: "linear-gradient(135deg, rgba(40, 45, 55, 0.8) 0%, rgba(15, 18, 24, 0.95) 100%)", image: "/iphone_17e.png" }
    ],
    prices: { "128gb": 179000, "256gb": 209000, "512gb": 269000 },
    stock: true,
    releaseDate: "2025-09-19",
    isReleased: true
  },
  {
    id: "iphone-16",
    brand: "Apple",
    model: "iPhone 16",
    condition: "new",
    tagline: "Amazing performance. Durable design.",
    description: "Brand new Apple iPhone 16 with A18 chip, Camera Control button, and advanced dual-camera system.",
    image: "/iphone_16.png",
    colors: [
      { name: "Ultramarine", hex: "#3b55a3", bgGrad: "linear-gradient(135deg, rgba(59, 85, 163, 0.8) 0%, rgba(15, 22, 45, 0.95) 100%)", image: "/iphone_16.png" },
      { name: "Teal", hex: "#3d8e8b", bgGrad: "linear-gradient(135deg, rgba(61, 142, 139, 0.8) 0%, rgba(15, 40, 38, 0.95) 100%)", image: "/iphone_16.png" },
      { name: "Pink", hex: "#e89cb7", bgGrad: "linear-gradient(135deg, rgba(232, 156, 183, 0.8) 0%, rgba(65, 20, 35, 0.95) 100%)", image: "/iphone_16.png" },
      { name: "White", hex: "#f2f3f5", bgGrad: "linear-gradient(135deg, rgba(242, 243, 245, 0.85) 0%, rgba(65, 68, 72, 0.95) 100%)", image: "/iphone_16.png" },
      { name: "Black", hex: "#222326", bgGrad: "linear-gradient(135deg, rgba(34, 35, 38, 0.75) 0%, rgba(8, 8, 10, 0.95) 100%)", image: "/iphone_16.png" }
    ],
    prices: { "128gb": 209000, "256gb": 239000, "512gb": 299000, "1tb": 359000 },
    stock: true,
    releaseDate: "2024-09-20",
    isReleased: true
  },
  {
    id: "iphone-17-pro-max",
    brand: "Apple",
    model: "iPhone 17 Pro Max",
    condition: "new",
    tagline: "Peak 2026 engineering. 12GB RAM, professional triple 48MP lenses.",
    description: "The peak of 2025 Apple engineering. 12GB RAM, A19 Pro chip, and professional triple 48MP lenses.",
    image: "/iphone_17_pro_max.png",
    colors: [
      { name: "Cosmic Orange", hex: "#ff6b35", bgGrad: "linear-gradient(135deg, rgba(255, 107, 53, 0.75) 0%, rgba(50, 15, 5, 0.95) 100%)", image: "/iphone_17_pro_max.png" },
      { name: "Deep Blue", hex: "#1a2f4c", bgGrad: "linear-gradient(135deg, rgba(26, 47, 76, 0.8) 0%, rgba(8, 15, 26, 0.95) 100%)", image: "/iphone_17_pro_max.png" },
      { name: "Silver", hex: "#e3e4e6", bgGrad: "linear-gradient(135deg, rgba(227, 228, 230, 0.7) 0%, rgba(40, 42, 45, 0.9) 100%)", image: "/iphone_17_pro_max.png" }
    ],
    prices: { "128gb": 379000, "256gb": 409000, "512gb": 469000, "1tb": 529000 },
    stock: true,
    releaseDate: "2025-09-19",
    isReleased: true
  },
  // Second-Hand iPhones (All Models)
  {
    id: "iphone-15-pro-max-used",
    brand: "Apple",
    model: "iPhone 15 Pro Max (Used)",
    condition: "second-hand",
    tagline: "Titanium body. A17 Pro speed. Certified Pre-Owned.",
    description: "Second-hand iPhone 15 Pro Max in Excellent condition (9/10). Titanium body, A17 Pro chip, minor cosmetic wear.",
    image: "/flagship_sleek_phone.png",
    prices: { "128gb": 225000, "256gb": 255000, "512gb": 299000, "1tb": 345000 },
    stock: true,
    releaseDate: "2023-09-22",
    isReleased: true
  },
  {
    id: "iphone-15-used",
    brand: "Apple",
    model: "iPhone 15 (Used)",
    condition: "second-hand",
    tagline: "Dynamic Island. 48MP main camera. Fully functional.",
    description: "Pre-owned iPhone 15 in Good condition (8.5/10). Fully functional with 88% battery health.",
    image: "/flagship_slim_phone.png",
    prices: { "128gb": 159000, "256gb": 189000, "512gb": 225000 },
    stock: true,
    releaseDate: "2023-09-22",
    isReleased: true
  },
  {
    id: "iphone-14-pro-used",
    brand: "Apple",
    model: "iPhone 14 Pro (Used)",
    condition: "second-hand",
    tagline: "Space Black edition. 48MP fusion camera.",
    description: "Pre-owned iPhone 14 Pro with Dynamic Island, Space Black. Condition: Like New (9.5/10), 91% battery health.",
    image: "/flagship_sleek_phone.png",
    prices: { "128gb": 185000, "256gb": 215000, "512gb": 250000, "1tb": 288000 },
    stock: true,
    releaseDate: "2022-09-16",
    isReleased: true
  },
  {
    id: "iphone-13-used",
    brand: "Apple",
    model: "iPhone 13 (Used)",
    condition: "second-hand",
    tagline: "Excellent dual-camera. Durable design.",
    description: "Good budget iPhone choice. Condition: Fair (8/10). Face ID active, unlocked to all carriers.",
    image: "/flagship_slim_phone.png",
    prices: { "128gb": 119000, "256gb": 142000, "512gb": 172000 },
    stock: true,
    releaseDate: "2021-09-24",
    isReleased: true
  },
  {
    id: "iphone-12-used",
    brand: "Apple",
    model: "iPhone 12 (Used)",
    condition: "second-hand",
    tagline: "Reliable 5G. Super Retina XDR display.",
    description: "Affordable 5G pre-owned iPhone. Blue color. Body shows light scratches. Screen is clean.",
    image: "/flagship_slim_phone.png",
    prices: { "128gb": 89000, "256gb": 109000 },
    stock: true,
    releaseDate: "2020-10-23",
    isReleased: true
  },

  // Samsung Brand New 2026
  {
    id: "samsung-s26-ultra",
    brand: "Samsung",
    model: "Galaxy S26 Ultra",
    condition: "new",
    description: "Latest 2026 flagship with Snapdragon 8 Gen 5, 200MP Quad Telephoto Space Zoom, and built-in S-Pen.",
    image: "/26ultra.png",
    colors: [
      { name: "Cobalt Violet", hex: "#4d4b75", bgGrad: "linear-gradient(135deg, rgba(77, 75, 117, 0.75) 0%, rgba(20, 20, 35, 0.95) 100%)", image: "/26ultra.png" },
      { name: "Sky Blue", hex: "#a2c8ec", bgGrad: "linear-gradient(135deg, rgba(162, 200, 236, 0.75) 0%, rgba(25, 40, 60, 0.95) 100%)", image: "/26ultra.png" },
      { name: "Black", hex: "#1e1e1e", bgGrad: "linear-gradient(135deg, rgba(30, 30, 30, 0.85) 0%, rgba(8, 8, 8, 0.95) 100%)", image: "/26ultra.png" },
      { name: "White", hex: "#f3f3f5", bgGrad: "linear-gradient(135deg, rgba(243, 243, 245, 0.85) 0%, rgba(60, 62, 65, 0.95) 100%)", image: "/26ultra.png" },
      { name: "Pink Gold (Samsung.com Exclusive)", hex: "#e6b8ae", bgGrad: "linear-gradient(135deg, rgba(230, 184, 174, 0.75) 0%, rgba(55, 35, 30, 0.95) 100%)", image: "/26ultra.png" },
      { name: "Silver Shadow (Samsung.com Exclusive)", hex: "#b8babd", bgGrad: "linear-gradient(135deg, rgba(184, 186, 189, 0.75) 0%, rgba(40, 42, 45, 0.95) 100%)", image: "/26ultra.png" }
    ],
    prices: { "128gb": 359000, "256gb": 389000, "512gb": 449000, "1tb": 509000 },
    stock: true,
    releaseDate: "2026-02-14",
    isReleased: true
  },
  {
    id: "samsung-s26-plus",
    brand: "Samsung",
    model: "Galaxy S26+",
    condition: "new",
    description: "Brand new 2026 release. 6.7-inch Dynamic AMOLED, A.I. Photo Assist, and efficient 4900mAh battery.",
    image: "/26+.png",
    colors: [
      { name: "Cobalt Violet", hex: "#4d4b75", bgGrad: "linear-gradient(135deg, rgba(77, 75, 117, 0.75) 0%, rgba(20, 20, 35, 0.95) 100%)", image: "/26+.png" },
      { name: "Sky Blue", hex: "#a2c8ec", bgGrad: "linear-gradient(135deg, rgba(162, 200, 236, 0.75) 0%, rgba(25, 40, 60, 0.95) 100%)", image: "/26+.png" },
      { name: "Black", hex: "#1e1e1e", bgGrad: "linear-gradient(135deg, rgba(30, 30, 30, 0.85) 0%, rgba(8, 8, 8, 0.95) 100%)", image: "/26+.png" },
      { name: "White", hex: "#f3f3f5", bgGrad: "linear-gradient(135deg, rgba(243, 243, 245, 0.85) 0%, rgba(60, 62, 65, 0.95) 100%)", image: "/26+.png" },
      { name: "Pink Gold (Samsung.com Exclusive)", hex: "#e6b8ae", bgGrad: "linear-gradient(135deg, rgba(230, 184, 174, 0.75) 0%, rgba(55, 35, 30, 0.95) 100%)", image: "/26+.png" },
      { name: "Silver Shadow (Samsung.com Exclusive)", hex: "#b8babd", bgGrad: "linear-gradient(135deg, rgba(184, 186, 189, 0.75) 0%, rgba(40, 42, 45, 0.95) 100%)", image: "/26+.png" }
    ],
    prices: { "128gb": 285000, "256gb": 315000, "512gb": 369000 },
    stock: true,
    releaseDate: "2026-02-14",
    isReleased: true
  },
  {
    id: "samsung-z-fold-8",
    brand: "Samsung",
    model: "Galaxy Z Fold 8",
    condition: "new",
    description: "The pinnacle of foldable technology in 2026. Ultra-thin folding glass, double-width main screen, multi-tasking master.",
    image: "/zfold8.png",
    colors: [
      { name: "Cream", hex: "#f5ece1", bgGrad: "linear-gradient(135deg, rgba(245, 236, 225, 0.85) 0%, rgba(60, 50, 40, 0.95) 100%)", image: "/zfold8.png" },
      { name: "Graphite", hex: "#3c3d42", bgGrad: "linear-gradient(135deg, rgba(60, 61, 66, 0.85) 0%, rgba(15, 15, 18, 0.95) 100%)", image: "/zfold8.png" },
      { name: "Lavender", hex: "#e2d5e7", bgGrad: "linear-gradient(135deg, rgba(226, 213, 231, 0.75) 0%, rgba(45, 30, 55, 0.95) 100%)", image: "/zfold8.png" },
      { name: "Pistachio (Samsung.com Exclusive)", hex: "#bce2cf", bgGrad: "linear-gradient(135deg, rgba(188, 226, 207, 0.75) 0%, rgba(30, 55, 45, 0.95) 100%)", image: "/zfold8.png" }
    ],
    prices: { "256gb": 539000, "512gb": 569000, "1tb": 629000 },
    stock: true,
    releaseDate: "2026-07-08",
    isReleased: true
  },

  // Redmi
  {
    id: "redmi-note-15-pro",
    brand: "Redmi",
    model: "Redmi Note 15 Pro+",
    condition: "new",
    description: "Unbeatable budget specs. 200MP camera, 120W HyperCharge (0-100% in 19 mins), and high-refresh display.",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop",
    colors: [
      { name: "Aurora Purple", hex: "#b7b2e6", bgGrad: "linear-gradient(135deg, rgba(183, 178, 230, 0.75) 0%, rgba(45, 30, 75, 0.95) 100%)", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop" },
      { name: "Moonlight White", hex: "#f7f7f9", bgGrad: "linear-gradient(135deg, rgba(247, 247, 249, 0.8) 0%, rgba(55, 60, 65, 0.95) 100%)", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop" },
      { name: "Midnight Black", hex: "#1e1e1e", bgGrad: "linear-gradient(135deg, rgba(30, 30, 30, 0.85) 0%, rgba(8, 8, 8, 0.95) 100%)", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop" },
      { name: "Forest Green", hex: "#4a7c59", bgGrad: "linear-gradient(135deg, rgba(74, 124, 89, 0.75) 0%, rgba(20, 35, 25, 0.95) 100%)", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop" }
    ],
    prices: { "128gb": 115000, "256gb": 129000, "512gb": 149000 },
    stock: true,
    releaseDate: "2025-11-10",
    isReleased: true
  },

  // Honor
  {
    id: "honor-magic-8-pro",
    brand: "Honor",
    model: "Magic 8 Pro",
    condition: "new",
    description: "Premium photography powerhouse with Silicon-Carbon 5600mAh battery and Falcon Camera System.",
    image: "https://images.unsplash.com/photo-1565849328638-7f18399c2c45?q=80&w=600&auto=format&fit=crop",
    prices: { "256gb": 255000, "512gb": 285000, "1tb": 329000 },
    stock: true,
    releaseDate: "2026-03-22",
    isReleased: true
  },

  // Nubia
  {
    id: "nubia-redmagic-11-pro",
    brand: "Nubia",
    model: "RedMagic 11 Pro",
    condition: "new",
    description: "The ultimate 2026 gaming phone. Active internal cooling fan, shoulder triggers, under-display selfie camera.",
    image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=600&auto=format&fit=crop",
    prices: { "256gb": 225000, "512gb": 255000, "1tb": 299000 },
    stock: true,
    releaseDate: "2025-12-15",
    isReleased: true
  }
];

// Upcoming Phones Database (Simulating Automatic Additions)
export const UPCOMING_PRODUCTS = [
  {
    id: "iphone-18-pro",
    brand: "Apple",
    model: "iPhone 18 Pro",
    condition: "new",
    description: "Upcoming flagship featuring an A20 Neural-engine, holographic widgets, and 8K zoom capability.",
    image: "/flagship_sleek_phone.png",
    prices: { "128gb": 329000, "256gb": 359000, "512gb": 419000, "1tb": 479000 },
    stock: true,
    releaseDate: "2026-09-18",
    isReleased: false
  },
  {
    id: "samsung-s27-ultra",
    brand: "Samsung",
    model: "Galaxy S27 Ultra",
    condition: "new",
    description: "2027 concept beast. Variable aperture camera, next-gen flexible OLED panel, and 100W wireless charging.",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop",
    prices: { "256gb": 405000, "512gb": 465000, "1tb": 525000 },
    stock: true,
    releaseDate: "2027-02-15",
    isReleased: false
  },
  {
    id: "redmi-note-16-pro",
    brand: "Redmi",
    model: "Redmi Note 16 Pro+",
    condition: "new",
    description: "Upcoming affordable beast. Liquid metal frame, MediaTek Dimensity 9500 gaming processor.",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop",
    colors: [
      { name: "Titanium Gray", hex: "#8e8e93", bgGrad: "linear-gradient(135deg, rgba(142, 142, 147, 0.75) 0%, rgba(40, 42, 45, 0.95) 100%)", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop" },
      { name: "Midnight Black", hex: "#1e1e1e", bgGrad: "linear-gradient(135deg, rgba(30, 30, 30, 0.85) 0%, rgba(8, 8, 8, 0.95) 100%)", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop" },
      { name: "Jade Green", hex: "#4e7c6b", bgGrad: "linear-gradient(135deg, rgba(78, 124, 107, 0.75) 0%, rgba(20, 35, 30, 0.95) 100%)", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop" }
    ],
    prices: { "128gb": 120000, "256gb": 135000, "512gb": 155000 },
    stock: true,
    releaseDate: "2026-10-05",
    isReleased: false
  },
  {
    id: "nubia-redmagic-12",
    brand: "Nubia",
    model: "RedMagic 12 Pro",
    condition: "new",
    description: "Upcoming high-end gaming phone with RGB lighting, mechanical air vents, and 24GB RAM options.",
    image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=600&auto=format&fit=crop",
    prices: { "256gb": 239000, "512gb": 269000, "1tb": 315000 },
    stock: true,
    releaseDate: "2026-11-20",
    isReleased: false
  }
];

// Preloaded Repair Services Catalog for iPhones and Android Phones
export const INITIAL_REPAIR_SERVICES = [
  {
    id: "rep-screen-iphone",
    category: "Screen & Display",
    serviceName: "Screen Replacement (OLED/Retina)",
    deviceType: "iPhone",
    sparePartsPrice: 28000,
    laborCharge: 4500,
    serviceFee: 2500,
    estimatedTime: "1 - 2 Hours",
    availability: "Available",
    description: "Original OEM Retina/OLED display panel replacement for iPhone series with TrueTone restoration."
  },
  {
    id: "rep-screen-android",
    category: "Screen & Display",
    serviceName: "Screen Replacement (AMOLED/LCD)",
    deviceType: "Android",
    sparePartsPrice: 22000,
    laborCharge: 4000,
    serviceFee: 2000,
    estimatedTime: "1 - 2 Hours",
    availability: "Available",
    description: "High quality curved/flat AMOLED or LCD assembly replacement for Samsung, Xiaomi, Pixel, Nubia & Honor."
  },
  {
    id: "rep-battery-iphone",
    category: "Power & Battery",
    serviceName: "Battery Replacement",
    deviceType: "iPhone",
    sparePartsPrice: 14000,
    laborCharge: 2500,
    serviceFee: 1500,
    estimatedTime: "45 Mins",
    availability: "Available",
    description: "High-capacity grade A+ battery replacement with battery health calibration and cycle zeroing."
  },
  {
    id: "rep-battery-android",
    category: "Power & Battery",
    serviceName: "Battery Replacement",
    deviceType: "Android",
    sparePartsPrice: 11000,
    laborCharge: 2000,
    serviceFee: 1500,
    estimatedTime: "45 Mins",
    availability: "Available",
    description: "Genuine polymer lithium battery cell swap for Android smartphones."
  },
  {
    id: "rep-charging-both",
    category: "Power & Battery",
    serviceName: "Charging Port Repair / Flex Replacement",
    deviceType: "Both",
    sparePartsPrice: 8500,
    laborCharge: 2500,
    serviceFee: 1500,
    estimatedTime: "1 Hour",
    availability: "Available",
    description: "Type-C / Lightning port cleaning, re-soldering, or flex ribbon replacement."
  },
  {
    id: "rep-camera-both",
    category: "Camera & Optics",
    serviceName: "Camera Module Repair (Front / Rear)",
    deviceType: "Both",
    sparePartsPrice: 26000,
    laborCharge: 4500,
    serviceFee: 2500,
    estimatedTime: "2 - 3 Hours",
    availability: "Available",
    description: "Optical image stabilization (OIS) fix, lens glass repair, or complete multi-camera module swap."
  },
  {
    id: "rep-speaker-both",
    category: "Audio & Sound",
    serviceName: "Speaker & Earpiece Repair",
    deviceType: "Both",
    sparePartsPrice: 6500,
    laborCharge: 2000,
    serviceFee: 1000,
    estimatedTime: "1 Hour",
    availability: "Available",
    description: "Crackling audio fix, low volume restoration, or stereo loudspeaker component replacement."
  },
  {
    id: "rep-mic-both",
    category: "Audio & Sound",
    serviceName: "Microphone Repair",
    deviceType: "Both",
    sparePartsPrice: 5500,
    laborCharge: 2000,
    serviceFee: 1000,
    estimatedTime: "1 Hour",
    availability: "Available",
    description: "Call noise cancellation microphone or main voice mic ribbon replacement."
  },
  {
    id: "rep-faceid-iphone",
    category: "Biometrics & Chipsets",
    serviceName: "Face ID Repair & Dot Projector Alignment",
    deviceType: "iPhone",
    sparePartsPrice: 18500,
    laborCharge: 5500,
    serviceFee: 3000,
    estimatedTime: "3 - 5 Hours",
    availability: "Available",
    description: "Precision micro-soldering for TrueDepth camera matrix, flood illuminator, and dot projector calibration."
  },
  {
    id: "rep-touchic-both",
    category: "Biometrics & Chipsets",
    serviceName: "Touch IC / Display IC Reballing",
    deviceType: "Both",
    sparePartsPrice: 16000,
    laborCharge: 6000,
    serviceFee: 3000,
    estimatedTime: "Same Day",
    availability: "By Appointment",
    description: "Fix for ghost touch, flickering lines, and unresponsive touch controller chips on the logic board."
  },
  {
    id: "rep-motherboard-both",
    category: "Motherboard & Micro-soldering",
    serviceName: "Motherboard Repair & Component Swap",
    deviceType: "Both",
    sparePartsPrice: 35000,
    laborCharge: 12000,
    serviceFee: 5000,
    estimatedTime: "24 - 48 Hours",
    availability: "Available",
    description: "Advanced BGA micro-soldering, short circuit detection, IC chip replacement, and power management IC (PMIC) repair."
  },
  {
    id: "rep-backglass-both",
    category: "Body & Glass",
    serviceName: "Back Glass Laser Replacement",
    deviceType: "Both",
    sparePartsPrice: 14500,
    laborCharge: 3500,
    serviceFee: 2000,
    estimatedTime: "2 - 4 Hours",
    availability: "Available",
    description: "Precision laser separation of shattered rear glass chassis and installation of fresh OEM back cover panel."
  },
  {
    id: "rep-water-both",
    category: "Motherboard & Micro-soldering",
    serviceName: "Water Damage Ultrasonic Cleaning & Restoration",
    deviceType: "Both",
    sparePartsPrice: 9000,
    laborCharge: 6000,
    serviceFee: 2500,
    estimatedTime: "24 Hours",
    availability: "Available",
    description: "Complete chemical bath ultrasonic board cleaning, corrosion removal, short tracing, and component drying."
  },
  {
    id: "rep-software-both",
    category: "Software & Firmware",
    serviceName: "Software Repair & Bootloop Recovery",
    deviceType: "Both",
    sparePartsPrice: 0,
    laborCharge: 4000,
    serviceFee: 2000,
    estimatedTime: "1 Hour",
    availability: "Available",
    description: "OS reinstallation, iTunes/DFU recovery, stuck Apple logo fix, Android brick recovery, and data preservation."
  },
  {
    id: "rep-unlocking-both",
    category: "Software & Firmware",
    serviceName: "Unlocking & Network Flashing",
    deviceType: "Both",
    sparePartsPrice: 0,
    laborCharge: 5500,
    serviceFee: 2500,
    estimatedTime: "1 - 3 Hours",
    availability: "Available",
    description: "Carrier network unlocking, FRP bypass, passcode unlock, and official regional firmware flashing."
  },
  {
    id: "rep-other-both",
    category: "Specialized & General",
    serviceName: "Other Common iPhone & Android Repairs",
    deviceType: "Both",
    sparePartsPrice: 10000,
    laborCharge: 3500,
    serviceFee: 1500,
    estimatedTime: "Same Day",
    availability: "Available",
    description: "Custom diagnostic and specialized hardware repair for rare iPhone and Android issues."
  }
];

// Seed initial databases to localStorage if empty
const initLocalStorage = () => {
  const schemaVersion = localStorage.getItem("mobile_inn_schema_v2");
  if (!schemaVersion) {
    if (!localStorage.getItem("mobile_inn_products")) {
      localStorage.setItem("mobile_inn_products", JSON.stringify(INITIAL_PRODUCTS));
    }
    localStorage.setItem("mobile_inn_schema_v2", "true");
  }

  if (!localStorage.getItem("mobile_inn_products")) {
    localStorage.setItem("mobile_inn_products", JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem("mobile_inn_upcoming")) {
    localStorage.setItem("mobile_inn_upcoming", JSON.stringify(UPCOMING_PRODUCTS));
  }
  if (!localStorage.getItem("mobile_inn_repair_services")) {
    localStorage.setItem("mobile_inn_repair_services", JSON.stringify(INITIAL_REPAIR_SERVICES));
  }
  if (!localStorage.getItem("mobile_inn_repair_bookings")) {
    localStorage.setItem("mobile_inn_repair_bookings", JSON.stringify([]));
  }
  if (!localStorage.getItem("mobile_inn_bookings")) {
    localStorage.setItem("mobile_inn_bookings", JSON.stringify([]));
  }
  if (!localStorage.getItem("mobile_inn_users")) {
    // Default admin user
    const defaultUsers = [
      {
        uid: "admin-uid",
        name: "Admin User",
        email: "admin@mobileinn.com",
        phone: "+94771234567",
        role: "admin",
        createdAt: new Date().toISOString()
      },
      {
        uid: "staff-uid",
        name: "Suresh Kumar (Staff)",
        email: "staff@mobileinn.com",
        phone: "+94771234568",
        role: "staff",
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem("mobile_inn_users", JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem("mobile_inn_notifications")) {
    localStorage.setItem("mobile_inn_notifications", JSON.stringify([]));
  }
  if (!localStorage.getItem("mobile_inn_simulated_date")) {
    localStorage.setItem("mobile_inn_simulated_date", "2026-07-19");
  }
};

initLocalStorage();

// In-memory cache to prevent multiple sync reads & parses of localStorage
const cache = {
  products: null,
  upcoming: null,
  bookings: null,
  users: null,
  repairServices: null,
  repairBookings: null,
  notifications: null,
  simulatedDate: null
};

const getCachedVal = (key, fallbackVal) => {
  if (cache[key] === null) {
    const raw = localStorage.getItem(`mobile_inn_${key}`);
    cache[key] = raw ? JSON.parse(raw) : fallbackVal;
  }
  return cache[key];
};

const setCachedVal = (key, val) => {
  cache[key] = val;
  localStorage.setItem(`mobile_inn_${key}`, JSON.stringify(val));
};

// DATABASE API (Uses in-memory cache with LocalStorage synchronization)
export const db = {
  // Products
  getProducts: () => {
    return getCachedVal("products", INITIAL_PRODUCTS);
  },
  saveProduct: (product) => {
    const products = [...db.getProducts()];
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = { ...products[index], ...product };
    } else {
      products.push(product);
    }
    setCachedVal("products", products);
    return products;
  },
  deleteProduct: (id) => {
    const products = db.getProducts().filter((p) => String(p.id) !== String(id));
    setCachedVal("products", products);
    const upcoming = db.getUpcomingProducts().filter((p) => String(p.id) !== String(id));
    setCachedVal("upcoming", upcoming);
    return products;
  },

  // Upcoming
  getUpcomingProducts: () => {
    return getCachedVal("upcoming", UPCOMING_PRODUCTS);
  },
  saveUpcomingProduct: (product) => {
    const upcoming = [...db.getUpcomingProducts()];
    const index = upcoming.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      upcoming[index] = product;
    } else {
      upcoming.push(product);
    }
    setCachedVal("upcoming", upcoming);
    return upcoming;
  },

  // Bookings
  getBookings: () => {
    return getCachedVal("bookings", []);
  },
  saveBooking: (booking) => {
    const bookings = [...db.getBookings()];
    bookings.push({
      id: "booking-" + Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString(),
      bookingStatus: "pending",
      paymentStatus: booking.paymentMethod === "card" ? "paid" : "pending",
      ...booking
    });
    setCachedVal("bookings", bookings);
    return bookings;
  },
  updateBookingStatus: (bookingId, status, depositAmount, paidAmount) => {
    const bookings = [...db.getBookings()];
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index >= 0) {
      bookings[index].bookingStatus = status;
      if (depositAmount !== undefined && depositAmount !== null) {
        bookings[index].advanceRequiredAmount = depositAmount;
      }
      if (paidAmount !== undefined && paidAmount !== null) {
        bookings[index].advancePaidAmount = paidAmount;
        bookings[index].paymentStatus = "deposit-paid";
      }
      if (status === "completed") {
        bookings[index].paymentStatus = "fully-paid";
      }
      setCachedVal("bookings", bookings);
      return bookings[index];
    }
    return null;
  },

  // Users
  getUsers: () => {
    return getCachedVal("users", []);
  },
  saveUser: (user) => {
    const users = [...db.getUsers()];
    const index = users.findIndex((u) => u.email === user.email || u.uid === user.uid);
    if (index >= 0) {
      users[index] = { ...users[index], ...user };
    } else {
      users.push({
        uid: "user-" + Math.floor(Math.random() * 1000000),
        createdAt: new Date().toISOString(),
        ...user
      });
    }
    setCachedVal("users", users);
    return users;
  },
  getUserByEmail: (email) => {
    const users = db.getUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  // Repair Services Catalog Management
  getRepairServices: () => {
    return getCachedVal("repair_services", INITIAL_REPAIR_SERVICES);
  },
  saveRepairService: (service) => {
    const services = [...db.getRepairServices()];
    const index = services.findIndex((s) => s.id === service.id);
    if (index >= 0) {
      services[index] = { ...services[index], ...service };
    } else {
      services.push({
        id: "rep-" + Math.floor(Math.random() * 1000000),
        ...service
      });
    }
    setCachedVal("repair_services", services);
    return services;
  },
  deleteRepairService: (id) => {
    const services = db.getRepairServices().filter((s) => s.id !== id);
    setCachedVal("repair_services", services);
    return services;
  },

  // Repair Bookings Management
  getRepairBookings: () => {
    return getCachedVal("repair_bookings", []);
  },
  saveRepairBooking: (booking) => {
    const repairBookings = [...db.getRepairBookings()];
    const newBooking = {
      id: "REP-" + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toISOString(),
      repairStatus: "booked", // booked, received, diagnosing, repairing, testing, ready, completed, cancelled
      paymentStatus: booking.paymentMethod === "card" ? "deposit-paid" : "pending",
      ...booking
    };
    repairBookings.push(newBooking);
    setCachedVal("repair_bookings", repairBookings);
    return newBooking;
  },
  updateRepairBookingStatus: (bookingId, status, notes) => {
    const repairBookings = [...db.getRepairBookings()];
    const index = repairBookings.findIndex((b) => b.id === bookingId);
    if (index >= 0) {
      repairBookings[index].repairStatus = status;
      if (notes) repairBookings[index].adminNotes = notes;
      if (status === "completed") {
        repairBookings[index].paymentStatus = "fully-paid";
      }
      setCachedVal("repair_bookings", repairBookings);
      return repairBookings[index];
    }
    return null;
  },

  // Notifications
  getNotifications: () => {
    return getCachedVal("notifications", []);
  },
  addNotification: (notification) => {
    const notifications = [...db.getNotifications()];
    const newNotif = {
      id: "notif-" + Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    notifications.unshift(newNotif); // latest first
    setCachedVal("notifications", notifications);
    return newNotif;
  },
  markNotificationRead: (id) => {
    const notifications = [...db.getNotifications()];
    const index = notifications.findIndex((n) => n.id === id);
    if (index >= 0) {
      notifications[index].read = true;
      setCachedVal("notifications", notifications);
    }
    return notifications;
  },
  markAllNotificationsRead: () => {
    const notifications = [...db.getNotifications()];
    notifications.forEach((n) => (n.read = true));
    setCachedVal("notifications", notifications);
    return notifications;
  },

  // System Date Simulation
  getSimulatedDate: () => {
    if (cache.simulatedDate === null) {
      cache.simulatedDate = localStorage.getItem("mobile_inn_simulated_date") || "2026-07-19";
    }
    return cache.simulatedDate;
  },
  setSimulatedDate: (dateStr) => {
    cache.simulatedDate = dateStr;
    localStorage.setItem("mobile_inn_simulated_date", dateStr);
    
    // Process automatic upcoming product launches
    const upcoming = db.getUpcomingProducts();
    const products = [...db.getProducts()];
    const simulatedDate = new Date(dateStr);
    
    const releasedList = [];
    const remainingUpcoming = [];

    upcoming.forEach((phone) => {
      const releaseDate = new Date(phone.releaseDate);
      if (simulatedDate >= releaseDate) {
        // Release it!
        const releasedPhone = { ...phone, isReleased: true };
        products.push(releasedPhone);
        releasedList.push(releasedPhone);
        
        // Trigger Notifications
        db.addNotification({
          title: "New Phone Released!",
          message: `The brand new ${phone.brand} ${phone.model} is now officially available for order as of ${phone.releaseDate}!`,
          type: "release",
          targetRoles: ["admin", "staff", "customer"],
          emailSent: true,
          emailDetails: {
            to: "all-users@mobileinn.com",
            subject: `New Arrival: ${phone.brand} ${phone.model} available now!`,
            body: `Dear customer,\n\nWe are excited to announce that the brand new ${phone.brand} ${phone.model} has officially arrived at MOBILE INN! Head over to our catalog to secure yours today.\n\nBest regards,\nMOBILE INN Team`
          }
        });
      } else {
        remainingUpcoming.push(phone);
      }
    });

    if (releasedList.length > 0) {
      setCachedVal("products", products);
      setCachedVal("upcoming", remainingUpcoming);
    }

    return {
      date: dateStr,
      releasedCount: releasedList.length
    };
  }
};;
