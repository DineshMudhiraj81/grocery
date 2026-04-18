import { useSelector } from "react-redux";

import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

function Checkout() {
  const { cartItems } = useSelector((state) => state.cart);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    city: "",
    pincode: "",
    addressLine: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
  if (
    !address.name ||
    !address.phone ||
    !address.city ||
    !address.pincode ||
    !address.addressLine
  ) {
    toast.error("Please fill all details");
    return;
  }

  try {
    // ✅ 1. Create order from backend
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
      { amount: totalPrice }
    );

    // ✅ 2. Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.amount,
      currency: "INR",
      name: "Grocery Store",
      description: "Order Payment",
      order_id: data.id,

      // 🔥 ADD HERE 👇
      handler: async function (response) {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/payment/verify-payment`,
      {
        ...response,
        cartItems,
        address,
        totalPrice,
        userId: userInfo._id,
      }
    );

    if (data.success) {
      toast.success("Payment successful 🎉");

      // ✅ clear cart
      dispatch(clearCart());
    } else {
      toast.error("Payment verification failed");
    }
  } catch (error) {
    toast.error("Verification error");
  }
},

      prefill: {
        name: address.name,
        contact: address.phone,
      },

      theme: {
        color: "#16a34a",
      },
    };

    // ✅ 3. Open Razorpay
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    toast.error("Payment failed");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center mb-10">
        Checkout 🧾
      </h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        
        {/* 🏠 Address Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">
            Delivery Details
          </h2>

          <div className="space-y-4">
            
            <div>
              <label className="text-sm font-medium text-gray-600">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              
              <div>
                <label className="text-sm font-medium text-gray-600">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Full Address
              </label>
              <textarea
                name="addressLine"
                placeholder="Street, Area, Landmark..."
                onChange={handleChange}
                rows="4"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* 🛒 Order Summary */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">
            Order Summary
          </h2>

          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-green-600">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-green-600">₹{totalPrice}</span>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handlePlaceOrder}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg font-semibold transition duration-300 cursor-pointer"
          >
            Place Order 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;