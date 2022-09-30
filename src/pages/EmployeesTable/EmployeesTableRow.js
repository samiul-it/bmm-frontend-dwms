import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { userRequest } from '../../requestMethods';

const EmployeesTableRow = ({ employee, index, refetch }) => {
  const handleDeleteAdmin = (id) => {
    const confirmDelete = window.confirm('Are you Sure?');
    if (confirmDelete) {
      const url = `http://localhost:5000/user/${id}`;
      userRequest
        .delete(url)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          refetch();
        });
    }
  };

  return (
    <>
      <tr>
        <th>{index + 1}</th>
        <td>{employee.name}</td>
        <td>{employee.phone}</td>
        <td>{employee.email}</td>
        <td>{employee?.role}</td>
        <td className="w-[200px]">
          <button
            onClick={() => handleDeleteAdmin(employee._id)}
            className="flex items-center w-max btn btn-sm modal-button bg-gray-800 text-red-500 shadow-lg mx-2"
          >
            <FiTrash2 />
            &nbsp; Delete
          </button>
        </td>
      </tr>
    </>
  );
};

export default EmployeesTableRow;
