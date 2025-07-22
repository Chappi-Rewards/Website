import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://chappi-app.uc.r.appspot.com/api', // Replace with your actual API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // You can get the token from local storage, a cookie, etc.
    const token = localStorage.getItem('chappi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response Error:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request Error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const http = {
  get: <T>(url: string, params?: object) => apiClient.get<T>(url, { params }),
  post: <T>(url: string, data: object, headers?: object) => apiClient.post<T>(url, data, { headers }),
  put: <T>(url: string, data: object) => apiClient.put<T>(url, data),
  delete: <T>(url: string) => apiClient.delete<T>(url),
};
