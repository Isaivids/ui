import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Login from "./pages/login/Login";
import WithOutNavBar from "./components/navbar/WithOutNavBar";
import WithNavbar from "./components/navbar/WithNavbar";
import Home from "./pages/Home/Home";
import Admin from "./pages/admin/Admin";
import Products from "./pages/products/Products";
import Categories from "./pages/categories/Categories";
import Bills from "./pages/bills/Bills";
import PieLoader from "./components/pieLoader/PieLoader";
import { useSelector } from "react-redux";

function App() {
  const cartDetails = useSelector((state: any) => state.cartDetails);
  const userDetails = useSelector((state: any) => state.userDetails);
  const productDetails = useSelector((state: any) => state.productDetaild);
  const categoryDetails = useSelector((state: any) => state.categoryDetals);
  const billDetails = useSelector((state: any) => state.billDetails);
  return (
    <div className="App">
      {(cartDetails.loading ||
        userDetails.loading ||
        productDetails.loading ||
        categoryDetails.loading ||
        billDetails.loading) && (
        <div className="loader">
          <PieLoader />
        </div>
      )}
      <Routes>
        <Route element={<WithOutNavBar />}>
          <Route path="/" element={<Login />} />
        </Route>
        <Route element={<WithNavbar />}>
          <Route path="/list/:id" element={<Home />} />
          <Route element={<Admin />}>
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/bills" element={<Bills />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
