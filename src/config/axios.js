import axios from 'axios';

import { getStorageData, removeStorageData, setStorageData } from '@app/config';
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_PROFILE } from '@app/constants';
import { refreshTokenApi } from '@app/apis';
import { notificationError } from '@helpers';

axios.defaults.baseURL =
  location.origin.includes('127.0.0.1') || location.origin.includes('localhost')
    ? 'http://localhost:3000/api'
    : `${location.origin}/api`;

axios.interceptors.request.use((config) => {
  if (config.url === '/auth/login') {
    return config;
  }

  if (config.url === '/auth/refresh') {
    const refreshtoken = getStorageData(REFRESH_TOKEN);

    if (refreshtoken) {
      config.headers['Authorization'] = `Bearer ${refreshtoken}`;
    }

    return config;
  }

  const accessToken = getStorageData(ACCESS_TOKEN);
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.config.url === '/auth/refresh' &&
      error.response.data?.error === 'Unauthorized'
    ) {
      removeStorageData(USER_PROFILE);
      removeStorageData(ACCESS_TOKEN);
      removeStorageData(REFRESH_TOKEN);
    }

    if (error.response.data?.message === 'Unauthorized') {
      const { data } = await refreshTokenApi();
      setStorageData(ACCESS_TOKEN, data.data.accessToken);
    }

    if (error.response.data?.message === 'Tài khoản không đúng') {
      removeStorageData(USER_PROFILE);
      removeStorageData(ACCESS_TOKEN);
      removeStorageData(REFRESH_TOKEN);
    }

    if (error.response.data?.message === 'Quyền truy cập đã được thay đổi') {
      notificationError(error.response.data?.message);
      removeStorageData(USER_PROFILE);
      removeStorageData(ACCESS_TOKEN);
      removeStorageData(REFRESH_TOKEN);
    }

    return Promise.reject(error);
  },
);
/* eslint-enable prettier/prettier */
