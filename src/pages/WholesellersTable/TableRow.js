import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { userRequest } from '../../requestMethods';
import { FiEdit } from 'react-icons/fi';

const TableRow = ({ wholeseller, index, refetch, updateHandler }) => {
  const handleDeleteItem = (id) => {
    const confirmDelete = window.confirm('Are you Sure?');
    if (confirmDelete) {
      const url = `http://localhost:5000/wholesellers/${id}`;
      userRequest.delete(url);
    }
  };

  return (
    <>
      <tr>
        <th>{index + 1}</th>
        <td>{wholeseller.name}</td>
        <td>{wholeseller.phone}</td>
        <td>{wholeseller.email}</td>
        <td>
          <button
            onClick={() => handleDeleteItem(wholeseller._id)}
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
        <td>
          <button
            className="btn btn-sm flex items-center"
            onClick={() => updateHandler(wholeseller)}
          >
            <span className="mx-1">
              <FiEdit />
            </span>
            Update
          </button>
        </td>
        <td>
          {wholeseller?.catagories.map((category) => (
            <span className="badge mr-1">{category.categoryName}</span>
          ))}
        </td>
      </tr>
    </>
  );
};

export default TableRow;
