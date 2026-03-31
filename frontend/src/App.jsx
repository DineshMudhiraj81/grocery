import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setCart } from "./redux/cartSlice";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./admin/AdminForm";
import Cart from "./pages/Cart";
import Details from "./pages/Details";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./admin/AdminRoute";
import GroceryList from "./admin/GroceryList";
import Checkout from "./pages/Checkout";

function App() {
  const dispatch = useDispatch();

  // 🔥 AUTO LOAD CART WHEN APP STARTS
  useEffect(() => {
    const loadCart = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo) return;

      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/cart",
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        dispatch(setCart(data.cartItems));
      } catch (error) {
        console.log("Cart load failed");
      }
    };

    loadCart();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/details/:id" element={<Details />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        <Route
          path="/groceries"
          element={
            <AdminRoute>
              <GroceryList />
            </AdminRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;