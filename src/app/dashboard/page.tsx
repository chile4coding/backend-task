"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiService, Product } from "../../lib/axios/request";
import CreateProductModal from "../components/modal/CreateProduct";
import { useUser } from "./UserContext";

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const user = useUser();

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleShowModal = (product?: Product | null) => {
    setSelectedProduct(product || null);
    setShowModal(!showModal);
  };

  const fetchProducts = async () => {
    try {
      const response = await apiService.products.getUserProducts();

      setProducts(response.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await apiService.products.delete(productId);
      setProducts(products.filter((product) => product.id !== productId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {user && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Welcome, {user.email}!
            </h2>
            <div className="text-sm text-gray-600">
              <p>Role: {user.role}</p>
              <p>Email Verified: {user.emailVerified ? "Yes" : "No"}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <button
            onClick={() => handleShowModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add New Product
          </button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              You haven&apos;t created any products yet
            </p>
            <button
              onClick={() => handleShowModal()}
              className="text-blue-600 hover:text-blue-700 underline">
              Create your first product
            </button>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    {user?.role === "admin" && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created By
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              <Link
                                href={`/products/${product.id}`}
                                className="hover:text-blue-600 transition-colors">
                                {product.name}
                              </Link>
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(product.createdAt || "").toLocaleDateString()}
                      </td>
                      {user?.role === "admin" && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900">
                              {typeof product.createdBy === "string"
                                ? product.createdBy
                                : product.createdBy?.email || "Unknown"}
                            </span>
                            <span
                              className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                typeof product.createdBy === "object" &&
                                product.createdBy?.isLoggedIn
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                              {typeof product.createdBy === "object" &&
                              product.createdBy?.isLoggedIn
                                ? "Online"
                                : "Offline"}
                            </span>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleShowModal(product)}
                            className="text-blue-600 hover:text-blue-900">
                            Edit
                          </button>

                          <Link
                            href={`/${product.id}`}
                            className="text-green-600 hover:text-blue-900">
                            View
                          </Link>
                          <button
                            onClick={() => handleDelete(product?.id || "")}
                            className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <CreateProductModal
        isOpen={showModal}
        onClose={handleShowModal}
        onSuccess={fetchProducts}
        product={selectedProduct}
      />
    </div>
  );
}
