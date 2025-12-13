import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; // Add this import

// 1️⃣ Create the context
const AuthContext = createContext();

// 2️⃣ Provider component — wraps the app
export const AuthProvider = ({ children }) => {
  // State for user and profile
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3️⃣ Check Supabase session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("🔐 Checking Supabase auth session...");
        
        // Get current session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("✅ Supabase user found:", session.user.email);
          setUser(session.user);
          
          // Try to get user profile from your custom table
          const { data: profileData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profileData) {
            console.log("📋 User profile found:", profileData);
            setProfile(profileData);
          } else {
            console.log("⚠️ No profile found in users table, creating one...");
            // Create profile from auth user metadata
            const newProfile = {
              id: session.user.id,
              email: session.user.email,
              first_name: session.user.user_metadata?.first_name || '',
              last_name: session.user.user_metadata?.last_name || '',
              role: session.user.user_metadata?.role || 'buyer'
            };
            
            const { data: createdProfile } = await supabase
              .from('users')
              .insert(newProfile)
              .select()
              .single();
            
            if (createdProfile) {
              setProfile(createdProfile);
            }
          }
          
          // Also store in localStorage for quick access
          localStorage.setItem('user', JSON.stringify(session.user));
          localStorage.setItem('profile', JSON.stringify(profileData || newProfile));
          localStorage.setItem('session', JSON.stringify(session));
        } else {
          console.log("❌ No Supabase session found");
          // Clear any stale localStorage data
          localStorage.removeItem('user');
          localStorage.removeItem('profile');
          localStorage.removeItem('session');
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("❌ Auth check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // 4️⃣ Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Auth state changed:", event);
        
        if (session?.user) {
          setUser(session.user);
          
          // Get or create profile
          const { data: profileData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          setProfile(profileData || {
            id: session.user.id,
            email: session.user.email,
            first_name: session.user.user_metadata?.first_name || '',
            last_name: session.user.user_metadata?.last_name || '',
            role: session.user.user_metadata?.role || 'buyer'
          });
          
          // Store in localStorage
          localStorage.setItem('user', JSON.stringify(session.user));
          localStorage.setItem('profile', JSON.stringify(profileData || {
            id: session.user.id,
            email: session.user.email,
            first_name: session.user.user_metadata?.first_name || '',
            last_name: session.user.user_metadata?.last_name || '',
            role: session.user.user_metadata?.role || 'buyer'
          }));
          localStorage.setItem('session', JSON.stringify(session));
        } else {
          console.log("🚪 User logged out");
          localStorage.removeItem('user');
          localStorage.removeItem('profile');
          localStorage.removeItem('session');
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  // 5️⃣ Login function - now uses Supabase
  const login = async (userData) => {
    console.log("🔑 Login called with:", userData);
    
    // If it's from Supabase registration/login
    if (userData.user && userData.session) {
      setUser(userData.user);
      setProfile(userData.profile);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData.user));
      localStorage.setItem('profile', JSON.stringify(userData.profile));
      localStorage.setItem('session', JSON.stringify(userData.session));
    } 
    // If it's manual login (for testing)
    else {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  // 6️⃣ Logout function - now uses Supabase
  const logout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state
      setUser(null);
      setProfile(null);
      localStorage.removeItem('user');
      localStorage.removeItem('profile');
      localStorage.removeItem('session');
    }
  };

  // 7️⃣ Check if user is authenticated
  const isAuthenticated = !!user;

  // 8️⃣ Provide all values to the rest of the app
  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      login, 
      logout, 
      isAuthenticated,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// 9️⃣ Custom hook for easy access in any component
export const useAuth = () => useContext(AuthContext);