import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  changeOrderQuantity,
  clearOrders,
  decrementOrderQuantity,
  incrementOrderQuantity,
  removeOrder,
} from '../../Reducers/OrdersSlice';
import Select from 'react-select';
import { userRequest } from '../../requestMethods';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const ConfirmOrder = () => {
  const { orders } = useSelector((state) => state.ordersState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifyerorr = (id, msg) => {
    toast.error(`${msg}!`, {
      position: toast.POSITION.TOP_CENTER,
      toastId: id,
    });
  };
  const notifysucc = (id, msg) => {
    toast.success(`${msg}!`, {
      position: toast.POSITION.TOP_CENTER,
      toastId: id,
    });
  };
  const { user } = useSelector((state) => state);

  const [wholesalers, setWholesalers] = useState([]);

  const [order, setOrder] = useState({
    buyersId: [],
    createdBy: user?.currentUser?.user._id,
  });

  let MainTotal = 0;

  const getSum = (item) => {
    const sum = item.product.price_wholesale * item.quantity;
    MainTotal += sum;
    return sum;
  };

  const getAllWholesalersApi = async () => {
    return await userRequest.get('/wholesellers');
  };

  const isUserAllowed = () => {
    if (
      user?.currentUser?.user.role === 'admin' ||
      user?.currentUser?.user.role === 'employee'
    ) {
      return true;
    } else {
      return false;
    }
  };

  const { isLoading: isWholesellersListLoading, data: wholesellersData } =
    useQuery('getAllWholesalers', getAllWholesalersApi, {
      enabled: isUserAllowed(),
    });

  const options = wholesellersData?.data?.map((item) => {
    return {
      value: item._id,
      label: item.name,
    };
  });

  useEffect(() => {
    setOrder({
      products: orders.map((item) => {
        return {
          product: {
            _id: item.product._id,
            product_name: item.product.product_name,
            price_wholesale: item.product.price_wholesale,
            price_retail: item.product.price_retail,
            mrp: item.product.mrp,
          },
          quantity: item.quantity,
        };
      }),
      buyersId: isUserAllowed()
        ? wholesalers.map((item) => item.value)
        : [user?.currentUser?.user._id],

      createdBy: user?.currentUser?.user._id,
    });
  }, [orders, wholesalers, user]);

  const createOrderApi = async (odr) => {
    return await userRequest.post('/orders/create', odr);
  };
  const { mutateAsync: createOrder, isLoading: createOrderIsLoading } =
    useMutation(createOrderApi, {
      onSuccess: () => {
        notifysucc('createOrder', 'Order Created Successfully');
        dispatch(clearOrders());
        navigate('/');
        setWholesalers([]);
        console.log('order created successfully');
      },
      onError: (err) => {
        console.log('Create Order Error ==>', err);
      },
    });

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto px-6">
        <div className="flex ">
          <div className="w-3/4 px-10 pb-10">
            <div className="flex justify-between border-b pb-8">
              <h1 className="font-semibold text-2xl">Shopping Cart</h1>
              <h2 className="font-semibold text-2xl">{orders?.length} Items</h2>
            </div>
            <div className="flex mt-10 mb-5">
              <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">
                Product Details
              </h3>
              <h3 className="font-semibold  text-gray-600 text-xs uppercase w-1/5 text-center">
                Quantity
              </h3>
              <h3 className="font-semibold  text-gray-600 text-xs uppercase w-1/5 text-center">
                Price
              </h3>
              <h3 className="font-semibold  text-gray-600 text-xs uppercase w-1/5 text-center">
                Total
              </h3>
            </div>

            <div className="max-h-[50%] overflow-auto">
              {orders?.map((item, index) => {
                return (
                  <div
                    key={item.product._id}
                    className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 border-b  px-6 py-5 relative"
                  >
                    <div className="flex w-2/5">
                      {/* <div className="w-20">
                      <img
                        className="h-24"
                        src="https://drive.google.com/uc?id=18KkAVkGFvaGNqPy2DIvTqmUH_nk39o3z"
                        alt=""
                      />
                    </div> */}
                      <div className="flex flex-col justify-between ml-4 flex-grow">
                        <span className="font-bold text-gray-800 dark:text-gray-300 text-sm">
                          {item?.product?.product_name}
                        </span>
                        <span className="font-bold text-gray-700 dark:text-gray-300 text-xs">
                          Category: {item.product.product_category}
                        </span>

                        <span className="font-semibold text-gray-500 dark:text-gray-300 text-xs">
                          Brand
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center w-1/5">
                      <button
                        onClick={() =>
                          dispatch(decrementOrderQuantity(item?.product))
                        }
                        className="text-red-700 hover:text-red-600 p-2"
                      >
                        <svg className="fill-current w-3" viewBox="0 0 448 512">
                          <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                        </svg>
                      </button>

                      <input
                        className="mx-2 border text-center min-w-[60px]"
                        type="number"
                        value={item.quantity}
                        min={1}
                        onChange={(e) => {
                          dispatch(
                            changeOrderQuantity({
                              product: item?.product,
                              quantity: +e.target.value,
                            })
                          );
                        }}
                      />

                      <button
                        onClick={() =>
                          dispatch(incrementOrderQuantity(item?.product))
                        }
                        className="text-green-700 hover:text-green-600 p-2"
                      >
                        <svg className="fill-current w-3" viewBox="0 0 448 512">
                          <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                        </svg>
                      </button>
                    </div>
                    <span className="text-center w-1/5 font-semibold text-sm">
                      ₹{item.product.price_wholesale}
                    </span>
                    <span className="text-center w-1/5 font-semibold text-sm">
                      ₹{getSum(item)}
                    </span>
                    <button
                      onClick={() => dispatch(removeOrder(item?.product))}
                      className="font-bold text-red-500 hover:underline text-xs absolute top-2 right-2 btn btn-xs bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => navigate(-1)}
              className="flex font-semibold text-indigo-600 text-sm mt-10"
            >
              <svg
                className="fill-current mr-2 text-indigo-600 w-4"
                viewBox="0 0 448 512"
              >
                <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
              </svg>
              Go Back
            </button>
          </div>

          <div id="summary" className="w-1/4 px-8 py-10">
            <h1 className="font-semibold text-2xl border-b pb-8">
              Order Summary
            </h1>
            <div className="flex justify-between mt-10 mb-5">
              <span className="font-semibold text-sm uppercase">
                Items {orders.length}
              </span>
              <span className="font-semibold text-sm">₹{MainTotal}</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                isUserAllowed() && wholesalers.length < 1
                  ? notifyerorr('selectWholselerErr', 'Select a Wholesaler')
                  : orders.length > 0
                  ? createOrder(order)
                  : notifyerorr('orderErr', 'Add Items to Cart');
              }}
            >
              {isUserAllowed() && (
                <>
                  <Select
                    isMulti
                    defaultValue={wholesalers}
                    onChange={setWholesalers}
                    options={options}
                    required
                    isDisabled={isWholesellersListLoading || orders?.length < 1}
                    isLoading={isWholesellersListLoading}
                  />

                  {isUserAllowed() && wholesalers.length < 1 && (
                    <h3 className="text-sm text-red-500">
                      Select a Wholesaler
                    </h3>
                  )}
                </>
              )}

              <div className="border-t mt-8">
                <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                  <span>Total cost</span>
                  <span>{MainTotal}</span>
                </div>
                <button
                  disabled={orders.length > 0 ? false : true}
                  type="submit"
                  className={`btn btn-primary w-full ${
                    createOrderIsLoading && 'loading'
                  }`}
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
