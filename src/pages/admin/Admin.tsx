import React, { useEffect, useState } from "react";
import "./Admin.scss";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BiSolidDrink } from "react-icons/bi";
import { BiCategoryAlt } from "react-icons/bi";
import { FaChartBar } from "react-icons/fa";

function Sidebar({ isOpen, toggleSidebar }: any) {
  return (
    <div className={`pmy side ${isOpen ? "open" : ""}`}>
      <div className="flex">
        <button onClick={toggleSidebar} className="m-1 scy">
          ☰
        </button>
      </div>
      <div className="flex flex-column font-semibold text-base text-green-700 mt-3">
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive
              ? "activelink flex gap-2 align-items-center navlinks"
              : "flex gap-2 align-items-center navlinks"
          }
        >
          <BiSolidDrink />
          <span className={isOpen ? "" : "hidden"}>Products</span>
        </NavLink>
        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            isActive
              ? "activelink flex gap-2 align-items-center navlinks"
              : "flex gap-2 align-items-center navlinks"
          }
        >
          <BiCategoryAlt />
          <span className={isOpen ? "" : "hidden"}>Categories</span>
        </NavLink>
        <NavLink
          to="/admin/bills"
          className={({ isActive }) =>
            isActive
              ? "activelink flex gap-2 align-items-center navlinks"
              : "flex gap-2 align-items-center navlinks"
          }
        >
          <FaChartBar />
          <span className={isOpen ? "" : "hidden"}>Bills</span>
        </NavLink>
      </div>
    </div>
  );
}

function Admin() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const [setAdmin, setSetAdmin] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (sessionStorage.getItem("isAdmin")) {
      if (sessionStorage.getItem("isAdmin") !== "true") {
        navigate("/");
        setSetAdmin(false);
      } else {
        setSetAdmin(true);
      }
    } else {
      navigate("/");
      setSetAdmin(false);
    }
  }, [navigate]);

  return (
    <div className="flex">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      {setAdmin && (
        <div className="content">
          <Outlet />
        </div>
      )}
    </div>
  );
}

export default Admin;
