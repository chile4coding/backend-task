import { NextRequest, NextResponse } from "next/server";
import { createFirebaseAdmin } from "../../../../../firebase/server";
import { getFirestore } from "@/lib/products";

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password, and role are required" },
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

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const validRoles = ["user", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be one of: " + validRoles.join(", ") },
        { status: 400 }
      );
    }

    const admin = createFirebaseAdmin();
    const auth = admin.auth();

    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: false,
    });
    const db = await getFirestore();
    await db.collection("users").doc(userRecord.uid).set({
      email,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isLoggedIn: false,
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          email,
          role,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating user:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "auth/email-already-exists") {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }

      if (error.code === "auth/invalid-email") {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        );
      }

      if (error.code === "auth/weak-password") {
        return NextResponse.json(
          { error: "Password is too weak" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
