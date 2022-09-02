import React, { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { useParams } from 'react-router-dom';
import * as FileSaver from 'file-saver';
// import { Header } from '../../../components';
import { useInfiniteQuery, useMutation, useQuery } from 'react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import emptyImage from '../../assets/empty.jpg';
import { userRequest } from '../../requestMethods';
import { useStateContext } from '../../contexts/ContextProvider';
import { Header } from '../../components';
import { addAndRemoveOrder } from '../../Reducers/OrdersSlice';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../components/shared/spinner/Spinner';
const Products = () => {
  const { category_name, id } = useParams();
  const { currentColor } = useStateContext();
  const dispatch = useDispatch();
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
  const formModelRef = useRef();
  const [deleteConfirmation, setDeleteConfirmation] = React.useState('');
  const deleteConfirmationRef = React.useRef();
  const uploadFileBtnRef = React.useRef();

  //? get full products Collection data

  // const {
  //   isLoading: productsLoading,
  //   error: productError,
  //   data: productList,
  //   isFetching,
  //   refetch: productRefetch,
  // } = useQuery('productList', () => userRequest.get('/product'));

  const [productFormData, setProductFormData] = React.useState({
    product_name: '',
    product_desc: '',
    slug: '',
    category: `${id}`,
    price_wholesale: null,
    price_retail: null,
    mrp: null,
    _id: '',
  });

  const resetFormData = () => {
    setProductFormData({
      product_name: '',
      product_desc: '',
      slug: '',
      category: `${id}`,
      price_wholesale: null,
      price_retail: null,
      mrp: null,
      _id: '',
    });
  };

  // const [pageLimit, setPageLimit] = useState(15);
  const [searchQuery, setSearchQuery] = useState('');

  const GetPaginationApi = async ({ pageParam = 1 }) => {
    const data = await userRequest.get(
      `/product/getPagination?categoryId=${id}&page=${pageParam}&limit=${15}&search=${searchQuery}`
    );
    return data;
  };

  const {
    data: infiniteProducts,
    error,
    fetchNextPage,
    refetch: refetchInfiniteProducts,
    hasNextPage,
    isLoading: isLoadingInfiniteProducts,
    isFetching: productsIsFetching,
    isFetchingNextPage,
    remove: removeInfiniteProducts,
  } = useInfiniteQuery(['infiniteProducts'], GetPaginationApi, {
    getNextPageParam: (page) => {
      return page.data.hasNext ? page.data.curruntPage + 1 : undefined;
    },
  });

  useEffect(() => {
    return () => {
      removeInfiniteProducts();
    };
  }, []);

  const addSingleProductApi = async (data) => {
    return await userRequest.post('/product/create', {
      product_name: data.product_name,
      product_desc: data.product_desc,
      slug: data.slug,
      category: data.category,
      price_wholesale: data.price_wholesale,
      price_retail: data.price_retail,
      mrp: data.mrp,
    });
  };
  const {
    mutateAsync: addSingleProduct,
    isLoading: addSingleProductIsLoading,
  } = useMutation(addSingleProductApi, {
    onSuccess: () => {
      refetchInfiniteProducts();
      // refetchProducts();
      formModelRef.current.checked = false;
      notifysucc('addedSuccessfully', 'Product Added Successfully');
      resetFormData();
    },
    onError: ({ response }) => {
      console.log('error', response.data.message);
      toast.error(response.data.message);
    },
  });

  const updateProductApi = async (data) => {
    return await userRequest.put(`/product/${data._id}`, {
      product_name: data.product_name,
      product_desc: data.product_desc,
      slug: data.slug,
      category: data.category,
      price_wholesale: data.price_wholesale,
      price_retail: data.price_retail,
      mrp: data.mrp,
    });
  };
  const {
    mutateAsync: updateSingleProduct,
    isLoading: updateSingleProductIsLoading,
  } = useMutation(updateProductApi, {
    onSuccess: () => {
      refetchInfiniteProducts();
      // refetchProducts();
      formModelRef.current.checked = false;
      notifysucc('updatedSuccessfully', 'Product Updated Successfully');
      resetFormData();
    },
    onError: ({ response }) => {
      console.log('error', response.data.message);
    },
  });

  const addSingleProductHandler = (e) => {
    e.preventDefault();
    addSingleProduct(productFormData);
  };

  const updateSingleProductHandler = (e) => {
    e.preventDefault();
    updateSingleProduct(productFormData);
  };

  const deleteSingleProductApi = async (id) => {
    return await userRequest.delete(`/product/${id}`);
  };

  const {
    mutateAsync: deleteSingleProduct,
    isLoading: deleteProductIsLoading,
  } = useMutation(deleteSingleProductApi, {
    onSuccess: () => {
      // refetchProducts();
      refetchInfiniteProducts();
      // formModelRef.current.checked = false;
      notifysucc('deleteSuccess', 'Product Deleted Successfully');
      deleteConfirmationRef.current.checked = false;
    },
    onError: ({ response }) => {
      console.log('error', response.data.message);
    },
  });

  const addBulkProductsApi = async (products) => {
    return await userRequest.post('/product/createBulk', products);
  };

  const { mutateAsync: addBulkProducts, isLoading: uploadProductsIsLoading } =
    useMutation(addBulkProductsApi, {
      onSuccess: () => {
        refetchInfiniteProducts();
        // refetchProducts();
        formModelRef.current.checked = false;
        notifysucc('AddBulkSuccess', "Product's Added Successfully");
        uploadFileBtnRef.current.value = null;
      },
      onError: (res) => {
        uploadFileBtnRef.current.value = null;
        console.log('Bulk Error ===>', res.data.message);
      },
    });

  const fileType = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];

  const exportToCSV = (productData) => {
    const product1 = XLSX.utils.json_to_sheet(productData);

    const wb = {
      Sheets: { product: product1 },
      SheetNames: ['product'],
    };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, `${category_name}-productList.xlsx`);
  };

  const getProductsByCategoryApi = async (id) => {
    return await userRequest.get(`/product/productsByCategory/${id}`);
  };

  const {
    mutateAsync: getAllProductsByCatId,
    isLoading: allProductsByCatIdIsLoading,
  } = useMutation(() => getProductsByCategoryApi(id), {
    onSuccess: (res) => {
      exportToCSV(res.data);
    },
  });

  const handleFormData = (e) => {
    setProductFormData({ ...productFormData, [e.target.name]: e.target.value });
  };

  const formOptions = [
    {
      name: 'product_name',
      label: 'Product Name',
      type: 'text',
      placeholder: 'Enter Product Name',
      value: productFormData.product_name,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      placeholder: 'Enter Slug',
      value: productFormData.slug,
    },
    // {
    //   name: 'subcategory',
    //   label: 'Subcategory',
    //   type: 'text',
    //   placeholder: 'Enter Subcategory',
    //   value: productFormData.subcategory,
    // },
    // {
    //   name: 'category',
    //   label: 'Category',
    //   type: 'text',
    //   placeholder: 'Enter Category',
    //   value: productFormData.category,
    // },
    // {
    //   name: 'attributes',
    //   label: 'Attributes',
    //   type: 'text',
    //   placeholder: 'Enter Attributes',
    //   value: productFormData.attributes,
    // },
    {
      name: 'price_wholesale',
      label: 'Price Wholesale',
      type: 'number',
      placeholder: 'Enter Price Wholesale',
      value: productFormData.price_wholesale,
    },
    {
      name: 'price_retail',
      label: 'Price Retail',
      type: 'number',
      placeholder: 'Enter Price Retail',
      value: productFormData.price_retail,
    },
    {
      name: 'mrp',
      label: 'MRP',
      type: 'number',
      placeholder: 'Enter MRP',
      value: productFormData.mrp,
    },
    // {
    //   name: 'product_desc',
    //   label: 'Product Description',
    //   type: 'textarea',
    //   placeholder: 'Enter Product Description',
    //   value: productFormData.product_desc,
    // },
  ];

  const handleFile = (f) => {
    f.preventDefault();
    const file = f.target.files[0];
    // setfilename(file.name);

    if (file) {
      if (file && fileType.includes(file.type)) {
        const promise = new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsArrayBuffer(file);

          fileReader.onload = (e) => {
            const bufferArray = e.target.result;

            const wb = XLSX.read(bufferArray, { type: 'buffer' });

            const wsname = wb.SheetNames[0];

            const ws = wb.Sheets[wsname];

            const data = XLSX.utils.sheet_to_json(ws);

            resolve(data);
          };

          fileReader.onerror = (error) => {
            reject(error);
          };
        });
        promise.then((d) => {
          console.log(d);
          // const arr = d.map((e) => e.product_name);
          // let unique = arr.filter((item, i, ar) => ar.indexOf(item) === i);
          const dataCsv = [];
          d.map((da) => {
            const obj = {
              _id: da._id,
              product_name: da.product_name,
              product_desc: da.product_desc,
              slug: da.slug,
              // imageLink: da.imageLink,
              category: `${id}`,
              attributes: da.attributes,
              price_wholesale: da.price_wholesale.toFixed(2),
              price_retail: da.price_retail.toFixed(2),
              mrp: da.mrp.toFixed(2),
            };
            const arrtri = [{}];
            for (const key of Object.keys(da)) {
              if (
                key !== '_id' &&
                key != 'product_name' &&
                key != 'product_desc' &&
                key != 'slug' &&
                // key != 'imageLink' &&
                key != 'category' &&
                key != 'attributes' &&
                key != 'price_wholesale' &&
                key != 'price_retail' &&
                key != 'mrp'
              ) {
                arrtri.push({ name: key, value: da[key] });
              }
              // if(key == 'name'){
              //   arrtri.push({ "name": 'product_name', "value": da[key] })
              // }
            }
            // obj['attributes'] = arrtri;
            arrtri.shift();
            obj['attributes'] = arrtri;

            dataCsv.push(obj);
            // }
          });
          // console.log('excel To JSON ====>', dataCsv);
          addBulkProducts(dataCsv);
          return;
        });
      } else {
        uploadFileBtnRef.current.value = null;
        notifyerorr('uploadError', 'Please Select Excel File');
      }
    } else {
      uploadFileBtnRef.current.value = null;
      notifyerorr('fileNotSelected', 'Please select a file');
    }
  };

  // const GetPaginationApi = async (page, pageLimit, searchQuery) => {
  //   return await userRequest.get(
  //     `/product/getPagination?categoryId=${id}&page=${page}&limit=${pageLimit}&search=${searchQuery}`
  //   );
  // };

  // const {
  //   isLoading,
  //   isError,
  //   error,
  //   data: paginatedProducts,
  //   isFetching,
  //   isPreviousData,
  // } = useQuery(
  //   ['projects', page, pageLimit, searchQuery],
  //   () => GetPaginationApi(page, pageLimit, searchQuery),
  //   {
  //     keepPreviousData: true,
  //   }
  // );

  const divRef = React.useRef();
  const tableRef = React.useRef();

  const handleScroll = (e) => {
    const scrollTopValue = e.target.scrollTop;
    const innerHeight = divRef.current.clientHeight;
    const offsetHeight = tableRef.current.offsetHeight;

    // console.log(Math.ceil(scrollTopValue) + innerHeight, offsetHeight);

    if (innerHeight + Math.ceil(scrollTopValue) >= offsetHeight) {
      // console.log(
      //   ' Reached at bottom ====>',
      //   innerHeight + Math.ceil(scrollTopValue) === offsetHeight
      // );
      // setPage(page + 1);

      fetchNextPage();
    }
  };

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

  // console.log(infiniteProducts?.pages[0].data);

  const searchHandler = (e) => {
    e.preventDefault();
    // if (e.target.value === '') {
    //   refetchInfiniteProducts();
    // }
    refetchInfiniteProducts();
  };

  React.useEffect(() => {
    if (searchQuery === '') {
      refetchInfiniteProducts();
    }
  }, [searchQuery]);

  const handleCheckbox = (e, item) => {
    // const { name, checked } = e.target;
    // const order = {
    //   product: item,
    // };
    // order['qyt'] = 1;
    // if (checked) {
    //   setOrders([...orders, order]);
    // } else {
    //   setOrders(orders.filter((e) => e._id !== item._id));
    // }
    const product = {
      ...item,
      product_category: category_name,
    };

    dispatch(addAndRemoveOrder(product));
  };
  const { orders } = useSelector((state) => state.ordersState);
  const user = useSelector((state) => state.user.currentUser.user);

  // React.useEffect(() => {
  //   console.log(orders);
  // }, [orders]);
  return (
    <div className="container mx-auto relative overflow-hidden px-6">
      <ToastContainer />
      <div className="w-full flex justify-between items-center ">
        <Header category="Products" title={category_name} />
        <form
          onSubmit={(e) => {
            searchHandler(e);
          }}
          className="w-1/2 mx-2"
        >
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
          >
            Search
          </label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none ">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
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
            <input
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              type="search"
              id="default-search"
              className="block p-3 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Products"
            />
            <button
              type="submit"
              style={{
                background: currentColor,
              }}
              className="text-white absolute right-2 bottom-[5px] focus:ring-4 focus:outline-none hover:bg-light-gray font-medium rounded-lg text-sm px-3 py-2"
            >
              Search
            </button>
          </div>
        </form>

        {user?.role == 'admin' && (
          <>
            <div className="h-max relative max-w-[230px]">
              <p className="block text-sm font-medium text-gray-900 dark:text-gray-300 absolute -top-6">
                {!uploadProductsIsLoading ? (
                  'Upload excel sheet'
                ) : (
                  <button className="btn loading no-animation bg-inherit border-0 p-0 m-0 text-gray-900 dark:text-gray-300 btn-sm -mt-2 max-w-max max-h-max">
                    Uploading File...
                  </button>
                )}
              </p>
              <input
                onChange={(e) => handleFile(e)}
                type="file"
                disabled={uploadProductsIsLoading}
                className="block w-max text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1a97f5] file:text-gray-200 hover:file:bg-[#0173ca] hover:cursor-pointer "
                ref={uploadFileBtnRef}
              />
            </div>

            <button
              onClick={getAllProductsByCatId}
              style={{
                background: currentColor,
              }}
              disabled={allProductsByCatIdIsLoading}
              type="button"
              className={`text-white bg-[${currentColor}] btn border-0 mx-2 btn-sm ${
                allProductsByCatIdIsLoading && 'loading'
              } `}
            >
              <svg className="fill-current w-4 h-4 mr-2" viewBox="0 0 20 20">
                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
              </svg>
              <span>Download</span>
            </button>

            <label
              htmlFor="my-modal-3"
              style={{
                background: currentColor,
              }}
              className="btn border-0 text-white mx-2 btn-sm "
            >
              Add Product
            </label>
          </>
        )}
      </div>

      {/* -----------FormModelStart----------- */}
      <input
        ref={formModelRef}
        type="checkbox"
        id="my-modal-3"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={resetFormData}
          >
            ✕
          </label>
          <h1 className=" text-lg font-semibold">
            {productFormData._id ? 'Update Product' : 'Create Product'}
          </h1>
          <form
            onSubmit={
              productFormData._id
                ? updateSingleProductHandler
                : addSingleProductHandler
            }
            className="card-body"
          >
            {formOptions.map((item, index) => (
              <div key={index} className="form-control">
                <label className="label">
                  <span className="label-text">{item.label}</span>
                </label>
                <input
                  name={item.name}
                  onChange={(e) => handleFormData(e)}
                  type={item.type ? item.type : 'text'}
                  placeholder={item.placeholder}
                  className="input input-bordered"
                  value={productFormData[item.name] || ''}
                />
              </div>
            ))}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                value={productFormData.product_desc}
                name="product_desc"
                className="textarea textarea-bordered"
                placeholder="Enter Product Description"
                onChange={(e) => handleFormData(e)}
              />
            </div>
            <div className="mt-6 flex justify-between ">
              <label
                htmlFor="my-modal-3"
                className="btn modal-button w-[48%] text-white border-0 bg-red-600 hover:bg-red-700"
                onClick={(e) => {
                  e.preventDefault();
                  formModelRef.current.checked = false;
                  resetFormData();
                }}
                disabled={updateSingleProductIsLoading}
              >
                Cancel
              </label>
              <button
                disabled={
                  addSingleProductIsLoading || updateSingleProductIsLoading
                }
                type="submit"
                className={`btn btn-primary w-[48%] ${
                  (addSingleProductIsLoading && 'loading') ||
                  (updateSingleProductIsLoading && 'loading')
                }`}
              >
                {productFormData._id ? 'Update' : 'submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* -----------FormModelEnd----------- */}

      {/* -------------Delete Confirmation Model-Start------------- */}

      <input
        ref={deleteConfirmationRef}
        type="checkbox"
        id="my-modal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Delete Product</h3>
          <p className="py-4">
            Product Name: {deleteConfirmation.product_name}
          </p>
          <div className="modal-action">
            <label
              onClick={() => setDeleteConfirmation('')}
              htmlFor="my-modal"
              className="btn bg-red-600 text-white hover:bg-red-500 border-0"
            >
              Cancel
            </label>
            <label
              onClick={(e) => {
                e.preventDefault();
                deleteConfirmation &&
                  deleteSingleProduct(deleteConfirmation._id);
              }}
              htmlFor="my-modal"
              className="btn bg-blue-600 text-white hover:bg-blue-500 border-0"
            >
              Confirm
            </label>
          </div>
        </div>
      </div>
      {/* -------------Delete Confirmation Model-End------------- */}

      {isLoadingInfiniteProducts ? (
        <div className="flex justify-center items-center w-full h-[70vh]">
          <Spinner />
        </div>
      ) : (
        <>
          <h1 className="">
            <span className="font-bold">Total Items Found: </span>
            {infiniteProducts?.pages[0]?.data?.totalDocuments}
          </h1>

          <div
            ref={divRef}
            onScrollCapture={(e) => handleScroll(e)}
            className="max-h-[650px] overflow-auto rounded-lg"
          >
            <table ref={tableRef} className="table w-full">
              <thead className="sticky top-0 left-0">
                <tr>
                  <th></th>
                  <th>Product Name</th>
                  <th>Wholesale</th>
                  <th>Retail</th>
                  <th>Mrp</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {infiniteProducts?.pages?.length > 0 &&
                  infiniteProducts?.pages?.map(
                    (page, i) =>
                      page?.data?.itemList?.length > 0 &&
                      page?.data?.itemList?.map((item, index) => (
                        <tr key={item._id}>
                          <td>
                            <label>
                              <input
                                type="checkbox"
                                checked={
                                  orders?.findIndex(
                                    (odr) => odr?.product?._id === item?._id
                                  ) !== -1
                                    ? true
                                    : false
                                }
                                onChange={(e) => handleCheckbox(e, item)}
                                value={item}
                                style={{
                                  borderColor: currentColor,
                                }}
                                className="checkbox checkbox-accent border-gray-300 border-2 cursor-pointer "
                              />
                            </label>
                          </td>
                          <th>{item.product_name}</th>
                          <td>₹{item.price_wholesale}/-</td>
                          <td>₹{item.price_retail}/-</td>
                          <td>₹{item.mrp}/-</td>
                          <td>
                            <div className="flex justify-end">
                              {user?.role === 'admin' && (
                                <label
                                  htmlFor="my-modal-3"
                                  onClick={(e) => {
                                    setProductFormData({
                                      product_name: item?.product_name,
                                      product_desc: item?.product_desc,
                                      slug: item?.slug,
                                      price_wholesale: item?.price_wholesale,
                                      price_retail: item?.price_retail,
                                      mrp: item?.mrp,
                                      _id: item?._id,
                                    });
                                    // e.preventDefault();
                                    // setDeleteConfirmation(item);
                                  }}
                                  className={`flex items-center w-max btn btn-sm modal-button bg-gray-800 text-blue-500 shadow-lg mx-2 ${
                                    updateSingleProductIsLoading && 'loading'
                                  }`}
                                >
                                  {!updateSingleProductIsLoading && 'Update '}
                                  &nbsp;
                                  {!updateSingleProductIsLoading && <FiEdit />}
                                </label>
                              )}
                              {user?.role == 'admin' && (
                                <label
                                  htmlFor="my-modal"
                                  onClick={(e) => {
                                    // e.preventDefault();
                                    setDeleteConfirmation(item);
                                  }}
                                  className={`flex items-center w-max btn btn-sm modal-button bg-gray-800 text-red-500 shadow-lg mx-2 ${
                                    deleteProductIsLoading &&
                                    deleteConfirmation?._id === item?._id &&
                                    'loading'
                                  }`}
                                >
                                  &nbsp;
                                  {deleteProductIsLoading &&
                                  deleteConfirmation?._id ===
                                    item?._id ? null : (
                                    <span className="flex">
                                      Delete &nbsp;
                                      <FiTrash2 />
                                    </span>
                                  )}
                                </label>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                {productsIsFetching && hasNextPage && LoadingCards}
              </tbody>
            </table>
          </div>
        </>
      )}
      {!hasNextPage &&
        !productsIsFetching &&
        (infiniteProducts?.pages[0]?.data.itemList.length > 1 ? (
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
                <span>You have Scrolled through all the data!</span>
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
                <span>!Items Not Found</span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
export default Products;

// <div ref={tableRef} className="flex flex-wrap mx-auto p-6 gap-4">
//   {/* {products ? ( */}
//   {infiniteProducts?.pages?.length > 0 &&
//     infiniteProducts?.pages?.map(
//       (page, i) =>
//         page?.data?.itemList?.length > 0 &&
//         page?.data?.itemList?.map((item, index) => (
//           <div
//             key={item._id}
//             className="w-[200px] flex-grow flex-shrink bg-gray-100 dark:bg-gray-700 group rounded-lg overflow-hidden relative border-1 dark:border-gray-600 hover:shadow-lg transition-all duration-200"
//           >

//             <input
//               type="checkbox"
//               checked={
//                 orders?.findIndex((odr) => odr?.product?._id === item?._id) !==
//                 -1
//                   ? true
//                   : false
//               }
//               onChange={(e) => handleCheckbox(e, item)}
//               value={item}
//               style={{
//                 borderColor: currentColor,
//               }}
//               className="checkbox absolute top-2 left-2 z-10 checkbox-accent border-gray-300 border-2 m-2 cursor-pointer p-3"
//             />
//             <label
//               htmlFor="my-modal"
//               onClick={(e) => {
//                 // e.preventDefault();
//                 setDeleteConfirmation(item);
//               }}
//               className={`z-10 flex btn btn-circle modal-button bg-gray-800 text-red-500 text-lg shadow-lg absolute top-2 right-2 ${
//                 deleteProductIsLoading && 'loading'
//               }`}
//             >
//               {!deleteProductIsLoading && <FiTrash2 />}
//             </label>
//             <div className="mx-auto overflow-hidden ">
//               <img
//                 className="max-h-[200px] w-full object-cover group-hover:scale-[120%] transition duration-200 ease-out"
//                 src={item.imageLink}
//                 alt={item.product_name}
//               />
//             </div>
//             <div className="flex flex-col justify-center p-2 border-t-1 dark:border-gray-200 dark:text-gray-100 text-gray-800 relative">
//               <h3 className="font-semibold truncate w-full">
//                 {item.product_name}
//               </h3>
//               <h3 className="text-sm">Wholesale: {item.price_wholesale}</h3>
//               <h3 className=" text-sm">Retail: {item.price_retail}</h3>
//               <h3 className=" text-sm">
//                 Mrp: {item.mrp}{' '}
//               </h3>
//             </div>
//           </div>
//         ))
//     )}
//   {productsIsFetching && hasNextPage && LoadingCards}
//   {/* Dummy Cards */}
//   <div className="w-[200px] h-[1px] flex-grow opacity-0" />
//   <div className="w-[200px] h-[1px] flex-grow opacity-0" />
//   <div className="w-[200px] h-[1px] flex-grow opacity-0" />
//   <div className="w-[200px] h-[1px] flex-grow opacity-0" />
//   <div className="w-[200px] h-[1px] flex-grow opacity-0" />
//   {!hasNextPage &&
//     !productsIsFetching &&
//     (infiniteProducts?.pages[0]?.data.itemList.length > 1 ? (
//       <div className="flex justify-center h-max w-full">
//         <div className="alert alert-success shadow-lg w-max ">
//           <div>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="stroke-current flex-shrink-0 h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             <span>You have Scrolled through all the data!</span>
//           </div>
//         </div>
//       </div>
//     ) : (
//       <div className="flex justify-center h-max w-full">
//         <div className="alert alert-info shadow-lg w-max">
//           <div>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               className="stroke-current flex-shrink-0 w-6 h-6"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               ></path>
//             </svg>
//             <span>!Items Not Found</span>
//           </div>
//         </div>
//       </div>
//     ))}
// </div>;
