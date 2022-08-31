import React from "react";
import Header from "../../components/Header";
import { useQuery } from "react-query";
import { userRequest } from "../../requestMethods";
import Loading from "../Loading";
import CategoryRequestTableRow from "./CategoryRequestTableRow";
import { useSelector } from "react-redux";

const CategoryRequest = () => {
  const user = useSelector((state) => state?.user?.currentUser?.user);
  const {
    isLoading,
    error,
    data: requests,
    isFetching,
    refetch,
  } = useQuery("requests", () => userRequest.get("/categoryrequest"));

  const {
    isLoading: wholesellerRequestsLoading,
    data: wholesellerRequests,
    refetch: wholesellerRequestsFetch,
  } = useQuery("wholesellerRequests", () =>
    userRequest.get(`/categoryrequest/wholeseller/${user?._id}`)
  );

  // console.log(wholesellerRequests);

  if (isLoading) {
    return <Loading></Loading>;
  }

  // console.log(requests);

  return (
    <div>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
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
                    refetch={refetch}
                  ></CategoryRequestTableRow>
                ))}
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
                      <button className="btn btn-primary btn-sm">Delete</button>
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
