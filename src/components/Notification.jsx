import React, { useEffect } from 'react';
import { MdOutlineCancel } from 'react-icons/md';

import { Button } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import moment from 'moment';
import { userRequest } from '../requestMethods';
import { useNavigate } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';

const Notification = ({ notifications, unseenMsgCount }) => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();

  // const unseenMsgCount = notifications?.messages?.filter(
  //   (m) => m.isSeen === false
  // ).length;

  useEffect(() => {
    return () => {
      if (unseenMsgCount >= 0) {
        userRequest.put('notification/updateIsSeen').then((res) => {
          console.log(res);
        });
      }
    };
  }, [unseenMsgCount]);

  return (
    <div className="nav-item absolute left-5 md:right-40 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <p className="font-semibold text-lg dark:text-gray-200">
            Notifications
          </p>

          <h1 className="text-sm text-gray-500 font-semibold">
            {unseenMsgCount} New
          </h1>
        </div>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="mt-5 max-h-[300px] overflow-y-auto flex flex-col gap-2">
        {notifications?.messages
          ?.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col leading-8 gap-2 p-2 relative border-b border-color bg-[#F2F1F2] dark:bg-[#515760] rounded-md ${
                item?.link && 'cursor-pointer'
              }`}
              onClick={() => {
                item?.link && navigate(item?.link);
              }}
            >
              <div className="absolute top-1 right-2 flex">
                {!item?.isSeen && (
                  <span className="font-bold text-xs text-blue-500">New</span>
                )}
                {item?.link && (
                  <span className="text-md text-gray-700 dark:text-gray-300">
                    {' '}
                    <FiExternalLink />{' '}
                  </span>
                )}
              </div>

              <p className="text-gray-500 dark:text-gray-300 font-semibold text-sm mt-1">
                {item?.message}
              </p>

              <h3 className=" text-gray-500 dark:text-gray-400 font-semibold text-xs ml-auto w-max">
                {moment(item?.cretedAt).format('DD MMM YYYY, h:mm A')}
              </h3>
            </div>
          ))
          ?.reverse()}
      </div>
      {/* <div className="mt-5">
        <Button
          color="white"
          bgColor={currentColor}
          text="See all notifications"
          borderRadius="10px"
          width="full"
        />
      </div> */}
    </div>
  );
};

export default Notification;
