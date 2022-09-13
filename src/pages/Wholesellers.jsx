import React, { useEffect, useRef, useState } from 'react';
import { employeesData, employeesGrid } from '../data/dummy';
import { Header } from '../components';
import * as xlsx from 'xlsx';
import FileSaver from 'file-saver';
import { useMutation, useQuery } from 'react-query';
import WholesellersTable from './WholesellersTable/WholesellersTable';
import Loading from './Loading';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { userRequest } from '../requestMethods';

export const DropDown = (props) => {
  const options = props?.options?.length > 0 && [
    { label: 'Select All', value: 'all' },
    ...props?.options,
  ];

  return (
    <div className={`react-select-wrapper ${props?.multi ? 'multi' : ''}`}>
      <Select
        classNamePrefix="select"
        name="catagory"
        options={options}
        isMulti
        value={props?.value ? props?.value : null}
        onChange={(selected) => {
          props?.multi &&
          selected.length &&
          selected.find((option) => option.value === 'all')
            ? props.handleChange(options.slice(1))
            : !props.multi
            ? props.handleChange((selected && selected.value) || null)
            : props.handleChange(selected);
        }}
      />
    </div>
  );
};

const Wholesellers = () => {
  const [wholesellerFormData, setWholesellerFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    catagories: [],
    _id: '',
    place: '',
    address: '',
  });
  const [fileData, setFileData] = useState([]);
  const [selectedOption, setSelectedOption] = useState();

  const modalRef = useRef();

  useEffect(() => {
    if (wholesellerFormData._id) {
      setSelectedOption(
        wholesellerFormData.catagories.map((e) => {
          return { label: e.categoryName, value: e.categoryId };
        })
      );
    }
  }, [wholesellerFormData]);

  // Fetching Wholesellers Data

  const {
    isLoading,
    data: wholesellersList,
    refetch,
  } = useQuery('wholesellers', () => userRequest.get('/wholesellers/'));

  const {
    isLoading: categoryLoading,
    error: categoryError,
    data: categoryData,
    isFetching: categoryFetching,
    refetch: categoryRefetch,
  } = useQuery('category', () => userRequest.get('/category'));

  const categoryIds =
    typeof selectedOption === 'object' &&
    selectedOption?.map((e) => {
      return { categoryId: e.value, categoryName: e.label };
    });
  // console.log('categoryIds ==>', categoryIds);
  // console.log('selectedOption ==>', selectedOption);

  // Setting React Select Options

  const resetFormData = () => {
    setWholesellerFormData({
      name: '',
      phone: '',
      email: '',
      password: '',
      catagories: [],
      _id: '',
      place: '',
      address: '',
    });
  };

  const catagories = categoryData?.data?.map((cd) => {
    return { value: cd._id, label: cd.name };
  });

  //Collecting wholesellers Data

  //Closing Modal

  const handleModalClose = () => {
    modalRef.current.checked = false;
  };

  // File Data Collection

  const fileType = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];

  const fileSubmit = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      let json;
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        json = xlsx.utils.sheet_to_json(worksheet);
        setFileData(json);
      };

      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  // Uploading file data to Database

  const updateToDb = () => {
    console.log(fileData);
    userRequest
      .post('/wholesellers/uploadxls', fileData)
      .then(function (response) {
        console.log(response);
        refetch();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  //Data Loading

  if (isLoading) {
    return <Loading></Loading>;
  }

  //Exporting or Dowloading Data

  // console.log(
  //   wholesellersList?.data.map((w) => {
  //     return {
  //       ...w,
  //       catagories: w.catagories.map((c) => c.categoryName),
  //     };
  //   })
  // );

  const exportToCSV = () => {
    const wholesellers1 = xlsx.utils.json_to_sheet(
      wholesellersList?.data?.map((w) => {
        return {
          ...w,
          catagories: w?.catagories?.map((c) => c?.categoryName).toString(),
        };
      })
    );

    const wb = {
      Sheets: { wholesellers: wholesellers1 },
      SheetNames: ['wholesellers'],
    };
    const excelBuffer = xlsx.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, 'wholesellers' + '.xlsx');
  };

  //Wholesellers infromations Form Handler

  const handleWholesellerInfo = (e) => {
    e.preventDefault();
    const { name, phone, email, place, address } = wholesellerFormData;

    userRequest
      .post('/wholesellers/create', {
        name: name,
        phone: phone,
        email: email,
        password: '1234',
        catagories: categoryIds,
        place,
        address,
      })
      .then(function (response) {
        console.log(response);
        refetch();
        toast.success('Wholeseller Created!');
        modalRef.current.checked = false;
      })
      .catch(function (error) {
        console.log(error);
        toast.error('Faild to Create wholeseller');
      });
  };

  const updateWholesellerApi = () => {
    userRequest
      .put(`/wholesellers/${wholesellerFormData._id}`, {
        name: wholesellerFormData.name,
        catagories: categoryIds,
        place: wholesellerFormData.place,
        address: wholesellerFormData.address,
      })
      .then(function (response) {
        console.log(response);
        refetch();
        toast.success('Wholeseller Updated!');
        modalRef.current.checked = false;
      })
      .catch(function (error) {
        console.log(error);
        toast.error('Faild to Update wholeseller');
      });
  };

  const updateHandler = (item) => {
    // console.log('update', item);
    modalRef.current.checked = true;
    setWholesellerFormData({
      name: item.name,
      phone: item.phone,
      email: item.email,
      password: item.password,
      catagories: item.catagories,
      _id: item._id,
      place: item.place,
      address: item.address,
    });
  };

  function handleChange(values) {
    setSelectedOption(values);
  }

  return (
    <div className="container mx-auto max-w-[95%]">
      <Header category="Page" title="Wholesellers" />
      {/* File Upload  */}
      <div className="flex items-center	m-3 ">
        <input
          onChange={fileSubmit}
          type="file"
          className="block w-max text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1a97f5] file:text-gray-200 hover:file:bg-[#07406b]"
        />

        <button
          className="btn  btn-sm rounded-full ml-2 mr-2 bg-[#1a97f5] border-0 text-slate-50 "
          onClick={updateToDb}
        >
          Update Database
        </button>

        {/* Adding Wholeseller  */}

        <label
          htmlFor="my-modal-3"
          className="btn  btn-sm rounded-full  bg-[#1a97f5] border-0 text-slate-50"
        >
          Add Wholeseller
        </label>

        <input
          ref={modalRef}
          type="checkbox"
          id="my-modal-3"
          className="modal-toggle"
        />
        <div className="modal">
          <div className="modal-box relative">
            <label
              htmlFor="my-modal-3"
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={(e) => {
                e.preventDefault();
                (modalRef.current.checked = false), resetFormData();
              }}
            >
              ✕
            </label>
            <h3 className="font-bold text-lg">Enter Wholeseller Details</h3>

            <div className="card-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  wholesellerFormData._id
                    ? updateWholesellerApi()
                    : handleWholesellerInfo(e);
                }}
              >
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Wholesellers Name</span>
                  </label>
                  <input
                    // ref={nameRef}
                    onChange={(e) => {
                      setWholesellerFormData({
                        ...wholesellerFormData,
                        name: e.target.value,
                      });
                    }}
                    value={wholesellerFormData.name}
                    type="text"
                    placeholder="Name"
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    // ref={emailRef}
                    onChange={(e) => {
                      setWholesellerFormData({
                        ...wholesellerFormData,
                        email: e.target.value,
                      });
                    }}
                    disabled={wholesellerFormData._id ? true : false}
                    value={wholesellerFormData.email}
                    type="email"
                    placeholder="Email"
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Contact</span>
                  </label>
                  <input
                    // ref={phoneRef}
                    onChange={(e) => {
                      setWholesellerFormData({
                        ...wholesellerFormData,
                        phone: e.target.value,
                      });
                    }}
                    value={wholesellerFormData.phone}
                    type="number"
                    disabled={wholesellerFormData._id ? true : false}
                    placeholder="Phone"
                    className="input input-bordered"
                  />
                </div>
                {/* <div className="form-control"> */}
                <label className="label">
                  <span className="label-text">Catagory</span>
                </label>
                {/* <Select
                  className="block w-full rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  value={selectedOption}
                  isMulti
                  onChange={setSelectedOption}
                  name="catagory"
                  options={catagories}
                  classNamePrefix="select"
                /> */}
                <DropDown
                  value={selectedOption}
                  options={catagories}
                  handleChange={handleChange}
                  multi={true}
                />
                {/* </div> */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Place</span>
                  </label>
                  <input
                    // ref={phoneRef}
                    onChange={(e) => {
                      setWholesellerFormData({
                        ...wholesellerFormData,
                        place: e.target.value,
                      });
                    }}
                    value={wholesellerFormData.place}
                    type="text"
                    // disabled={wholesellerFormData._id ? true : false}
                    placeholder="Place"
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Address</span>
                  </label>
                  <textarea
                    onChange={(e) => {
                      setWholesellerFormData({
                        ...wholesellerFormData,
                        address: e.target.value,
                      });
                    }}
                    value={wholesellerFormData.address}
                    type="address"
                    // disabled={wholesellerFormData._id ? true : false}
                    placeholder="Address"
                    className="textarea textarea-bordered"
                  />
                </div>

                <div className="form-control mt-6">
                  <button type="submit" className="btn btn-primary">
                    {wholesellerFormData._id ? 'update' : 'Submit'}
                  </button>
                </div>
              </form>
              <div className="form-control mt-6">
                <button
                  onClick={() => {
                    handleModalClose(), resetFormData();
                  }}
                  className="btn bg-orange-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Download Wholesellers List  */}
        <button
          className="btn  btn-sm rounded-full ml-2 bg-[#1a97f5] border-0 text-slate-50 "
          onClick={exportToCSV}
        >
          Download
        </button>
      </div>

      {/* Creating Wholesellers Table and Passing Data  */}

      <WholesellersTable
        updateHandler={updateHandler}
        wholesellersList={wholesellersList?.data}
        refetch={refetch}
      ></WholesellersTable>
    </div>
  );
};

export default Wholesellers;
