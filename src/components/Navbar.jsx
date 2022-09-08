import React, { useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';

import avatar from '../data/avatar.jpg';
import { Cart, Chat, Notification, UserProfile } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import { useSelector } from 'react-redux';

const NavButton = ({
  title,
  customFunc,
  icon,
  color,
  dotColor,
  dotCount,
  isDotVisible,
}) => (
  <button
    type="button"
    onClick={() => customFunc()}
    style={{ color }}
    className="relative text-xl rounded-full p-3 hover:bg-light-gray"
  >
    {isDotVisible && (
      <span
        style={{ background: dotColor }}
        className="absolute rounded-full h-5 w-5 right-0 top-0  text-center flex justify-center items-center"
      >
        <h1 className="text-xs text-gray-800 font-bold">
          {dotCount > 0 ? dotCount : 0}
        </h1>
      </span>
    )}

    {icon}
  </button>
);

const Navbar = ({ notificationData }) => {
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();
  const { user } = useSelector((state) => state?.user?.currentUser);
  const cartItems = useSelector((state) => state?.ordersState?.orders);
  const notifications = notificationData?.data;
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  const unseenMsgCount = notifications?.messages?.filter(
    (m) => m.isSeen === false
  ).length;

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative ">
      <div>
        <NavButton
          title="Menu"
          customFunc={handleActiveMenu}
          color={currentColor}
          icon={<AiOutlineMenu />}
        />
        <NavButton
          title="Cart"
          customFunc={() => handleClick('cart')}
          color={currentColor}
          icon={<FiShoppingCart />}
          isDotVisible={true}
          dotCount={cartItems?.length}
          dotColor={cartItems?.length > 0 ? 'rgb(254, 201, 15)' : '#87ff8a'}
        />
        {/* <NavButton
          title="Chat"
          dotColor="#03C9D7"
          customFunc={() => handleClick('chat')}
          color={currentColor}
          icon={<BsChatLeft />}
        /> */}
        <NavButton
          isDotVisible={true}
          title="Notification"
          dotCount={unseenMsgCount}
          dotColor={unseenMsgCount > 0 ? 'rgb(254, 201, 15)' : '#87ff8a'}
          customFunc={() => handleClick('notification')}
          color={currentColor}
          icon={<RiNotification3Line />}
        />
      </div>

      <div
        className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
        onClick={() => handleClick('userProfile')}
      >
        {/* <img
            className="rounded-full w-8 h-8"
            src={avatar}
            alt="user-profile"
          /> */}
        <div className="avatar placeholder">
          <div
            style={{
              background: currentColor,
            }}
            className="bg-neutral-focus text-white rounded-full w-8 h-8"
          >
            <span className="text">{user?.name.charAt(0)}</span>
          </div>
        </div>
        <p>
          <span className="text-gray-400 text-14">Hi,</span>{' '}
          <span className="text-gray-400 font-bold ml-1 text-14">
            {user?.name ? user?.name : 'User'}
          </span>
        </p>
        <MdKeyboardArrowDown className="text-gray-400 text-14" />
      </div>

      {isClicked.cart && <Cart />}
      {isClicked.chat && <Chat />}
      {isClicked.notification && <Notification notifications={notifications} />}
      {isClicked.userProfile && <UserProfile />}
    </div>
  );
};

export default Navbar;
