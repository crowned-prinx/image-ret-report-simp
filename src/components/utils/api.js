import axios from "axios";
import NProgress from "nprogress";
import "@/css/nprogress.css";
const baseURL = import.meta.env.VITE_API_URL;

let isNProgressInitialized = false;

const initializeNProgress = () => {
  if (typeof window !== "undefined" && !isNProgressInitialized) {
    // Wait for DOM to be ready before configuring
    const configure = () => {
      NProgress.configure({
        showSpinner: false,
        trickleSpeed: 300,
        // Remove parent selector or use 'body' instead
        // parent: "#__next", // This is causing the error
        minimum: 0.1,
        easing: "ease",
        speed: 500,
        trickle: true,
        trickleRate: 0.02,
        trickleSpeed: 200,
      });
      isNProgressInitialized = true;
    };

    // Ensure DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", configure);
    } else {
      configure();
    }
  }
};

// Default configuration
const DEFAULT_CONFIG = {
  // baseURL: "http://127.0.0.1:5000",
  baseURL: baseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

// Create axios instance with default config
const apiInstance = axios.create(DEFAULT_CONFIG);

// Track active requests to avoid conflicts
let activeRequests = 0;

apiInstance.interceptors.request.use(
  config => {
    initializeNProgress();

    // Only show for non-GET requests or longer requests
    if (config.method !== "get") {
      activeRequests++;
      if (activeRequests === 1) {
        // Only start if this is the first request
        NProgress.start();
        NProgress.set(0.3);
      }
    }
    return config;
  },
  error => {
    if (error.config?.method !== "get") {
      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) {
        NProgress.done();
      }
    }
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  response => {
    if (response.config.method !== "get") {
      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) {
        NProgress.done();
      }
    }
    return response;
  },
  error => {
    if (error.config?.method !== "get") {
      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) {
        NProgress.done();
      }
    }
    return Promise.reject(error);
  }
);

// Main API function with customizable options
const createApiCall = (customConfig = {}) => {
  // Merge custom config with defaults
  const config = { ...DEFAULT_CONFIG, ...customConfig };

  // Create new instance if custom config provided
  const instance =
    customConfig.baseURL ||
    customConfig.timeout ||
    customConfig.withCredentials !== undefined
      ? axios.create(config)
      : apiInstance;

  return {
    // GET method
    get: async (url, options = {}) => {
      try {
        const response = await instance.get(url, {
          ...options,
          withCredentials: options.withCredentials ?? config.withCredentials,
        });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },

    // POST method
    post: async (url, data = {}, options = {}) => {
      try {
        const response = await instance.post(url, data, {
          ...options,
          withCredentials: options.withCredentials ?? config.withCredentials,
        });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },

    // PUT method
    put: async (url, data = {}, options = {}) => {
      try {
        const response = await instance.put(url, data, {
          ...options,
          withCredentials: options.withCredentials ?? config.withCredentials,
        });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },

    // PATCH method
    patch: async (url, data = {}, options = {}) => {
      try {
        const response = await instance.patch(url, data, {
          ...options,
          withCredentials: options.withCredentials ?? config.withCredentials,
        });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },

    // DELETE method
    delete: async (url, options = {}) => {
      try {
        const response = await instance.delete(url, {
          ...options,
          withCredentials: options.withCredentials ?? config.withCredentials,
        });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },

    // Generic request method for full control
    request: async config => {
      try {
        const response = await instance.request({
          withCredentials:
            config.withCredentials ?? instance.defaults.withCredentials,
          ...config,
        });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },

    // Upload method for file uploads
    upload: async (url, formData, options = {}) => {
      try {
        const response = await instance.post(url, formData, {
          ...options,
          headers: {
            "Content-Type": "multipart/form-data",
            ...options.headers,
          },
          withCredentials: options.withCredentials ?? config.withCredentials,
        });
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    },
  };
};

// Error handler
const handleApiError = error => {
  const errorResponse = {
    message:
      error.response?.data?.message || error.message || "An error occurred",
    status: error.response?.data?.status,
    data: error.response?.data,
  };
  return errorResponse;
};

// Default API instance
const api = createApiCall();

// Export both the default instance and the factory function
export default api;
export { createApiCall, baseURL };
