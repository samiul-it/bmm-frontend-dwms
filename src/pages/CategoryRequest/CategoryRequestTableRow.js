import React from 'react';
import { FaPen } from 'react-icons/fa';
import { userRequest } from '../../requestMethods';
import { toast } from 'react-toastify';
import { useQuery } from 'react-query';

const CategoryRequestTableRow = ({ requestItem, index, refetch }) => {
  //   console.log(requestItem);

  const {
    isLoading: wholesellerDetailsLoading,
    error,
    data: wholesellerDetails,
    isFetching,
    refetch: wholesellerDetailsRefetch,
  } = useQuery(
    'wholesellerDetails',
    async () =>
      await userRequest.get(`/wholesellers/id/${requestItem.wholesellerId}`)
  );

  // console.log(wholesellerDetails?.data?.name);

  const handleDeleteCategoryReq = (id) => {
    const confirmDelete = window.confirm('Are you Sure?');
    if (confirmDelete) {
      const url = `/categoryrequest/${id}`;
      userRequest.delete(url);
    }
  };

  const handleCategoryUpdate = (wholesellerId, newCategories, elementId) => {
    // console.log("Clicked", wholesellerId, newCategories);
    userRequest
      .put(`/wholesellers/${wholesellerId}`, {
        catagories: newCategories,
      })
      .then(function (response) {
        // console.log(response);
        refetch();
        handleDeleteCategoryReq(elementId);
        toast.success('Categories Updated!');
        refetch();
        wholesellerDetailsRefetch();
      })
      .catch(function (error) {
        console.log(error);
        toast.error('Faild to Update Category');
      });
  };
  return (
    <>
      <tr>
        <th>{index + 1}</th>
        <td>{wholesellerDetails?.data?.name}</td>
        <td>{wholesellerDetails?.data?.email}</td>
        <td>
          {requestItem.categories.map((ct, index) => (
            <p key={index} className="badge  badge-info gap-2">
              {ct.categoryName}
            </p>
          ))}
        </td>
        <td>{requestItem.status}</td>
        <td>
          <span>
            <button
              onClick={() =>
                handleCategoryUpdate(
                  requestItem?.wholesellerId,
                  requestItem.categories,
                  requestItem._id
                )
              }
              className="btn btn-active btn-secondary btn-sm"
            >
              Approve
            </button>
          </span>
        </td>

        <td>
          <button
            onClick={() => handleDeleteCategoryReq(requestItem._id)}
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
      </tr>
    </>
  );
};

export default CategoryRequestTableRow;
