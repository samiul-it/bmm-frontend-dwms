import React, { useRef, useState } from 'react';
import Header from './../components/Header';
import { useQuery } from 'react-query';
import EmployeesTable from './EmployeesTable/EmployeesTable';
import Loading from './Loading';
import { toast } from 'react-toastify';
import { userRequest } from '../requestMethods';
import Select from 'react-select';

const Employees = () => {
  const modalRef = useRef();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [role, setRole] = useState('');

  const FormDataHandler = (e) => {
    console.log(formData);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // All Backend Users
  const {
    isLoading,
    data: employeesList,
    refetch,
  } = useQuery('employees', async () => await userRequest.get('/user'));

  if (isLoading) {
    return <Loading></Loading>;
  }

  const handleModalClose = () => {
    modalRef.current.checked = false;
    setFormData({
      name: '',
      phone: '',
      email: '',
    });
    setRole('');
    setRole('');
  };

  const handleAdminCreation = (e) => {
    e.preventDefault();

    userRequest
      .post('/user/create', {
        ...formData,
        role: role?.value,
        password: '1234',
      })
      .then(function (response) {
        // console.log(response);
        refetch();
        toast.success('Employee Created!');
        modalRef.current.checked = false;
        setFormData({
          name: '',
          phone: '',
          email: '',
        });
        setRole('');
      })
      .catch(function (error) {
        setFormData({
          name: '',
          phone: '',
          email: '',
        });
        setRole('');
        // console.log(error);
        toast.error('Faild to Create Employee');
      });
  };

  const options = [
    {
      value: 'admin',
      label: 'Admin',
    },
    {
      value: 'employee',
      label: 'Employee',
    },
  ];

  return (
    <div className="container mx-auto max-w-[95%]">
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
            onClick={handleModalClose}
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
                  name="name"
                  onChange={FormDataHandler}
                  value={formData?.name}
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
                  name="email"
                  onChange={FormDataHandler}
                  value={formData?.email}
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
                  name="phone"
                  onChange={FormDataHandler}
                  value={formData?.phone}
                  type="number"
                  placeholder="Phone"
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>

                <Select
                  value={role}
                  onChange={setRole}
                  options={options}
                  required
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
              <button onClick={handleModalClose} className="btn bg-orange-600">
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
  );
};

export default Employees;
