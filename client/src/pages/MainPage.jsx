import { Route,Routes } from "react-router-dom";
import Login from "./Loginpage";
import Dashboard from "../components/dashboard/Dashboard";




const MainPage = () => {
  return (
    <>
      
      <section >
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/*" element={<Dashboard />} />
          
          
          
        </Routes>

        
      </section>
    </>
  );
};

export default MainPage;
