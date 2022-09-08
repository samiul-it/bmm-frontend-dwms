import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { userRequest } from '../../requestMethods';
import moment from 'moment';
import Spinner from '../../components/shared/spinner/Spinner';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const OrdersPage = () => {
  const getAllOrdersApi = async () => {
    return await userRequest.get('/orders');
  };
  const { data: ordersData, isLoading: orderDataLoading } = useQuery(
    'getAllOrders',
    getAllOrdersApi,
    {
      onSuccess: (data) => {
        // console.log(data);
      },
    }
  );
  const navigate = useNavigate();

  const temp = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  const LoadingCards = temp.map((e, i) => {
    return (
      <tr key={i}>
        <td></td>
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
    <div className="container mx-auto h-max px-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold  ">Orders</h1>
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

      {orderDataLoading ? (
        <div className="flex justify-center items-center w-full h-[70vh]">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="max-h-[650px] overflow-auto rounded-lg ">
            <table className="table w-full">
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
                {!orderDataLoading &&
                  ordersData?.data
                    ?.map((order) => {
                      return (
                        <>
                          <tr
                            onClick={(e) => {
                              e.preventDefault(),
                                navigate(`/OrderDetails/${order?.orderId}`);
                            }}
                            className="hover "
                            key={order?._id}
                          >
                            <td>
                              <span className="badge font-semibold">
                                <span className="select-none">#</span>
                                {order?.orderId}
                              </span>
                            </td>
                            <td className="group hover:cursor-pointer hover:relative">
                              <span className="badge badge-primary">
                                Products
                              </span>

                              <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-2 flex-col gap-2 hidden group-hover:flex absolute left-1/2 -translate-x-1/2 z-20 mt-2 h-max max-h-72 overflow-y-auto shadow-sm">
                                {order.products.map((p, i) => {
                                  return (
                                    <div
                                      key={i}
                                      className="p-2 bg-gray-300 dark:bg-gray-700 dark:text-gray-300 text-gray-600 rounded-md"
                                    >
                                      <span className=" block text-sm font-bold">
                                        {p.product?.product_name}
                                      </span>
                                      <span className=" block text-sm font-semibold">
                                        wholesell price: ₹
                                        {p.product?.price_wholesale}/-
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
                              {moment(order.createdAt)
                                .format('MMMM Do YYYY, h:mm:ss a')
                                .includes('am')
                                ? moment(order.createdAt)
                                    .format('MMMM Do YYYY, h:mm:ss a')
                                    .replace('am', 'AM')
                                : moment(order.createdAt)
                                    .format('MMMM Do YYYY, h:mm:ss a')
                                    .replace('pm', 'PM')}
                            </td>
                            <td>₹{order?.total_cost}/-</td>
                            <td>
                              {/* <span className="badge badge-accent ">Active</span> */}

                              <label
                                tabIndex="0"
                                className="badge badge-accent m-1"
                              >
                                {
                                  order?.status[order?.status.length - 1]
                                    ?.status
                                }
                              </label>
                            </td>
                          </tr>
                        </>
                      );
                    })
                    ?.reverse()}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;
