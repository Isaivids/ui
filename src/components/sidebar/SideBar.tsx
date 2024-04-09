import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from '../../assets/logo.png'
import "./SideBar.scss";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../../store/slice/category";
import { AppDispatch } from "../../store/store";
import Shimmer from "../shimmer/Shimmer";
import { Message } from 'primereact/message';
        
const SideBar = () => {
  const [data, setData]:any = useState([])
  const categoryDetails = useSelector((state: any) => state.categoryDetals);
  const dispatch = useDispatch<AppDispatch>();
  const fetchData = useCallback(async () => {
    try {
      const categories = await dispatch(getCategory());
      const categoryData = categories.payload?.data;
      const all = {
        name: 'All',
        image: '',
        categoryId: 'all'
      };
  
      setData([all, ...categoryData]);
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);
  
  useEffect(() => {
    const fetchDataAndLog = async () => {
      await fetchData();
    };
    fetchDataAndLog()
  }, [fetchData]);

  return (
    <div className="left-sidebar surface-ground p-3">
    {(categoryDetails.loading) && <Shimmer count={6}/>}
    {(categoryDetails.error) && <Message severity="error" text="Unable to fetch Data" />}
      {data.length > 0 &&
        data.map((x: any, index: number) => {
          return (
            <NavLink
              to={`/list/${x.categoryId}`}
              key={index}
              className={({ isActive }) => isActive ? 'active-link flex p-2 flex-column mb-3 shadow-1 border-round-md' : 'flex p-2 cat flex-column mb-3 shadow-1 border-round-md'}
            >
              <img src={x.image || logo} alt={x.name} />
              <span className="text-center">
                {x.name}
              </span>
            </NavLink>
          );
        })}
    </div>
  );
};

export default SideBar;
