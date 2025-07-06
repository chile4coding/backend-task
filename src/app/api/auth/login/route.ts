import { NextRequest, NextResponse } from "next/server";
import { createFirebaseAdmin } from "../../../../../firebase/server";
import { sign } from "jsonwebtoken";
import { getFirestore } from "@/lib/products";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const admin = createFirebaseAdmin();
    const auth = admin.auth();

    try {
      const userRecord = await auth.getUserByEmail(email);

      const db = await getFirestore();
      await db.collection("users").doc(userRecord.uid).update({
        lastLoginAt: new Date().toISOString(),
        isLoggedIn: true,
      });

      const user = await db.collection("users").doc(userRecord.uid).get();

      const userData = user.data();

      const data = {
        uid: user?.id,
        email: userData?.email,
        role: userData?.role,
        emailVerified: userData?.emailVerified,
        isLoggedIn: userData?.isLoggedIn,
      };

      //();

      // Create session data
      const sessionData = {
        ...data,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      };

      // Create JWT token
      const token = sign(sessionData, JWT_SECRET);

      // Create response
      const response = NextResponse.json(
        {
          message: "User logged in successfully",
          user: data,
        },
        { status: 200 }
      );

      // Set session cookie
      response.cookies.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24 hours
        path: "/",
      });

      return response;
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        if (error.code === "auth/user-not-found") {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }
      }
      throw error;
    }
  } catch (error: unknown) {
    console.error("Error during login:", error);

    // Handle Firebase-specific errors
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "auth/invalid-email") {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        );
      }

      if (error.code === "auth/user-not-found") {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }

    // Generic error response
    return NextResponse.json(
      { error: "Failed to process login" },
      { status: 500 }
    );
  }
}
