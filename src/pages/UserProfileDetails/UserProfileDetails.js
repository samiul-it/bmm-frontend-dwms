import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { BsFillPencilFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useStateContext } from "../../contexts/ContextProvider";
import { getUser } from "../../redux/apiCalls";
import { userRequest } from "../../requestMethods";
import Header from "./../../components/Header";
import Select from "react-select";
import { useQuery } from "react-query";

const UserProfileDetails = () => {
  const { user } = useSelector((state) => state.user.currentUser);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passModalRef = useRef();
  const categoryModalRef = useRef();
  const { currentColor } = useStateContext();
  const updateUserDetailsModalRef = useRef();
  const [userDetails, setUserDetails] = useState(user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState();

  // Available Categories Fetch
  const {
    isLoading: categoryLoading,
    error: categoryError,
    data: categoryData,
    isFetching: categoryFetching,
    refetch: categoryRefetch,
  } = useQuery("category", () => userRequest.get("/category"));

  const handleModalToggle = () => {
    passModalRef.current.checked = false;
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleModalClose = () => {
    categoryModalRef.current.checked = false;
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
      if (user.role == "wholeseller") {
        setIsLoading(true);
        userRequest
          .put(`/wholesellers/reset-pass/${user._id}`, {
            password: password,
            newPassword: newPassword,
          })
          .then(function (response) {
            // console.log(response);
            handleModalToggle();
            toast.success("Password Changed Successfully");
            setIsLoading(false);
          })
          .catch(function (error) {
            // console.log(error);
            toast.error("Failed to Change Password");
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
            toast.success("Password Changed Successfully");
            setIsLoading(false);
          })
          .catch(function (error) {
            // console.log(error);
            toast.error("Failed to Change Password");
            setIsLoading(false);
          });
      }
    } else {
      toast.error("Password Didn't match");
    }
  };

  //User Categories

  const userCatagories = user?.catagories?.map((cd) => {
    return { value: cd.categoryId, label: cd.categoryName };
  });

  //Available Categoires

  const availableCatagories = categoryData?.data?.map((cd) => {
    return { value: cd._id, label: cd.name };
  });

  const categoryIds = selectedOption?.map((e) => {
    return { categoryId: e.value, categoryName: e.label };
  });

  //New Category Request

  const handleCategoryRequest = (e) => {
    e.preventDefault();
    // console.log("Form Submitted");
    // console.log(user._id);
    // console.log(selectedOption);

    userRequest
      .put(`categoryrequest/create`, {
        wholesellerId: user._id,
        categories: categoryIds,
      })
      .then(function (response) {
        // console.log(response);
        categoryRefetch();
        handleModalClose();
        toast.success("New Category Request Sent");
        // modalRef.current.checked = false;
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Faild to Send Category Request");
      });
  };

  const userDetailsChangeHandler = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const updateUserDetailsHandler = (e) => {
    e.preventDefault();
    // console.log(userDetails);
    if (userDetails.role == "wholeseller") {
      setIsLoading(true);
      userRequest
        .put(`/wholesellers/${userDetails._id}`, userDetails)
        .then(function (response) {
          // console.log(response);
          closeUserDetailsModal();
          toast.success("User Details Updated Successfully");
          getUser(dispatch);
          setIsLoading(false);
        })
        .catch(function (error) {
          // console.log(error);
          toast.error("Failed to Update User Details");
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
          toast.success("User Details Updated Successfully");
          getUser(dispatch);
          setIsLoading(false);
        })
        .catch(function (error) {
          // console.log(error);
          toast.error("Failed to Update User Details");
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
    <div className="container mx-auto px-6 relative ">
      <Header category="Page" title="My Profile" />

      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center w-max">
          <div className="avatar placeholder ">
            <div
              style={{ background: currentColor }}
              className="bg-neutral-focus text-neutral-content rounded-full h-24"
            >
              <span className="text-3xl text-white">
                {user?.name.charAt(0)}
              </span>
            </div>
          </div>
          <div className="relative w-max pt-3">
            <label
              htmlFor="userDetails_modal"
              className="btn btn-circle btn-sm hover:opacity-100 opacity-50 absolute -right-4 top-0"
            >
              <BsFillPencilFill />
            </label>
            <h4 className="flex items-center gap-2 my-2  w-max">
              <strong>Username:</strong> <span>{user.name}</span>
            </h4>
            <h4 className=" my-2  w-max">
              {" "}
              <strong>Email:</strong> {user.email} <span></span>
            </h4>
            {/* <h4 className="">Role: {user.role}</h4> */}
            <h4 className=" my-2 w-max">
              {" "}
              <strong>Phone:</strong> +91 {user.phone}
            </h4>

            <div className="flex items-center my-2 w-max">
              <strong>Categories:</strong>
              <div className="max-w-80">
                {user.role !== "admin" ? (
                  user?.catagories.map((cat, i) => (
                    <span key={i} className="badge badge-primary mx-1">
                      {cat?.categoryName}
                    </span>
                  ))
                ) : (
                  <span className="badge mx-1"> All Categories </span>
                )}
              </div>

              {user?.role == "wholeseller" && (
                <label
                  htmlFor="my-modal-3"
                  className="btn modal-button btn-warning btn-xs my-4 mr-auto"
                >
                  Request Category
                </label>
              )}

              {/* <button
                onClick={handleCategoryRequest}
                className="btn btn-warning btn-xs my-4 mr-auto"
              >
                Request Category
              </button> */}
            </div>
          </div>
          <label
            htmlFor="password-modal"
            className="btn btn-primary btn-sm my-4 mr-auto"
          >
            Chnage Password
          </label>
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
                  disabled={isLoading}
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

        <input
          type="checkbox"
          ref={updateUserDetailsModalRef}
          id="userDetails_modal"
          className="modal-toggle"
        />
        <div className="modal">
          <div className="modal-box ">
            <h3 className="font-bold text-lg">Update Your Details</h3>

            <form className="my-2" onSubmit={updateUserDetailsHandler}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
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

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
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
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone</span>
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
      {/* Category Request Modal */}

      <input
        type="checkbox"
        ref={categoryModalRef}
        id="my-modal-3"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Request Categories</h3>
          <form onSubmit={handleCategoryRequest}>
            <div className="py-4">
              <Select
                className="block w-full input input-bordered    px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                isMulti
                onChange={setSelectedOption}
                defaultValue={userCatagories}
                options={availableCatagories}
                name="catagory"
                classNamePrefix="select"
              />
            </div>
            <button className="btn btn-active btn-accent btn-xs">
              Request Categories
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDetails;
