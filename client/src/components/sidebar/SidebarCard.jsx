
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
  const [selectedItem, setSelectedItem] = useState("Home");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  // Progress bar animation
  useEffect(() => {
    let timer;
    let progressInterval;

    const startLoading = () => {
      setIsLoading(true);
      setProgress(0);
      
      // Initial jump
      setProgress(20);
      
      // Slow gradual increase
      progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200); // Slower interval (200ms instead of 100ms)
    };

    const completeLoading = () => {
      clearInterval(progressInterval);
      setProgress(100);
      
      timer = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500); // Longer delay before hiding (500ms)
    };

    startLoading();
    const timeout = setTimeout(completeLoading, 500); 

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
      clearTimeout(timeout);
    };
  }, [location.pathname]);

  // Rest of your existing code...
  useEffect(() => {
    const path = location.pathname;
    if (path === "/shorts") {
      setSelectedItem("Shorts");
    } else if (path === "/") {
      setSelectedItem("Home");
    }
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
      {/* Progress Bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[1000] bg-transparent overflow-hidden">
          <div
            className={`h-full ${isDarkMode ? "bg-red-500" : "bg-red-600"} transition-all duration-300 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Rest of your existing JSX remains exactly the same */}
      <section className={`p-4 transition-all duration-300 h-[85vh] fixed z-70 lg:flex hidden ${isSidebarOpen ? "w-[20vw]" : "w-[100px]"}  sidebar`}>
        <div className="p-4 w-full h-[30vh] rounded-lg flex flex-col gap-4">
          <Link
            to="/"
            className={`${selectedItem === "Home" ? isDarkMode ? "bg-[#dbe1e330]" : "bg-[#b3b0b034]" : "bg-transparent"} h-10 flex items-center rounded-lg cursor-pointer ${!isSidebarOpen ? "justify-center" : ""}`}
          >
            <LiaHomeSolid className={`h-6 w-6 mx-2 flex-shrink-0 ${isDarkMode ? "text-white" : ""}`} />
            {isSidebarOpen && <h2 className={isDarkMode ? "text-white" : ""}>Home</h2>}
          </Link>

          <Link
            to="/shorts"
            className={`${selectedItem === "Shorts" ? isDarkMode ? "bg-[#dbe1e330]" : "bg-[#b3b0b034]" : "bg-transparent"} h-10 flex items-center rounded-lg cursor-pointer ${!isSidebarOpen ? "justify-center" : ""}`}
          >
            <SiYoutubeshorts className={`h-6 w-6 mx-2 flex-shrink-0 ${isDarkMode ? "text-white" : ""}`} />
            {isSidebarOpen && <h2 className={isDarkMode ? "text-white" : ""}>Shorts</h2>}
          </Link>
        </div>
      </section>

      <div className={`fixed bottom-0 left-0 right-0 lg:hidden flex justify-around items-center p-2 z-50 ${isDarkMode ? "bg-[#1e1e1e]" : "bg-white"} border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        <Link
          to="/"
          className={`${selectedItem === "Home" ? isDarkMode ? "bg-[#dbe1e330]" : "bg-[#b3b0b034]" : "bg-transparent"} h-10 flex items-center rounded-lg cursor-pointer justify-center`}
        >
          <LiaHomeSolid className={`h-6 w-6 mx-2 flex-shrink-0 ${isDarkMode ? "text-white" : ""}`} />
        </Link>

        <Link
          to="/shorts"
          className={`${selectedItem === "Shorts" ? isDarkMode ? "bg-[#dbe1e330]" : "bg-[#b3b0b034]" : "bg-transparent"} h-10 flex items-center rounded-lg cursor-pointer justify-center`}
        >
          <SiYoutubeshorts className={`h-6 w-6 mx-2 flex-shrink-0 ${isDarkMode ? "text-white" : ""}`} />
        </Link>

        <div className={`${isDarkMode ? "bg-[#333] hover:bg-[#444]" : "bg-[#d4d0d079] hover:bg-[#a4a1a179]"} w-10 h-10 flex items-center justify-center rounded-full`}>
          <GoPlus className="w-6 h-6" />
        </div>
        <div className="w-10 h-10 bg-red-800 text-amber-50 flex items-center justify-center rounded-full">
          BE
        </div>
      </div>
    </>
  );
};

export default SidebarCard;