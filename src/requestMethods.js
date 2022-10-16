import axios from 'axios';
import { store } from './redux/store';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,

  headers: {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});

userRequest.interceptors.request.use(
  (config) => {
    const token = store?.getState()?.user?.currentUser?.token;
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  // , (error) => {
  //   return Promise.reject(error);
  // }
);
