
import React, { useEffect, useState } from "react";
import { toggleSidebar } from '../../hooks/sidebarSlice';
import logo from "../../../public/youtube.svg";
import { CiSearch } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaRegSun, FaRegMoon } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../hooks/themeSlice'; 
import Searchbar from '../searchbar/Searchbar'; // Import the Searchbar component
import {Link} from "react-router-dom"
import Login from "../auth/g_login";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  return (
    <>
      <section
         className={`fixed top-0 left-0 z-50 w-full h-[20vh] border-[#2777a0] transition-all duration-300 
         ${scrolled ? (isDarkMode ? "dark:bg-[#030303e4]" : "bg-[#f4f2f2e8]") : ""}`}
        style={{
          backdropFilter: scrolled ? "blur(10px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
        }}
      >
        <div className="flex gap-4 p-4 mx-6 items-center justify-between">
          {/* Left: Hamburger & Logo */}
          <div className="flex gap-4 items-center">
            <div className="lg:flex hidden cursor-pointer">
              <RxHamburgerMenu 
              className="h-6 w-6" 
               onClick={() => dispatch(toggleSidebar())}
              />
            </div>
            <div className="flex items-center justify-center">
              <Link to="/homes"><img src={logo} alt="" className="h-10 w-10" /></Link>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex items-center">
            {/* Desktop Search */}
            <div className="hidden lg:flex items-center">
              <input
                id="search"
                type="text"
                placeholder="search"
                className="w-[500px] h-10 px-8 border border-[#9e9898d6] rounded-l-4xl hover:shadow-[inset_0_0_6px_#1e90ff]"
                onClick={handleSearchClick}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              <div className="py-4 border border-[#9e9898d6] rounded-r-4xl w-[100px] h-10 flex items-center justify-center bg-[#e4dede57] hover:bg-[#cccaca95]">
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
              <CiSearch className="w-6 h-6" onClick={handleSearchClick} />
            </div>

            {/* Theme Toggle Icons mobile */}
            <div className="lg:hidden flex items-center gap-4 ml-4">
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
          <div className="gap-4 items-center lg:flex hidden">
            <Link to="/create">
            <div className="bg-[#d4d0d079] hover:bg-[#a4a1a179] px-4 py-2 rounded-4xl flex items-center gap-2">
              <GoPlus />
              Create
            </div>
            </Link>
            

            <Login/>
            
          </div>
        </div>
      </section>

      {/* Searchbar overlay */}
      <Searchbar isOpen={isSearchOpen} onClose={handleSearchClose} />
    </>
  );
};

export default Navbar;