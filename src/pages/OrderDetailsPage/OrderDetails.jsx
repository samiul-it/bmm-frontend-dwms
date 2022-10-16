import React, { useRef, useState } from 'react';
import { FiArrowLeft, FiDownload, FiTrash } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { useMutation, useQuery } from 'react-query';
import { publicRequest, userRequest } from '../../requestMethods';
import Spinner from '../../components/shared/spinner/Spinner';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { BsFillPencilFill } from 'react-icons/bs';
import { FaFileInvoice } from 'react-icons/fa';
import { saveAs } from 'file-saver';
// import ImageKit from 'imagekit';

// var imagekit = new ImageKit({
//   publicKey: 'public_YWhtb0662wdexzUYmQS6hNIQsmQ=',
//   privateKey: 'private_M2bBZ2xf6bISvuehveLcfZO2iww=',
//   urlEndpoint: 'https://ik.imagekit.io/bmm/',
// });

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [invoiceFile, setInvoiceFile] = useState(null);
  const user = useSelector((state) => state.user.currentUser.user);
  const confirmStatusUpdateModalRef = useRef();
  const [selectedStatus, setSelectedStaus] = useState({});
  const [orderDetailsModal, setOrderDetailsModal] = useState({});
  const confirmOrderDtailsUpdateModalRef = useRef();
  const [isEditModeOn, setIsEditModeOn] = useState({
    deliveryAddress: false,
    customerAndOrderDetails: false,
  });
  const [deleteImageId, setDeleteImageId] = useState(null);
  const confirmDeleteInvoiceImageRef = useRef();
  const uploadFileBtnRef = useRef();

  const {
    data: orderDetailsData,
    refetch: refetchOrderDetails,
    isLoading: isLoadingOrderDetails,
    isFetching: isFetchingOrderDetails,
  } = useQuery(
    'orderDetails',
    async () =>
      await userRequest
        .get(`/orders/getOrderByOrderId/${orderId}`)
        .then((res) => res.data),
    {
      refetchOnWindowFocus: false,
      enabled: orderId ? true : false,
      onSuccess: (res) => {
        setOrderDetails(res);
      },
    }
  );

  const [orderDetails, setOrderDetails] = useState(orderDetailsData);

  // console.log(orderDetails);

  const statusOptions = [
    { value: 'Requested', label: 'Requested' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delevered', label: 'Delevered' },
    { value: 'Pending', label: 'Pending' },
    { value: 'cancelled', label: 'cancelled' },
  ];

  const statusColors = {
    Pending: {
      color: '#F3A638',
    },
    Shipped: {
      color: '#1E91CF',
    },
    Requested: {
      color: '#3094ff',
    },
    Delevered: {
      color: '#4CB64C',
    },
    Processing: {
      color: '#54B7D3',
    },
    ['Order Placed']: {
      color: '#1175AE',
    },
    cancelled: {
      color: '#E3503E',
    },
  };

  const { mutateAsync: updateOrderStatus, isLoading: isUpdateStatusLoading } =
    useMutation(
      (data) =>
        userRequest.put(
          `/orders/updateOrderStatus/${data?.orderId}?status=${data?.status.value}`
        ),
      {
        onSuccess: () => {
          toast.success('Order Status Updated Successfully');
          refetchOrderDetails();
        },
        onError: (err) => {
          toast.error('Order Status Error ==>', err.response.data);
        },
      }
    );

  const {
    mutateAsync: updateOrderDetails,
    isLoading: updateOrderDetailsIsLoading,
  } = useMutation(
    async () =>
      await userRequest.put(
        `orders/updateOrderDetails/${orderDetails?._id}`,
        orderDetails
      ),
    {
      onSuccess: () => {
        toast.success('Order Details Updated Successfully');
        refetchOrderDetails();
        setIsEditModeOn({
          deliveryAddress: false,
          deliveryAddress: false,
        });
      },
      onError: (err) => {
        setIsEditModeOn({
          deliveryAddress: false,
          customerAndOrderDetails: false,
        });
        console.log('Order Update Error ==>', err.response.data);
      },
    }
  );

  const getCurruntStatusColor = (status) => {
    return statusColors[`${status}`]?.color;
  };

  const closeUpdatedStatusHandler = () => {
    confirmStatusUpdateModalRef.current.checked = false;
    setSelectedStaus({});
  };

  const openOrderDtailsUpdateModal = (message) => {
    setOrderDetailsModal({ message: message });
    confirmOrderDtailsUpdateModalRef.current.checked = true;
  };

  const uplaodInvoiceApi = async () => {
    const formData = new FormData();
    formData.append('file', invoiceFile);
    formData.append(
      'upload_preset',
      process.env.REACT_APP_CLODINARY_UPLOAD_PRESET
    );
    formData.append('folder', 'bmm');

    await publicRequest
      .post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      )
      .then((res) => {
        console.log('cloudinary image uploaded ✅ ====>', res);

        setOrderDetails({
          ...orderDetails,
          images: [
            ...orderDetails?.images,
            {
              public_id: res?.data?.public_id,
              image_url: res?.data?.secure_url,
            },
          ],
        });
        updateOrderDetails();
        setInvoiceFile(null);
        uploadFileBtnRef.current.value = null;
      })
      .catch((err) => {
        setInvoiceFile(null);
        uploadFileBtnRef.current.value = null;
        console.log('Error ===>', err.response);
        toast.error('Something Went Uploading file!');
      });
  };

  const { mutateAsync: UplaodInvoice, isLoading: uplaodInvoiceIsLoading } =
    useMutation(uplaodInvoiceApi, {
      onSuccess: () => {
        toast.success('Image Uploaded Sucessfully ✅');
      },
    });
  // console.log('orderDetails', orderDetails?.images);

  const downloadImage = (image_url, public_id) => {
    saveAs(image_url, `invoice_${orderId}_${public_id}`); // Put your image url here.
  };

  const { mutateAsync: deleteImage, isLoading: deleteImageisLoading } =
    useMutation(async (public_id) => await deleteImageAPI(public_id), {
      onSuccess: () => {
        setDeleteImageId(null);
      },
      onError: (err) => {
        setDeleteImageId(null);
        console.log(err.response);
        toast.error('something went Wrong');
      },
    });

  const deleteImageAPI = async (public_id) => {
    await userRequest
      .delete(`/orders/deleteImgae?public_id=${public_id}`)
      .then(async (res) => {
        setOrderDetails({
          ...orderDetails,
          images: orderDetails?.images?.filter(
            (inv) => inv?.public_id !== public_id
          ),
        });

        await updateOrderDetails();
      });
  };

  return (
    <div className="container mx-auto max-w-[95%]">
      <header className="flex justify-between items-center">
        <h3 className="flex items-center font-bold dark:text-gray-200">
          <button onClick={() => navigate(-1)} className="p-2 text-2xl ">
            <FiArrowLeft />
          </button>
          <span className="text-lg"> Order Details</span>
        </h3>
      </header>

      {isLoadingOrderDetails ? (
        <div className="flex justify-center items-center w-full h-[70vh]">
          <Spinner />
        </div>
      ) : (
        <>
          <hr className="my-2" />

          <div className="flex items-center justify-between gap-6 my-4 flex-wrap">
            <div className="font-semibold text-lg dark:text-gray-200">
              Order Number {'  '}
              <span className="text-red-500">
                <span className="select-none ">#</span>
                {orderDetails?.orderId}
              </span>
            </div>
            <div className="flex items-center gap-7 flex-wrap">
              <Link to={`/invoice/${orderId}`} className="btn btn-sm btn-white">
                Generate Invoice &nbsp; <FaFileInvoice />
              </Link>

              {user?.role === 'admin' && (
                <div className="flex flex-wrap sm:flex-nowrap  ">
                  <div className="h-max relative text-center mt-2 md:mt-0 md:max-w-[300px] w-full flex flex-wrap">
                    <p className="block text-sm font-medium text-gray-900 dark:text-gray-300 absolute -top-6">
                      {!uplaodInvoiceIsLoading ? (
                        'Upload invoice img/pdf*'
                      ) : (
                        <button className="btn loading no-animation bg-inherit border-0 p-0 m-0 text-red-500 btn-sm -mt-2 max-w-max max-h-max">
                          Uploading File...
                        </button>
                      )}
                    </p>
                    <input
                      onChange={(e) => setInvoiceFile(e.target.files[0])}
                      type="file"
                      accept="image/*, application/pdf"
                      // disabled={uploadProductsIsLoading}
                      className="block w-max text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1a97f5] file:text-gray-200 hover:file:bg-[#0173ca] hover:cursor-pointer "
                      ref={uploadFileBtnRef}
                    />
                  </div>
                  <span
                    disabled={!invoiceFile || uplaodInvoiceIsLoading}
                    onClick={() => {
                      user?.role === 'admin' && UplaodInvoice();
                    }}
                    className="btn btn-sm btn-dark sm:w-max w-full mt-2 sm:mt-0"
                  >
                    Upload
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex lg:flex-row flex-col gap-4 relative">
            <div className="flex flex-col gap-4 lg:w-[70%] ">
              <div className="border rounded-lg p-6 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500">
                {' '}
                <h1 className="font-semibold py-2 text-lg dark:text-gray-200">
                  Items Summary:
                </h1>
                <div className="max-h-[400px] overflow-auto rounded-lg">
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
                              ₹{item?.product?.price_wholesale * item?.quantity}
                              /-
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  openOrderDtailsUpdateModal('Customer And Order Details');
                }}
                className="border rounded-lg p-6 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500 pb-3 relative"
              >
                {user?.role === 'admin' && (
                  <label
                    onClick={() =>
                      setIsEditModeOn({
                        ...isEditModeOn,
                        customerAndOrderDetails:
                          !isEditModeOn.customerAndOrderDetails,
                      })
                    }
                    className="btn btn-sm btn-circle absolute top-2 right-2"
                  >
                    <BsFillPencilFill />
                  </label>
                )}

                <h1 className="font-semibold py-2 text-lg dark:text-gray-200">
                  Customer And Order Details
                </h1>

                <div className="flex justify-between items-center border-t border-gray-300 dark:border-gray-500 py-3">
                  <h1 className="font-semibold dark:text-gray-300">
                    Customer Name
                  </h1>

                  {!isEditModeOn.customerAndOrderDetails ||
                  user?.role !== 'admin' ? (
                    <h2 className="text-sm font-semibold dark:text-gray-400 ">
                      {orderDetails?.buyersName}
                    </h2>
                  ) : (
                    <input
                      disabled={
                        !isEditModeOn.customerAndOrderDetails ||
                        user?.role !== 'admin'
                      }
                      type="text"
                      value={orderDetails?.buyersName}
                      onChange={(e) => {
                        setOrderDetails({
                          ...orderDetails,
                          buyersName: e.target.value,
                        });
                      }}
                      required
                      className="input w-[50%] input-sm"
                    />
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-gray-300 dark:border-gray-500 py-3">
                  <h1 className="font-semibold dark:text-gray-300">
                    Phone Number
                  </h1>

                  {!isEditModeOn.customerAndOrderDetails ||
                  user?.role !== 'admin' ? (
                    <h2 className="text-sm font-semibold dark:text-gray-400">
                      +91 {orderDetails?.buyersPhone}
                    </h2>
                  ) : (
                    <input
                      disabled={
                        !isEditModeOn.customerAndOrderDetails ||
                        user?.role !== 'admin'
                      }
                      type="text"
                      value={orderDetails?.buyersPhone}
                      onChange={(e) => {
                        setOrderDetails({
                          ...orderDetails,
                          buyersPhone: e.target.value,
                        });
                      }}
                      required
                      className="input w-[50%] input-sm"
                    />
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-gray-300 dark:border-gray-500 py-3">
                  <h1 className="font-semibold dark:text-gray-300">Email</h1>

                  {!isEditModeOn.customerAndOrderDetails ||
                  user?.role !== 'admin' ? (
                    <h2 className="text-sm font-semibold dark:text-gray-400">
                      {orderDetails?.buyersEmail}
                    </h2>
                  ) : (
                    <input
                      disabled={
                        !isEditModeOn.customerAndOrderDetails ||
                        user?.role !== 'admin'
                      }
                      type="text"
                      value={orderDetails?.buyersEmail}
                      onChange={(e) => {
                        setOrderDetails({
                          ...orderDetails,
                          buyersEmail: e.target.value,
                        });
                      }}
                      required
                      className="input w-[50%] input-sm"
                    />
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-gray-300 dark:border-gray-500 py-3">
                  <h1 className="font-semibold dark:text-gray-300">Place</h1>

                  {!isEditModeOn.customerAndOrderDetails ||
                  user?.role !== 'admin' ? (
                    <h2 className="text-sm font-semibold dark:text-gray-400">
                      {orderDetails?.buyersPlace}
                    </h2>
                  ) : (
                    <input
                      disabled={
                        !isEditModeOn.customerAndOrderDetails ||
                        user?.role !== 'admin'
                      }
                      type="text"
                      value={orderDetails?.buyersPlace}
                      onChange={(e) => {
                        setOrderDetails({
                          ...orderDetails,
                          buyersPlace: e.target.value,
                        });
                      }}
                      required
                      className="input w-[50%] input-sm"
                    />
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-gray-300 dark:border-gray-500 py-3">
                  <h1 className="font-semibold dark:text-gray-300">
                    Created By
                  </h1>
                  <h2 className="text-sm font-semibold dark:text-gray-400">
                    {orderDetails?.createdBy === orderDetails?.buyersId
                      ? orderDetails?.buyersName
                      : 'Admin'}
                  </h2>
                </div>

                <div className="flex justify-between items-center border-t border-gray-300 dark:border-gray-500 py-3">
                  <h1 className="font-semibold dark:text-gray-300">Note</h1>
                  <h2 className="text-sm font-semibold dark:text-gray-400">
                    N/A
                  </h2>
                </div>

                {isEditModeOn.customerAndOrderDetails && (
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        refetchOrderDetails(),
                          setIsEditModeOn({
                            ...isEditModeOn,
                            customerAndOrderDetails: false,
                          });
                      }}
                      className="btn btn-sm btn-error"
                    >
                      cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateOrderDetailsIsLoading}
                      className={`btn btn-sm btn-success ${
                        updateOrderDetailsIsLoading && 'loading'
                      }`}
                    >
                      save
                    </button>
                  </div>
                )}
              </form>

              <div className="flex gap-4 flex-wrap">
                {orderDetailsData?.images &&
                  orderDetailsData?.images.length > 0 &&
                  orderDetailsData?.images?.map((inv) => {
                    return (
                      <div
                        key={inv?.public_id}
                        className="max-w-[49%] lg:max-w-[32%] min-h-[350px] relative flex-grow flex-shrink bg-base-100 shadow-xl image-full rounded-2xl overflow-hidden"
                      >
                        {deleteImageisLoading &&
                          deleteImageId === inv?.public_id && (
                            <>
                              <div className="absolute w-full h-full top-0 left-0 bg-black opacity-80 z-10" />
                              <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center">
                                <Spinner />
                              </div>
                            </>
                          )}
                        <img
                          className="w-full h-full object-cover"
                          src={inv?.image_url}
                          alt={inv?.public_id}
                        />
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => {
                              setDeleteImageId(inv?.public_id);
                              confirmDeleteInvoiceImageRef.current.checked = true;
                            }}
                            className="btn btn-circle absolute top-5 right-5"
                          >
                            <FiTrash />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            downloadImage(inv?.image_url, inv?.public_id)
                          }
                          className="btn btn-sm absolute bottom-5 right-5"
                        >
                          Downlaod &nbsp; <FiDownload />
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:w-[30%]">
              <div className="border rounded-lg p-6 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500 pb-0">
                <div className="flex justify-between items-center">
                  <h1 className="font-semibold py-2 text-lg dark:text-gray-200">
                    Order Summary
                  </h1>
                  {/* <h1 className="font-semibold p-2 bg-slate-200 rounded text-green-500 text-xs">
                {orderDetails?.status[orderDetails?.status?.length - 1].status}
              </h1> */}

                  <div className="dropdown">
                    <button
                      style={{
                        background: getCurruntStatusColor(
                          orderDetails?.status[orderDetails?.status?.length - 1]
                            ?.status
                        ),
                      }}
                      tabIndex="0"
                      className={`font-semibold p-2 w-max rounded text-white text-[13px] btn btn-sm  border-0 ${
                        isUpdateStatusLoading && 'loading'
                      } ${user?.role !== 'admin' && 'pointer-events-none'}`}
                    >
                      {
                        orderDetails?.status[orderDetails?.status?.length - 1]
                          .status
                      }
                    </button>
                    <ul
                      tabIndex="0"
                      className="dropdown-content menu p-2 shadow bg-gray-200 dark:bg-gray-600 rounded-md w-max gap-2 "
                    >
                      {statusOptions.map((status, i) => {
                        return (
                          <li
                            onClick={() => {
                              setSelectedStaus({
                                orderId: orderDetails?._id,
                                status,
                              });
                              confirmStatusUpdateModalRef.current.checked = true;
                            }}
                            disabled={isUpdateStatusLoading}
                            // onClick={() => {
                            //   updateOrderStatus({
                            //     orderId: orderDetails?._id,
                            //     status,
                            //   });
                            // }}
                            key={i}
                          >
                            <span
                              style={{
                                background: getCurruntStatusColor(
                                  status?.value
                                ),
                              }}
                              className={`badge text-white bg-${getCurruntStatusColor(
                                status?.value
                              )} hover:badge-outline font-semibold hover:text-white`}
                            >
                              {status?.label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2">
                  <h1 className="font-semibold dark:text-gray-300 text-sm">
                    Order Created
                  </h1>
                  <h2 className="text-sm font-semibold dark:text-gray-400">
                    {moment(orderDetails?.createdAt).format('Do MMM YYYY')}
                  </h2>
                </div>

                <div className="flex justify-between items-center py-2">
                  <h1 className="font-semibold dark:text-gray-300 text-sm">
                    Order Time
                  </h1>
                  <h2 className="text-sm font-semibold dark:text-gray-400">
                    {moment(orderDetails?.createdAt).format('h:mm A')}
                  </h2>
                </div>

                <div className="flex justify-between items-center py-2">
                  <h1 className="font-semibold dark:text-gray-300 text-sm">
                    Subtotal
                  </h1>
                  <h2 className="text-sm font-semibold dark:text-gray-400">
                    ₹{orderDetails?.total_cost}
                  </h2>
                </div>

                <div className="flex justify-between items-center py-2">
                  <h1 className="font-semibold dark:text-gray-300 text-sm">
                    Delivery Fee
                  </h1>
                  <h2 className="text-sm font-semibold dark:text-gray-400">
                    ₹0.00
                  </h2>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500 flex items-center justify-between">
                <h1 className="font-semibold dark:text-gray-300 ">Total</h1>
                <h2 className="font-semibold dark:text-white underline">
                  ₹{orderDetails?.total_cost}/-
                </h2>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  openOrderDtailsUpdateModal('Delivery Address Details');
                }}
                className="border rounded-lg p-6 pb-3 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500 relative"
              >
                {/* Toggle Edit */}
                {user?.role === 'admin' && (
                  <label
                    type="button"
                    onClick={() =>
                      setIsEditModeOn({
                        ...isEditModeOn,
                        deliveryAddress: true,
                      })
                    }
                    className="btn btn-sm btn-circle absolute top-2 right-2"
                  >
                    <BsFillPencilFill />
                  </label>
                )}

                <h1 className="font-semibold py-2 text-lg dark:text-gray-200">
                  Delivery Address
                </h1>

                <div className="flex justify-between items-center py-2 relative">
                  <h1 className="font-semibold dark:text-gray-300 text-sm">
                    Place / City
                  </h1>
                  {!isEditModeOn.deliveryAddress || user?.role !== 'admin' ? (
                    <h2 className="text-sm font-semibold dark:text-gray-400 max-w-[50%] w-full">
                      {orderDetails?.buyersPlace}
                    </h2>
                  ) : (
                    <input
                      disabled={
                        !isEditModeOn.deliveryAddress || user?.role !== 'admin'
                      }
                      type="text"
                      value={orderDetails?.buyersPlace}
                      onChange={(e) => {
                        setOrderDetails({
                          ...orderDetails,
                          buyersPlace: e.target.value,
                        });
                      }}
                      required
                      className="input w-[50%] lg:w-[70%] input-sm"
                    />
                  )}
                </div>

                <div className="flex justify-between items-center py-2 relative">
                  <h1 className="font-semibold dark:text-gray-300 text-sm">
                    Address
                  </h1>

                  {!isEditModeOn.deliveryAddress || user?.role !== 'admin' ? (
                    <h2 className="text-sm font-semibold dark:text-gray-400 max-w-[50%] w-full">
                      {orderDetails?.buyersAddress}
                    </h2>
                  ) : (
                    <textarea
                      disabled={
                        !isEditModeOn.deliveryAddress || user?.role !== 'admin'
                      }
                      type="text"
                      value={orderDetails?.buyersAddress}
                      onChange={(e) => {
                        setOrderDetails({
                          ...orderDetails,
                          buyersAddress: e.target.value,
                        });
                      }}
                      required
                      className="input w-[50%] lg:w-[70%] input-sm h-max"
                    />
                  )}
                </div>
                {isEditModeOn.deliveryAddress && (
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        refetchOrderDetails(),
                          setIsEditModeOn({
                            ...isEditModeOn,
                            deliveryAddress: false,
                          });
                      }}
                      className="btn btn-sm btn-error"
                    >
                      cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateOrderDetailsIsLoading}
                      className={`btn btn-sm btn-success ${
                        updateOrderDetailsIsLoading && 'loading'
                      }`}
                    >
                      save
                    </button>
                  </div>
                )}
              </form>

              <div className="border rounded-lg p-6 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500 pb-0">
                <h1 className="font-semibold py-2 text-lg dark:text-gray-200">
                  Status Log's
                </h1>

                <div className=" max-h-[300px] overflow-auto">
                  {orderDetails?.status
                    ?.map((item, i) => {
                      return (
                        <div
                          key={i}
                          className="p-4 flex flex-col justify-between bg-gray-200 dark:bg-gray-600 rounded-lg relative h-max my-2"
                        >
                          <h1 className="font-semibold dark:text-gray-300 text-sm">
                            Status:{' '}
                            <span
                              style={{
                                background: getCurruntStatusColor(item?.status),
                              }}
                              className={`badge border-gray-600 text-white bg-${getCurruntStatusColor(
                                item?.status
                              )} `}
                            >
                              {item?.status}
                            </span>
                          </h1>
                          <h2 className="text-sm font-semibold dark:text-gray-300 my-1">
                            Updated At:{' '}
                            {moment(item?.createdAt).format(
                              'Do MMM YYYY, h:mm A'
                            )}
                          </h2>

                          <h3 className="text-xs font-bold dark:text-gray-400 absolute bottom-1 right-2">
                            {item?.updatedBy}
                          </h3>
                        </div>
                      );
                    })
                    ?.reverse()}
                </div>
              </div>
            </div>
          </div>

          <input
            ref={confirmStatusUpdateModalRef}
            type="checkbox"
            id="my-modal"
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Update Order Status</h3>
              <p className="py-4">
                Are Your sure you want to change currunt Order status from{' '}
                <span className="underline decoration-red-500 font-bold text-gray-900 dark:text-white">
                  {
                    orderDetails?.status[orderDetails?.status?.length - 1]
                      ?.status
                  }
                </span>
                {'   '} to {'  '}
                <span className="underline decoration-red-500 font-bold text-gray-900 dark:text-white">
                  {selectedStatus?.status?.value}
                </span>
              </p>
              <div className="modal-action">
                <label
                  onClick={() => closeUpdatedStatusHandler()}
                  className="btn bg-red-600 text-white hover:bg-red-500 border-0"
                >
                  Cancel
                </label>
                <label
                  onClick={() => {
                    updateOrderStatus(selectedStatus);
                  }}
                  htmlFor="my-modal"
                  className="btn bg-blue-600 text-white hover:bg-blue-500 border-0"
                >
                  Confirm
                </label>
              </div>
            </div>
          </div>

          <input
            ref={confirmOrderDtailsUpdateModalRef}
            type="checkbox"
            id="updateOrderDetailsModal"
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Update</h3>
              <p className="py-4">
                Are Your sure you want to change{' '}
                <span className="text-gray-900 dark:text-white font-bold">
                  "{orderDetailsModal?.message}"
                </span>
              </p>
              <div className="modal-action">
                <label
                  htmlFor="updateOrderDetailsModal"
                  onClick={() => {
                    setOrderDetailsModal({});
                  }}
                  className="btn bg-red-600 text-white hover:bg-red-500 border-0"
                >
                  Cancel
                </label>
                <label
                  onClick={() => {
                    updateOrderDetails();
                  }}
                  htmlFor="updateOrderDetailsModal"
                  className="btn bg-blue-600 text-white hover:bg-blue-500 border-0"
                >
                  Confirm
                </label>
              </div>
            </div>
          </div>

          <input
            ref={confirmDeleteInvoiceImageRef}
            type="checkbox"
            id="deleteInvoiceImage"
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Delete Invoice Image</h3>
              <p className="py-4">
                Are Your sure you want to Delete Invoice Image?
              </p>
              <div className="modal-action">
                <label
                  htmlFor="deleteInvoiceImage"
                  onClick={() => {
                    setDeleteImageId(null);
                  }}
                  className="btn bg-red-600 text-white hover:bg-red-500 border-0"
                >
                  Cancel
                </label>
                <label
                  onClick={() => {
                    user?.role === 'admin' && deleteImage(deleteImageId);
                  }}
                  htmlFor="deleteInvoiceImage"
                  className="btn bg-blue-600 text-white hover:bg-blue-500 border-0"
                >
                  Confirm
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderDetails;
