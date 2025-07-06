"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserSession } from "@/lib/auth";
import { apiService } from "@/lib/axios/request";

interface AuthContextType {
  user: UserSession | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: UserSession | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<UserSession | null>(initialUser || null);
  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.auth.login({ email, password });

      if (response.user) {
        setUser({
          uid: response.user.uid,
          email: response.user.email,
          role: response.user.role,
          emailVerified: response.user.emailVerified || false,
        });

        if (user?.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/dashboard";
        }
      }
    } catch (error) {
      throw error;
    } finally {
    }
  };

  const logout = async () => {
    try {
      await apiService.auth.logout();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
