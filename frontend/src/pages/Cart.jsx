import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../redux/cartSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Cart() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // 🔥 Load Cart From Backend
  useEffect(() => {
    const fetchCart = async () => {
      if (!userInfo) return;

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/cart`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        dispatch(setCart(data.cartItems));
      } catch (error) {
        toast.error("Failed to load cart");
      }
    };

    fetchCart();
  }, [dispatch]);

  // 🔥 Increase / Decrease Quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      dispatch(setCart(data.cartItems));
    } catch (error) {
      toast.error("Update failed");
    }
  };

  // 🔥 Remove Item
  const removeItem = async (productId) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      dispatch(setCart(data.cartItems));
      toast.success("Item removed");
    } catch (error) {
      toast.error("Remove failed");
    }
  };

  // 🔥 Clear Cart
  const clearCart = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      dispatch(setCart([]));
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Clear failed");
    }
  };

  // 🔥 Total Price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (!userInfo) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold">
          Please login to view cart
        </h2>
        <Link
          to="/login"
          className="text-green-600 font-bold underline"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">Your Cart 🛒</h2>

      {cartItems.length === 0 ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="bg-white shadow-lg rounded-xl p-8 text-center">
            <p className="text-gray-500 text-lg font-medium mb-2">
              Your cart is empty 🛒
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Looks like you haven’t added anything yet
            </p>

            <Link to="/">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="bg-white p-4 rounded-xl shadow flex flex-col sm:flex-row justify-between items-center gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />

                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-gray-500">
                      ₹{item.price}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.product, item.quantity - 1)
                    }
                    className="px-3 py-1 bg-gray-300 rounded cursor-pointer"
                  >
                    -
                  </button>

                  <span className="font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(item.product, item.quantity + 1)
                    }
                    className="px-3 py-1 bg-gray-300 rounded cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="font-bold text-green-600">
                  ₹{item.price * item.quantity}
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.product)}
                  className="text-red-500 font-semibold cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4">
              Order Summary
            </h3>

            <p className="flex justify-between mb-2">
              <span>Total Items:</span>
              <span>{cartItems.length}</span>
            </p>

            <p className="flex justify-between text-lg font-bold text-green-600">
              <span>Total Price:</span>
              <span>₹{totalPrice}</span>
            </p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={clearCart}
                className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer"
              >
                Clear Cart
              </button>

              <Link to="/checkout">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer">
                  Checkout
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;