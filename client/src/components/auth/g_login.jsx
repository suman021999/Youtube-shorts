
import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();

  // ✅ Get user from localStorage (same as LoginPage)
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_AUTH_URL}/api/v1/auth/logout`, {
        withCredentials: true,
      });

      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);

      // Still clear client-side
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  // ✅ Avatar display
  const renderAvatar = () => {
    if (!isLoggedIn) {
      return <span className="text-sm">?</span>;
    }

    if (user.avatar) {
      return (
        <img
          src={user.avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }

    const initials = user.username
      ? user.username.slice(0, 2).toUpperCase()
      : "US";

    return <span className="text-sm font-semibold">{initials}</span>;
  };

  return (
    <div className="relative">
      {/* Avatar Button */}
      <div
        className="w-10 h-10 bg-red-600 text-white flex items-center justify-center rounded-full cursor-pointer overflow-hidden"
        onClick={() => setShowLogoutPopup(!showLogoutPopup)}
      >
        {renderAvatar()}
      </div>

      {/* Dropdown */}
      {showLogoutPopup && (
        <div
          className={`absolute top-12 right-0 rounded-lg p-2 w-40 z-50 shadow-md ${
            isDarkMode ? "bg-[#1e1e1e]" : "bg-white"
          }`}
        >
          <div
            className={`py-2 px-3 rounded cursor-pointer ${
              isDarkMode
                ? "hover:bg-[#333333]"
                : "hover:bg-gray-100"
            }`}
            onClick={handleLogout}
          >
            Sign out
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

