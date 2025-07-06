import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../lib/auth";
import { createFirebaseAdmin } from "../../../../../firebase/server";
import { Product } from "../../../../types/product";
import { RegisterData } from "@/lib/axios/request";

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);

    const admin = createFirebaseAdmin();
    const db = admin.firestore();

    let snapshot;

    if (user.role === "admin") {
      snapshot = await db
        .collection("products")
        .orderBy("createdAt", "desc")
        .get();
    } else {
      snapshot = await db
        .collection("products")
        .where("createdBy", "==", user.uid)
        .orderBy("createdAt", "desc")
        .get();
    }

    const productsWithCreators = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const productData = doc.data();
        const product = { id: doc.id, ...productData } as Product;

        if (user.role === "admin" && productData.createdBy) {
          try {
            const creatorDoc = await db
              .collection("users")
              .doc(productData.createdBy)
              .get();
            if (creatorDoc.exists) {
              product.createdBy =
                typeof creatorDoc === "string"
                  ? productData.createdBy
                  : ({
                      id: creatorDoc.id,
                      ...creatorDoc.data(),
                    } as RegisterData);
            }
          } catch (error) {
            console.error(
              `Error fetching creator for product ${doc.id}:`,
              error
            );
          }
        }

        return product;
      })
    );

    const products: Product[] =
      user.role === "admin"
        ? productsWithCreators
        : snapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as Product)
          );

    return NextResponse.json({
      message: "User products retrieved successfully",
      products: products,
      count: products.length,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.error("Error fetching user products:", error);
    return NextResponse.json(
      { error: "Failed to fetch user products" },
      { status: 500 }
    );
  }
}
