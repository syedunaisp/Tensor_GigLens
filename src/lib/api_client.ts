import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Define the base URL from environment variables
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable if you need to send cookies
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // You can add auth tokens here if needed
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle global errors here (e.g., 401 Unauthorized, 500 Server Error)
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
            if (error.response.status === 401) {
                // Redirect to login or handle session expiry
                console.warn('Unauthorized access - redirecting to login...');
            }
        } else {
            console.error('Network Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;

// Generic fetcher for SWR or React Query
export const fetcher = (url: string) => apiClient.get(url).then((res) => res.data);
