import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/apiCalls';
import { useNavigate } from 'react-router-dom';
import { SiShopware } from 'react-icons/si';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFetching } = useSelector((state) => state.user);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // console.log("Clicked..!");
    login(dispatch, { email, password });

    // console.log(email, password,role, "up...");
  };

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
                <button
                  disabled={isFetching}
                  className={`btn btn-primary ${isFetching && 'loading'}`}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
