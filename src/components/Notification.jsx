import React, { useEffect } from 'react';
import { MdOutlineCancel } from 'react-icons/md';

import { Button } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import { useMutation } from 'react-query';
import { userRequest } from '../requestMethods';

const Notification = ({ notifications }) => {
  const { currentColor } = useStateContext();

  // const { mutateAsync: updateIsSeen } = useMutation(
  //   () => userRequest.put('/notification/updateIsSeen'),
  //   {
  //     onSuccess: (res) => {
  //       console.log(res.data);
  //     },
  //     onError: ({ response }) => {
  //       console.log('error', response.data.message);
  //     },
  //   }
  // );

  // useEffect(() => {
  //   updateIsSeen();
  //   console.log('notification update is Seen useEffect');
  // }, []);

  const unseenMsgCount = notifications?.messages?.filter(
    (m) => m.isSeen === false
  ).length;

  return (
    <div className="nav-item absolute left-5 md:right-40 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <p className="font-semibold text-lg dark:text-gray-200">
            Notifications
          </p>
          <button
            type="button"
            className="text-white text-xs rounded p-1 px-2 bg-orange-theme "
          >
            {unseenMsgCount} New
          </button>
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
              className="flex items-center leading-8 gap-5 border-b-1 border-color p-3"
            >
              {/* <img
              className="rounded-full h-10 w-10"
              src={item.image}
              alt={item.message}
            /> */}
              <div>
                <p className="text-gray-500  dark:text-gray-400">
                  {item.message}
                </p>
              </div>
            </div>
          ))
          ?.reverse()}
        <div className="mt-5">
          <Button
            color="white"
            bgColor={currentColor}
            text="See all notifications"
            borderRadius="10px"
            width="full"
          />
        </div>
      </div>
    </div>
  );
};

export default Notification;
