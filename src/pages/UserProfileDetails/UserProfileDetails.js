import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { BsFillPencilFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useStateContext } from '../../contexts/ContextProvider';
import { getUser } from '../../redux/apiCalls';
import { userRequest } from '../../requestMethods';
import Header from './../../components/Header';

const UserProfileDetails = () => {
  const { user } = useSelector((state) => state.user.currentUser);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const passModalRef = useRef();
  const { currentColor } = useStateContext();
  const updateUserDetailsModalRef = useRef();
  const [userDetails, setUserDetails] = useState(user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleModalToggle = () => {
    passModalRef.current.checked = false;
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  useEffect(() => {
    setUserDetails(user);
  }, [user]);

  const closeUserDetailsModal = () => {
    setUserDetails(user);
    updateUserDetailsModalRef.current.checked = false;
  };

  //Password Chnage

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // console.log(password, newPassword, confirmPassword);
    if (newPassword === confirmPassword) {
      if (user.role == 'wholeseller') {
        setIsLoading(true);
        userRequest
          .put(`/wholesellers/reset-pass/${user._id}`, {
            password: password,
            newPassword: newPassword,
          })
          .then(function (response) {
            // console.log(response);
            handleModalToggle();
            toast.success('Password Changed Successfully');
            setIsLoading(false);
          })
          .catch(function (error) {
            // console.log(error);
            toast.error('Failed to Change Password');
            setIsLoading(false);
          });
      } else {
        setIsLoading(true);
        userRequest
          .put(`/user/reset-pass/${user._id}`, {
            password: password,
            newPassword: newPassword,
          })
          .then(function (response) {
            // console.log(response);
            handleModalToggle();
            toast.success('Password Changed Successfully');
            setIsLoading(false);
          })
          .catch(function (error) {
            // console.log(error);
            toast.error('Failed to Change Password');
            setIsLoading(false);
          });
      }
    } else {
      toast.error("Password Didn't match");
    }
  };

  const userDetailsChangeHandler = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const updateUserDetailsHandler = (e) => {
    e.preventDefault();
    console.log(userDetails);
    if (userDetails.role == 'wholeseller') {
      setIsLoading(true);
      userRequest
        .put(`/wholesellers/${userDetails._id}`, userDetails)
        .then(function (response) {
          // console.log(response);
          closeUserDetailsModal();
          toast.success('User Details Updated Successfully');
          getUser(dispatch);
          setIsLoading(false);
        })
        .catch(function (error) {
          // console.log(error);
          toast.error('Failed to Update User Details');
          setIsLoading(false);
        })
        .finally(function () {
          setIsLoading(false);
          setUserDetails(user);
        });
    } else {
      setIsLoading(true);
      userRequest
        .put(`/user/${userDetails._id}`, userDetails)
        .then(function (response) {
          // console.log(response);
          closeUserDetailsModal();
          toast.success('User Details Updated Successfully');
          getUser(dispatch);
          setIsLoading(false);
        })
        .catch(function (error) {
          // console.log(error);
          toast.error('Failed to Update User Details');
          setIsLoading(false);
        })
        .finally(function () {
          setUserDetails(user);
          setIsLoading(false);
        });
    }
  };

  //   console.log(user);
  return (
    <div className="container mx-auto px-6">
      <Header category="Page" title="My Profile" />

      <div>
        <div className="avatar placeholder mx-auto">
          <div
            style={{ background: currentColor }}
            className="bg-neutral-focus text-neutral-content rounded-full h-24"
          >
            <span className="text-3xl text-white">{user?.name.charAt(0)}</span>
          </div>
        </div>
        <div className="relative w-max pt-3">
          <label
            htmlFor="userDetails_modal"
            className="btn btn-circle btn-sm hover:opacity-100 opacity-50 absolute right-32 top-0"
          >
            <BsFillPencilFill />
          </label>
          <h4 className="flex items-center gap-2 my-2  w-max">
            <strong>Username:</strong> <span>{user.name}</span>
          </h4>
          <h4 className=" my-2  w-max">
            {' '}
            <strong>Email:</strong> {user.email} <span></span>
          </h4>
          {/* <h4 className="">Role: {user.role}</h4> */}
          <h4 className=" my-2 w-max">
            {' '}
            <strong>Phone:</strong> +91 {user.phone}
          </h4>

          <div className="flex items-center my-2 w-max">
            <strong>Categories:</strong>
            <div className="w-80">
              {user.role !== 'admin' ? (
                user?.catagories.map((cat, i) => (
                  <span key={i} className="badge badge-primary mx-1">
                    {cat?.categoryName}
                  </span>
                ))
              ) : (
                <span className="badge mx-1"> All Categories </span>
              )}
            </div>
          </div>
        </div>
        <label htmlFor="password-modal" className="btn btn-primary btn-sm my-4">
          Chnage Password
        </label>
      </div>

      {/* <div className="flex items-center justify-center">
        <div className="  card w-96 dark:bg-base-100 bg-gray-200 shadow-xl ">
          <div className="avatar placeholder mx-auto pt-5">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-24">
              <span className="text-3xl">{user.name.charAt(0)}</span>
            </div>
          </div>
          <div className="card-body items-center text-center">
            <h4 className="card-title">User Name: {user.name}</h4>
            <h4 className="card-title">User Email: {user.email}</h4>
            <h4 className="card-title">User Role: {user.role}</h4>

            <div className="card-actions">
              <label htmlFor="password-modal" className="btn btn-primary">
                Chnage Password
              </label>
            </div>
          </div>
        </div>
      </div> */}

      <input
        type="checkbox"
        ref={passModalRef}
        id="password-modal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box ">
          <h3 className="font-bold text-lg">Enter Password</h3>

          <form onSubmit={handlePasswordChange}>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter Current Password"
                className="input input-bordered w-full my-2"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter New Password"
                className="input input-bordered w-full my-2"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                required
              />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Confirm Password"
                className="input input-bordered w-full my-2"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
              />
            </div>

            <div className="modal-action">
              <label
                onClick={handleModalToggle}
                className="btn bg-red-600 text-white hover:bg-red-500 border-0"
              >
                Cancel
              </label>
              <button
                disabled={isLoading}
                type="submit"
                // htmlFor="password-model"
                className={
                  'btn bg-blue-600 text-white hover:bg-blue-500 border-0'
                }
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      <input
        type="checkbox"
        ref={updateUserDetailsModalRef}
        id="userDetails_modal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box ">
          <h3 class="font-bold text-lg">Update Your Details</h3>

          <form className="my-2" onSubmit={updateUserDetailsHandler}>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Username</span>
              </label>
              <input
                type="username"
                placeholder="Username*"
                className="input input-bordered w-full"
                name="name"
                onChange={userDetailsChangeHandler}
                value={userDetails.name}
                required
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email*"
                className="input input-bordered w-full"
                name="email"
                onChange={userDetailsChangeHandler}
                value={userDetails.email}
                required
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Phone</span>
              </label>
              <input
                type="tel"
                placeholder="Phone*"
                className="input input-bordered w-full"
                name="phone"
                onChange={userDetailsChangeHandler}
                value={userDetails.phone}
                required
              />
            </div>

            <div className="modal-action">
              <label
                onClick={closeUserDetailsModal}
                className="btn bg-red-600 text-white hover:bg-red-500 border-0"
              >
                Cancel
              </label>
              <button
                disabled={isLoading}
                type="submit"
                // htmlFor="password-model"
                className={
                  'btn bg-blue-600 text-white hover:bg-blue-500 border-0'
                }
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDetails;
