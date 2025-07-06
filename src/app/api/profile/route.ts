import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);

    return NextResponse.json({
      message: "Profile retrieved successfully",
      user: {
        uid: user.uid,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = requireAuth(request);

    const { displayName, bio } = await request.json();

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        uid: user.uid,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        displayName,
        bio,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
