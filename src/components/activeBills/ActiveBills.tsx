import React, { useCallback, useEffect, useRef, useState } from "react";
import "./ActiveBills.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  addUser,
  changeActive,
  clearSelectedUser,
  deleteUser,
  getUsers,
  setLoggedInUser,
} from "../../store/slice/user";
import { AppDispatch } from "../../store/store";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { IoCloseOutline } from "react-icons/io5";
import { makeCashFalse, makeGSTTrue } from "../../store/slice/cart";

const ActiveBills = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData]: any = useState();
  const [selectedUser, setSelectedUser]: any = useState(null);
  const userDetails = useSelector((state: any) => state.userDetails);
  const op: any = useRef(null);
  const [userName, setUserName] = useState("");

  const setUser = async (x: any) => {
    const rs = await dispatch(changeActive({ tableId: x._id, active: true }));
    if (rs.payload && rs.payload.status) {
      dispatch(setLoggedInUser(x));
      setSelectedUser(x);
      dispatch(makeGSTTrue());
      dispatch(makeCashFalse(false));
    }
  };

  const deleteUserClikc = async (x: any) => {
    const rs = await dispatch(deleteUser({ id: x._id,name : x.name }));
    if (rs.payload && rs.payload.status) {
      dispatch(clearSelectedUser());
      dispatch(makeGSTTrue());
      dispatch(makeCashFalse(false));
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const userData = await dispatch(getUsers());
      if (userData.payload.status) {
        setData(userData.payload.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  const toggle = (e: any) => {
    setUserName('')
    op?.current.toggle(e);
  };

  const addNew = async () => {
    const today = new Date();
    const timestamp = today.getTime();
    const body: any = {
      name: userName || 'C'+timestamp,
      admin: false,
      active: true,
    };
    const rsa = await dispatch(addUser(body));
    if (rsa.payload && rsa.payload.status && !userDetails.body.error) {
      dispatch(setLoggedInUser(rsa.payload.data[rsa.payload.data.length - 1]));
      dispatch(makeGSTTrue());
      dispatch(makeCashFalse(false));
      op.current.toggle(false);
    }
  };

  useEffect(() => {
    setSelectedUser(userDetails.selectedUser);
  }, [userDetails.selectedUser]);

  useEffect(() => {
    const fetchDataAndLog = async () => {
      await fetchData();
    };
    fetchDataAndLog();
  }, [fetchData]);

  return (
    <div className="active-customers">
      {userDetails.loading ? (
        "Loading"
      ) : (
        <div className="flex">
          <span className="text-base flex align-items-center gap-3 font-bold text-50 mx-2">
            ActiveBills
            <Button icon="pi pi-plus" rounded onClick={(e: any) => toggle(e)} />
          </span>
          <OverlayPanel ref={op}>
            <input
              type="text"
              value={userName}
              className="mx-3"
              maxLength={13}
              onChange={(e: any) => setUserName(e.target.value)}
            />
            <Button
              label="Add"
              severity="success"
              style={{ height: "30px" }}
              onClick={addNew}
              // disabled={!userName}
            />
          </OverlayPanel>
          <div className="flex gap-3">
            {data &&
              userDetails.body.data.map((x: any, index: number) => {
                return (
                  <div
                    className={`flex pending gap-3 cursor-pointer ${
                      selectedUser?.name === x?.name ? "selected" : ""
                    }`}
                    key={index}
                  >
                    <span onClick={() => setUser(x)}>{x.name}</span>
                    <IoCloseOutline
                      className="bg-red-500 text-white border-round"
                      onClick={() => deleteUserClikc(x)}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveBills;
