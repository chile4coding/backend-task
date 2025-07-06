import { requireAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "@/lib/products";

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);

    const response = NextResponse.json(
      {
        message: "Logged out successfully",
      },
      { status: 200 }
    );

    response.cookies.delete("session");

    const db = await getFirestore();
    await db.collection("users").doc(user.uid).update({
      isLoggedIn: false,
    });

    response.headers.set("Clear-Site-Data", '"cache", "cookies", "storage"');

    return response;
  } catch (error: unknown) {
    console.error("Error during logout:", error);

    return NextResponse.json(
      { error: "Failed to process logout" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: "Logout endpoint is available",
      note: "Use POST method to logout",
    },
    { status: 200 }
  );
}
