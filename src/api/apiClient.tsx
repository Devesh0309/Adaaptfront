// src/api/apiClient.js (Corrected Version)

import axios from 'axios';

// --- No changes needed for the instance creation or request interceptor ---
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Corrected Response Interceptor ---

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If a refresh is already in progress, queue the original request
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token, log out
          processQueue(new Error('No refresh token available.'), null);
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        const rs = await axios.post('http://localhost:8000/api/v1/auth/refresh', {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = rs.data;
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        
        // Update the header for subsequent requests
        apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
        
        // Process the queue with the new token
        processQueue(null, access_token);

        // Retry the original request
        originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
        return apiClient(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;