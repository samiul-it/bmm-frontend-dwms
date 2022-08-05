import { publicRequest, userRequest } from '../requestMethods';
import { toast } from 'react-toastify';
import {
  getUserFailure,
  getUserStart,
  getUserSuccess,
  loginFailure,
  loginStart,
  loginSuccess,
  logout,
} from './userRedux';

export const login = async (dispatch, user) => {
  // console.log(dispatch);
  dispatch(loginStart());
  try {
    const res = await publicRequest.post('auth/signin', user);
    dispatch(loginSuccess(res.data));
    // console.log(res.data);
    toast.success('Login Successful!');
  } catch (err) {
    dispatch(loginFailure());
    toast.error('Email/Password Error!');
    console.log(err);
  }
};

export const getUser = async (dispatch) => {
  dispatch(getUserStart());
  try {
    const res = await userRequest.get('auth/me');
    dispatch(getUserSuccess(res.data));
  } catch (err) {
    dispatch(getUserFailure());
    console.log(err);
  }
};

export const userLogout = async (dispatch) => {
  dispatch(logout());
  try {
    await publicRequest.post('auth/sign-out');
  } catch (err) {
    console.log(err);
  }
};
