import { NextRequest } from "next/server";
import { SessionData } from "../middleware";

export interface UserSession {
  uid: string;
  email: string;
  role: string;
  emailVerified: boolean;
}

export function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

export function verifyJWT(token: string): SessionData | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const [, payloadB64] = parts;

    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(payloadB64))
    );

    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      return null;
    }

    return payload as SessionData;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}

/**
 * Extract user information from request headers set by middleware
 */
export function getUserFromRequest(request: NextRequest): UserSession | null {
  const sessionToken = request.cookies.get("session")?.value;

  if (!sessionToken) {
    return null;
  }

  const user = getUserFromSession(sessionToken);

  if (!user) {
    return null;
  }

  const { uid, email, role, emailVerified } = user;

  if (!uid || !email || !role) {
    return null;
  }

  return {
    uid,
    email,
    role,
    emailVerified: emailVerified ? true : false,
  };
}

export function getUserFromSession(sessionToken: string): UserSession | null {
  const session = verifyJWT(sessionToken) as SessionData;

  const uid = session.uid;
  const email = session.email;
  const role = session.role;
  const emailVerified = session.emailVerified;

  if (!uid || !email || !role) {
    return null;
  }

  return {
    uid,
    email,
    role,
    emailVerified,
  };
}

/**
 * Check if user has required role
 */
export function hasRole(
  user: UserSession | null,
  requiredRole: string
): boolean {
  if (!user) return false;
  return user.role === requiredRole;
}

/**
 * Check if user is admin
 */
export function isAdmin(user: UserSession | null): boolean {
  return hasRole(user, "admin");
}

/**
 * Require authentication - throws error if user is not authenticated
 */
export function requireAuth(request: NextRequest): UserSession {
  const user = getUserFromRequest(request);
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

/**
 * Require specific role - throws error if user doesn't have required role
 */
export function requireRole(
  request: NextRequest,
  requiredRole: string
): UserSession {
  const user = requireAuth(request);

  if (!hasRole(user, requiredRole)) {
    throw new Error(`Role '${requiredRole}' required`);
  }
  return user;
}

/**
 * Require admin role - throws error if user is not admin
 */
export function requireAdmin(request: NextRequest): UserSession {
  return requireRole(request, "admin");
}
