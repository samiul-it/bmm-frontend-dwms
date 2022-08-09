import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { userRequest } from "../../requestMethods";
import Header from "./../../components/Header";

const UserProfileDetails = () => {
  const { user } = useSelector((state) => state.user.currentUser);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passModalRef = useRef();

  const handleModalToggle = () => {
    passModalRef.current.checked = false;
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  //Password Chnage

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // console.log(password, newPassword, confirmPassword);
    if (newPassword === confirmPassword) {
      if (user.role == "wholeseller") {
        userRequest
          .put(`/wholesellers/reset-pass/${user._id}`, {
            password: password,
            newPassword: newPassword,
          })
          .then(function (response) {
            // console.log(response);
            handleModalToggle();
            toast.success("Password Changed Successfully");
          })
          .catch(function (error) {
            // console.log(error);
            toast.error("Failed to Change Password");
          });
      } else {
        userRequest
          .put(`/user/reset-pass/${user._id}`, {
            password: password,
            newPassword: newPassword,
          })
          .then(function (response) {
            // console.log(response);
            handleModalToggle();
            toast.success("Password Changed Successfully");
          })
          .catch(function (error) {
            // console.log(error);
            toast.error("Failed to Change Password");
          });
      }
    } else {
      toast.error("Password Didn't match");
    }
  };

  //   console.log(user);
  return (
    <div className="container mx-auto ">
      <Header category="Page" title="My Profile" />
      <div className="flex items-center justify-center">
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
      </div>

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
                type="submit"
                // htmlFor="password-model"
                className={
                  "btn bg-blue-600 text-white hover:bg-blue-500 border-0"
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
