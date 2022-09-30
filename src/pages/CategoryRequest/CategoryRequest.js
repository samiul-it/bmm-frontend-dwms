import React from "react";
import Header from "../../components/Header";
import { useQuery } from "react-query";
import { userRequest } from "../../requestMethods";
import Loading from "../Loading";
import CategoryRequestTableRow from "./CategoryRequestTableRow";
import { useSelector } from "react-redux";
import { useStateContext } from "../../contexts/ContextProvider";

const CategoryRequest = () => {
  const user = useSelector((state) => state?.user?.currentUser?.user);
  const { currentColor } = useStateContext();
  const {
    isLoading: requestLoading,
    error,
    data: requests,
    isFetching,
    refetch: requestRefetch,
  } = useQuery("requests", () => userRequest.get("/categoryrequest"));

  // console.log(requests?.data);

  const {
    isLoading: wholesellerRequestsLoading,
    data: wholesellerRequests,
    refetch: wholesellerRequestsFetch,
  } = useQuery("wholesellerRequests", () =>
    userRequest.get(`/categoryrequest/wholeseller/${user?._id}`)
  );

  if (requestLoading) {
    return <Loading></Loading>;
  }

  //Delete Category Request Wholeseller
  const handleDeleteCategoryReq = async (id) => {
    const confirmDelete = window.confirm("Are you Sure?");
    console.log(confirmDelete);
    if (confirmDelete) {
      const url = `/categoryrequest/${id}`;
      await userRequest.delete(url);
      wholesellerRequestsFetch();
    }
  };

  return (
    <div>
      <div className="w-full  px-6">
        <Header category="Page" title="Category Requests" />

        {user?.role == "admin" && (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Wholeseller</th>
                  <th>Wholeseller Email</th>
                  <th>Requested Categories</th>
                  <th>Request Status</th>
                  <th>Manage Request</th>
                  <th>Delete Request</th>
                </tr>
              </thead>
              <tbody>
                {requests?.data?.map((requestItem, index) => (
                  <CategoryRequestTableRow
                    key={requestItem._id}
                    requestItem={requestItem}
                    index={index}
                    requestRefetch={requestRefetch}
                    requests={requests}
                  ></CategoryRequestTableRow>
                ))}
                {requests?.data?.length > 0 ? (
                  <tr>
                    <td></td>
                    <td className="text-green-600 ">
                      Total Active Requests:
                      {requests?.data?.length}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ) : (
                  <tr>
                    <td className="text-orange-600"> No Requests!</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {user?.role == "wholeseller" && (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Wholeseller</th>
                  <th>Requested Categories</th>
                  <th>Request Status</th>
                  <th>Delete Request</th>
                </tr>
              </thead>
              <tbody>
                {wholesellerRequests?.data?.categories?.length > 0 ? (
                  <tr>
                    <td>1</td>
                    <td>{user?.name}</td>
                    <td>
                      {wholesellerRequests?.data?.categories?.map(
                        (category, index) => (
                          <p key={index} className="badge badge-info gap-2">
                            {category.categoryName}
                          </p>
                        )
                      )}
                    </td>
                    <td>{wholesellerRequests?.data?.status}</td>
                    <td>
                      <button
                        onClick={() =>
                          handleDeleteCategoryReq(
                            wholesellerRequests?.data?._id
                          )
                        }
                        className="btn btn-primary btn-sm"
                        style={{
                          backgroundColor: currentColor,
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <th>
                      {" "}
                      <p className="text-red-500"> No Requests! </p>
                    </th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryRequest;
