import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import biller from "../../assets/icons/biller.svg";
import admin from "../../assets/icons/admin.svg";
import "./Login.scss";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { clearSelectedUser } from "../../store/slice/user";
import AdminDialog from "./AdminDialog";

const Login: any = () => {
  const [visible, setVisible] = useState(false);
  const [password, setPassword]: any = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const handleLogin = (type: any) => {
    if (type === "admin") {
      setPassword("");
      setErrorMessage("");
      setVisible(true);
    } else if (type === "biller") {
      navigate("/list/all");
    }
  };

  useEffect(() => {
    dispatch(clearSelectedUser());
  }, [dispatch]);

  return (
    <div className="pmy h-screen flex flex-column align-items-center justify-content-center">
      <div className="p-3 gap-3">
        <h2 className="font-md font-bold text-center">Welcome Back !</h2>
        <div className="image">
          <div className="flex flex-column">
            <img
              src={biller}
              alt="Biller"
              onClick={() => handleLogin("biller")}
            />
            <h3 className="text-center">Biller</h3>
          </div>
          <div className="flex flex-column">
            <img src={admin} alt="Admin" onClick={() => handleLogin("admin")} />
            <h3 className="text-center">Admin</h3>
          </div>
        </div>
      </div>
      <AdminDialog
        visible={visible}
        setVisible={setVisible}
        password={password}
        setPassword={setPassword}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

export default Login;
