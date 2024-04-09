import React from "react";
import "./ProductCard.scss";
import "../../App.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { addToCartReducer, changeCount } from "../../store/slice/cart";
import { FaMinus, FaPlus } from "react-icons/fa";
import nodata from "../../assets/icons/nodata.svg";
const ProductCard = ({ data, userDetails }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const cartDetails = useSelector((state: any) => state.cartDetails);

  const getCountById = (targetProductId: string): number => {
    if (cartDetails.body.data) {
      const cartItems = cartDetails?.body?.data;
      const item = cartItems.find(
        (cartItem: any) => cartItem.productId === targetProductId
      );
      if (item) {
        return item.count;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  };

  const addItemToCart = async (data: any) => {
    const body: any = {
      userId: userDetails.selectedUser.name,
      productId: data._id,
      name: data.name,
      price: data.amount,
      count: 1,
      gst: data.gst,
    };
    try {
      dispatch(addToCartReducer(body));
    } catch (error: any) {
      console.error("Error adding to cart:", error.message);
    }
  };

  const changeCountValue = async (data: any, type: string) => {
    const body: any = {
      productId: data._id,
      count: 1,
      type: type,
    };
    try {
      dispatch(changeCount(body));
    } catch (error: any) {
      console.error("Error adding to cart:", error.message);
    }
  };

  return (
    <div className="productCard p-2 flex gap-2 flex-wrap">
      {data.length > 0 ? (
        data.map((x: any, index: any) => {
          return (
            <div
              key={index}
              className="flex flex-column shadow-2 card align-items-center surface-ground "
            >
              <div
                className="image-cont p-2 cursor-pointer"
                onClick={() => addItemToCart(x)}
              >
                <img src={x.photo} alt={x.name} />
              </div>
              <div className="name flex flex-column justify-content-between pmy text-center p-2 w-full">
                <span
                  className="font-semibold"
                  title={x.name}
                >
                  {x.name}
                  {/* {x.name.length <= 20 ? x.name : x.name.substring(0,20)+'...'} */}
                </span>
                <span className="font-semibold"> ₹  {x.amount}</span>
              </div>
              <div className="p-0 flex justify-content-between count">
                <span className="text-center" onClick={() => addItemToCart(x)}>
                  <FaPlus />
                </span>
                <span
                  className="text-center"
                  onClick={() => changeCountValue(x, "decrease")}
                >
                  <FaMinus />
                </span>
              </div>
              {getCountById(x._id) ? (
                <span className="badge">{getCountById(x._id)}</span>
              ) : (
                ""
              )}
            </div>
          );
        })
      ) : (
        <img src={nodata} alt="No Data" style={{ width: "30vh" }} />
      )}
    </div>
  );
};

export default ProductCard;
