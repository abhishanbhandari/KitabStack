import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken) {
        try {
          const response = await axios.post(
            "http://localhost:8000/api/token/refresh/",
            {
              refresh: refreshToken,
            },
          );
          localStorage.setItem("access", response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
        }
      }
    }

    return Promise.reject(error);
  },
);

export async function getAllPages(endpoint) {
  let results = [];
  let url = endpoint;

  while (url) {
    const response = await api.get(url);
    results = results.concat(response.data.results);
    url = response.data.next
      ? response.data.next.replace("http://localhost:8000/api", "")
      : null;
  }

  return results;
}

export default api;
