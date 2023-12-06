import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: location.origin.includes('127.0.0.1') || location.origin.includes('localhost')
  ? `http://${location.hostname}:4000/`
  : `https://api-emptrack.onrender.com/`
});

axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);