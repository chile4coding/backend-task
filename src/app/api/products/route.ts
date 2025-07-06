import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../lib/auth";
import {
  getAllProducts,
  createProduct,
  validateProductData,
} from "../../../lib/products";

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({
      message: "Products retrieved successfully",
      products: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const data = await request.json();
    const { isValid, errors } = validateProductData(data);
    if (!isValid) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }
    const newProduct = await createProduct({
      name: data.name,
      description: data.description,
      price: data.price,
      createdBy: user.uid,
    });
    return NextResponse.json(
      {
        message: "Product created successfully",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
