import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Link, useNavigate } from "react-router-dom";
import * as FileSaver from "file-saver";
import { Header } from "../components";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userRequest } from "../requestMethods";
import emptyImage from "../assets/empty.jpg";
import { useSelector } from "react-redux";
import { useStateContext } from "../contexts/ContextProvider";
import Spinner from "../components/shared/spinner/Spinner";
import { AiFillLock } from "react-icons/ai";

const Categories = () => {
  const [deleteConfirmation, setDeleteConfirmation] = React.useState("");
  const [password, setPassword] = useState("");
  const [categoriesFormData, setCategoriesFormData] = React.useState({
    name: "",
    description: "",
    slug: "",
    imageLink: "",
    _id: "",
  });
  const { currentColor } = useStateContext();
  const deleteConfirmationRef = React.useRef();
  const categoryFormModelRef = useRef();
  const navigateToProfile = useNavigate();
  const notifyerorr = (id, msg) => {
    toast.error(`${msg}!`, {
      position: toast.POSITION.TOP_RIGHT,
      toastId: id,
    });
  };
  const notifysucc = (id, msg) => {
    toast.success(`${msg}!`, {
      position: toast.POSITION.TOP_RIGHT,
      toastId: id,
    });
  };
  const notifyWarn = (id, msg) => {
    toast.warning(`${msg}!`, {
      position: toast.POSITION.TOP_CENTER,
      toastId: id,
    });
  };
  const user = useSelector((state) => state.user.currentUser.user);
  const resetFormData = () => {
    setCategoriesFormData({
      name: "",
      description: "",
      slug: "",
      imageLink: "",
      _id: "",
    });
  };

  const addCategoryApiCall = async (data) => {
    return await userRequest.post("/category", data);
  };

  const { mutateAsync: addCategory, isLoading: addCategoryIsLoading } =
    useMutation(addCategoryApiCall, {
      onSuccess: () => {
        notifysucc("addCategorySuccess", "Category Added Successfully");
        refetchInfiniteCategories();
        // categoryRefetch();
        categoryFormModelRef.current.checked = false;
        resetFormData();
      },
    });

  const updateCategoryApiCall = async (data) => {
    return await userRequest.put(`/category/${data._id}`, {
      name: data.name,
      description: data.description,
      slug: data.slug,
      imageLink: data.imageLink,
    });
  };

  const { mutateAsync: updateCategory, isLoading: updateCategoryIsLoading } =
    useMutation(updateCategoryApiCall, {
      onSuccess: () => {
        notifysucc("updateCategorySuccess", "Category Updated Successfully");
        refetchInfiniteCategories();
        // categoryRefetch();
        categoryFormModelRef.current.checked = false;
        resetFormData();
      },
    });

  const [pageLimit, setPageLimit] = useState(15);
  const [searchQuery, setSearchQuery] = useState("");
  const divRef = useRef();
  const tableRef = useRef();
  const uploadFileBtnRef = useRef();

  const GetPaginationApi = async ({ pageParam = 1 }) => {
    const data = await userRequest.get(
      `/category/getPagination?&page=${pageParam}&limit=${pageLimit}&search=${searchQuery}`
    );
    return data;
  };

  //Locked Categories for wholeseller api
  const lockedCategories = async ({ pageParam = 1 }) => {
    const data = await userRequest.get(
      `/category/lockedcategories?&page=${pageParam}&limit=${pageLimit}&search=${searchQuery}`
    );
    return data;
  };

  const {
    data: infiniteCategories,
    error,
    fetchNextPage,
    refetch: refetchInfiniteCategories,
    hasNextPage,
    isLoading: isLoadingInfiniteCategories,
    isFetching: InfiniteCategoriesIsFetching,
  } = useInfiniteQuery(["infiniteCategories"], GetPaginationApi, {
    getNextPageParam: (page) => {
      return page.data.hasNext ? page.data.curruntPage + 1 : undefined;
    },
    onError: ({ response }) => {
      console.log("Pagination Error ==>", response.data);
      notifyerorr("PaginationError", response.data.message);
    },
  });

  // Locked Categories Infinite Scroll
  const {
    data: lockedInfiniteCategories,

    fetchNextPage: lockedFetchNext,
    refetch: lockedInfiniteCategoriesRefetch,
    hasNextPage: lockedHasNext,
    isLoading: lockedInfiniteCategoriesLoading,
    isFetching: lockedInfiniteCategoriesFetching,
  } = useInfiniteQuery(["lockedCategories"], lockedCategories, {
    getNextPageParam: (page) => {
      return page.data.hasNext ? page.data.curruntPage + 1 : undefined;
    },
    onError: ({ response }) => {
      console.log("Pagination Error ==>", response.data);
      notifyerorr("PaginationError", response.data.message);
    },
  });

  const handleScroll = (e) => {
    const scrollTopValue = e.target.scrollTop;
    const innerHeight = divRef.current.clientHeight;
    const offsetHeight = tableRef.current.offsetHeight;

    // console.log(Math.ceil(scrollTopValue) + innerHeight, offsetHeight);

    if (innerHeight + Math.ceil(scrollTopValue) >= offsetHeight) {
      console.log(
        " Reached at bottom ====>",
        innerHeight + Math.ceil(scrollTopValue) === offsetHeight
      );
      // setPage(page + 1);

      fetchNextPage();
    }
  };

  const temp = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const LoadingCards = temp.map((e) => {
    return (
      <div className="w-[200px] flex-grow flex-shrink bg-white group rounded-lg overflow-hidden relative">
        <div className="mx-auto overflow-hidden">
          <img
            className="max-h-[220px] w-full object-cover group-hover:scale-[120%] transition duration-200 ease-out"
            // src="https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
            src={emptyImage}
            alt="loading"
          />
        </div>
        <div className="flex flex-col p-2 h-[60%]">
          <span className=" h-5 w-1/2 my-2  bg-gray-300 rounded-md"></span>
          <span className=" h-5 w-3/4 my-2  bg-gray-300 rounded-md"></span>
          <span className=" h-5 w-full  my-2  bg-gray-300 rounded-md"></span>
          <span className=" h-5 w-full my-2  bg-gray-300 rounded-md"></span>
        </div>
      </div>
    );
  });

  const searchHandler = (e) => {
    e.preventDefault();
    // if (e.target.value === '') {
    //   refetchInfiniteProducts();
    // }
    refetchInfiniteCategories();
  };

  React.useEffect(() => {
    if (searchQuery === "") {
      refetchInfiniteCategories();
    }
  }, [searchQuery]);

  const {
    data: categoryData,
    isLoading: categoryIsLoading,
    refetch: categoryRefetch,
  } = useQuery(["categories"], () => userRequest.get("/category"));

  const deleteCategoryApiCall = async (data) => {
    return await userRequest.post(`/category/deleteOne`, data);
  };

  const {
    mutateAsync: deleteSingleCategory,
    isLoading: deleteCategoryIsLoading,
  } = useMutation(deleteCategoryApiCall, {
    onSuccess: () => {
      notifysucc("deleteCategorySuccess", "Category Deleted Successfully");
      deleteConfirmationRef.current.checked = false;
      refetchInfiniteCategories();
      // categoryRefetch();
      setPassword("");
      setDeleteConfirmation("");
      deleteConfirmationRef.current.checked = false;
      passwordConfirmationRef.current.checked = false;
    },
    onError: ({ response }) => {
      // setPassword('');
      // setDeleteConfirmation('');
      console.log("Delete Error ==>", response.data);
      // deleteConfirmationRef.current.checked = false;
      notifyerorr("DeleteError", response.data.message);
    },
  });

  const addBulkCategoryApiCall = async (data) => {
    return await userRequest.post("/category/upload", data);
  };
  const { mutateAsync: uploadExcel, isLoading: uploadCategoriesIsLoading } =
    useMutation(addBulkCategoryApiCall, {
      onSuccess: (res) => {
        if (res?.data?.warnings?.length > 0) {
          res?.data?.warnings?.map((e) => {
            notifyWarn("uploadExcelWarning", e);
          });
        }
        console.log("upload bulk success ==>", res);
        notifysucc("uploadExcelSuccess", "Category Uploaded Successfully");
        refetchInfiniteCategories();
        // categoryRefetch();
        uploadFileBtnRef.current.value = null;
      },
      onError: ({ response }) => {
        uploadFileBtnRef.current.value = null;
        console.log("Upload Error ==>", response.data);
        notifyerorr("uploadError", response.data.message);
      },
    });

  // Category Unlock

  const handleCategoryUnlock = () => {
    console.log("Clicked");
    navigateToProfile('/user-details');
  };
  const fileType = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];

  const exportToCSV = () => {
    const category1 = XLSX.utils.json_to_sheet(categoryData.data);

    const wb = {
      Sheets: { category: category1 },
      SheetNames: ["category"],
    };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "Category" + ".xlsx");
  };

  const handleFormData = (e) => {
    setCategoriesFormData({
      ...categoriesFormData,
      [e.target.name]: e.target.value,
    });
  };

  const submitCategoryFormHandler = (e) => {
    e.preventDefault();
    const { name, description, slug, imageLink } = categoriesFormData;
    const data = { name, description, slug, imageLink };
    addCategory(data);
  };

  const updateCategoryFormHandler = (e) => {
    e.preventDefault();
    updateCategory(categoriesFormData);
  };

  const formOptions = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter Category Name",
      value: categoriesFormData.category_name,
    },

    {
      name: "slug",
      label: "Slug",
      type: "text",
      placeholder: "Enter Unique Slug",
      value: categoriesFormData.slug,
    },
    {
      name: "imageLink",
      label: "Image Link",
      type: "text",
      placeholder: "Enter Image Link",
      value: categoriesFormData.imageLink,
    },
  ];

  const handleFile = (f) => {
    f.preventDefault();
    const file = f.target.files[0];

    if (file) {
      if (file && fileType.includes(file.type)) {
        // setfilename(file.name);
        const promise = new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsArrayBuffer(file);

          fileReader.onload = (e) => {
            const bufferArray = e.target.result;

            const wb = XLSX.read(bufferArray, { type: "buffer" });

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
              name: da.name,
              description: da.description,
              slug: da.slug,
              imageLink: da.imageLink,
              metadata: da.attributes,
            };
            const arrtri = [{}];
            for (const key of Object.keys(da)) {
              if (
                key !== "_id" &&
                key != "name" &&
                key != "description" &&
                key != "slug" &&
                key != "imageLink" &&
                key != "metadata"
              ) {
                arrtri.push({ name: key, value: da[key] });
              }
              // if(key == 'name'){
              //   arrtri.push({ "name": 'product_name', "value": da[key] })
              // }
            }
            // obj['attributes'] = arrtri;
            arrtri.shift();
            obj["metadata"] = arrtri;

            dataCsv.push(obj);
          });
          console.log("excel To JSON ====>", dataCsv);
          uploadExcel(dataCsv);
          return;
        });
      } else {
        uploadFileBtnRef.current.value = null;
        notifyerorr("uploadError", "Please Select Excel File");
      }
    } else {
      uploadFileBtnRef.current.value = null;
      notifyerorr("fileNotSelected", "Please select a file");
    }
  };

  const passwordConfirmationRef = useRef(null);

  return (
    <div className="container mx-auto">
      <ToastContainer />
      <div className="w-full flex justify-between items-center px-6">
        <Header category="Page" title="Categories" />

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
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
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
              placeholder="Search Category"
            />
            <button
              type="submit"
              className="text-white absolute right-2 bottom-[5px] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>

        {user?.role == "admin" && (
          <>
            <div className="h-max relative max-w-[230px] ">
              <p className="block text-sm font-medium text-gray-900 dark:text-gray-300 absolute -top-6">
                {!uploadCategoriesIsLoading ? (
                  "Upload excel sheet"
                ) : (
                  <button className="btn loading no-animation bg-inherit border-0 p-0 m-0 text-gray-900 dark:text-gray-300 btn-sm -mt-2 max-w-max max-h-max">
                    Uploading File...
                  </button>
                )}
              </p>
              <input
                onChange={(e) => handleFile(e)}
                type="file"
                disabled={uploadCategoriesIsLoading}
                ref={uploadFileBtnRef}
                className="block text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1a97f5] file:text-gray-200 hover:file:bg-[#0173ca] hover:cursor-pointer"
              />
            </div>

            <button
              onClick={exportToCSV}
              style={{
                background: currentColor,
              }}
              type="button"
              className="text-white btn border-0 mx-2 btn-sm"
            >
              <svg className="fill-current w-4 h-4 mr-2" viewBox="0 0 20 20">
                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
              </svg>
              <span>Download</span>
            </button>
            <label
              style={{
                background: currentColor,
              }}
              htmlFor="my-modal-3"
              className="text-white btn border-0 mx-2 btn-sm"
            >
              Add Category
            </label>
          </>
        )}
      </div>
      {/* ----------Form Model Start---------- */}
      <input
        ref={categoryFormModelRef}
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

          <form
            onSubmit={
              categoriesFormData._id
                ? updateCategoryFormHandler
                : submitCategoryFormHandler
            }
          >
            <div className="card-body">
              {formOptions.map((item, index) => (
                <div key={index} className="form-control">
                  <label className="label">
                    <span className="label-text">{item.label}</span>
                  </label>
                  <input
                    name={item.name}
                    onChange={(e) => handleFormData(e)}
                    type={item.type ? item.type : "text"}
                    placeholder={item.placeholder}
                    className="input input-bordered"
                    value={categoriesFormData[item.name] || ""}
                  />
                </div>
              ))}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  value={categoriesFormData.description}
                  className="textarea textarea-bordered"
                  placeholder="Enter Product Description"
                  onChange={(e) => handleFormData(e)}
                />
              </div>
              <div className="mt-6 flex justify-between ">
                <label
                  onClick={resetFormData}
                  htmlFor="my-modal-3"
                  className="btn modal-button w-[48%] text-white border-0 bg-red-600 hover:bg-red-700"
                >
                  Cancel
                </label>
                <button
                  // onClick={submitCategoryFormHandler}
                  disabled={addCategoryIsLoading || updateCategoryIsLoading}
                  type="submit"
                  className={`btn btn-primary w-[48%] ${
                    (addCategoryIsLoading && "loading",
                    updateCategoryIsLoading && "loading")
                  }`}
                >
                  {categoriesFormData._id ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* ----------Form Model End---------- */}
      {/* -------------Delete Confirmation Model-Start------------- */}
      <input
        ref={deleteConfirmationRef}
        type="checkbox"
        id="my-modal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Delete Category</h3>
          <p className="py-4">
            All the products associated with category: "
            <span className=" capitalize underline decoration-red-500 text-red-500 font-semibold">
              {deleteConfirmation.name}
            </span>
            " will be deleted
          </p>
          <div className="modal-action">
            <label
              onClick={() => {
                setDeleteConfirmation("");
                setPassword("");
              }}
              htmlFor="my-modal"
              className="btn bg-red-600 text-white hover:bg-red-500 border-0"
            >
              Cancel
            </label>
            <label
              onClick={() => (passwordConfirmationRef.current.checked = true)}
              htmlFor="my-modal"
              className="btn bg-blue-600 text-white hover:bg-blue-500 border-0"
            >
              Confirm
            </label>
          </div>
        </div>
      </div>
      {/* <label htmlFor="password-model" className="btn modal-button">
        open modal
      </label> */}
      <input
        type="checkbox"
        ref={passwordConfirmationRef}
        id="password-model"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box ">
          <h3 className="font-bold text-lg">Enter Password</h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("deleted");
              deleteConfirmation &&
                deleteSingleCategory({
                  id: deleteConfirmation._id,
                  password: password,
                });
            }}
          >
            <div className="relative">
              <input
                type="password"
                placeholder="Enter Password"
                className="input input-bordered w-full my-2"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>

            <div className="modal-action">
              <label
                onClick={(e) => {
                  e.preventDefault();
                  setDeleteConfirmation("");
                  setPassword("");
                  deleteConfirmationRef.current.checked = false;
                  passwordConfirmationRef.current.checked = false;
                }}
                className="btn bg-red-600 text-white hover:bg-red-500 border-0"
              >
                Cancel
              </label>
              <button
                type="submit"
                // htmlFor="password-model"
                className={`btn bg-blue-600 text-white hover:bg-blue-500 border-0 ${
                  deleteCategoryIsLoading && "loading"
                }`}
                disabled={deleteCategoryIsLoading}
              >
                {!deleteCategoryIsLoading && "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* -------------Delete Confirmation Model-End------------- */}
      {isLoadingInfiniteCategories ? (
        <div className="flex justify-center items-center w-full h-[70vh]">
          <Spinner />
        </div>
      ) : (
        <>
          <h1 className="ml-6">
            <span className="font-bold">Total Items Found: </span>
            {infiniteCategories?.pages[0]?.data?.totalDocuments}
          </h1>

          <div
            ref={divRef}
            onScrollCapture={(e) => handleScroll(e)}
            className="max-h-[650px] overflow-y-auto "
          >
            <div ref={tableRef} className="flex flex-wrap mx-auto p-6 gap-4 ">
              {/* {products ? ( */}
              {infiniteCategories?.pages.length > 0 &&
                infiniteCategories?.pages.map(
                  (page, i) =>
                    page?.data?.itemList?.length > 0 &&
                    page?.data?.itemList?.map((item, index) => (
                      <Link
                        to={`/categories/${item.name}/${item._id}`}
                        key={item._id}
                        className="w-[200px] flex-grow flex-shrink bg-gray-100 dark:bg-gray-700 group rounded-lg overflow-hidden relative border-1 dark:border-gray-600 hover:shadow-lg transition-all duration-200"
                      >
                        {user.role === "admin" && (
                          <>
                            <label
                              htmlFor="my-modal-3"
                              onClick={(e) => {
                                e.preventDefault();
                                setCategoriesFormData({
                                  name: item.name,
                                  description: item.description,
                                  slug: item.slug,
                                  _id: item._id,
                                  imageLink: item.imageLink,
                                });
                                categoryFormModelRef.current.checked = true;
                              }}
                              className={`z-10 flex btn btn-circle modal-button bg-gray-800 text-blue-500 text-lg shadow-lg absolute top-2 left-2`}
                            >
                              <FiEdit />
                            </label>

                            <label
                              htmlFor="my-modal"
                              onClick={(e) => {
                                e.preventDefault();
                                deleteConfirmationRef.current.checked = true;
                                setDeleteConfirmation(item);
                              }}
                              className={`z-10 flex btn btn-circle modal-button bg-gray-800 text-red-500 text-lg shadow-lg absolute top-2 right-2 ${
                                deleteCategoryIsLoading &&
                                deleteConfirmation._id === item._id &&
                                "loading"
                              }`}
                            >
                              {deleteCategoryIsLoading &&
                              deleteConfirmation._id === item._id ? null : (
                                <FiTrash2 />
                              )}
                            </label>
                          </>
                        )}
                        <div className="mx-auto overflow-hidden ">
                          <img
                            className="h-[200px] max-h-[70%] w-full object-cover group-hover:scale-[120%] transition duration-200 ease-out"
                            src={item.imageLink}
                            alt="img"
                          />
                        </div>
                        <div className="flex flex-col justify-center p-2 items-center border-t-1 dark:border-gray-200 dark:text-gray-100 text-gray-800">
                          <h3 className="font-semibold">{item.name}</h3>
                        </div>
                      </Link>
                    ))
                )}

              {InfiniteCategoriesIsFetching && hasNextPage && LoadingCards}
              {/* Dummy Cards */}
              <div className="w-[200px] h-[1px] flex-grow opacity-0" />
              <div className="w-[200px] h-[1px] flex-grow opacity-0" />
              <div className="w-[200px] h-[1px] flex-grow opacity-0" />
              <div className="w-[200px] h-[1px] flex-grow opacity-0" />
              <div className="w-[200px] h-[1px] flex-grow opacity-0" />
              {!hasNextPage &&
                !InfiniteCategoriesIsFetching &&
                (infiniteCategories?.pages[0]?.data.itemList.length > 1 ? (
                  <div className="flex justify-center h-max w-full">
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

                        <span>Your Categories Loaded</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center h-max w-full">
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
          </div>
        </>
      )}
      {/* Locked Categories  */}
      {lockedInfiniteCategoriesLoading && user.role === "wholeseller" ? (
        <div className="flex justify-center items-center w-full h-[70vh]">
          <Spinner />
        </div>
      ) : (
        <>
          {user.role === "wholeseller" && (
            <>
              <h1 className="ml-6">
                <span className="font-bold">Other Categories: </span>
                {lockedInfiniteCategories?.pages[0]?.data?.totalDocuments}
              </h1>

              <div
                ref={divRef}
                onScrollCapture={(e) => handleScroll(e)}
                className="max-h-[650px] overflow-y-auto "
              >
                <div
                  ref={tableRef}
                  className="flex flex-wrap mx-auto p-6 gap-4 "
                >
                  {/* {products ? ( */}
                  {lockedInfiniteCategories?.pages.length > 0 &&
                    lockedInfiniteCategories?.pages.map(
                      (page, i) =>
                        page?.data?.itemList?.length > 0 &&
                        page?.data?.itemList?.map((item, index) => (
                          <div
                            // to={`/categories/${item.name}/${item._id}`}
                            key={item._id}
                            className="w-[200px] flex-grow flex-shrink bg-gray-100 dark:bg-gray-700 group rounded-lg overflow-hidden relative border-1 dark:border-gray-600 hover:shadow-lg transition-all duration-200 "
                          >
                            <div className="mx-auto overflow-hidden  blur-sm">
                              <img
                                className="h-[200px] max-h-[70%] w-full object-cover "
                                src={item.imageLink}
                                alt="img"
                              />
                            </div>

                            <div
                              className="opacity-0 hover:opacity-100 duration-300 absolute inset-0 z-10 flex justify-center items-center text-8xl text-rose-600 font-semibold"
                              onClick={handleCategoryUnlock}
                            >
                              <AiFillLock />
                              {/* Locked */}
                            </div>

                            <div className="flex flex-col justify-center p-2 items-center border-t-1 dark:border-gray-200 dark:text-gray-100 text-gray-800">
                              <h3 className="font-semibold">{item.name}</h3>
                            </div>
                          </div>
                        ))
                    )}

                  {lockedInfiniteCategoriesFetching &&
                    lockedHasNext &&
                    LoadingCards}
                  {/* Dummy Cards */}
                  <div className="w-[200px] h-[1px] flex-grow opacity-0" />
                  <div className="w-[200px] h-[1px] flex-grow opacity-0" />
                  <div className="w-[200px] h-[1px] flex-grow opacity-0" />
                  <div className="w-[200px] h-[1px] flex-grow opacity-0" />
                  <div className="w-[200px] h-[1px] flex-grow opacity-0" />
                  {!lockedHasNext &&
                    !lockedInfiniteCategoriesFetching &&
                    (lockedInfiniteCategories?.pages[0]?.data.itemList.length >
                    1 ? (
                      <div className="flex justify-center h-max w-full"></div>
                    ) : (
                      <div className="flex justify-center h-max w-full">
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
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
export default Categories;
