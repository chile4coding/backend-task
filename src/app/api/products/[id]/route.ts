import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../lib/auth";
import {
  getProductById,
  isProductOwner,
  updateProduct,
  deleteProduct,
  validateProductData,
  getFirestore,
} from "../../../../lib/products";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    const db = await getFirestore();

    const user = await db
      .collection("users")
      .doc(product?.createdBy as string)
      .get();

    const userData = user.data();

    const creator = {
      uid: user?.id,
      email: userData?.email,
      role: userData?.role,
      emailVerified: userData?.emailVerified,
      isLoggedIn: userData?.isLoggedIn,
    };

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "Product retrieved successfully",
      product: product,
      creator,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAuth(request);
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (!isProductOwner(product, user.uid)) {
      return NextResponse.json(
        { error: "You can only update products you created" },
        { status: 403 }
      );
    }
    const data = await request.json();
    const { isValid, errors } = validateProductData(data);
    if (!isValid) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }
    const updatedProduct = await updateProduct(id, {
      name: data.name,
      description: data.description,
      price: data.price,
    });
    return NextResponse.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAuth(request);
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (!isProductOwner(product, user.uid)) {
      return NextResponse.json(
        { error: "You can only delete products you created" },
        { status: 403 }
      );
    }
    const deletedProduct = await deleteProduct(id);
    return NextResponse.json({
      message: "Product deleted successfully",
      deletedProduct: deletedProduct,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
