import React from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { userRequest } from '../../requestMethods';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const TableRow = ({ wholeseller, index, refetch, updateHandler }) => {
  const handleDeleteItem = (id) => {
    const confirmDelete = window.confirm('Are you Sure?');
    if (confirmDelete) {
      const url = `/wholesellers/${id}`;
      userRequest.delete(url);
    }
  };

  return (
    <>
      <tr key={wholeseller?._id}>
        <th>{index + 1}</th>
        <td>{wholeseller?.name}</td>
        <td>{wholeseller?.phone}</td>
        <td>{wholeseller?.email}</td>
        <td>{wholeseller?.place}</td>
        <td>
          <button
            onClick={() => handleDeleteItem(wholeseller._id)}
            className="flex items-center w-max btn btn-sm modal-button bg-gray-800 text-red-500 shadow-lg mx-2"
          >
            <span className="flex">
              Delete &nbsp;
              <FiTrash2 />
            </span>
          </button>
        </td>
        <td>
          <button
            className="flex items-center w-max btn btn-sm modal-button bg-gray-800 text-blue-500 shadow-lg mx-2"
            onClick={() => updateHandler(wholeseller)}
          >
            <span className="mx-1">
              <FiEdit />
            </span>
            Update
          </button>
        </td>
        <td>
          {wholeseller?.catagories.map((category, i) => (
            <span key={i} className="badge mr-1">
              {category.categoryName}
            </span>
          ))}
        </td>
      </tr>
    </>
  );
};

export default TableRow;
