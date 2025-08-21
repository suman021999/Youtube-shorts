
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./Loginpage";
import Dashboard from "../components/dashboard/Dashboard";


const MainPage = () => {
  
  return (
    <>
      <section >
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Dashboard />} />
        </Routes>
      </section>
    </>
  );
};

export default MainPage;