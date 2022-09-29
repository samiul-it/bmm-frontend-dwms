import React, { useEffect } from 'react';
import { MdOutlineCancel } from 'react-icons/md';

import { Button } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import moment from 'moment';
import { userRequest } from '../requestMethods';

const Notification = ({ notifications, unseenMsgCount }) => {
  const { currentColor } = useStateContext();

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
      <div className="mt-5 max-h-[300px] overflow-y-auto">
        {notifications?.messages
          ?.map((item, index) => (
            <div
              key={index}
              className="flex items-center leading-8 gap-5 p-3 relative border-b border-color "
            >
              {!item?.isSeen && (
                <span className="text-blue-500 absolute top-1 right-1 font-bold text-xs">
                  New
                </span>
              )}
              <div>
                <p className="text-gray-500 dark:text-gray-400 font-semibold">
                  {item?.message}
                </p>
                <p className="absolute right-1 bottom-1 text-gray-400 font-bold text-xs">
                  {moment(item?.cretedAt).format('DD MMM YYYY, h:mm A')}
                </p>
              </div>
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
