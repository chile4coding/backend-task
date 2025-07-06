"use client";
import React, { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { Mail, Lock, UserCheck, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { AxiosError } from "axios";

interface RegisterFormData {
  email: string;

  password: string;
}

interface RegisterFormErrors {
  email?: string;

  password?: string;
  submit?: string;
}

export default function Login() {
  const { login, user } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user && success) {
      setTimeout(() => {
        if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }, 1000);
    }
  }, [user, success, router]);

  const validateForm = () => {
    const newErrors: RegisterFormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }));

    if (errors[name as keyof RegisterFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      await login(formData.email, formData.password);
      setSuccess(true);

      setFormData({
        email: "",
        password: "",
      });
    } catch (error: unknown) {
      setErrors({
        submit:
          error instanceof AxiosError
            ? error.response?.data.error
            : "Network error. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
      setSuccess(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br  from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-indigo-100">
            <UserCheck className="size-8 text-indigo-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Login</h1>
          <p className="text-gray-600">Join us today and get started</p>
        </div>

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <CheckCircle className="size-5 text-green-600" />
            <span className="text-green-800">Login successfully!</span>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="size-5 text-red-600" />
            <span className="text-red-800">{errors.submit}</span>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full rounded-lg text-gray-700 border py-3 pl-10 pr-4 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="john.doe@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full rounded-lg text-gray-700 border py-3 pl-10 pr-4 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your password"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Password must be at least 8 characters long
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-lg text-white bg-indigo-600 px-4 py-3 font-medium  transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-700">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
