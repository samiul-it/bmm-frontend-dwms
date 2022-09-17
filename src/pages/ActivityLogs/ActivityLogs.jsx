import moment from 'moment';
import React from 'react';
import { useQuery } from 'react-query';
import { Header } from '../../components';
import Spinner from '../../components/shared/spinner/Spinner';
import { userRequest } from '../../requestMethods';

const ActivityLogs = () => {
  const { data: ActivityLogs, isLoading: activityLogsLoading } = useQuery(
    'activity-logs',
    async () =>
      await userRequest.get('/activity-logs').then((res) => res?.data),
    {
      onError: ({ response }) => {
        console.log('Activiy-logs error ===>', response.data.message);
      },
    }
  );

  return (
    <div className="container mx-auto max-w-[95%]">
      <Header category="Page" title="Activity Log's" />
      <div className="h-[80vh]">
        {activityLogsLoading ? (
          <div className="flex justify-center items-center w-full h-[70vh]">
            <Spinner />
          </div>
        ) : (
          <div className="max-h-[95%] overflow-auto rounded-lg">
            <table className="table w-full">
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
                {ActivityLogs?.map((log, i) => {
                  return (
                    <tr key={log?._id} className="hover">
                      <td>{i + 1}</td>
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
                      {/* <td className="w-[300px]">
                        <span className="badge">
                          <span className="select-none">#</span>
                          {log?.userId}
                        </span>
                      </td> */}
                      <td>{moment(log?.createdAt).format('DD/MM/YYYY')}</td>
                      <td>{moment(log?.createdAt).format('hh:mm A')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
