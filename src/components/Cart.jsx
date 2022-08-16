import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

import { useStateContext } from '../contexts/ContextProvider';
import { Button } from '.';
import { useDispatch, useSelector } from 'react-redux';
import {
  decrementOrderQuantity,
  incrementOrderQuantity,
} from '../Reducers/OrdersSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { currentColor } = useStateContext();
  const { orders: cartData } = useSelector((state) => state.ordersState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const productsTotal = cartData.map((item) => {
  //   return item.product.price_wholesale * item.quantity;
  // });
  // console.log(
  //   productsTotal.map((item) => {
  //     return item + item;
  //   })
  // );
  console.log(cartData);
  let total = 0;

  const getSum = (item) => {
    const sum = item.product.price_wholesale * item.quantity;
    total += sum;
    return sum;
  };
  console.log(total);

  return (
    <div className="bg-half-transparent w-full fixed nav-item top-0 right-0 ">
      <div className="float-right h-screen overflow-auto duration-1000 ease-in-out dark:text-gray-200 transition-all dark:bg-[#484B52] bg-white md:w-400 ">
        <div className="flex flex-col px-8 py-4 sticky top-0 dark:text-gray-200 transition-all dark:bg-[#484B52] bg-white border-b">
          <div className="flex justify-between items-center ">
            <p className="font-semibold text-lg">Shopping Cart</p>
            <Button
              icon={<MdOutlineCancel />}
              color="rgb(153, 171, 180)"
              bgHoverColor="light-gray"
              size="2xl"
              borderRadius="50%"
            />
          </div>
          {cartData.length > 0 && <h1>Cart Items: {cartData.length}</h1>}
        </div>
        {cartData.length < 1 ? (
          <div class="alert alert-info shadow-lg text-white w-[90%] mx-auto mt-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="stroke-current flex-shrink-0 w-6 h-6"
              >
                <path
                  strokeLnecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>No Items In Cart!</span>
            </div>
          </div>
        ) : (
          <div className="dark:text-gray-200 transition-all dark:bg-[#484B52] bg-white px-8">
            {cartData?.map((item, index) => (
              <div key={index}>
                <div>
                  <div className="flex items-center leading-8 gap-5 border-b-1 border-color dark:border-gray-600 p-4">
                    {/* <img
                      className="rounded-lg h-80 w-24"
                      src={item?.product.imageLink}
                      alt=""
                    /> */}
                    <div>
                      <p className="font-semibold ">
                        Name: {item?.product.product_name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
                        Category: {item.product.product_category}
                      </p>
                      <div className="flex flex-col mt-2 ">
                        <p className="">
                          Price: ₹{item?.product?.price_wholesale}
                        </p>
                        <p className="">Total: ₹{getSum(item)}</p>

                        <div className="flex items-center border-1 border-r-0 border-color rounded w-max">
                          <p
                            onClick={() =>
                              dispatch(decrementOrderQuantity(item?.product))
                            }
                            className="p-2 border-r-1 dark:border-gray-600 border-color text-red-600 "
                          >
                            <AiOutlineMinus />
                          </p>
                          <p className="p-2 border-r-1 border-color dark:border-gray-600 text-green-600">
                            {item.quantity}
                          </p>
                          <p
                            onClick={() =>
                              dispatch(incrementOrderQuantity(item?.product))
                            }
                            className="p-2 border-r-1 border-color dark:border-gray-600 text-green-600"
                          >
                            <AiOutlinePlus />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {cartData.length > 0 && (
          <div className="sticky bottom-0 px-8 py-4 border-t dark:text-gray-200 transition-all dark:bg-[#484B52] bg-white">
            {/* <div className="flex justify-between items-center">
                <p className="text-gray-500 dark:text-gray-200">Sub Total</p>
                <p className="font-semibold">$890</p>
              </div> */}
            <div className="flex justify-between items-center mt-3">
              <p className="text-gray-500 dark:text-gray-200">Total</p>
              <p className="font-semibold">₹{total}</p>
            </div>
            <div onClick={() => navigate('/confirmOrder')} className="mt-5">
              <Button
                color="white"
                bgColor={currentColor}
                text="Place Order"
                borderRadius="10px"
                width="full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
