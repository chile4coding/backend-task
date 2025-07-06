import { RegisterData } from "@/lib/axios/request";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  createdBy: string | RegisterData;
  createdAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface ProductResponse {
  message: string;
  product?: Product;
  products?: Product[];
  count?: number;
  deletedProduct?: Product;
}
