import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Loader } from "lucide-react";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null); // 'ADMIN', 'PROVIDER', 'SUBPROVIDER', 'USER'

  useEffect(() => {
    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchUserRole(session.user.id);
      else setLoading(false);
    });

    // 2. Listen for changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId) => {
    try {
      // Fetch role from your custom user_info table
      const { data, error } = await supabase
        .from("user_info")
        .select("*")
        .eq("UserID", userId) // Assuming 'UserID' links to auth.users.id
        .single();

      if (error) throw error;

      setUser(data); // This contains Name, Role, etc.
      setRole(data?.Role);
    } catch (error) {
      console.error("Error fetching user role:", error);
      // Fallback: If no user_info found, they might be a fresh user or error
      setRole("USER"); 
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, login, logout, loading }}>
      {!loading ? children : (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader className="h-10 w-10 animate-spin text-brand-primary mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Loading iXabo Portal...</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};