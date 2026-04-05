import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCart } from "../redux/cartSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Home() {
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);

  // ✅ Filter States
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  // 🔥 Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo) return;

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/groceries`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          },
        );

        setItems(data);
      } catch (error) {
        toast.error("Failed to load products");
      }
    };

    fetchData();
  }, []);

  // ✅ Filter + Sort Logic
  const filteredItems = items
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "low-high") return a.price - b.price;
      if (sort === "high-low") return b.price - a.price;
      if (sort === "a-z") return a.name.localeCompare(b.name);
      if (sort === "z-a") return b.name.localeCompare(a.name);
      return 0;
    });

  // 🛒 Add to Cart
  const handleAddToCart = async (item) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo) {
        toast.error("Please login first");
        return;
      }

      const { data } = await axios.post(
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
        },
      );

      dispatch(setCart(data.cartItems));
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">🛒 Grocery Products</h2>

      {/* 🔍 Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-lg w-full sm:w-1/2"
        />

        {/* Sort */}
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

      {/* 🔥 Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden"
            >
              {/* Image */}
              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
                alt={item.name}
                className="w-full h-40 object-cover"
              />

              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {item.name}
                </h3>

                <p className="text-gray-500 text-sm">{item.category}</p>

                {/* Price */}
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

                {/* Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm cursor-pointer"
                  >
                    Add to cart
                  </button>

                  <Link to={`/details/${item._id}`} className="flex-1">
                    <button className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg text-sm cursor-pointer">
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
    </div>
  );
}

export default Home;
