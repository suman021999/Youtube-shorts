import React, { useEffect, useState } from "react";

import logo from "../../../public/youtube.svg";
import { CiSearch } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaRegSun, FaRegMoon } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../hooks/themeSlice'; 

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const dispatch = useDispatch();
 

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section
         className={`fixed top-0 left-0 z-50 w-full h-[20vh] border-[#2777a0] transition-all duration-300 
          ${scrolled && "bg-[#f4f2f2e8]"} 
          ${isDarkMode && "dark:bg-gray-800"}`}
        style={{
          backdropFilter: scrolled ? "blur(10px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
        }}
      >
        <div className="flex gap-4 p-4 mx-6 items-center justify-between">
          {/* Left: Hamburger & Logo */}
          <div className="flex gap-4 items-center">
            <div className="lg:flex hidden cursor-pointer">
              <RxHamburgerMenu className="h-6 w-6" />
            </div>
            <div className="flex items-center justify-center">
              <img src={logo} alt="" className="h-10 w-10" />
            </div>
          </div>

          {/* Search bar */}
          <div className="flex items-center">
            {/* Desktop Search */}

            <div className="hidden lg:flex items-center">
              <input
                type="text"
                placeholder="search"
                className="w-[500px] h-15 px-8 border border-[#9e9898d6] rounded-l-4xl hover:shadow-[inset_0_0_6px_#1e90ff]"
              />
              <div className="py-4 border border-[#9e9898d6] rounded-r-4xl w-[100px] h-15 flex items-center justify-center bg-[#e4dede57] hover:bg-[#cccaca95]">
                <CiSearch className="w-6 h-6" />
              </div>
            </div>

            {/* Theme Toggle Icons */}
            <div className="hidden lg:flex items-center gap-4 ml-4">
              {isDarkMode ? (
                

                   <FaRegMoon
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => dispatch(toggleTheme())}
                />
              ) : (
                <FaRegSun
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => dispatch(toggleTheme())}
                />
              )}
            </div>

            {/* Mobile Search Icon only */}
            <div className="lg:hidden flex items-center">
              <CiSearch className="w-6 h-6" />
            </div>

            {/* Theme Toggle Icons mobile */}
            <div className="lg:hidden flex  items-center gap-4 ml-4">
              {isDarkMode ?(
                    <FaRegMoon
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => dispatch(toggleTheme())}
                />
              ) : (
                <FaRegSun
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => dispatch(toggleTheme())}
                />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className=" gap-4 items-center lg:flex hidden">
            <div className="bg-[#d4d0d079] hover:bg-[#a4a1a179] px-4 py-2 rounded-4xl flex items-center gap-2">
              <GoPlus />
              Create
            </div>

            <div>
              <div className="w-10 h-10 bg-red-800 text-amber-50 flex items-center justify-center rounded-full">
                BE
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Navbar;
