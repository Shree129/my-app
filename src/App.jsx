import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Layout
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import ChatBot from "./components/AI/ChatBot";
import InstallPrompt from "./components/PWA/InstallPrompt";
import { SkeletonGrid } from "./components/Common/SkeletonLoader";

// Eagerly loaded core pages
import Home from "./pages/Home";
import BuyerLogin from "./buyer/BuyerLogin";

// Lazy loaded pages for code splitting
const Products = lazy(() => import("./pages/Products"));
const Gallery = lazy(() => import("./pages/Gallery"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Categories = lazy(() => import("./pages/Categories"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Analyse = lazy(() => import("./pages/Analyse"));

// Buyer Pages (lazy)
const BuyerDashboard = lazy(() => import("./buyer/BuyerDashboard"));
const BuyerProtectedRoute = lazy(() => import("./buyer/BuyerProtectedRoute"));
const CurtainSection = lazy(() => import("./buyer/CurtainSection"));
const CurtainDescription = lazy(() => import("./buyer/CurtainDescription"));
const BedsheetSection = lazy(() => import("./buyer/BedsheetSection"));
const BedsheetDescription = lazy(() => import("./buyer/BedsheetDescription"));
const SofaCoverSection = lazy(() => import("./buyer/SofaCoverSection"));
const SofaProductDescription = lazy(() => import("./buyer/SofaProductDescription"));
const PillowCoverSection = lazy(() => import("./buyer/PillowCoverSection"));
const PillowDescription = lazy(() => import("./buyer/PillowDescription"));
const DoormatSection = lazy(() => import("./buyer/DoormatSection"));
const DoormatDetail = lazy(() => import("./buyer/doormatDetail"));
const BuyerDashboardSection = lazy(() => import("./buyer/BuyerDashboardSection"));

// Admin (lazy)
const AdminLogin = lazy(() => import("./admin/AdminLogin"));
const Admin = lazy(() => import("./admin/Admin"));
const AdminProtectedRoute = lazy(() => import("./admin/AdminProtectedRoute"));
const AdminCurtainApproval = lazy(() => import("./admin/AdminCurtainApproval"));
const AdminBedsheetApproval = lazy(() => import("./admin/AdminBedsheetApproval"));
const AdminSofaApproval = lazy(() => import("./admin/AdminSofaApproval"));
const AdminPillowApproval = lazy(() => import("./admin/AdminPillowApproval"));
const AdminDoormatApproval = lazy(() => import("./admin/AdminDoormatApproval"));

// Other Pages (lazy)
const AboutJPFurnishing = lazy(() => import("./pages/AboutJPFurnishing"));
const TeamDashboard = lazy(() => import("./pages/TeamDashboard"));

/**
 * Page loading fallback — shows skeleton grid while lazy pages load
 */
function PageLoader() {
  return (
    <div style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <SkeletonGrid count={6} columns={3} />
    </div>
  );
}

/**
 * Coming Soon placeholder for unbuilt pages
 */
function ComingSoon({ title }) {
  return (
    <div style={styles.comingSoonWrap}>
      <div style={styles.card}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>🚧</div>
        <h1 style={{ color: "#3f2b20", marginBottom: 8 }}>{title}</h1>
        <p style={{ color: "#78716c" }}>This page is coming soon.</p>
      </div>
    </div>
  );
}

/**
 * Protected route wrapper for lazy-loaded BuyerProtectedRoute
 */
function BuyerGuard({ children }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <BuyerProtectedRoute>{children}</BuyerProtectedRoute>
    </Suspense>
  );
}

function AdminGuard({ children }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <AdminProtectedRoute>{children}</AdminProtectedRoute>
    </Suspense>
  );
}

function App() {
  const location = useLocation();

  const buyerRoutes = [
    "/buyer/dashboard",
    "/curtain-section",
    "/bedsheet-section",
    "/sofa-cover-section",
    "/pillow-cover-section",
    "/doormat-section",
    "/about-jp-furnishing",
    "/team-dashboard",
    "/buyer-dashboard-section",
    "/orders",
    "/wishlist",
    "/address",
    "/admin",
  ];

  const isBuyerLoginRoute = location.pathname === "/login";

  const isBuyerRoute =
    buyerRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/curtain/") ||
    location.pathname.startsWith("/bedsheets/") ||
    location.pathname.startsWith("/sofa-cover/") ||
    location.pathname.startsWith("/pillow-cover/") ||
    location.pathname.startsWith("/doormat/");

  const isAdminRoute = location.pathname.startsWith("/admin");

  const hideLayout = isBuyerLoginRoute || isBuyerRoute || isAdminRoute;

  return (
    <ErrorBoundary>
      {!hideLayout && <Header />}

      <main style={styles.main}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ═══════ PUBLIC ROUTES ═══════ */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/analyse" element={<Analyse />} />

            {/* ═══════ AUTH ═══════ */}
            <Route path="/login" element={<BuyerLogin />} />

            {/* ═══════ BUYER DASHBOARD ═══════ */}
            <Route path="/buyer/dashboard" element={<BuyerGuard><BuyerDashboard /></BuyerGuard>} />

            {/* ═══════ SECTIONS ═══════ */}
            <Route path="/curtain-section" element={<BuyerGuard><CurtainSection /></BuyerGuard>} />
            <Route path="/bedsheet-section" element={<BuyerGuard><BedsheetSection /></BuyerGuard>} />
            <Route path="/sofa-cover-section" element={<BuyerGuard><SofaCoverSection /></BuyerGuard>} />
            <Route path="/pillow-cover-section" element={<BuyerGuard><PillowCoverSection /></BuyerGuard>} />
            <Route path="/doormat-section" element={<BuyerGuard><DoormatSection /></BuyerGuard>} />

            {/* ═══════ PRODUCT DETAILS ═══════ */}
            <Route path="/curtain/:id" element={<BuyerGuard><CurtainDescription /></BuyerGuard>} />
            <Route path="/bedsheets/:id" element={<BuyerGuard><BedsheetDescription /></BuyerGuard>} />
            <Route path="/sofa-cover/:id" element={<BuyerGuard><SofaProductDescription /></BuyerGuard>} />
            <Route path="/pillow-cover/:id" element={<BuyerGuard><PillowDescription /></BuyerGuard>} />
            <Route path="/doormat/:id" element={<BuyerGuard><DoormatDetail /></BuyerGuard>} />

            {/* ═══════ ADMIN ═══════ */}
            <Route path="/admin/AdminLogin" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminGuard><Admin /></AdminGuard>} />
            <Route path="/admin/curtain-approval" element={<AdminGuard><AdminCurtainApproval /></AdminGuard>} />
            <Route path="/admin/bedsheet-approval" element={<AdminGuard><AdminBedsheetApproval /></AdminGuard>} />
            <Route path="/admin/sofa-approval" element={<AdminGuard><AdminSofaApproval /></AdminGuard>} />
            <Route path="/admin/pillow-approval" element={<AdminGuard><AdminPillowApproval /></AdminGuard>} />
            <Route path="/admin/doormat-approval" element={<AdminGuard><AdminDoormatApproval /></AdminGuard>} />

            {/* ═══════ EXTRA ═══════ */}
            <Route path="/about-jp-furnishing" element={<BuyerGuard><AboutJPFurnishing /></BuyerGuard>} />
            <Route path="/team-dashboard" element={<BuyerGuard><TeamDashboard /></BuyerGuard>} />
            <Route path="/buyer-dashboard-section" element={<BuyerGuard><BuyerDashboardSection /></BuyerGuard>} />
            <Route path="/orders" element={<BuyerGuard><ComingSoon title="My Orders" /></BuyerGuard>} />
            <Route path="/wishlist" element={<BuyerGuard><ComingSoon title="Wishlist" /></BuyerGuard>} />
            <Route path="/address" element={<BuyerGuard><ComingSoon title="Saved Address" /></BuyerGuard>} />

            {/* ═══════ 404 ═══════ */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {!hideLayout && <Footer />}

      {/* Global AI ChatBot */}
      <ChatBot />

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </ErrorBoundary>
  );
}

const styles = {
  main: {
    minHeight: "80vh",
    paddingTop: "72px",
    overflowX: "hidden",
    flex: 1,
  },
  comingSoonWrap: {
    minHeight: "60vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f7f4ef",
  },
  card: {
    background: "#fff",
    padding: "48px 40px",
    borderRadius: 24,
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    textAlign: "center",
    maxWidth: 400,
  },
};

export default App;