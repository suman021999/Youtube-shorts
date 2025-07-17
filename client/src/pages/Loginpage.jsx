
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

const Loginpage = () => {
  const [isLogin, setIsLogin] = useState(true); // true = show login

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center px-4">
      <div className="relative w-full max-w-5xl h-[550px] rounded-xl shadow-2xl overflow-hidden bg-white">
        {/* Form Slider Container */}
        <motion.div
          className="relative w-full h-full"
          animate={{ x: isLogin ? "0%" : "-50%" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* Login Form - absolute positioned */}
          <div className="absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center items-center px-10 bg-white">
            <h2 className="text-3xl font-bold text-zinc-800 mb-6">Sign in</h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 mb-4 border rounded border-gray-300 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 mb-4 border rounded border-gray-300 focus:outline-none"
            />
            <button className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition">
              Sign in
            </button>

            <div className="mt-6 flex items-center gap-3 text-black hover:scale-105 cursor-pointer transition">
              <FcGoogle size={24} />
              <span>Sign in with Google</span>
            </div>
          </div>

          {/* Register Form - absolute positioned */}
          <div className="absolute top-0 left-1/1 w-1/2 h-full flex flex-col justify-center items-center px-10 bg-white">
            <h2 className="text-3xl font-bold text-zinc-800 mb-6">Create Account</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-2 mb-4 border rounded border-gray-300 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 mb-4 border rounded border-gray-300 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 mb-4 border rounded border-gray-300 focus:outline-none"
            />
            <button className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition">
              Sign up
            </button>

            <div className="mt-6 flex items-center gap-3 text-black hover:scale-105 cursor-pointer transition">
              <FcGoogle size={24} />
              <span>Sign up with Google</span>
            </div>
          </div>
        </motion.div>

        {/* Overlay Panel */}
        <motion.div
          animate={{ x: isLogin ? "100%" : "0%" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-1/2 h-full z-10 bg-gradient-to-r from-pink-500 to-orange-400 text-white flex flex-col justify-center items-center px-10"
        >
          {isLogin ? (
            <>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
              <p className="mb-6">Don't have an account? Sign up now to get started!</p>
              <button
                onClick={() => setIsLogin(false)}
                className="bg-white text-pink-600 font-semibold px-6 py-2 rounded hover:bg-zinc-200 transition"
              >
                Sign up
              </button>
            </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
              <p className="mb-6">Already have an account? Sign in to continue.</p>
              <button
                onClick={() => setIsLogin(true)}
                className="bg-white text-pink-600 font-semibold px-6 py-2 rounded hover:bg-zinc-200 transition"
              >
                Sign in
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Loginpage;