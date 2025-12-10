import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

// Context & Logic
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDirection } from "./hooks/useDirection"; // ✅ Kept this

// Layouts
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminLayout from "./components/admin/AdminLayout";

// Public Pages
import Landing from "./pages/Landing";
import JoinUs from "./pages/JoinUs";
import ContactUs from "./pages/ContactUs";
import Pricing from "./pages/Pricing";
import Dictionary from "./pages/Dictionary";
import Login from "./pages/Login"; // ✅ New Login Page

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Providers from "./pages/admin/Providers";
import Categories from "./pages/admin/Categories";
import Governorates from "./pages/admin/Governorates";
import Packages from "./pages/admin/Packages";
import SalesPoints from "./pages/admin/SalesPoints";
import Users from "./pages/admin/Users";
import Subscriptions from "./pages/admin/Subscriptions";
import Codes from "./pages/admin/Codes";
import IntroMemes from "./pages/admin/IntroMemes";
import Suggestions from "./pages/admin/Suggestions";
import Approvals from "./pages/admin/Approvals";
import Notifications from "./pages/admin/Notifications";
import Scans from "./pages/admin/Scans";
import FeaturedAds from "./pages/admin/FeaturedAds"; // ✅ Added FeaturedAds

// Create a client
const queryClient = new QueryClient();

function App() {
  useDirection(); // ✅ This handles RTL/LTR switching based on i18n

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* --- PUBLIC WEBSITE ROUTES --- */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/join-us" element={<JoinUs />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/dictionary" element={<Dictionary />} />
                  </Routes>
                  <Footer />
                </>
              }
            />

            {/* --- AUTH ROUTE --- */}
            <Route path="/login" element={<Login />} />

            {/* --- PROTECTED ADMIN ROUTES --- */}
            <Route 
              path="/portal" 
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="providers" element={<Providers />} />
              <Route path="categories" element={<Categories />} />
              <Route path="governorates" element={<Governorates />} />
              <Route path="packages" element={<Packages />} />
              <Route path="sales-points" element={<SalesPoints />} />
              <Route path="users" element={<Users />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="codes" element={<Codes />} />
              <Route path="intro-memes" element={<IntroMemes />} />
              <Route path="suggestions" element={<Suggestions />} />
              <Route path="approvals" element={<Approvals />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="scans" element={<Scans />} />
              <Route path="featured" element={<FeaturedAds />} />
            </Route>
          </Routes>
          
          <Toaster position="top-center" />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;