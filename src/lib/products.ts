import { Product } from "../types/product";
import { initAdmin } from "../../firebase/server";

const COLLECTION = "products";

let db: FirebaseFirestore.Firestore | null = null;

export async function getFirestore() {
  if (!db) {
    const admin = await initAdmin();
    db = admin.firestore();
  }
  return db;
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const firestore = await getFirestore();
    const snapshot = await firestore.collection(COLLECTION).get();
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Product)
    );
  } catch (error) {
    console.error("Error getting all products:", error);
    throw error;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const fireStore = await getFirestore();
    const doc = await fireStore.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Product;
  } catch (error) {
    console.error("Error getting product by ID:", error);
    throw error;
  }
}

export async function getProductsByUser(userId: string): Promise<Product[]> {
  try {
    const fireStore = await getFirestore();
    const snapshot = await fireStore
      .collection(COLLECTION)
      .where("createdBy", "==", userId)
      .get();
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Product)
    );
  } catch (error) {
    console.error("Error getting products by user:", error);
    throw error;
  }
}

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  createdBy: string;
}): Promise<Product> {
  try {
    const firestore = await getFirestore();
    const createdAt = new Date().toISOString();
    const docRef = await firestore
      .collection(COLLECTION)
      .add({ ...data, createdAt });
    return { id: docRef.id, ...data, createdAt };
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, "id" | "createdBy" | "createdAt">>
): Promise<Product | null> {
  try {
    const firestore = await getFirestore();
    const docRef = firestore.collection(COLLECTION).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;
    await docRef.update(updates);
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() } as Product;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<Product | null> {
  try {
    const firestore = await getFirestore();
    const docRef = firestore.collection(COLLECTION).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;
    const product = { id: doc.id, ...doc.data() } as Product;
    await docRef.delete();
    return product;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

export function isProductOwner(product: Product, userId: string): boolean {
  return product.createdBy === userId;
}

export function validateProductData(data: unknown): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (typeof data !== "object" || data === null) {
    errors.push("Invalid data");
    return { isValid: false, errors };
  }
  const d = data as Record<string, unknown>;
  if (!d.name || typeof d.name !== "string") {
    errors.push("Name is required and must be a string");
  } else if (d.name.length < 2 || d.name.length > 100) {
    errors.push("Name must be between 2 and 100 characters");
  }
  if (!d.description || typeof d.description !== "string") {
    errors.push("Description is required and must be a string");
  } else if (d.description.length < 10 || d.description.length > 1000) {
    errors.push("Description must be between 10 and 1000 characters");
  }
  if (d.price === undefined || typeof d.price !== "number") {
    errors.push("Price is required and must be a number");
  } else if (d.price <= 0) {
    errors.push("Price must be a positive number");
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
}
