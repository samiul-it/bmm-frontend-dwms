import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import { Header } from '../../components';
import Spinner from '../../components/shared/spinner/Spinner';
import { useStateContext } from '../../contexts/ContextProvider';
import { userRequest } from '../../requestMethods';

const ActivityLogs = () => {
  const divRef = useRef();
  const tableRef = useRef();
  const { currentColor } = useStateContext();
  const [searchQuery, setSearchQuery] = useState('');
  // const { data: ActivityLogs, isLoading: activityLogsLoading } = useQuery(
  //   'activity-logs',
  //   async () =>
  //     await userRequest.get('/activity-logs').then((res) => res?.data),
  //   {
  //     onError: ({ response }) => {
  //       console.log('Activiy-logs error ===>', response.data.message);
  //     },
  //   }
  // );

  const GetPaginationApi = async ({ pageParam = 1 }) => {
    const data = await userRequest.get(
      `/activity-logs/getPagination?&page=${pageParam}&limit=${25}&search=${searchQuery}`
    );
    return data;
  };

  const {
    data: activityLogs,
    fetchNextPage,
    refetch: refetchInfiniteProducts,
    hasNextPage,
    isLoading: isLoadingInfiniteProducts,
    isFetching: activityLogsIsFetching,
    isRefetching,
    remove,
  } = useInfiniteQuery(['activityLogsScroll'], GetPaginationApi, {
    refetchOnWindowFocus: false,
    getNextPageParam: (page) => {
      return page.data.hasNext ? page.data.curruntPage + 1 : undefined;
    },
  });

  const searchHandler = (e) => {
    e.preventDefault();
    refetchInfiniteProducts();
  };

  useEffect(() => {
    if (!searchQuery) refetchInfiniteProducts();
  }, [searchQuery]);

  const handleScroll = (e) => {
    const scrollTopValue = e.target.scrollTop;
    const innerHeight = divRef.current.clientHeight;
    const offsetHeight = tableRef.current.offsetHeight;

    // console.log(Math.ceil(scrollTopValue) + innerHeight, offsetHeight);

    if (innerHeight + Math.ceil(scrollTopValue) >= offsetHeight) {
      console.log(
        ' Reached at bottom ====>',
        innerHeight + Math.ceil(scrollTopValue) === offsetHeight
      );
      // setPage(page + 1);

      fetchNextPage();
    }
  };

  const temp = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  const LoadingCards = temp.map((e, i) => {
    return (
      <tr key={i}>
        <td></td>
        <td>
          <div className="bg-slate-600 rounded-lg w-[90%] h-[25px]"></div>
        </td>
        <td>
          <div className="bg-slate-600 rounded-lg w-[90%] h-[25px]"></div>
        </td>
        <td>
          <div className="bg-slate-600 rounded-lg w-[90%] h-[25px]"></div>
        </td>
      </tr>
    );
  });

  let srNo = 0;

  return (
    <div className="container mx-auto max-w-[95%]">
      <div className="w-full flex justify-between flex-wrap md:flex-nowrap items-center md:mb-0 mb-4">
        <Header category="Page" title="Activity Log's" />
        <form
          onSubmit={(e) => {
            searchHandler(e);
          }}
          className="w-full md:max-w-[370px] relative"
        >
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
          >
            Search
          </label>
          <div className="relative">
            <input
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              type="search"
              id="default-search"
              className="block p-3 pr-14 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Activity"
            />
            <button
              type="submit"
              style={{
                background: currentColor,
              }}
              className="text-white absolute right-2 bottom-[5px] focus:ring-4 focus:outline-none hover:bg-light-gray font-medium rounded-lg text-sm px-3 py-2"
            >
              <div className="flex items-center pointer-events-none ">
                <svg
                  className="w-5 h-5 text-gray-100 "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </button>
          </div>
          <h1 className="absolute -bottom-4 text-gray-700 font-semibold text-sm dark:text-gray-300">
            {isRefetching && searchQuery && 'Searching...'}
          </h1>
        </form>
      </div>

      <div className="h-[80vh]">
        {isLoadingInfiniteProducts ? (
          <div className="flex justify-center items-center w-full h-[70vh]">
            <Spinner />
          </div>
        ) : (
          <>
            <div
              ref={divRef}
              onScrollCapture={(e) => handleScroll(e)}
              className="max-h-[650px] overflow-auto rounded-lg "
            >
              <table ref={tableRef} className="table w-full">
                <thead className="sticky top-0 left-0">
                  <tr>
                    <th></th>
                    <th>Activity</th>
                    {/* <th>User Id</th> */}
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLogs?.pages?.length > 0 &&
                    activityLogs?.pages?.map(
                      (page, i) =>
                        page?.data?.itemList?.length > 0 &&
                        page?.data?.itemList?.map((log, index) => (
                          <tr key={log?._id} className="hover">
                            <td>{(srNo += 1)}</td>
                            <td className="max-w-[300px] group hover:cursor-pointer hover:relative">
                              <span className="w-full truncate block">
                                {log?.activity}
                              </span>

                              <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-2 flex-col gap-2 hidden group-hover:flex absolute  z-20 mt-2 h-max max-h-72 overflow-y-auto shadow-sm">
                                <div className="p-2 bg-gray-300 dark:bg-gray-700 dark:text-gray-300 text-gray-600 rounded-md text-sm font-semibold">
                                  {log?.activity}
                                </div>
                              </div>
                            </td>

                            <td>
                              {moment(log?.createdAt).format('DD/MM/YYYY')}
                            </td>
                            <td>{moment(log?.createdAt).format('hh:mm A')}</td>
                          </tr>
                        ))
                    )}
                  {activityLogsIsFetching && hasNextPage && LoadingCards}
                </tbody>
              </table>
            </div>

            {!hasNextPage &&
              !activityLogsIsFetching &&
              (activityLogs?.pages[0]?.data.itemList.length > 1 ? (
                <div className="flex justify-center h-max w-full mt-4">
                  <div className="alert alert-success shadow-lg w-max ">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current flex-shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-semibold">
                        You have Scrolled through all the data!
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center h-max w-full mt-4">
                  <div className="alert alert-info shadow-lg w-max">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-current flex-shrink-0 w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span className="font-semibold">!Items Not Found</span>
                    </div>
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
