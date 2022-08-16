import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';

import { Button } from '.';
import { userProfileData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import avatar from '../data/avatar.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../redux/apiCalls';
import { BsCurrencyDollar } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { currentColor, handleClick } = useStateContext();

  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user.currentUser);
  const navigateToUserProfile = () => {
    navigate('/user-details');
    console.log('Clicked');
    handleClick('userProfile');
  };

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <div className="avatar placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-24">
            <span className="text-3xl">{user?.name.charAt(0)}</span>
          </div>
        </div>
        <div>
          <p className="font-semibold text-xl dark:text-gray-200">
            {user?.name}
          </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            {user?.role}
          </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
            {user?.email}
          </p>
        </div>
      </div>
      <div>
        <div
          onClick={navigateToUserProfile}
          className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]"
        >
          <button
            style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }}
            type="button"
            className=" text-xl rounded-lg p-3 hover:bg-light-gray"
          >
            <BsCurrencyDollar />
          </button>

          <div>
            <p className="font-semibold dark:text-gray-200 ">My Profile</p>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              Account Settings
            </p>
          </div>
        </div>
        {/* {userProfileData.map((item, index) => (
          <div
            
            key={index}
            className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]"
          >
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              {item.icon}
            </button>

            <div>
              <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {" "}
                {item.desc}{" "}
              </p>
            </div>
          </div>
        ))} */}
      </div>
      <div className="mt-5" onClick={() => userLogout(dispatch)}>
        <Button
          color="white"
          bgColor={currentColor}
          text="Logout"
          borderRadius="10px"
          width="full"
          // onClick={()=> userLogout(dispatch)}
        />
      </div>
    </div>
  );
};

export default UserProfile;
