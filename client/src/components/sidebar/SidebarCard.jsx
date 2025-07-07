import React, { useEffect, useState } from "react";
import { LiaHomeSolid } from "react-icons/lia";
import { SiYoutubeshorts } from "react-icons/si";
import { useSelector, useDispatch } from "react-redux";
import { closeSidebar } from "../../hooks/sidebarSlice";
import { Link, useLocation } from "react-router-dom"; // Added useLocation
import { GoPlus } from "react-icons/go";

const SidebarCard = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const [selectedItem, setSelectedItem] = useState("Home");
  const dispatch = useDispatch();
  const location = useLocation(); // Get current route location

  // Update selectedItem based on the current path
  useEffect(() => {
    const path = location.pathname;
    if (path === "/shorts") {
      setSelectedItem("Shorts");
    } else if (path === "/") {
      setSelectedItem("Home");
    }
  }, [location.pathname]); // Re-run when path changes

  // Close sidebar when clicking outside (unchanged)
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
      <section
        className={`
          p-4 
          transition-all 
          duration-300
          h-[85vh] 
          fixed 
          z-70 
          lg:flex 
          hidden
          ${isSidebarOpen ? "w-[20vw]" : "w-[100px]"}
          ${isDarkMode ? "bg-[#121212]" : ""}
          sidebar
        `}
      >
        <div className="p-4 w-full h-[30vh] rounded-lg flex flex-col gap-4">
          {/* Home Item */}
          <Link
            to="/"
            className={`${
              selectedItem === "Home"
                ? isDarkMode
                  ? "bg-[#dbe1e330]"
                  : "bg-[#b3b0b034]"
                : "bg-transparent"
            } 
            h-10 flex items-center rounded-lg cursor-pointer ${
              !isSidebarOpen ? "justify-center" : ""
            }`}
          >
            <LiaHomeSolid
              className={`h-6 w-6 mx-2 flex-shrink-0 ${
                isDarkMode ? "text-white" : ""
              }`}
            />
            {isSidebarOpen && (
              <h2 className={isDarkMode ? "text-white" : ""}>Home</h2>
            )}
          </Link>

          {/* Shorts Item */}
          <Link
            to="/shorts"
            className={`${
              selectedItem === "Shorts"
                ? isDarkMode
                  ? "bg-[#dbe1e330]"
                  : "bg-[#b3b0b034]"
                : "bg-transparent"
            } 
            h-10 flex items-center rounded-lg cursor-pointer ${
              !isSidebarOpen ? "justify-center" : ""
            }`}
          >
            <SiYoutubeshorts
              className={`h-6 w-6 mx-2 flex-shrink-0 ${
                isDarkMode ? "text-white" : ""
              }`}
            />
            {isSidebarOpen && (
              <h2 className={isDarkMode ? "text-white" : ""}>Shorts</h2>
            )}
          </Link>
        </div>
      </section>

      {/* Mobile Bottom Navigation */}
      <div
        className={`fixed bottom-0 left-0 right-0 lg:hidden flex justify-around items-center p-2 z-50
         ${isDarkMode ? "bg-[#1e1e1e]" : "bg-white"} border-t ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        {/* Home (Mobile) */}
        <Link
          to="/"
          className={`${
            selectedItem === "Home"
              ? isDarkMode
                ? "bg-[#dbe1e330]"
                : "bg-[#b3b0b034]"
              : "bg-transparent"
          } 
          h-10 flex items-center rounded-lg cursor-pointer justify-center`}
        >
          <LiaHomeSolid
            className={`h-6 w-6 mx-2 flex-shrink-0 ${
              isDarkMode ? "text-white" : ""
            }`}
          />
        </Link>

        {/* Shorts (Mobile) */}
        <Link
          to="/shorts"
          className={`${
            selectedItem === "Shorts"
              ? isDarkMode
                ? "bg-[#dbe1e330]"
                : "bg-[#b3b0b034]"
              : "bg-transparent"
          } 
          h-10 flex items-center rounded-lg cursor-pointer justify-center`}
        >
          <SiYoutubeshorts
            className={`h-6 w-6 mx-2 flex-shrink-0 ${
              isDarkMode ? "text-white" : ""
            }`}
          />
        </Link>

        {/* Plus & Profile (Mobile - unchanged) */}
        <div
          className={`${
            isDarkMode
              ? "bg-[#333] hover:bg-[#444]"
              : "bg-[#d4d0d079] hover:bg-[#a4a1a179]"
          } 
          w-10 h-10 flex items-center justify-center rounded-full`}
        >
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