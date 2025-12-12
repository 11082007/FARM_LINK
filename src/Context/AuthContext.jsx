import React, { createContext, useContext, useState, useEffect } from "react";

// 1️⃣ Create the context
const AuthContext = createContext();

// 2️⃣ Provider component — wraps the app
export const AuthProvider = ({ children }) => {
  // State for user
  const [user, setUser] = useState(null);

  // 3️⃣ Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // 4️⃣ Login function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 5️⃣ Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // 6️⃣ Check if user is authenticated
  const isAuthenticated = !!user;

  // 7️⃣ Provide all values to the rest of the app
  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// 8️⃣ Custom hook for easy access in any component
export const useAuth = () => useContext(AuthContext);
