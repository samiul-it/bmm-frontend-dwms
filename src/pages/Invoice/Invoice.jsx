import moment from 'moment';
import React, { useRef } from 'react';
import { FiDownload } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { userRequest } from '../../requestMethods';
import ReactToPrint from 'react-to-print';
import './invoice.css';
import { useEffect } from 'react';

const Invoice = () => {
  const { orderId } = useParams();
  const user = useSelector((state) => state?.user?.currentUser?.user);
  const componentRef = useRef();
  const {
    data: orderDetails,
    refetch: refetchOrderDetails,
    isLoading: isLoadingOrderDetails,
  } = useQuery(
    'orderDetails',
    async () =>
      await userRequest
        .get(`/orders/getOrderByOrderId/${orderId}`)
        .then((res) => res.data),
    {
      enabled: orderId
        ? true
        : false &&
          user.role !== 'admin' &&
          user.role !== 'employee' &&
          user._id !== orderDetails?.buyersId,
    }
  );

  if (
    user.role !== 'admin' &&
    user.role !== 'employee' &&
    user._id !== orderDetails?.buyersId
  ) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    document.title = `#${orderId}-invoice-bmm`;
  }, []);

  return (
    <div className="container mx-auto max-w-[95%]">
      <div className="flex justify-end ">
        <ReactToPrint
          trigger={() => (
            <button className="btn btn-sm btn-white m-b-10 p-l-5">
              Export as PDF &nbsp; <FiDownload />
            </button>
          )}
          content={() => componentRef.current}
        />
      </div>

      <div ref={componentRef} className="">
        <div className="col-md-12">
          <div className="invoice">
            <div className="invoice-company text-inverse f-w-600 flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800">
                Build Mega Mart, Inc
              </h1>
            </div>

            <div className="invoice-header">
              <div className="invoice-from text-gray-700">
                <small>from</small>
                <address className="m-t-5 m-b-5 ">
                  <strong className="text-inverse ">
                    Build Mega Mart, Inc.
                  </strong>
                  <br />
                  Street Address
                  <br />
                  City, Zip Code
                  <br />
                  Phone: (123) 456-7890
                  <br />
                  Fax: (123) 456-7890
                </address>
              </div>
              <div className="invoice-to text-gray-700">
                <small>to</small>
                <address className="m-t-5 m-b-5">
                  <strong className="text-inverse">
                    {orderDetails?.buyersName}
                  </strong>
                  <br />
                  {orderDetails?.buyersAddress}
                  <br />
                  {orderDetails?.buyersPlace}, Zip Code
                  <br />
                  Phone: {orderDetails?.buyersPhone}
                  <br />
                  {/* Fax: (123) 456-7890 */}
                </address>
              </div>
              <div className="invoice-date text-gray-700">
                <small>Invoice / Receipt</small>
                <div className="invoice-detail">
                  <span className="font-semibold text-gray-800">
                    {' '}
                    #{orderId}
                  </span>
                  <br />
                  <div className="date text-inverse m-t-5">
                    {moment(orderDetails?.createdAt).format('Do MMM YYYY')}
                  </div>
                  {/* Services Product */}
                </div>
              </div>
            </div>
            {/* <!-- end invoice-header --> */}
            {/* <!-- begin invoice-content --> */}
            <div className="invoice-content">
              {/* <!-- begin table-responsive --> */}
              <div className=" overflow-auto rounded-lg mb-6">
                <table className="table w-full">
                  <thead className="sticky top-0 left-0">
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>QTY</th>
                      <th>Price</th>
                      <th>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails?.products?.map((item, i) => {
                      return (
                        <tr key={i} className="hover">
                          <td>{i + 1}</td>
                          <td>{item?.product?.product_name}</td>
                          <td>
                            <span className="text-xs font-semibold">X</span>{' '}
                            {item?.quantity}
                          </td>
                          <td>₹{item?.product?.price_wholesale}</td>
                          <td>
                            ₹{item?.product?.price_wholesale * item?.quantity}/-
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* <!-- end table-responsive --> */}
              {/* <!-- begin invoice-price --> */}
              <div className="invoice-price text-gray-700">
                <div className="invoice-price-left">
                  <div className="invoice-price-row">
                    <div className="sub-price">
                      <small>SUBTOTAL</small>
                      <span className="text-inverse">
                        ₹{orderDetails?.total_cost}
                      </span>
                    </div>
                    <div className="sub-price">
                      <i className="fa fa-plus text-muted"></i>
                    </div>
                    {/* <div className="sub-price">
                      <small>PAYPAL FEE (0.0%)</small>
                      <span className="text-inverse">₹0.00</span>
                    </div> */}
                  </div>
                </div>
                <div className="invoice-price-right">
                  <small>TOTAL</small>{' '}
                  <span className="f-w-600">₹{orderDetails?.total_cost}</span>
                </div>
              </div>
              {/* <!-- end invoice-price --> */}
            </div>
            {/* <!-- end invoice-content --> */}
            {/* <!-- begin invoice-note --> */}
            <div className="mt-2 text-sm">
              {/* * Make all cheques payable to [Your Company Name]
              <br />
              * Payment is due within 30 days */}
              <br />* If you have any questions concerning this invoice, contact
              +91 1234567890, bmm@example.com
            </div>
            {/* <!-- end invoice-note --> */}
            {/* <!-- begin invoice-footer --> */}
            <div className="invoice-footer">
              <p className="text-center mb-1 f-w-600">
                THANK YOU FOR YOUR BUSINESS
              </p>
              <p className="text-center">
                <h1 className="mr-5">
                  <i className="fa fa-fw fa-lg fa-globe"></i>
                  BMM.com
                </h1>
                {/* <span className="m-r-10">
                  <i className="fa fa-fw fa-lg fa-phone-volume"></i>
                  T:016-18192302
                </span> */}
                <h1 className="mr-5">
                  <i className="fa fa-fw fa-lg fa-envelope"></i>
                  bmm@example.com
                </h1>
              </p>
            </div>
            {/* <!-- end invoice-footer --> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
