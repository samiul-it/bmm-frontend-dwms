import React from 'react';
import TableRow from './TableRow';

const WholesellersTable = ({ wholesellersList, refetch, updateHandler }) => {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>SL</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Place</th>
              <th>Action</th>
              <th>Update</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {wholesellersList?.map((wholeseller, index) => (
              <TableRow
                key={wholeseller._id}
                wholeseller={wholeseller}
                index={index}
                refetch={refetch}
                updateHandler={updateHandler}
              ></TableRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WholesellersTable;
