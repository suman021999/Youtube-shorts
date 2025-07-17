import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../index.css";

const LoginPage = () => {
  const [isRightActive, setIsRightActive] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  return (
    <div className="flex justify-center items-center flex-col bg-black min-h-screen font-['Montserrat'] p-4">
      <div
        className={`bg-white rounded-xl shadow-2xl relative overflow-hidden w-full max-w-4xl min-h-[480px] ${
          isRightActive ? "right-panel-active" : ""
        }`}
      >
        {/* Sign Up Form */}
        <div className={`absolute top-0  h-full transition-all duration-600 ease-in-out left-0  w-1/2 ${
            isRightActive
              ? "translate-x-full opacity-100 z-50 animate-show"
              : "opacity-0 z-10"
          }`}
        >
          <form className="bg-white flex flex-col items-center justify-center px-12 h-full text-center">
            <h1 className="font-bold m-0">Create Account</h1>

            <input
              type="text"
              placeholder="Name"
              className="bg-gray-100 border-none py-3 px-4 my-2 w-full rounded"
            />
            <input
              type="email"
              placeholder="Email"
              className="bg-gray-100 border-none py-3 px-4 my-2 w-full rounded"
            />
            <div className="relative w-full">
              <input
                type={showSignUpPassword ? "text" : "password"}
                placeholder="Password"
                className="bg-gray-100 border-none py-3 px-4 my-2 w-full rounded pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowSignUpPassword(!showSignUpPassword)}
              >
                {showSignUpPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="my-5 flex gap-2">
              <a className="flex gap-2" href="">
                <FcGoogle size={24} />
                <span>Sign up with Google</span>
              </a>
            </div>

            <button className="rounded-full bg-red-500 text-white text-xs font-bold py-3 px-12 my-2 uppercase tracking-wider border border-red-500 hover:bg-red-600 transition">
              Sign Up
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0  w-1/2 z-20 ${
            isRightActive ? "translate-x-full" : ""
          }`}
        >
          <form className="bg-white flex flex-col items-center justify-center px-12 h-full text-center">
            <h1 className="font-bold m-0">Sign In</h1>

            <input
              type="email"
              placeholder="Email"
              className="bg-gray-100 border-none py-3 px-4 my-2 w-full rounded"
            />
            <div className="relative w-full">
              <input
                type={showSignInPassword ? "text" : "password"}
                placeholder="Password"
                className="bg-gray-100 border-none py-3 px-4 my-2 w-full rounded pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowSignInPassword(!showSignInPassword)}
              >
                {showSignInPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="my-5 flex gap-2">
              <a className="flex gap-2" href="">
                <FcGoogle size={24} />
                <span>Sign in with Google</span>
              </a>
            </div>
            <button className="rounded-full bg-red-500 text-white text-xs font-bold py-3 px-12 my-2 uppercase tracking-wider border border-red-500 hover:bg-red-600 transition">
              Sign In
            </button>
          </form>
        </div>

        {/* Overlay */}
        <div
          className={`absolute top-0  left-1/2 w-1/2 h-full overflow-hidden transition-all duration-600 ease-in-out z-30 ${
            isRightActive ? "-translate-x-full" : ""
          }`}
        >
          <div
            className={`relative left-[-100%] w-[200%] h-full bg-gradient-to-r from-orange-500 to-red-700 text-white transition-all duration-600 ease-in-out ${
              isRightActive ? "translate-x-1/2" : ""
            }`}
          >
            <div
              className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-10 text-center transition-all duration-600 ease-in-out ${
                isRightActive ? "translate-x-0" : "-translate-x-1/5"
              }`}
            >
              <h1 className="font-bold text-2xl mb-4">Welcome Back!</h1>
              <p className="text-sm mb-6">Use your personal info to login</p>
              <button
                onClick={() => setIsRightActive(false)}
                className="rounded-full border border-white bg-transparent text-white text-xs font-bold py-3 px-12 uppercase tracking-wider transition"
              >
                Sign In
              </button>
            </div>

            <div
              className={`absolute right-0 w-1/2 h-full flex flex-col items-center justify-center px-10 text-center transition-all duration-600 ease-in-out ${
                isRightActive ? "translate-x-1/5" : "translate-x-0"
              }`}
            >
              <h1 className="font-bold text-2xl mb-4">Hello, Friend!</h1>
              <p className="text-sm mb-6">Enter your details to get started</p>
              <button
                onClick={() => setIsRightActive(true)}
                className="rounded-full border border-white bg-transparent text-white text-xs font-bold py-3 px-12 uppercase tracking-wider  transition"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;