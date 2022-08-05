import React, { useRef } from 'react';
import Header from './../components/Header';
import { useQuery } from 'react-query';
import WholesellersTable from './WholesellersTable/WholesellersTable';
import EmployeesTable from './EmployeesTable/EmployeesTable';
import Loading from './Loading';
import { toast } from 'react-toastify';
import { userRequest } from '../requestMethods';

const Employees = () => {
  const nameRef = useRef();
  const phoneRef = useRef();
  const emailRef = useRef();
  const modalRef = useRef();
  // All Backend Users

  const {
    isLoading,
    error,
    data: employeesList,
    isFetching,
    refetch,
  } = useQuery('employees', () =>
    userRequest('http://localhost:5000/user/').then((res) => res.json())
  );

  if (isLoading) {
    return <Loading></Loading>;
  }

  const handleModalClose = () => {
    modalRef.current.checked = false;
  };

  const handleAdminCreation = (e) => {
    e.preventDefault();
    // console.log("form Submitted!");
    const name = nameRef.current.value;
    const phone = phoneRef.current.value;
    // const catagory = catagoryRef.current.value;
    const email = emailRef.current.value;
    // console.log(name, phone, email);

    userRequest
      .post('/user/create', {
        name: name,
        phone: phone,
        email: email,
        password: '1234',
      })
      .then(function (response) {
        // console.log(response);
        refetch();
        toast.success('Employee Created!');
        modalRef.current.checked = false;
      })
      .catch(function (error) {
        // console.log(error);
        toast.error('Faild to Create Employee');
      });
  };
  return (
    <div>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Header category="Page" title="Employees" />

        <label
          htmlFor="my-modal-3"
          className="btn mb-2  btn-sm rounded-full  bg-[#1a97f5] border-0 text-slate-50"
        >
          Add Employee
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
            >
              ✕
            </label>
            <h3 className="font-bold text-lg">Enter Employee Details</h3>

            <div className="card-body">
              <form onSubmit={handleAdminCreation}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Employees Name</span>
                  </label>
                  <input
                    ref={nameRef}
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
                    ref={emailRef}
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
                    ref={phoneRef}
                    type="number"
                    placeholder="Phone"
                    className="input input-bordered"
                  />
                </div>

                <div className="form-control mt-6">
                  <input
                    type="submit"
                    value="Confirm"
                    className="btn btn-primary"
                  />
                </div>
              </form>
              <div className="form-control mt-6">
                <button
                  onClick={handleModalClose}
                  className="btn bg-orange-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <EmployeesTable
          employeesList={employeesList?.data}
          refetch={refetch}
        ></EmployeesTable>
      </div>
    </div>
  );
};

export default Employees;
