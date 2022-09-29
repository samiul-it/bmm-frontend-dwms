import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { RiMessage2Line, RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { Cart, Chat, Notification, UserProfile } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { useMutation, useQuery } from 'react-query';
import { userRequest } from '../requestMethods';
import { toast } from 'react-toastify';
import { DropDown } from './shared/MultipleSelect/MultipleSelect';

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

const Navbar = ({ notificationData, refetchNotifications }) => {
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedWholesellers, setSelectedWholesellers] = useState([]);
  const [message, setMessage] = useState('');
  const wholesellerMessageModalRef = useRef();
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

  useEffect(() => {
    getWholesllersByCategories();
  }, [selectedCategory]);

  useEffect(() => {
    refetchNotifications();
  }, [isClicked?.notification]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  const unseenMsgCount = notifications?.messages?.filter(
    (m) => m.isSeen === false
  ).length;

  const isUserAllowed = () => {
    if (user?.role === 'admin' || user?.role === 'employee') {
      return true;
    } else {
      return false;
    }
  };

  const closeMessageModal = () => {
    setSelectedCategory([]);
    setMessage('');
    wholesellerMessageModalRef.current.checked = false;
  };

  const { isLoading: categoryLoading, data: categoryData } = useQuery(
    'categoriesList',
    async () => await userRequest.get('/category').then((res) => res?.data),
    {
      enabled: isUserAllowed(),
    }
  );

  const { isLoading: wholesellersListIsLoading, data: wholesellersList } =
    useQuery(
      'wholesellersList1',
      async () =>
        await userRequest.get('/wholesellers').then((res) => res?.data),
      {
        enabled: isUserAllowed(),
      }
    );

  const options = (array) => {
    return array?.map((item) => {
      return {
        value: item._id,
        label: item.name,
      };
    });
  };

  const { isLoading: isMSGSendLoading, mutateAsync: sendMessage } = useMutation(
    async () =>
      await userRequest.post('/wholesellers/sendNotificationByCategoty', {
        wholesellersList: selectedWholesellers?.map((ws) => ws?.value),
        message,
      }),
    {
      onSuccess: () => {
        closeMessageModal();
        toast.success('Notification sent successfully');
      },
      enabled: isUserAllowed(),
    }
  );

  const {
    isLoading: getWholesllersByCategoriesISLoading,
    mutateAsync: getWholesllersByCategories,
  } = useMutation(
    async () =>
      await userRequest
        .post('/wholesellers/findWholesellerByCategoryId', {
          id: selectedCategory.map((category) => category?.value),
        })
        .then((res) => res?.data),
    {
      enabled: isUserAllowed(),
      onSuccess: (res) => {
        setSelectedWholesellers(options(res));
      },
    }
  );

  function handleChange(values) {
    setSelectedCategory(values);
  }
  function handleWSSelectChange(values) {
    setSelectedWholesellers(values);
    if (values?.length === 0) {
      setSelectedCategory([]);
    }
  }

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative ">
      <div className="flex items-center gap-2">
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
        {isUserAllowed() && (
          <label
            htmlFor="wholesellerMessageModal"
            className="btn btn-circle bg-inherit hover:bg-white border-none"
          >
            <RiMessage2Line
              className="text-xl"
              style={{ color: currentColor }}
            />
          </label>
        )}
      </div>

      <div
        className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg ml-2"
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
      {isClicked.notification && (
        <Notification
          unseenMsgCount={unseenMsgCount}
          notifications={notifications}
        />
      )}
      {isClicked.userProfile && <UserProfile />}

      <input
        ref={wholesellerMessageModalRef}
        type="checkbox"
        id="wholesellerMessageModal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            onClick={closeMessageModal}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Send Message</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedWholesellers?.length !== 0 && isUserAllowed()) {
                sendMessage();
              }
            }}
            className="py-4"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Select Category</span>
              </label>{' '}
              <DropDown
                value={selectedCategory}
                options={options(categoryData)}
                handleChange={handleChange}
                multi={true}
                isDisabled={
                  categoryLoading ||
                  wholesellersListIsLoading ||
                  getWholesllersByCategoriesISLoading
                }
                isLoading={
                  categoryLoading ||
                  wholesellersListIsLoading ||
                  getWholesllersByCategoriesISLoading
                }
              />
              {/* <p className="text-red-500 text-md font-semibold">
                {selectedCategory.length === 0 && 'Select a category'}
              </p> */}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Select Wholeseller's</span>
              </label>{' '}
              <DropDown
                value={selectedWholesellers}
                options={options(wholesellersList)}
                handleChange={handleWSSelectChange}
                multi={true}
                isDisabled={
                  categoryLoading ||
                  wholesellersListIsLoading ||
                  getWholesllersByCategoriesISLoading
                }
                isLoading={
                  categoryLoading ||
                  wholesellersListIsLoading ||
                  getWholesllersByCategoriesISLoading
                }
              />
              <p className="text-red-500 text-md font-semibold">
                {selectedWholesellers.length === 0 && '*Select a wholeseller'}
              </p>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Message</span>
              </label>
              <textarea
                required
                name="message"
                value={message}
                className="textarea textarea-bordered"
                placeholder="Type Message..."
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <button
                tpye="submit"
                htmlFor="wholesellerMessageModal"
                className={`btn ${isMSGSendLoading && 'loading'}`}
                disabled={isMSGSendLoading}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
