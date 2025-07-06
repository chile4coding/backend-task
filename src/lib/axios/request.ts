import { AxiosResponse, AxiosRequestConfig } from "axios";
import axiosInstance from "./axiosInstance";

// Type definitions
interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string | RegisterData;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  role: string;
  id?: string;
  isLoggedIn?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const request = {
  // GET request
  get: async <T = unknown>(url: string): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.get(url);
    return response.data;
  },

  // POST request
  post: async <T = unknown>(url: string, data?: unknown): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.post(url, data);
    return response.data;
  },

  // PUT request
  put: async <T = unknown>(url: string, data?: unknown): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.put(url, data);
    return response.data;
  },

  // PATCH request
  patch: async <T = unknown>(url: string, data?: unknown): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.patch(url, data);
    return response.data;
  },

  // DELETE request
  delete: async <T = unknown>(url: string): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.delete(url);
    return response.data;
  },
};

// Specific API methods based on your routes
export const apiService = {
  // Auth related
  auth: {
    login: (credentials: LoginCredentials) =>
      request.post<{
        message: string;
        user: {
          emailVerified: boolean;
          uid: string;
          email: string;
          role: string;
        };
      }>("/api/auth/login", credentials),
    register: (userData: RegisterData) =>
      request.post<{
        message: string;
        user: { uid: string; email: string; role: string };
      }>("/api/auth/signup", userData),
    logout: () => request.post<void>("/api/auth/logout"),
  },

  // Products related
  products: {
    getAll: () =>
      request.get<{ products: Product[]; message: string; count: number }>(
        "/api/products"
      ),
    getById: (id: string) =>
      request.get<{ product: Product; creator: RegisterData }>(
        `/api/products/${id}`
      ),
    create: (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) =>
      request.post<Product>("/api/products", productData),
    update: (id: string, productData: Partial<Product>) =>
      request.put<Product>(`/api/products/${id}`, productData),
    delete: (id: string) => request.delete<void>(`/api/products/${id}`),
    getUserProducts: () =>
      request.get<{ message: string; products: Product[]; count: number }>(
        "/api/products/user"
      ),
  },

  // Users related
  users: {
    getAll: () => request.get<{ users: RegisterData[] }>("/api/users"),
    getById: (id: string) => request.get<RegisterData>(`/api/users/${id}`),
    create: (userData: Omit<RegisterData, "id" | "createdAt" | "updatedAt">) =>
      request.post<RegisterData>("/api/users", userData),
    update: (id: string, userData: Partial<RegisterData>) =>
      request.put<RegisterData>(`/api/users/${id}`, userData),
    delete: (id: string) => request.delete<void>(`/api/users/${id}`),
  },
};

export type { AxiosRequestConfig, AxiosResponse };
export type { Product, LoginCredentials, RegisterData, QueryParams };
