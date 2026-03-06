import axios from "axios";

// Force rebuild - updated baseURL
const API = axios.create({
  baseURL: "https://job-portal-backend-x29s.onrender.com/api",
});

API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('=== API ERROR ===');
    console.error('URL:', error.config?.url);
    console.error('Method:', error.config?.method);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('================');
    
    if (error.response?.status === 500) {
      console.error('Server Error Details:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default API;   