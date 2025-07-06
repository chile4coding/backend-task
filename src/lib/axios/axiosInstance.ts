import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const axiosInstance = axios.create({
  baseURL: "/",
  withCredentials: true,
  timeout: 30000, // Add timeout to prevent long-hanging requests
});

axiosInstance.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    return config;
  },
  function (error: AxiosError) {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Handle network errors specially
    if (error.message === "Network Error") {
      console.error("Network error detected. API may be unreachable.");
      // You can add custom handling here, like showing a toast notification
      return Promise.reject(error);
    }

    // this was removed and so no response was coming if there is error
    return Promise.reject(error);
  }
);
export default axiosInstance;
