import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoutes = ({ isAdminRoute }) => {
  const user = useSelector((state) => state.user.currentUser);

  if (user?.user?.role === 'admin' ? true : isAdminRoute === false) {
    return user?.token ? <Outlet /> : <Navigate to="/login" />;
  }
  if (!isAdminRoute) {
    return user?.token ? <Outlet /> : <Navigate to="/login" />;
  }
  return user?.token ? <Navigate to="/categories" /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
