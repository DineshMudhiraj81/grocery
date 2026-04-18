import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../redux/cartSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Home() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Filter States
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  // 🔥 Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/groceries`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        setItems(data);
      } catch (error) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Filter + Sort Logic
  const filteredItems = items
    .filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "low-high") return a.price - b.price;
      if (sort === "high-low") return b.price - a.price;
      if (sort === "a-z") return a.name.localeCompare(b.name);
      if (sort === "z-a") return b.name.localeCompare(a.name);
      return 0;
    });

  // 🛒 Add to Cart (Optimistic + Rollback)
  const handleAddToCart = async (item) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
      toast.error("Please login first");
      return;
    }

    const previousCart = [...cartItems];

    const existingItem = cartItems.find(
      (cartItem) => cartItem.product === item._id
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = cartItems.map((cartItem) =>
        cartItem.product === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedCart = [
        ...cartItems,
        {
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: 1,
        },
      ];
    }

    // ✅ Instant UI
    dispatch(setCart(updatedCart));

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        {
          productId: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");

      // ✅ Rollback
      dispatch(setCart(previousCart));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">🛒 Grocery Products</h2>

      {/* 🔍 Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-lg w-full sm:w-1/2"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-2 border rounded-lg w-full sm:w-1/3"
        >
          <option value="">Sort By</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
          <option value="a-z">Name: A to Z</option>
          <option value="z-a">Name: Z to A</option>
        </select>
      </div>

      {/* 🔥 LOADING SKELETON */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow animate-pulse"
            >
              <div className="h-40 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded mt-4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {item.name}
                  </h3>

                  <p className="text-gray-500 text-sm">{item.category}</p>

                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-bold text-lg">
                      ₹{item.price}
                    </span>
                    {item.discount > 0 && (
                      <span className="text-sm text-red-500">
                        {item.discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm"
                    >
                      Add to cart
                    </button>

                    <Link to={`/details/${item._id}`} className="flex-1">
                      <button className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg text-sm">
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No products found
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;