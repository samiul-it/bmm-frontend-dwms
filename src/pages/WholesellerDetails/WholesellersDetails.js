import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import Loading from '../Loading';

const WholesellersDetails = () => {
  const userId = useParams();
  // console.log(userId);

  const {
    isLoading,
    error,
    data: wholesellerDetails,
    isFetching,
    refetch,
  } = useQuery('wholesellerDetails', () => fetch(`http://localhost:5000/wholesellers/id/${userId.id}`).then((res) => res.json()));

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="">
      <p>Wholesellers Details</p>

      <div className="m-4 card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <p className="text-orange-600">{wholesellerDetails.name}</p>
          <p>{wholesellerDetails.email}</p>
          <p>{wholesellerDetails.catagories}</p>
        </div>
      </div>
    </div>
  );
};

export default WholesellersDetails;
