import React from "react";
import Navbar from "../Navbar/Navbar";
import SidebarCard from "../sidebar/SidebarCard";
import Homecontext from "../Home/Homecontext";
import { Route, Routes } from "react-router-dom";
import Shortscontext from "../shorts/Shortscontext";
import Mypage from "../Home/Mypage";
import Create from "../create/Create";



const Dashboard = props => {
  return (
    <>
      <Navbar />
      <section className="w-full min-h-screen  pt-[15vh] flex">
        <Routes>
          <Route path="/homes" element={<Homecontext />} />
          <Route path="/shorts" element={<Shortscontext />} />
          <Route path="/Mychennel" element={<Mypage />} />
          <Route path="/create" element={<Create />} />
          
          
        </Routes>

        <SidebarCard />
      </section>
    </>
  )
}

Dashboard.propTypes = {

}

export default Dashboard
