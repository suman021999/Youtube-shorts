import React from "react";
import Navbar from "../Navbar/Navbar";
import SidebarCard from "../sidebar/SidebarCard";
import Homecontext from "../Home/Homecontext";
import { Route, Routes } from "react-router-dom";
import Shortscontext from "../shorts/Shortscontext";
import Mypage from "../Home/Mypage";
import Create from "../create/Create";
import { useSelector } from "react-redux";



const Dashboard = () => {
  const isBlurred = useSelector((state) => state.blur.isBlurred);
  return (
    <>
      <section className={isBlurred ? "blurred" : ""}>
        <div className="w-full min-h-screen  flex">
          
        <Routes>
          <Route path="/homes" element={<Homecontext />} />
          <Route path="/shorts/:id" element={<Shortscontext />} />
          <Route path="/channel/:username" element={<Mypage />} />
          <Route path="/create" element={<Create />} />
          
          
        </Routes>

        <SidebarCard />
      </div>
      </section>
      <Navbar />
      
    </>
  )
}
export default Dashboard
