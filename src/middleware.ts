import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./lib/auth";

export interface SessionData {
  uid: string;
  email: string;
  role: string;
  emailVerified: boolean;
  iat: number;
  exp: number;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  try {
    const sessionToken = request.cookies.get("session")?.value;
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const decoded = verifyJWT(sessionToken);

    if (!decoded) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("session");
      return response;
    }

    const response = NextResponse.next();

    response.headers.set("x-user-uid", decoded.uid);
    response.headers.set("x-user-email", decoded.email);
    response.headers.set("x-user-role", decoded.role);

    if (pathname.startsWith("/admin") && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);

    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session");
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/", "/admin"],
};
