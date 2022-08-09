import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
  BarChart,
  Bar,
  Cell,
  Legend,
  Area,
  AreaChart,
} from 'recharts';

import { useQuery } from 'react-query';
import Header from './../../components/Header';
import { userRequest } from '../../requestMethods';
import DateFilter from '../../components/DateFilter';
import moment from 'moment';
import { addDays } from 'date-fns';
import { useStateContext } from '../../contexts/ContextProvider';

const Homepage = () => {
  // function convert(str) {
  //   var date = new Date(str),
  //     mnth = ('0' + (date.getMonth() + 1)).slice(-2),
  //     day = ('0' + date.getDate()).slice(-2);
  //   return [date.getFullYear(), mnth, day].join('-');
  // }
  const { currentColor } = useStateContext();
  const [state, setState] = React.useState([
    {
      startDate: addDays(new Date(), -10),
      endDate: addDays(new Date(), +0),
      key: 'selection',
    },
  ]);

  // console.log(new Date(state[0].startDate).toISOString());

  const {
    isLoading,
    error,
    data: graphData,
    isFetching,
    refetch: refetchGraphData,
  } = useQuery('graphData', () =>
    userRequest.get(
      `/orders/getGraphData?startDate=${new Date(
        state[0].startDate
      ).toUTCString()}&endDate=${new Date(state[0].endDate).toUTCString()}`
    )
  );

  React.useEffect(() => {
    refetchGraphData();
  }, [state]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label} : ${payload[0].value}`}</p>
          <p className="intro">{getIntroOfPage(label)}</p>
          <p className="desc">Anything you want can be displayed here.</p>
        </div>
      );
    }

    return null;
  };

  // console.log('graphDate ===>', graphDate);

  const formatDate = (dateString) => {
    const date = new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      year: 'numeric',
      month: 'short',
    });
    return date;
  };

  return (
    <div className="container mx-auto px-6">
      <div className="flex items-center justify-between px-6">
        <Header category="Page" title="Data Visialization" />
        <DateFilter state={state} setState={setState} />
      </div>
      <h3>Our Statistics(1)</h3>
      <div>
        <div>
          <h3>Total Sale vs Day</h3>
          <ResponsiveContainer width="100%" aspect={3}>
            <AreaChart
              width={400}
              height={300}
              data={graphData?.data.map((d) => {
                return {
                  ...d,
                  _id: formatDate(d._id),
                };
              })}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <Area
                type="monotone"
                dataKey="totalSale"
                stroke={`${currentColor}`}
                fill={`${currentColor}`}
              />
              <Area type="monotone" dataKey="totalOrders" />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={`_id`} />
              <YAxis />
              <Tooltip />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
