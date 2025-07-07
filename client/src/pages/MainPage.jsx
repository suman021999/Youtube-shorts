import React from "react";
import Navbar from "../components/Navbar/Navbar";
import SidebarCard from "../components/sidebar/SidebarCard";
import Homecontext from "../components/Home/Homecontext";
import { Route, Routes } from "react-router-dom";
import Shortscontext from "../components/shorts/Shortscontext";

const MainPage = () => {
  return (
    <>
      <Navbar />
      <section className="w-full min-h-screen  pt-[15vh] flex">
        <Routes>
          <Route path="/" element={<Homecontext />} />
          <Route path="/shorts" element={<Shortscontext />} />
        </Routes>

        <SidebarCard />
      </section>
    </>
  );
};

export default MainPage;
