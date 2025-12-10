import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IMAGES } from "../constants"; // Use your logo
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader, AlertCircle } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/portal/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={IMAGES.logo} alt="iXabo" className="h-12" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Admin Portal</h2>
        <p className="text-sm text-gray-500 text-center mb-8">Sign in to manage your platform</p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="admin@ixabo.net" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-brand-primary hover:underline">Forgot password?</a>
            </div>
            <Input 
              id="password"
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-secondary h-11" disabled={isSubmitting}>
            {isSubmitting ? <Loader className="animate-spin mr-2" /> : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} iXabo. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;