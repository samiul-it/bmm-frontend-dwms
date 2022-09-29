import React, { useEffect, useRef, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useInfiniteQuery, useQuery } from 'react-query';
import { userRequest } from '../../requestMethods';
import moment from 'moment';
import Spinner from '../../components/shared/spinner/Spinner';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components';
import { useStateContext } from '../../contexts/ContextProvider';

const OrdersPage = () => {
  const divRef = useRef();
  const tableRef = useRef();
  const { currentColor } = useStateContext();
  const [searchQuery, setSearchQuery] = useState('');
  // const getAllOrdersApi = async () => {
  //   return await userRequest.get('/orders');
  // };
  // const { data: ordersData, isLoading: orderDataLoading } = useQuery(
  //   'getAllOrders',
  //   getAllOrdersApi,
  //   {
  //     onSuccess: (data) => {
  //       // console.log(data);
  //     },
  //   }
  // );
  const navigate = useNavigate();

  const GetPaginationApi = async ({ pageParam = 1 }) => {
    const data = await userRequest.get(
      `/orders/?&page=${pageParam}&limit=${25}&search=${searchQuery}`
    );
    return data;
  };

  const {
    data: ordersData,
    fetchNextPage,
    refetch: refetchInfiniteProducts,
    hasNextPage,
    isLoading: orderDataLoading,
    isFetching: ordersDataIsFetching,
    isRefetching,
    remove,
  } = useInfiniteQuery(['ordersDataScroll'], GetPaginationApi, {
    refetchOnWindowFocus: false,
    getNextPageParam: (page) => {
      return page.data.hasNext ? page.data.curruntPage + 1 : undefined;
    },
  });

  const searchHandler = (e) => {
    e.preventDefault();
    refetchInfiniteProducts();
  };

  useEffect(() => {
    if (!searchQuery) refetchInfiniteProducts();
  }, [searchQuery]);

  const handleScroll = (e) => {
    const scrollTopValue = e.target.scrollTop;
    const innerHeight = divRef.current.clientHeight;
    const offsetHeight = tableRef.current.offsetHeight;

    // console.log(Math.ceil(scrollTopValue) + innerHeight, offsetHeight);

    if (innerHeight + Math.ceil(scrollTopValue) >= offsetHeight) {
      console.log(
        ' Reached at bottom ====>',
        innerHeight + Math.ceil(scrollTopValue) === offsetHeight
      );
      // setPage(page + 1);

      fetchNextPage();
    }
  };

  const temp = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  const LoadingCards = temp.map((e, i) => {
    return (
      <tr key={i}>
        <td>
          <div className="bg-slate-600 rounded-lg w-[90%] h-[25px]"></div>
        </td>
        <td>
          <div className="bg-slate-600 rounded-lg w-[90%] h-[25px]"></div>
        </td>
        <td>
          <div className="bg-slate-600 rounded-lg w-[90%] h-[25px]"></div>
        </td>
        <td>
          <div className="bg-slate-600 rounded-lg w-[90%] h-[25px]"></div>
        </td>
        <td>
          <div className="bg-slate-600 rounded-lg w-[70%] h-[25px]"></div>
        </td>
      </tr>
    );
  });

  const statusOptions = [
    { value: 'pending', label: 'Pending', class: 'badge-secondary' },
    { value: 'Delevered', label: 'Delevered', class: 'badge-accent' },
    { value: 'Processing', label: 'Processing', class: 'badge-primary' },
  ];

  // const handleStatusUpdate = (orderId, status) => {
  //   console.log('Status Update', orderId, status);
  //   userRequest
  //     .put(`/orders/updateOrderStatus/${orderId}?status=${status.value}`, {})
  //     .then(function (response) {
  //       // console.log(response);
  //       toast.success('Status Updated');
  //       // setIsLoading(false);
  //     })
  //     .catch(function (error) {
  //       // console.log(error);
  //       toast.error('Failed to Update Status');
  //       // setIsLoading(false);
  //     });
  // };

  const [details, setDetails] = React.useState();

  const modalRef = React.useRef();
  // console.log('ordersData ===>', ordersData);

  return (
    <div className="container mx-auto h-max max-w-[95%]">
      <div className="flex justify-between mb-4">
        <Header category="Page" title="Orders" />
        <div className="flex gap-4 items-center">
          <form
            onSubmit={(e) => {
              searchHandler(e);
            }}
            className="w-full md:max-w-[370px] relative"
          >
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
            >
              Search
            </label>
            <div className="relative">
              <input
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                type="search"
                id="default-search"
                className="block p-3 pr-14 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter Order ID"
              />
              <button
                type="submit"
                style={{
                  background: currentColor,
                }}
                className="text-white absolute right-2 bottom-[5px] focus:ring-4 focus:outline-none hover:bg-light-gray font-medium rounded-lg text-sm px-3 py-2"
              >
                <div className="flex items-center pointer-events-none ">
                  <svg
                    className="w-5 h-5 text-gray-100 "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </button>
            </div>
            <h1 className="absolute -bottom-4 text-gray-700 font-semibold text-sm dark:text-gray-300">
              {isRefetching && searchQuery && 'Searching...'}
            </h1>
          </form>
          <button
            onClick={() => {
              navigate('/confirmOrder');
            }}
            className="btn btn-primary btn-sm capitalize"
          >
            Go to Cart
            <span className="mx-2 text-lg">
              <FiArrowRight />
            </span>
          </button>
        </div>
      </div>

      {orderDataLoading ? (
        <div className="flex justify-center items-center w-full h-[70vh]">
          <Spinner />
        </div>
      ) : (
        <>
          <div
            ref={divRef}
            onScrollCapture={(e) => handleScroll(e)}
            className="max-h-[650px] overflow-auto rounded-lg "
          >
            <table ref={tableRef} className="table w-full">
              <thead className="sticky top-0 left-0">
                <tr>
                  <th>Order #Id</th>
                  <th>Products</th>
                  <th>Order Date</th>
                  <th>Total Cost</th>
                  <th>status</th>
                </tr>
              </thead>
              <tbody>
                {ordersData?.pages?.length > 0 &&
                  ordersData?.pages?.map(
                    (page, i) =>
                      page?.data?.itemList?.length > 0 &&
                      page?.data?.itemList?.map((order, i) => (
                        <tr
                          onClick={(e) => {
                            e.preventDefault(),
                              navigate(`/OrderDetails/${order?.orderId}`);
                          }}
                          className="hover "
                          key={order?._id}
                        >
                          <td>
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="badge font-semibold"
                            >
                              <span className="select-none">#</span>
                              {order?.orderId}
                            </span>
                          </td>
                          <td className="group hover:cursor-pointer hover:relative">
                            <span className="badge badge-primary">
                              Products
                            </span>

                            <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-2 flex-col gap-2 hidden group-hover:flex absolute left-1/2 -translate-x-1/2 z-20 mt-2 h-max max-h-72 overflow-y-auto shadow-sm">
                              {order?.products?.map((p, i) => {
                                return (
                                  <div
                                    key={i}
                                    className="p-2 bg-gray-300 dark:bg-gray-700 dark:text-gray-300 text-gray-600 rounded-md"
                                  >
                                    <span className=" block text-sm font-bold">
                                      {p?.product?.product_name}
                                    </span>
                                    <span className=" block text-sm font-semibold">
                                      wholesell price: ₹
                                      {p?.product?.price_wholesale}/-
                                    </span>
                                    <span className=" block text-sm">
                                      qty: {p?.quantity}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                          <td>
                            {moment(order?.createdAt).format(
                              'Do MMM YYYY, h:mm A'
                            )}
                          </td>
                          <td>₹{order?.total_cost}/-</td>
                          <td>
                            {/* <span className="badge badge-accent ">Active</span> */}

                            <label
                              tabIndex="0"
                              className="badge badge-accent m-1"
                            >
                              {order?.status[order?.status.length - 1]?.status}
                            </label>
                          </td>
                        </tr>
                      ))
                  )}
                {ordersDataIsFetching && hasNextPage && LoadingCards}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!hasNextPage &&
        !ordersDataIsFetching &&
        (ordersData?.pages[0]?.data.itemList.length > 1 ? (
          <div className="flex justify-center h-max w-full mt-4">
            <div className="alert alert-success shadow-lg w-max ">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-semibold">
                  You have Scrolled through all the data!
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center h-max w-full mt-4">
            <div className="alert alert-info shadow-lg w-max">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current flex-shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="font-semibold">!Items Not Found</span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default OrdersPage;
