import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const [isRightActive, setIsRightActive] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signInError, setSignInError] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const navigate = useNavigate();

  // Form states
  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });

  const [signUpForm, setSignUpForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSignInChange = (e) => {
    setSignInForm({
      ...signInForm,
      [e.target.name]: e.target.value,
    });
    setSignInError("");
  };

  const handleSignUpChange = (e) => {
    setSignUpForm({
      ...signUpForm,
      [e.target.name]: e.target.value,
    });
    setSignUpError("");
  };

  const switchToSignIn = () => {
    setIsRightActive(false);
    setSignUpError("");
  };

  const switchToSignUp = () => {
    setIsRightActive(true);
    setSignInError("");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSignInError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_AUTH_URL}/login`,
        signInForm
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/homes");
    } catch (err) {
      setSignInError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSignUpError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_AUTH_URL}/register`,
        {
          username: signUpForm.username,
          email: signUpForm.email,
          password: signUpForm.password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (err) {
      setSignUpError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google OAuth handlers
  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_AUTH_URL}/google`,
        { token }
      );

      console.log("Google login success:", res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/homes");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleError = () => {
    console.log("Google Login Failed");
  };

  return (
    <div className="flex justify-center items-center flex-col bg-black min-h-screen font-['Montserrat'] p-4">
      <div
        className={`bg-white rounded-xl shadow-2xl relative overflow-hidden w-full max-w-4xl md:min-h-[480px] min-h-[600px] ${
          isRightActive ? "right-panel-active" : ""
        }`}
      >
        {/* Sign Up Form */}
        <div
          className={`absolute top-0 h-full transition-all duration-600 ease-in-out md:left-0 md:w-1/2 left-0 w-full ${
            isRightActive
              ? "md:translate-x-full md:opacity-100 md:z-50 md:animate-show opacity-100 z-50"
              : "md:opacity-0 md:z-10 opacity-0 z-10"
          }`}
        >
          <form
            onSubmit={handleSignUp}
            className="bg-white flex flex-col items-center justify-center md:px-12 px-8 h-full text-center"
          >
            <h1 className="font-bold m-0 text-xl md:text-2xl mb-4">
              Create Account
            </h1>

            {signUpError && (
              <div className="w-full max-w-sm mb-2 p-2 bg-red-100 text-red-600 rounded text-sm">
                {signUpError}
              </div>
            )}

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={signUpForm.username}
              onChange={handleSignUpChange}
              required
              className="bg-gray-100 border-none py-3 px-4 text-black my-2 w-full max-w-sm rounded text-sm md:text-base"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signUpForm.email}
              onChange={handleSignUpChange}
              required
              className="bg-gray-100 border-none py-3 px-4 my-2 text-black w-full max-w-sm rounded text-sm md:text-base"
            />
            <div className="relative w-full max-w-sm">
              <input
                type={showSignUpPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={signUpForm.password}
                onChange={handleSignUpChange}
                required
                minLength="8"
                className="bg-gray-100 border-none py-3 px-4 my-2 text-black w-full max-w-sm rounded pr-10 text-sm md:text-base"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowSignUpPassword(!showSignUpPassword)}
              >
                {showSignUpPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* ✅ Google Sign Up */}
            <div className="md:my-5 my-2 flex gap-2">
              <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
            </div>

            <button
              type="button"
              onClick={switchToSignIn}
              className="md:hidden mt-2 mb-2 text-red-500 text-sm underline cursor-pointer"
            >
              Already have an account? Sign In
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-red-500 text-white text-xs font-bold py-3 px-8 md:px-12 my-2 uppercase tracking-wider border border-red-500 hover:bg-red-600 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div
          className={`absolute top-0 h-full transition-all duration-600 ease-in-out md:left-0 md:w-1/2 md:z-20 left-0 w-full z-20 ${
            isRightActive ? "md:translate-x-full opacity-0" : "opacity-100"
          }`}
        >
          <form
            onSubmit={handleSignIn}
            className="bg-white flex flex-col items-center justify-center md:px-12 px-8 h-full text-center"
          >
            <h1 className="font-bold m-0 text-xl md:text-2xl mb-4">Sign In</h1>

            {signInError && (
              <div className="w-full max-w-sm mb-2 p-2 bg-red-100 text-red-600 rounded text-sm">
                {signInError}
              </div>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signInForm.email}
              onChange={handleSignInChange}
              required
              className="bg-gray-100 border-none py-3 px-4 my-2 text-black  w-full max-w-sm rounded text-sm md:text-base"
            />
            <div className="relative w-full max-w-sm">
              <input
                type={showSignInPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={signInForm.password}
                onChange={handleSignInChange}
                required
                className="bg-gray-100 border-none py-3 px-4 my-2 text-black w-full max-w-sm rounded text-sm md:text-base pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowSignInPassword(!showSignInPassword)}
              >
                {showSignInPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* ✅ Google Sign In */}
            <div className="md:my-5 my-2 flex gap-2">
              <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
            </div>

            <button
              type="button"
              onClick={switchToSignUp}
              className="md:hidden mt-2 mb-2 text-red-500 text-sm underline cursor-pointer"
            >
              Don't have an account? Sign Up
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-red-500 text-white text-xs font-bold py-3 px-12 my-2 uppercase tracking-wider border border-red-500 hover:bg-red-600 transition disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Overlay */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-600 ease-in-out z-30 hidden md:block ${
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
                onClick={switchToSignIn}
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
                onClick={switchToSignUp}
                className="rounded-full border border-white bg-transparent text-white text-xs font-bold py-3 px-12 uppercase tracking-wider transition"
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

