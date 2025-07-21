import React, { useEffect, useState } from "react";
import { LiaHomeSolid } from "react-icons/lia";
import { SiYoutubeshorts } from "react-icons/si";
import { useSelector, useDispatch } from "react-redux";
import { closeSidebar } from "../../hooks/sidebarSlice";
import { Link, useLocation } from "react-router-dom";
import { GoPlus } from "react-icons/go";

const SidebarCard = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  // Only highlight if on these exact paths
  const shouldHighlightHome = location.pathname === "/homes";
  const shouldHighlightShorts = location.pathname === "/shorts";

  // Progress bar animation (unchanged)
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
              shouldHighlightHome ? 
                (isDarkMode ? "bg-[#dbe1e330]" : "bg-[#b3b0b034]") : 
                "bg-transparent"
            } h-10 flex items-center rounded-lg cursor-pointer ${
              !isSidebarOpen ? "justify-center" : ""
            }`}
          >
            <LiaHomeSolid className={`h-6 w-6 mx-2 flex-shrink-0 ${isDarkMode ? "text-white" : ""}`} />
            {isSidebarOpen && <h2 className={isDarkMode ? "text-white" : ""}>Home</h2>}
          </Link>

          <Link
            to="/shorts"
            className={`${
              shouldHighlightShorts ? 
                (isDarkMode ? "bg-[#dbe1e330]" : "bg-[#b3b0b034]") : 
                "bg-transparent"
            } h-10 flex items-center rounded-lg cursor-pointer ${
              !isSidebarOpen ? "justify-center" : ""
            }`}
          >
            <SiYoutubeshorts className={`h-6 w-6 mx-2 flex-shrink-0 ${isDarkMode ? "text-white" : ""}`} />
            {isSidebarOpen && <h2 className={isDarkMode ? "text-white" : ""}>Shorts</h2>}
          </Link>
        </div>
      </section>

      {/* mobile option */}
      <div className={`fixed bottom-0 left-0 right-0 lg:hidden flex justify-around items-center p-2 z-50 ${
        isDarkMode ? "bg-[#1e1e1e]" : "bg-white"
      } border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        <Link
          to="/homes"
          className={`${
            shouldHighlightHome ? 
              (isDarkMode ? "bg-[#dbe1e330]" : "bg-[#b3b0b034]") : 
              "bg-transparent"
          } h-10 flex items-center rounded-lg cursor-pointer justify-center`}
        >
          <LiaHomeSolid className={`h-6 w-6 mx-2 flex-shrink-0 ${isDarkMode ? "text-white" : ""}`} />
        </Link>

        <Link
          to="/shorts"
          className={`${
            shouldHighlightShorts ? 
              (isDarkMode ? "bg-[#dbe1e330]" : "bg-[#b3b0b034]") : 
              "bg-transparent"
          } h-10 flex items-center rounded-lg cursor-pointer justify-center`}
        >
          <SiYoutubeshorts className={`h-6 w-6 mx-2 flex-shrink-0 ${isDarkMode ? "text-white" : ""}`} />
        </Link>

        <div className={`${
          isDarkMode ? "bg-[#333] hover:bg-[#444]" : "bg-[#d4d0d079] hover:bg-[#a4a1a179]"
        } w-10 h-10 flex items-center justify-center rounded-full`}>
          <Link to="/create"><GoPlus className="w-6 h-6" /></Link>
        </div>
        <div 
          className="w-10 h-10 bg-red-800 text-amber-50 flex items-center justify-center rounded-full cursor-pointer"
          onClick={() => setShowLogoutPopup(!showLogoutPopup)}
        >
          BE
        </div>

        {showLogoutPopup && (
          <div className={`absolute -top-18 right-2 rounded-lg p-2 w-40 z-50 ${isDarkMode ? "dark:bg-[#3e3d3df8]" : "bg-[#b9b8b8f3]"}`}>
            <div className={`py-2 px-3 rounded cursor-pointer ${isDarkMode ? "dark:hover:bg-[#dbe1e330]" : "hover:bg-[#5b59599c] hover:bg-opacity-20"}`}>
              Sign out
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SidebarCard;