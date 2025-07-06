import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "../../../lib/auth";
import { getFirestore } from "@/lib/products";

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const db = await getFirestore();
    const usersDoc = await db.collection("users").get();
    const users = usersDoc.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error listing users:", error);
    return NextResponse.json(
      { error: "Failed to list users" },
      { status: 500 }
    );
  }
}
