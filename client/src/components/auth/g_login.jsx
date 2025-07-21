
import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();



  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_AUTH_URL}/logout`, {
        withCredentials: true
      });
      
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Redirect to login page
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API logout fails, clear client-side auth
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

    // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;

  // Avatar display logic
  const renderAvatar = () => {
    if (!isLoggedIn) {
      return <span className="text-sm">?</span>;
    }
    
    // For Google users with avatar image
    if (user.avatar) {
      return (    
        <p>{user.avatar}</p>
      );
    }
    
    // For regular users - show initials
    const initials = user.username 
      ? user.username.slice(0, 2).toUpperCase()
      : "US";
    
    return <span className="text-sm">{initials}</span>;
  };

  return (
    <>
      <div className="relative">
        <div
          className="w-10 h-10 bg-red-800 text-amber-50 flex items-center justify-center rounded-full cursor-pointer overflow-hidden"
          onClick={() => setShowLogoutPopup(!showLogoutPopup)}
        >
          {renderAvatar()}
        </div>

        {showLogoutPopup && (
          <div
            className={`absolute top-12 right-0 rounded-lg p-2 w-40 z-50 ${
              isDarkMode ? "dark:bg-[#030303e4]" : "bg-[#b3b0b034]"
            }`}
          >
            <div
              className={`py-2 px-3 rounded cursor-pointer ${
                isDarkMode
                  ? "dark:hover:bg-[#dbe1e330]"
                  : "hover:bg-[#b3b0b043] hover:bg-opacity-20"
              }`}
              onClick={handleLogout}
            >
              Sign out
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;

