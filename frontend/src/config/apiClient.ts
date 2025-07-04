import axios from "axios";

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // to make authorized requests to backend
};

const API = axios.create(options);

// response interceptor
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { status, data } = error.response;
    return Promise.reject({ status, ...data });
  }
);

export default API;
