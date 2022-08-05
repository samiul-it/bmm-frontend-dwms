import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
// import {  } from '@syncfusion/ej2-react-popups';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { Navbar, Footer, Sidebar, ThemeSettings } from './components';
import {
  Ecommerce,
  Products,
  Calendar,
  Employees,
  Stacked,
  Pyramid,
  Customers,
  Kanban,
  Line,
  Area,
  Bar,
  Pie,
  Financial,
  ColorPicker,
  ColorMapping,
  Editor,
} from './pages';
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

const App = () => {
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

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
    user?.token && user?.token !== '' && getUser(dispatch);
  }, [user?.token, dispatch]);

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
                ? 'dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full  '
                : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
            }
          >
            {user?.token ? (
              <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
                <Navbar />
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

                {/* Protected Routes Normal */}
                <Route element={<ProtectedRoutes isAdminRoute={false} />}>
                  {/* dashboard  */}
                  {/* <Route path="/" element={<h1>Ecommerce</h1>} /> */}
                  <Route path="/ecommerce" element={<h1>Ecommerce</h1>} />

                  {/* Wholeseller  */}
                  <Route path="/wholesellers" element={<Wholesellers />} />

                  {/* Homepage  */}
                  <Route path="/" element={<Homepage />} />
                  <Route path="/home" element={<Homepage />} />
                  {/* Wholesellers Details  */}

                  <Route
                    path="/wholesellers-details/:id"
                    element={<WholesellersDetails></WholesellersDetails>}
                  />

                  {/* pages  */}
                  <Route path="/categories/" element={<Category />} />
                  <Route
                    path="/categories/:category_name/:id"
                    element={<Products />}
                  />
                  <Route path="/confirmOrder" element={<ConfirmOrder />} />
                  <Route path="/OrdersPage" element={<OrdersPage />} />
                  <Route path="/" element={<h1>Home Page </h1>} />
                </Route>

                {/* Admin Routes */}
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
                </Route>
              </Routes>
            </>
            {/* {user ? <Footer /> : ''} */}
          </div>
        </div>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
};

export default App;
