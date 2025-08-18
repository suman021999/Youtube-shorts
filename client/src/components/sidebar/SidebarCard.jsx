import React, { useEffect, useState } from "react";
import { LiaHomeSolid } from "react-icons/lia";
import { SiYoutubeshorts } from "react-icons/si";
import { useSelector, useDispatch } from "react-redux";
import { closeSidebar } from "../../hooks/sidebarSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import axios from "axios";

const SidebarCard = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;

  const getRandomVideo = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_VIDEO_URL}/random`);
      if (response.data?.success && response.data.data?._id) {
        return response.data.data._id;
      }
      throw new Error("No video found");
    } catch (error) {
      console.error("Error fetching random video:", error);
      return null;
    }
  };

  const handleShortsClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const randomVideoId = await getRandomVideo();
      if (randomVideoId) {
        navigate(`/shorts/${randomVideoId}`);
      } else {
        navigate('/shorts');
      }
    } catch (error) {
      console.error("Failed to navigate to random video:", error);
      navigate('/shorts');
    } finally {
      setIsLoading(false);
    }
  };

  const renderAvatar = () => {
    if (!isLoggedIn) {
      return <span className="text-sm">?</span>;
    }
    
    if (user.avatar) {
      return <p>{user.avatar} </p>;
    }
    
    const initials = user.username 
      ? user.username.slice(0, 2).toUpperCase()
      : "US";
    
    return <span className="text-sm">{initials}</span>;
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_AUTH_URL}/logout`, {
        withCredentials: true
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  useEffect(() => {
    let timer;
    let progressInterval;

    const startLoading = () => {
      setIsLoading(true);
      setProgress(0);
      setProgress(20);
      progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200);
    };

    const completeLoading = () => {
      clearInterval(progressInterval);
      setProgress(100);
      timer = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);
    };

    startLoading();
    const timeout = setTimeout(completeLoading, 500); 

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
      clearTimeout(timeout);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && !event.target.closest(".sidebar")) {
        dispatch(closeSidebar());
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen, dispatch]);

  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[1000] bg-transparent overflow-hidden">
          <div
            className={`h-full ${isDarkMode ? "bg-red-500" : "bg-red-600"} transition-all duration-300 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <section className={`p-4 transition-all duration-300 h-[85vh] fixed z-70 lg:flex hidden ${
        isSidebarOpen ? "w-[20vw]" : "w-[100px]"
      } sidebar`}>
        <div className="p-4 w-full h-[30vh] rounded-lg flex flex-col gap-4">
          <Link
            to="/homes"
            className={`${
              location.pathname === "/homes" ? 
                (isDarkMode ? "bg-[#dbe1e330]" : "bg-[#b3b0b034]") : 
                "bg-transparent"
            } h-10 flex items-center rounded-lg cursor-pointer ${
              !isSidebarOpen ? "justify-center" : ""
            }`}
          >
            <LiaHomeSolid className={`h-6 w-6 mx-2 flex-shrink-0 ${isDarkMode ? "text-white" : ""}`} />
            {isSidebarOpen && <h2 className={isDarkMode ? "text-white" : ""}>Home</h2>}
          </Link>

          <div
            onClick={handleShortsClick}
            className={`${
              location.pathname.includes("/shorts") ? 
                (isDarkMode ? "bg-[#dbe1e330]" : "bg-[#b3b0b034]") : 
                "bg-transparent"
            } h-10 flex items-center rounded-lg cursor-pointer ${
              !isSidebarOpen ? "justify-center" : ""
            }`}
          >
            <SiYoutubeshorts className={`h-6 w-6 mx-2 flex-shrink-0 ${isDarkMode ? "text-white" : ""}`} />
            {isSidebarOpen && <h2 className={isDarkMode ? "text-white" : ""}>Shorts</h2>}
          </div>
        </div>
      </section>

      <div className={`fixed bottom-0 left-0 right-0 lg:hidden flex justify-around items-center p-2 z-50 ${
        isDarkMode ? "bg-[#1e1e1e]" : "bg-white"
      } border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        <Link
          to="/homes"
          className={`${
            location.pathname === "/homes" ? 
              (isDarkMode ? "bg-[#dbe1e330]" : "bg-[#b3b0b034]") : 
              "bg-transparent"
          } h-10 flex items-center rounded-lg cursor-pointer justify-center`}
        >
          <LiaHomeSolid className={`h-6 w-6 mx-2 flex-shrink-0 ${isDarkMode ? "text-white" : ""}`} />
        </Link>

        <div
          onClick={handleShortsClick}
          className={`${
            location.pathname.includes("/shorts") ? 
              (isDarkMode ? "bg-[#dbe1e330]" : "bg-[#b3b0b034]") : 
              "bg-transparent"
          } h-10 flex items-center rounded-lg cursor-pointer justify-center`}
        >
          <SiYoutubeshorts className={`h-6 w-6 mx-2 flex-shrink-0 ${isDarkMode ? "text-white" : ""}`} />
        </div>

        <div className={`${
          isDarkMode ? "bg-[#333] hover:bg-[#444]" : "bg-[#d4d0d079] hover:bg-[#a4a1a179]"
        } w-10 h-10 flex items-center justify-center rounded-full`}>
          <Link to="/create"><GoPlus className="w-6 h-6" /></Link>
        </div>
        <div 
          className="w-10 h-10 bg-red-800 text-amber-50 flex items-center justify-center rounded-full cursor-pointer overflow-hidden"
          onClick={() => setShowLogoutPopup(!showLogoutPopup)}
        >
          {renderAvatar()}
        </div>

        {showLogoutPopup && (
          <div className={`absolute -top-18 right-2 rounded-lg p-2 w-40 z-50 ${isDarkMode ? "dark:bg-[#3e3d3df8]" : "bg-[#b9b8b8f3]"}`}>
            <div 
              className={`py-2 px-3 rounded cursor-pointer ${isDarkMode ? "dark:hover:bg-[#dbe1e330]" : "hover:bg-[#5b59599c] hover:bg-opacity-20"}`}
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

export default SidebarCard;
