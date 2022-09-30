import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
// import {  } from '@syncfusion/ej2-react-popups';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar, Footer, Sidebar, ThemeSettings } from './components';
import { Products, Employees } from './pages';
import './App.css';
import { useStateContext } from './contexts/ContextProvider';
import Login from './pages/Login';
import { useSelector, useDispatch } from 'react-redux';
import ProtectedRoutes from './ProtectedRoutes';
import Category from './pages/Category';
import Wholesellers from './pages/Wholesellers';
import SignUp from './pages/SignUp/SignUp';
import WholesellersDetails from './pages/WholesellerDetails/WholesellersDetails';
import ConfirmOrder from './pages/ConfirmOrder/ConfirmOrder';
import { getUser } from './redux/apiCalls';
import OrdersPage from './pages/OrdersPage/OrdersPage';
import Homepage from './pages/Homepage/Homepage';
import UserProfileDetails from './pages/UserProfileDetails/UserProfileDetails';
import io from 'socket.io-client';
import { useQuery } from 'react-query';
import { userRequest } from './requestMethods';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import OrderDetails from './pages/OrderDetailsPage/OrderDetails';
// import { SocketContext } from './contexts/socketContext';
import CategoryRequest from './pages/CategoryRequest/CategoryRequest';
import ActivityLogs from './pages/ActivityLogs/ActivityLogs';
import Invoice from './pages/Invoice/Invoice';

const App = () => {
  // const socketIO = useContext(SocketContext);
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
  } = useStateContext();
  const [socket, setSocket] = useState();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
    user?.token && user?.token !== '' && getUser(dispatch);
  }, [user?.token, dispatch]);

  useEffect(() => {
    if (user?.token) {
      const newSocket = io(process.env.REACT_APP_BASE_URL, {
        // transportOptions: {
        //   polling: {
        //     extraHeaders: {
        //       Authorization: `Bearer ${user?.token}`,
        //     },
        //   },
        // },
      });
      setSocket(newSocket);

      return () => newSocket?.disconnect();
    }
  }, [user?.user?._id]);

  const {
    data: notificationData,
    refetch: refetchNotifications,
    isFetching,
  } = useQuery('notificationList', () => userRequest.get('/notification'), {
    enabled:
      user?.token !== undefined && user?.token !== null && user?.token !== '',

    onError: (err) => {
      console.error(err.response);
    },
  });

  const messageListener = (message) => {
    refetchNotifications();
    // console.log('isFetching ===>', isFetching);
    Notification.requestPermission().then((perm) => {
      console.log(perm);
      if (perm === 'granted' && document.visibilityState === 'hidden') {
        new Notification('New Notification', {
          body: message?.message,
          tag: 'notification',
          requireInteraction: true,
        });
      }
    });
    toast?.success(message?.message);
  };

  useEffect(() => {
    socket?.emit('connection', user?.user);
    socket?.on('notification', messageListener);

    return () => socket?.disconnect();
  }, [socket]);

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
            <button
              type="button"
              onClick={() => setThemeSettings(true)}
              style={{ background: currentColor, borderRadius: '50%' }}
              className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
            >
              <FiSettings />
            </button>
          </div>
          {user?.token ? (
            <div>
              {activeMenu ? (
                <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
                  <Sidebar />
                </div>
              ) : (
                <div className="w-0 dark:bg-secondary-dark-bg">
                  <Sidebar />
                </div>
              )}
            </div>
          ) : (
            ''
          )}
          <div
            className={
              activeMenu && user?.token
                ? 'dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full overflow-hidden'
                : 'bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2 '
            }
          >
            {user?.token ? (
              <div className="bg-main-bg dark:bg-main-dark-bg navbar w-full ">
                <Navbar
                  notificationData={notificationData}
                  refetchNotifications={refetchNotifications}
                />
              </div>
            ) : (
              ''
            )}
            <>
              {themeSettings && <ThemeSettings />}

              <Routes>
                {/* Login  */}
                <Route
                  path="/login"
                  element={user?.token ? <Navigate to="/" /> : <Login />}
                />

                {/* Create wholeseller  */}

                <Route path="/signup" element={<SignUp></SignUp>}></Route>
                <Route
                  path="/invoice/:orderId"
                  element={<Invoice></Invoice>}
                ></Route>

                {/* -------------Protected Routes Normal------------- */}
                <Route element={<ProtectedRoutes isAdminRoute={false} />}>
                  {/* dashboard  */}
                  {/* Wholeseller  */}
                  <Route path="/wholesellers" element={<Wholesellers />} />
                  {/* Homepage  */}
                  <Route path="/" element={<Homepage />} />

                  <Route
                    path="/category-request"
                    element={<CategoryRequest />}
                  />
                  {/* User Profile Details  */}

                  <Route
                    path="/user-details"
                    element={<UserProfileDetails></UserProfileDetails>}
                  />
                  <Route path="/categories/" element={<Category />} />
                  <Route
                    path="/categories/:category_name/:id"
                    element={<Products />}
                  />
                  <Route path="/confirmOrder" element={<ConfirmOrder />} />
                  <Route path="/OrdersPage" element={<OrdersPage />} />
                  <Route
                    path="/OrderDetails/:orderId"
                    element={<OrderDetails />}
                  />
                </Route>

                {/* ---------------------Admin Routes--------------------- */}
                <Route element={<ProtectedRoutes isAdminRoute={true} />}>
                  <Route
                    path="/wholesellers"
                    element={<Wholesellers></Wholesellers>}
                  />
                  {/* // Employees or Backend Users */}
                  <Route path="/employees" element={<Employees></Employees>} />
                  {/* Wholesellers Details  */}
                  <Route
                    path="/wholesellers-details/:id"
                    element={<WholesellersDetails></WholesellersDetails>}
                  />

                  {/* Category Request Admin---> */}
                </Route>

                <Route path="/activity-logs" element={<ActivityLogs />} />

                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </>
            {/* {user?.token ? <Footer /> : ''} */}
          </div>
        </div>
      </BrowserRouter>
      <ToastContainer autoClose={2500} draggable />
    </div>
  );
};

export default App;
