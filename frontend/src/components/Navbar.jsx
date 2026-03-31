import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Navbar() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Get cart items from Redux
  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("userInfo");
      setUserInfo(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser();
    window.addEventListener("userChanged", loadUser);

    return () => {
      window.removeEventListener("userChanged", loadUser);
    };
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    window.dispatchEvent(new Event("userChanged"));
    navigate("/login");
    setIsOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `relative px-3 py-2 rounded transition ${
      isActive
        ? "bg-white text-green-600 font-semibold"
        : "hover:bg-green-500"
    }`;

  return (
    <nav className="bg-green-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <h1 className="font-bold text-lg">FreshMart 🛒</h1>

        {/* Desktop */}
        <div className="hidden md:flex gap-4 items-center">
          {userInfo && userInfo.role === "user" && (
            <>
              <NavLink to="/" className={linkClass}>
                Home
              </NavLink>

              {/* 🛒 CART WITH COUNT */}
              <NavLink to="/cart" className={linkClass}>
                Cart
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-0.5 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </NavLink>
            </>
          )}

          {userInfo && userInfo.role === "admin" && (
            <>
              <NavLink to="/admin" className={linkClass}>
                Home
              </NavLink>
              <NavLink to="/groceries" className={linkClass}>
                 Groceries List
              </NavLink>
            </>
          )}

          {!userInfo ? (
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
          ) : (
            <>
              <div className="bg-green-500 px-3 py-1 rounded flex items-center gap-2">
                👋 {userInfo.name}
              </div>

              <button
                onClick={logoutHandler}
                className="bg-white text-green-600 px-3 py-1 rounded cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl"
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {isOpen && (
      <div className="md:hidden px-4 pb-4 pt-2 space-y-3 bg-green-600">

        {/* USER */}
        {userInfo && userInfo.role === "user" && (
          <div className="flex flex-col gap-2">
            <NavLink
              to="/"
              className="block w-full px-4 py-2 rounded-lg bg-green-500 hover:bg-green-700 transition"
            >
              Home
            </NavLink>

            <NavLink
              to="/cart"
              className="flex justify-between items-center w-full px-4 py-2 rounded-lg bg-green-500 hover:bg-green-700 transition"
            >
              <span>Cart</span>
              {cartItems.length > 0 && (
                <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </NavLink>
          </div>
        )}

        {/* ADMIN */}
        {userInfo && userInfo.role === "admin" && (
          <div className="flex flex-col gap-2">
            <NavLink
              to="/admin"
              className="block w-full px-4 py-2 rounded-lg bg-green-500 hover:bg-green-700 transition"
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/groceries"
              className="block w-full px-4 py-2 rounded-lg bg-green-500 hover:bg-green-700 transition"
            >
              Groceries List
            </NavLink>
          </div>
        )}

        {/* LOGIN / LOGOUT */}
        {!userInfo ? (
          <NavLink
            to="/login"
            className="block w-full px-4 py-2 rounded-lg bg-white text-green-600 text-center font-semibold"
          >
            Login
          </NavLink>
        ) : (
          <button
            onClick={logoutHandler}
            className="w-full px-4 py-2 rounded-lg bg-white text-green-600 font-semibold"
          >
            Logout
          </button>
        )}
      </div>
    )}
    </nav>
  );
}

export default Navbar;