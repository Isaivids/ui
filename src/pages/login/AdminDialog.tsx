import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React from "react";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
const AdminDialog = ({ visible, setVisible, password, setPassword,errorMessage, setErrorMessage }: any) => {
  const navigate = useNavigate();
  const checkPassword = () => {
    if (password === "admin") {
        sessionStorage.setItem('isAdmin','true')
      navigate("/admin/products");
    } else {
      setErrorMessage("Invalid Password");
    }
  };

  return (
    <Dialog
      header="Admin Confirmation"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => setVisible(false)}
    >
      <div className="flex align-items-center justify-content-center w-full">
        <input
          type="password"
          value={password}
          className="mx-3"
          maxLength={13}
          onChange={(e: any) => setPassword(e.target.value)}
        />
        <Button label="Login" onClick={checkPassword} className="p-button" />
      </div>
      <small className="text-center w-full flex justify-content-center">{errorMessage}</small>
    </Dialog>
  );
};

export default AdminDialog;
