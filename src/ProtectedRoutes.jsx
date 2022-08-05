import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import { useEffect } from 'react';

const ProtectedRoutes = ({ isAdminRoute }) => {
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    console.log(user?.user?.role === 'admin' ? true : false === isAdminRoute);
  }, [isAdminRoute]);

  if (user?.user?.role === 'admin' ? true : false === isAdminRoute) {
    return user?.token ? <Outlet /> : <Navigate to="/login" />;
  } else if (!isAdminRoute) {
    return user?.token ? <Outlet /> : <Navigate to="/login" />;
  } else {
    return user?.token ? (
      <Navigate to="/categories" />
    ) : (
      <Navigate to="/login" />
    );
  }
};

export default ProtectedRoutes;
