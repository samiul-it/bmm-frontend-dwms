import React, { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { userRequest } from "../../requestMethods";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import Loading from "../Loading";
import { useStateContext } from "../../contexts/ContextProvider";

const CategoryRequestTableRow = ({
  requestItem,
  index,
  requestRefetch,

  requests,
}) => {
  // console.log(requestItem);

  const { currentColor } = useStateContext();

  const [wholesellerDetails, setWholesellerDetails] = useState([]);

  useEffect(() => {
    userRequest
      .get(`/wholesellers/id/${requestItem?.wholesellerId}`)
      .then(function (response) {
        // console.log(response);
        setWholesellerDetails(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [requestItem?.wholesellerId]);

  const handleDeleteCategoryReqDirect = (id) => {
    const url = `/categoryrequest/${id}`;
    return userRequest.delete(url);
  };

  const handleDeleteCategoryReq = async (id) => {
    const confirmDelete = window.confirm("Are you Sure?");
    if (confirmDelete) {
      const url = `/categoryrequest/${id}`;
      await userRequest.delete(url);
      requestRefetch();
    }
  };

  const handleCategoryUpdate = (wholesellerId, newCategories, elementId) => {
    // console.log("Clicked", wholesellerId, newCategories);

    const confirmDelete = window.confirm("Are you Sure?");
    if (confirmDelete) {
      userRequest
        .put(`/wholesellers/${wholesellerId}`, {
          catagories: newCategories,
        })
        .then(function (response) {
          console.log(response);
          return handleDeleteCategoryReqDirect(elementId);
        })
        .then(function (response) {
          requestRefetch();
          toast.success("Categories Updated!");
        })
        .catch(function (error) {
          console.log(error);
          toast.error("Faild to Update Category");
        });
    }
  };
  return (
    <>
      <tr>
        <th>{index + 1}</th>
        <td className="link">{wholesellerDetails?.data?.name}</td>
        <td>{wholesellerDetails?.data?.email}</td>
        <td>
          {requestItem?.categories?.map((ct, index) => (
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
              className="btn btn-primary btn-sm"
              style={{
                backgroundColor: currentColor,
              }}
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
