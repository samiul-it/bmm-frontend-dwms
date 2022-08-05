import React from "react";

const EmployeesTableRow = ({ employee, index, refetch }) => {
  const handleDeleteAdmin = (id) => {
    const confirmDelete = window.confirm("Are you Sure?");
    if (confirmDelete) {
      const url = `http://localhost:5000/user/${id}`;
      fetch(url, {
        method: "DELETE",
      })
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
        <td>
          <button
            onClick={() => handleDeleteAdmin(employee._id)}
            className="btn btn-xs btn-circle btn-outline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </td>
        <td>{employee?.role}</td>
      </tr>
    </>
  );
};

export default EmployeesTableRow;
