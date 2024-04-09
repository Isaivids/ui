import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import "./Cart.scss";
import { Button } from "primereact/button";
import "../../App.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  addMultipleItems,
  changeCount,
  changeGST,
  clearCart,
  getCartItems,
  makeCashFalse,
  makeGSTTrue,
  removeOneItem,
} from "../../store/slice/cart";
import { IoClose } from "react-icons/io5";
import { Dialog } from "primereact/dialog";
import { ImPrinter } from "react-icons/im";
import ReactToPrint from "react-to-print";
import { Message } from "primereact/message";
import logo from "../../assets/logo.png";
import {
  clearSelectedUser,
  deleteUser,
  getUsers,
  setLoggedInUser,
} from "../../store/slice/user";
import { Checkbox } from "primereact/checkbox";
import { ProgressBar } from "primereact/progressbar";
import { addBill } from "../../store/slice/bill";
import { InputSwitch } from "primereact/inputswitch";
const Cart = () => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US");
  const formattedTime = now.toLocaleTimeString("en-US");
  const [data, setData] = useState<any>([]);
  const cartDetails = useSelector((state: any) => state.cartDetails);
  const userDetails = useSelector((state: any) => state.userDetails);
  const billDetails = useSelector((state: any) => state.billDetails);
  const dispatch = useDispatch<AppDispatch>();
  const [visible, setVisible] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [checked, setChecked] = useState(!cartDetails.cash);
  const companyDetails = {
    companyName: "Tender Town",
    address:
      "114D/170, Mount Poonamallee Road,MP Road, Porur, Chennai - 600116",
    gst: "33BWDPV3834K1Z7",
    phone: "+91 9940124094",
  };
  const [billNumber, setBillNumber]: any = useState();

  const fetchData = useCallback(async () => {
    try {
      const rs = await dispatch(
        getCartItems({ userId: userDetails.selectedUser.name })
      );
      if (rs.payload.status && !cartDetails.body.loading) {
        setData(rs.payload?.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [cartDetails.body.loading, dispatch, userDetails.selectedUser.name]);

  const changeCountValue = async (data: any, type: string) => {
    const body: any = {
      productId: data.productId,
      count: 1,
      type: type,
    };
    try {
      dispatch(changeCount(body));
    } catch (error: any) {
      console.error("Error adding to cart:", error.message);
    }
  };

  const deleteOneCartItemFromCart = async (payload: any) => {
    const body: any = {
      productId: payload.productId,
    };
    try {
      dispatch(removeOneItem(body));
    } catch (error: any) {
      console.error("Error deleting the cart:", error.message);
    }
  };

  const clearCartData = async () => {
    try {
      dispatch(clearCart());
      dispatch(makeGSTTrue())
      dispatch(makeCashFalse(false));
    } catch (error: any) {
      console.error("Error deleting the cart:", error.message);
    }
  };

  const toggleGST = () => {
    setChecked(!checked);
    dispatch(changeGST());
  };

  useEffect(() => {
    const fetchDataAndLog = async () => {
      userDetails.selectedUser.active && (await fetchData());
    };
    fetchDataAndLog();
  }, [fetchData, userDetails.selectedUser]);

  useEffect(() => {
    if (cartDetails.body.data) {
      setChecked(cartDetails.gst);
      setData(cartDetails.body.data);
    }
  }, [cartDetails]);
  const invoiceRef: any = useRef();
  const Header = () => {
    return (
      <div className="flex gap-2 align-items-center">
        Receipt
        <ReactToPrint
          trigger={() => <ImPrinter className="cursor-pointer" />}
          content={() => invoiceRef.current}
          onAfterPrint={async () => {
            closeDialogActions();
          }}
        />
      </div>
    );
  };

  // const changeActiveStatus = async() =>{
  //   const rs = await dispatch(changeActive({tableId : userDetails.selectedUser._id, active : false}));
  //   if(rs.payload.status){
  //     setVisible(false);
  //     dispatch(clearSelectedUser());
  //   }
  // }

  const changeModeOfPayment = (e:any) =>{
    setToggle(e.value);
    dispatch(makeCashFalse(e.value))
  }

  const getRandomBillNumber = () => {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    const combinedValue = timestamp + 100;
    setBillNumber(combinedValue);
    return combinedValue;
  };

  const makeDialogVisible = async () => {
    // changeActiveStatus();
    const bill = getRandomBillNumber();
    const body = {
      billNumber: bill,
      gstEnabled: checked,
      cash : toggle,
      billName: userDetails.selectedUser.name,
      details: cartDetails.body.data,
    };
    const rs = await dispatch(addBill(body));
    if (rs.payload.status) {
      setVisible(true);
    }
  };

  const closeDialogActions = async () => {
    setVisible(false);
    const { _id, name } = userDetails.selectedUser;
    if (_id && name) {
      const rs = await dispatch(deleteUser({ id: _id, name: name }));
      if (rs.payload && rs.payload.status) {
        dispatch(clearSelectedUser());        
      }
    } else {
      dispatch(clearSelectedUser());
    }
    dispatch(makeGSTTrue())
    dispatch(makeCashFalse(false));
    clearCartData();
  };

  const getIndividualTotal = (item:any) => {
    let price = item.price;
    if(cartDetails.gst){
      price += (item.price * item.gst)/100
    }
    return price * item.count
  }

  const BasicDemo = () => {
    return (
      <div className="card flex justify-content-center">
        <Dialog
          header={<Header />}
          visible={visible}
          style={{ width: "50vw" }}
          onHide={closeDialogActions}
        >
          <div ref={invoiceRef} className="p-2 border-1">
            <div className="flex flex-column text-center">
              <div className="flex justify-content-center">
                <img src={logo} alt="TenderTown" style={{ width: "80px" }} />
              </div>
              <span className="font-semibold text-xl">
                {companyDetails.companyName}
              </span>
              <span className="text-sm">{companyDetails.address}</span>
              <span className="text-sm">GST IN : {companyDetails.gst}</span>
              <span className="text-sm">PHONE : {companyDetails.phone}</span>
            </div>
            <hr style={{ borderTop: "2px dashed black" }} />
            <div className="flex justify-content-between my-2">
              <span>Bill No : {billNumber}</span>
              <span>Date : {formattedDate}</span>
              <span>Time : {formattedTime}</span>
            </div>
            <hr style={{ borderTop: "2px dashed black" }} />
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  {cartDetails.gst && <th>GST</th>}
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.count}</td>
                    {cartDetails.gst && <td>{item.gst}</td>}
                    <td>₹ {item.price.toFixed(2)}</td>
                    {/* <td>₹ {(item.count * item.price).toFixed(2)}</td> */}
                    <td>₹ {getIndividualTotal(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr style={{ borderTop: "2px dashed black" }} />
            <div className="flex justify-content-end">
              <strong>Total Amount:</strong> ₹ {cartDetails.total}
            </div>
            <hr style={{ borderTop: "2px dashed black" }} />
            <div className="flex text-center flex-column">
              <span>Thank you for choosing Tender Town! </span>
              <span>Visit again soon.😀</span>
            </div>
          </div>
        </Dialog>
      </div>
    );
  };

  const handleMultipleSave = async () => {
    try {
      const propertyToRemove = "userId";
      const newArray = data.map(function ({
        [propertyToRemove]: _,
        ...rest
      }: any) {
        return rest;
      });
      const body = {
        userId: userDetails.selectedUser.name,
        products: newArray,
      };
      const cart = await dispatch(addMultipleItems(body));
      if (cart.payload.status) {
        const rsa = await dispatch(getUsers());
        if (rsa.payload && rsa.payload.status && !userDetails.body.error) {
          const loggedIN = rsa.payload.data.filter((x:any) => x.name === userDetails.selectedUser.name);
          dispatch(
            setLoggedInUser(loggedIN[0])
          );
        }
        setData(cart.payload?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="cart">
      {visible && <BasicDemo />}
      {(cartDetails.loading || cartDetails.aLoading || billDetails.loading) && (
        <ProgressBar
          mode="indeterminate"
          style={{ height: "6px" }}
        ></ProgressBar>
      )}
      {(cartDetails.error || cartDetails.aError) && (
        <Message severity="error" text="Unable to fetch Data" />
      )}
      {!cartDetails.loading &&
        !cartDetails.aLoading &&
        !cartDetails.error &&
        !cartDetails.aError && (
          <div className="h-full content surface-ground">
            <div className="pmy flex p-3 gap-1 justify-content-between">
              <span className="font-bold text-center text-lg">Bill</span>
              <span className="font-bold text-center text-sm">
                GST <Checkbox onChange={toggleGST} checked={checked}></Checkbox>
              </span>
            </div>
            <div className="overflow-container">
              <div className="flex justify-content-center gap-1">
                <Button
                  severity="danger"
                  label="Clear"
                  disabled={data.length < 1}
                  onClick={() => clearCartData()}
                />
                <Button
                  label="Checkout"
                  severity="secondary"
                  disabled={data.length < 1}
                  onClick={makeDialogVisible}
                />
                <Button
                  label="Hold"
                  onClick={handleMultipleSave}
                  disabled={cartDetails && cartDetails.body.data?.length <= 0}
                />
              </div>
              <div className="m-3 flex justify-content-start align-items-center">
                <span className="font-bold text-center text-sm">Cash</span>
                <InputSwitch
                  checked={cartDetails.cash}
                  onChange={(e) => changeModeOfPayment(e)}
                  className="mx-2"
                />
              </div>
              {data &&
                data.length > 0 &&
                data.map((item: any, index: any) => (
                  <div
                    key={index}
                    className="flex m-3 gap-2 p-2 surface-0 flex-column mb-3 border-round-md shadow-1"
                  >
                    <div className="flex justify-content-between">
                      <span className="text-color	">
                        {item.name.length > 10
                          ? item.name.substring(0, 10) + "..."
                          : item.name}{" "}
                        :
                      </span>
                      <span className="font-bold text-center text-sm">
                        ₹{item.price * item.count}
                      </span>
                    </div>
                    <div className="flex justify-content-between align-items-center">
                      <div className="flex align-items-center gap-3">
                        <FaMinus
                          className="btn"
                          onClick={() => changeCountValue(item, "decrease")}
                        />
                        <input
                          type="text"
                          style={{ width: "30px", height: "20px" }}
                          value={item.count}
                          disabled
                        />
                        <FaPlus
                          className="btn"
                          onClick={() => changeCountValue(item, "increase")}
                        />
                      </div>
                      <IoClose
                        className="text-danger"
                        onClick={() => deleteOneCartItemFromCart(item)}
                      />
                    </div>
                  </div>
                ))}
            </div>
            <div className="bg-primary flex p-3 gap-1 justify-content-center">
              <span className="font-bold text-center text-lg">
                ₹{data.length > 0 ? cartDetails.total : 0}
              </span>
            </div>
          </div>
        )}
    </div>
  );
};

export default Cart;
