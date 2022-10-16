import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.preventDefault();
    console.log(email, password, phone);
  };
  return (
    <div>
      <section className="flex justify-center items-center h-screen bg-gray-800">
        <form
          onSubmit={handleClick}
          className="max-w-md w-full bg-gray-900 rounded p-6 space-y-4"
        >
          <div className="mb-4">
            <p className="text-gray-400">Signup</p>
            <h2 className="text-xl font-bold text-white">BMM</h2>
          </div>
          <div />
          <div>
            <input
              className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
              type="number"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <input
              className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold text-gray-50 transition duration-200"
              type="submit"
            >
              Sign Up
            </button>
          </div>
          {/* <div className="flex items-center justify-between">
                <div className="flex flex-row items-center">
                    <input type="checkbox" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                    <label for="comments" className="ml-2 text-sm font-normal text-gray-400">Remember me</label>
                </div>
            </div> */}
        </form>
      </section>
    </div>
  );
};

export default SignUp;
