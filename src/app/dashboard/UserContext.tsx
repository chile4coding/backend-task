"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { UserSession } from "@/lib/auth";

interface UserContextType {
  user: UserSession | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  user: UserSession | null;
  children: ReactNode;
}

export function UserProvider({ user, children }: UserProviderProps) {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context.user;
}
