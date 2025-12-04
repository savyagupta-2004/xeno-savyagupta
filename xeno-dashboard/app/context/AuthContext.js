"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user + validate token on startup
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Validate token through our proxy
        const res = await fetch(
          `/api/proxy?endpoint=/api/auth/validate-token&token=${token}`
        );

        const data = await res.json();

        if (res.ok && data.success) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } catch (err) {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // LOGIN FUNCTION
  const login = async (userData) => {
    const userInfo = {
      email: userData.email,
      tenantId: userData.tenantId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      tenantName: userData.tenantName,
      tenantDomain: userData.tenantDomain,
    };

    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  // RETURN AUTH HEADERS
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      "X-User-Email": user?.email || "",
      "X-Tenant-ID": user?.tenantId || "",
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: () => !!user,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
