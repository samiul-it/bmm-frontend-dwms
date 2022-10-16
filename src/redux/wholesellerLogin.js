import { toast } from 'react-toastify';
import { loginFailure, loginStart, loginSuccess, logout } from './userRedux';
import { publicRequest, userRequest } from '../requestMethods';

export const wholesellerlogin = async (dispatch, user) => {
  // console.log(user);
  dispatch(loginStart());
  try {
    const res = await publicRequest.post('auth/signin-wholeseller', user);
    dispatch(loginSuccess(res.data));
    // console.log(res.data);
    toast.success('Login Successful!');
  } catch (err) {
    dispatch(loginFailure());
    toast.error('Email/Password Error!');
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
