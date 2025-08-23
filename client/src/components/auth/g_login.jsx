
// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const isDarkMode = useSelector((state) => state.theme.isDarkMode);
//   const [showLogoutPopup, setShowLogoutPopup] = useState(false);
//   const navigate = useNavigate();

//   // ✅ Get user from localStorage
//   const user = JSON.parse(localStorage.getItem("user"));
//   const isLoggedIn = !!user;

//   const handleLogout = async () => {
//     try {
//       await axios.get(`${import.meta.env.VITE_AUTH_URL}/api/v1/auth/logout`, {
//         withCredentials: true,
//       });

//       // Clear auth data
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");

//       navigate("/");
//     } catch (error) {
//       console.error("Logout failed:", error);

//       // Still clear client-side
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       navigate("/");
//     }
//   };

//   // ✅ Avatar display
//   const renderAvatar = () => {
//     if (!isLoggedIn) {
//       return <span className="text-sm">?</span>;
//     }

//     if (user.avatar) {
//       // Check if avatar looks like an image URL (http, https, or base64 data:image)
//       const isImage =
//         typeof user.avatar === "string" &&
//         (user.avatar.startsWith("http") || user.avatar.startsWith("data:image"));

//       if (isImage) {
//         return (
//           <img
//             src={user.avatar}
//             alt="avatar"
//             className="w-10 h-10 rounded-full object-cover"
//           />
//         );
//       } else {
//         // If avatar is just text
//         return <p className="text-sm font-semibold">{user.avatar}</p>;
//       }
//     }

//     // Fallback: show initials
//     const initials = user.username
//       ? user.username.slice(0, 2).toUpperCase()
//       : "US";

//     return <span className="text-sm font-semibold">{initials}</span>;
//   };

//   return (
//     <div className="relative">
//       {/* Avatar Button */}
//       <div
//         className="w-10 h-10 bg-red-600 text-white flex items-center justify-center rounded-full cursor-pointer overflow-hidden"
//         onClick={() => setShowLogoutPopup(!showLogoutPopup)}
//       >
//         {renderAvatar()}
//       </div>

//       {/* Dropdown */}
//       {showLogoutPopup && (
//         <div
//           className={`absolute top-12 right-0 rounded-lg p-2 w-40 z-50 shadow-md ${
//             isDarkMode ? "bg-[#1e1e1e]" : "bg-white"
//           }`}
//         >
//           <div
//             className={`py-2 px-3 rounded cursor-pointer ${
//               isDarkMode ? "hover:bg-[#333333]" : "hover:bg-gray-100"
//             }`}
//             onClick={handleLogout}
//           >
//             Sign out
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Login;

import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLogoutPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get user from localStorage safely
  const getUser = () => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  const user = getUser();
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_AUTH_URL}/api/v1/auth/logout`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear client-side data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setShowLogoutPopup(false);
      navigate("/");
    }
  };

  // Avatar display with better fallbacks
  const renderAvatar = () => {
    if (!isLoggedIn) {
      return (
        <div className="w-10 h-10 bg-gray-400 text-white flex items-center justify-center rounded-full cursor-pointer">
          <span className="text-sm">?</span>
        </div>
      );
    }

    if (user.avatar) {
      const isImage =
        typeof user.avatar === "string" &&
        (user.avatar.startsWith("http") || 
         user.avatar.startsWith("data:image"));

      if (isImage) {
        return (
          <img
            src={user.avatar}
            alt="User avatar"
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        );
      }
    }

    // Fallback: show initials
    const initials = user.username
      ? user.username.slice(0, 2).toUpperCase()
      : "US";

    return (
      <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center rounded-full">
        <span className="text-sm font-semibold">{initials}</span>
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <div
        className="cursor-pointer"
        onClick={() => setShowLogoutPopup(!showLogoutPopup)}
        aria-haspopup="true"
        aria-expanded={showLogoutPopup}
      >
        {renderAvatar()}
      </div>

      {/* Dropdown */}
      {showLogoutPopup && (
        <div
          className={`absolute top-12 right-0 rounded-lg p-2 w-40 z-50 shadow-md ${
            isDarkMode 
              ? "bg-[#1e1e1e] border border-gray-700" 
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="py-2 px-3 text-sm">
            {user?.username && (
              <div className={`mb-2 truncate ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {user.username}
              </div>
            )}
          </div>
          <div
            className={`py-2 px-3 rounded cursor-pointer text-sm ${
              isDarkMode 
                ? "hover:bg-[#333333] text-red-400" 
                : "hover:bg-gray-100 text-red-600"
            }`}
            onClick={handleLogout}
            role="button"
            tabIndex={0}
          >
            Sign out
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;