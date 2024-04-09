import React, { useEffect, useState } from "react";
import { Outlet,useLocation } from "react-router";
import NavBar from "./NavBar";
import ActiveBills from "../activeBills/ActiveBills";

const WithNavbar = () => {
  const location = useLocation();
  const [adminFLag, setAdminFLag] = useState(false)
  useEffect(() => {
    if(location.pathname.includes('admin')){
      setAdminFLag(true)
    }
  }, [location.pathname])
  
  return (
    <>
      <NavBar />
      {!adminFLag && <ActiveBills />}
      <div className="main-content">
        <Outlet />
      </div>
    </>
  );
};

export default WithNavbar;
