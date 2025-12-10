import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Allowed roles for the Portal
const ALLOWED_ROLES = ['ADMIN', 'PROVIDER', 'SUBPROVIDER'];

const ProtectedRoute = ({ children }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Spinner is handled in AuthContext

  // 1. Not Logged In -> Go to Login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Logged In but Wrong Role -> Go Home (or Error Page)
  if (!ALLOWED_ROLES.includes(role)) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You are logged in as <strong>{role}</strong>, but you do not have permission to access the Admin Portal.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary"
        >
          Return Home
        </button>
      </div>
    );
  }

  // 3. Allowed -> Render Content
  return children;
};

export default ProtectedRoute;