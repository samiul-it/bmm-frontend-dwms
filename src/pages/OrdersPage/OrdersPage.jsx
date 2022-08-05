import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { userRequest } from '../../requestMethods';
import moment from 'moment';
import Spinner from '../../components/shared/spinner/Spinner';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const getAllOrdersApi = async () => {
    return await userRequest.get('/orders');
  };
  const { data: ordersData, isLoading: orderDataLoading } = useQuery(
    'getAllOrders',
    getAllOrdersApi,
    {
      onSuccess: (data) => {
        console.log(data);
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
          Proceed To Checkout
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
              <thead className="">
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
                  ordersData?.data?.map((order) => {
                    return (
                      <tr key={order._id}>
                        <th>
                          <span className="badge">{order._id}</span>
                        </th>
                        <td className="relative group hover:cursor-pointer ">
                          <span className="badge badge-primary">Products</span>

                          <div className="bg-gray-800 rounded-md p-2  flex-col gap-2 hidden group-hover:flex absolute left-1/2 -translate-x-1/2 z-20 mt-2 h-max max-h-72 overflow-y-auto shadow-sm">
                            {order.products.map((p) => {
                              return (
                                <div className="p-2 bg-gray-700 rounded-md">
                                  <span className=" block text-sm font-bold">
                                    {p.product.product_name}
                                  </span>
                                  <span className=" block text-sm font-semibold">
                                    wholesell price: ₹
                                    {p.product.price_wholesale}/-
                                  </span>
                                  <span className=" block text-sm">
                                    qty: {p.quantity}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        <td>
                          {moment(order.createdAt).format(
                            'MMMM Do YYYY, h:mm:ss a'
                          )}
                        </td>
                        <td>₹{order.total_cost}/-</td>
                        <td>
                          {/* <span className="badge badge-accent ">Active</span> */}

                          <div class="dropdown">
                            <label tabindex="0" class="badge badge-accent m-1">
                              Active
                            </label>
                            <ul
                              tabindex="0"
                              class="dropdown-content menu p-2 shadow bg-gray-600 rounded-md w-max gap-2 "
                            >
                              {statusOptions.map((status, i) => {
                                return (
                                  <li key={i}>
                                    <a
                                      className={`badge ${
                                        status?.class && status?.class
                                      } hover:badge-outline font-semibold hover:text-white`}
                                    >
                                      {status.label}
                                    </a>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;
