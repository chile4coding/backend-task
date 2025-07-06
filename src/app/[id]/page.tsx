"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiService, Product, RegisterData } from "@/lib/axios/request";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [creator, setCreator] = useState<RegisterData | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiService.products.getById(productId);
        setProduct(response.product);
        setCreator(response.creator);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Details Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-lg mb-6">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-green-600">
                    ${product.price}
                  </span>
                  {product.createdAt && (
                    <span className="text-sm text-gray-400">
                      Created:{" "}
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Creator Details Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Seller Information
                </h2>

                {creator ? (
                  <div className="space-y-4">
                    {/* Online Status */}
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          creator.isLoggedIn ? "bg-green-500" : "bg-gray-400"
                        }`}></div>
                      <span
                        className={`text-sm font-medium ${
                          creator.isLoggedIn
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}>
                        {creator.isLoggedIn ? "Online" : "Offline"}
                      </span>
                    </div>

                    {/* User Details */}
                    <div className="border-t pt-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Email
                          </label>
                          <p className="text-sm text-gray-900 mt-1">
                            {creator.email}
                          </p>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Role
                          </label>
                          <p className="text-sm text-gray-900 mt-1 capitalize">
                            {creator.role}
                          </p>
                        </div>

                        {creator.lastLoginAt && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Last Active
                            </label>
                            <p className="text-sm text-gray-900 mt-1">
                              {new Date(
                                creator.lastLoginAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {creator.createdAt && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Member Since
                            </label>
                            <p className="text-sm text-gray-900 mt-1">
                              {new Date(creator.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Button */}
                    <div className="border-t pt-4">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200">
                        Contact Seller
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">
                      Seller information not available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
