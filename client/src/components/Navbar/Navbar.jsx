// import React, { useEffect, useState } from "react";

// import logo from "../../../public/youtube.svg";
// import { CiSearch } from "react-icons/ci";
// import { GoPlus } from "react-icons/go";
// import { RxHamburgerMenu } from "react-icons/rx";
// const Navbar = () => {
//   const [mobileview, setMobileview] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   //   const [sidebarOpen, setSidebarOpen] = useState(false);

//   //   const toggleSidebar = () => {
//   //     setSidebarOpen(!sidebarOpen);
//   //   };

//     useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 50) {
//         setScrolled(true);
//       } else {
//         setScrolled(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);
//   return (
//     <>
//       <section className={`fixed top-0 left-0 z-50 w-full h-[20vh] border-[#2777a0] bg-white backdrop-blur-lg transition-all duration-300 ${scrolled ? "bg-black/50" : "bg-transparent"}`}

//       style={{
//         backdropFilter: "blur(10px)", // For browsers that need inline style
//         WebkitBackdropFilter: "blur(10px)", // Safari support
//       }}

//       >
//         <div className="flex gap-4 p-4 mx-6 items-center justify-between">
//           <div className="flex gap-4 items-center">
//             <div>
//               <RxHamburgerMenu className="h-6 w-6" />
//             </div>

//             <div>
//               <img src={logo} alt="" className="h-10 w-10" />
//             </div>
//           </div>

//           <div>
//             <div className="flex items-center">
//               <input
//                 type="text"
//                 name="search"
//                 id="search"
//                 placeholder="search"
//                 className="w-[500px] h-15 px-8 border-1 border-[#9e9898d6]
//            rounded-l-4xl hover:shadow-[inset_0_0_6px_#1e90ff] "
//               />
//               <div className="flex py-4 border-1 rounded-r-4xl w-[100px] h-15 items-center justify-center bg-[#e4dede57] hover:bg-[#cccaca95] border-[#9e9898d6]">
//                 <CiSearch className="w-6 h-6" />
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-4 items-center">
//             <div className="bg-[#d4d0d079] hover:bg-[#a4a1a179] px-4 py-2 rounded-4xl flex items-center gap-2">
//               <GoPlus />
//               Create
//             </div>
//             <div>
//               <div className="w-10 h-10 bg-red-800 text-amber-50 flex items-center justify-center rounded-full">
//                 BE
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Navbar;




import React, { useEffect, useState } from "react";

import logo from "../../../public/youtube.svg";
import { CiSearch } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

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
        className={`fixed top-0 left-0 z-50 w-full h-[20vh] border-[#2777a0] transition-all duration-300 ${
          scrolled ? "bg-[#f4f2f2e8]" : "bg-transparent"
        }`}
        style={{
          backdropFilter: scrolled ? "blur(10px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
        }}
      >
        <div className="flex gap-4 p-4 mx-6 items-center justify-between">
          {/* Left: Hamburger & Logo */}
          <div className="flex gap-4 items-center">
            <div>
              <RxHamburgerMenu className="h-6 w-6" />
            </div>
            <div>
              <img src={logo} alt="" className="h-10 w-10" />
            </div>
          </div>

          {/* Search bar */}
          <div>
            <div className="flex items-center">
              <input
                type="text"
                name="search"
                id="search"
                placeholder="search"
                className="w-[500px] h-15 px-8 border-1 border-[#9e9898d6] rounded-l-4xl hover:shadow-[inset_0_0_6px_#1e90ff]"
              />
              <div className="flex py-4 border-1 rounded-r-4xl w-[100px] h-15 items-center justify-center bg-[#e4dede57] hover:bg-[#cccaca95] border-[#9e9898d6]">
                <CiSearch className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 items-center">
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