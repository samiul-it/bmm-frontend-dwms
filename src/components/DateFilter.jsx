import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { addDays } from 'date-fns';
import { useState } from 'react';
import { DateRange, DateRangePicker } from 'react-date-range';
import { Popover } from '@headlessui/react';
import { FiChevronDown } from 'react-icons/fi';
import moment from 'moment';
import { useStateContext } from '../contexts/ContextProvider';

// import { ChevronDownIcon, XIcon } from '@heroicons/react/solid';

function DateFilter({ state, setState }) {
  const getDate = (d) => {
    return moment(d).format('Do MMMM YYYY');
    //   var date = new Date(str),
    //     mnth = ('0' + (date.getMonth() + 1)).slice(-2),
    //     day = ('0' + date.getDate()).slice(-2);
    //   return [date.getFullYear(), mnth, day].join('-');
  };
  const { currentColor } = useStateContext();

  // console.log(addDays(new Date(), -10));

  return (
    <>
      <div className=" py-2 cursor-pointer bg-white rounded-[20px] h-10 w-max flex justify-center items-center flex-col ">
        <p
          className="items-center  px-5  rounded-md   text-sm font-medium"
          // onClick={() => {
          //   if (!state[0].startDate) {
          //     const startdate = new Date();
          //     startdate.setMonth(startdate.getMonth() - 1);
          //     setState([
          //       {
          //         startDate: startdate,
          //         endDate: new Date(),
          //         key: 'selection',
          //       },
          //     ]);
          //   } else {
          //     const startdate = new Date();
          //     startdate.setMonth(startdate.getMonth() - 1);
          //     setState([
          //       {
          //         startDate: '',
          //         endDate: '',
          //         key: 'selection',
          //       },
          //     ]);
          //   }
          // }}
        >
          {/* {heading} */}
        </p>
        {state[0].startDate && state[0].startDate != '' && (
          <>
            <div className=" mx-auto bg-white  rounded-2xl  ">
              <Popover className="">
                {({ open, close }) => (
                  <>
                    <Popover.Button className="flex space-x-2 justify-center items-center  px-5  rounded-md relative z-10  text-[10px] font-medium ">
                      <span
                        style={{
                          color: currentColor,
                        }}
                        className="font-semibold"
                      >
                        <p className="text-sm">{`${getDate(
                          state[0].startDate
                        )} - ${getDate(state[0].endDate)}`}</p>
                      </span>
                      <FiChevronDown
                        className={`${
                          open ? ' opacity-0' : ''
                        } w-5 h-5 text-black`}
                      />
                    </Popover.Button>

                    <Popover.Panel className=" absolute top-0 w-full left-0 z-50   text-sm text-gray-500 ">
                      <DateRangePicker
                        editableDateInputs={true}
                        onChange={(item) => {
                          // console.log(
                          //   'date picker ===>',
                          //   item.selection.endDate
                          // );
                          const _item = new Date(item.selection.endDate);
                          _item.setHours(23);
                          _item.setMinutes(59);

                          setState([{ ...item.selection, endDate: _item }]);
                        }}
                        months={1}
                        className="relative  z-50 p-4 left-1/3  rounded-md"
                        minDate={addDays(new Date(), -300)}
                        maxDate={addDays(new Date(), +0)}
                        direction="vertical"
                        // initialFocusedRange={state[0]}
                        scroll={{ enabled: true }}
                        ranges={state}
                      />
                      <div
                        className=" absolute z- left-0 top-0 w-full h-screen bg-black bg-opacity-40"
                        onClick={() => close()}
                      ></div>
                    </Popover.Panel>
                  </>
                )}
              </Popover>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default DateFilter;
