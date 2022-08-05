import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/apiCalls';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';
import { wholesellerlogin } from '../redux/wholesellerLogin';
import { SiShopware } from 'react-icons/si';
import { publicRequest } from '../requestMethods';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpUser, setOtpUser] = useState('');
  const [otpBackend, setOtpBackend] = useState('123456');
  const [wholeseller, setWholeseller] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const dispatch = useDispatch();

  const otpModalRef = useRef();
  const navigate = useNavigate();

  const [role, setRole] = useState('wholeseller');

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const handleOtpSubmission = (e) => {
    e.preventDefault();
    // console.log("OTP Submitted Successfully..!");
    if (otpUser === otpBackend) {
      toast.success('OTP Verified');
      otpModalRef.current.checked = false;

      wholesellerlogin(dispatch, {
        email: wholeseller.email,
        password: '1234',
        // Phone
      });

      // navigate(`/wholesellers-details/${wholeseller._id}`);
    } else {
      toast.error('Invelid OTP');
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // console.log("Clicked..!");
    login(dispatch, { email, password });

    // console.log(email, password,role, "up...");
  };

  if (modalLoading) {
    return <Loading></Loading>;
  }

  // const handleWholesellerLogin = (e) => {
  //   e.preventDefault();

  //   publicRequest
  //     .get(`http://localhost:5000/wholesellers/phone/${phone}`)
  //     .then((res) => {
  //       console.log(res.data);
  //       setWholeseller(res.data);
  //       toast.info('A Six Digit OTP Sent');
  //       otpModalRef.current.checked = true;
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       toast.error('Wholeseller does not exist');
  //     });

  //   // console.log("Phone", phone);
  // };

  // console.log(wholeseller);
  return (
    <>
      <div className="min-h-screen bg-base-200 relative flex justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <div className="flex items-center my-6 -mt-6 transition ease-in-out delay-150 text-blue-500 hover:-translate-y-1 hover:scale-110 hover:text-indigo-500 duration-300 ">
            <span className="text-4xl">
              <SiShopware />
            </span>{' '}
            <span className="mx-2 text-2xl font-semibold">BMM</span>
          </div>
          <div className="card w-[400px] flex-shrink-0  shadow-2xl bg-base-100">
            <form onSubmit={handleAdminLogin} className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* <label className="label">
                  <a href="#" className="label-text-alt link link-hover">
                    Forgot password?
                  </a>
                </label> */}
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
