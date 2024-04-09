import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.scss";
import logo from "../../assets/logo.png";
import "./NavBar.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { clearCart } from "../../store/slice/cart";
import {
  clearSelectedUser,
  clearUser,
  setLoggedInUser,
} from "../../store/slice/user";
import { clearProducts } from "../../store/slice/products";
import { Button } from "primereact/button";

const NavBar = () => {
  const userDetails = useSelector((state: any) => state.userDetails);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    const today = new Date();
    const timestamp = today.getTime();
    const randomNumber = Math.floor(Math.random() * timestamp);
    if(!userDetails.body.selectedUser){
      const body:any = {
        _id : 'id'+randomNumber,
        name:'C'+randomNumber,
        admin:false,
        active:true,
      }
      dispatch(setLoggedInUser(body));
    }
  }, [dispatch, userDetails.body.selectedUser]);

  const logout = () => {
    dispatch(clearCart());
    dispatch(clearUser());
    dispatch(clearProducts());
    dispatch(clearSelectedUser());
    sessionStorage.removeItem('isAdmin')
    navigate("/");
  };

  return (
    <div className="navbar flex px-6 w-full align-items-center justify-content-between pmy">
      <div className="logo flex gap-1 align-items-center">
        <img src={logo} alt="Tender Town" />
        <span className="scy">Tender Town</span>
      </div>
      <div className="flex gap-2">
        <div className="flex align-items-center gap-2">
          <Button
            icon="pi pi-user"
            severity="info"
            aria-label="User"
            onClick={logout}
          />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
