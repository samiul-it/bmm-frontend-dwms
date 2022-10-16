import React from 'react';
import EmployeesTableRow from './EmployeesTableRow';

const EmployeesTable = ({ employeesList, refetch }) => (
  <div>
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>SL</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employeesList?.map((employee, index) => (
            <EmployeesTableRow
              key={employee._id}
              employee={employee}
              index={index}
              refetch={refetch}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default EmployeesTable;
