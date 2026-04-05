import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCart } from "../redux/cartSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Details() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo) return;

      const { data } = await axios.get(
        
        `${import.meta.env.VITE_API_URL}/api/auth/groceries/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setItem(data);

      const all = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/groceries`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      const related = all.data.filter(
        (i) => i.category === data.category && i._id !== data._id
      );

      setRelatedItems(related);
    };

    fetchDetails();
  }, [id]);

  // 🔥 Dynamic Add To Cart
  const handleAddToCart = async () => {
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
        }
      );

      dispatch(setCart(data.cartItems));
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (!item)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );

  const discountedPrice =
    item.discount > 0
      ? item.price - (item.price * item.discount) / 100
      : item.price;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2">
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
              alt={item.name}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>

          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              {item.name}
            </h2>

            <p className="text-gray-500">
              Category: {item.category}
            </p>

            <div>
              {item.discount > 0 && (
                <span className="line-through text-gray-400 mr-2">
                  ₹{item.price}
                </span>
              )}

              <span className="text-2xl text-green-600 font-bold">
                ₹{discountedPrice}
              </span>
            </div>

            <p>
              Stock:{" "}
              <span
                className={
                  item.stock > 0
                    ? "text-green-600 font-semibold"
                    : "text-red-500 font-semibold"
                }
              >
                {item.stock > 0 ? "Available" : "Out of Stock"}
              </span>
            </p>

            <p className="text-gray-600">
              {item.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                onClick={handleAddToCart}
                disabled={item.stock <= 0}
                className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 cursor-pointer"
              >
                Add to Cart
              </button>

              <Link to="/" className="w-full sm:w-auto">
                <button className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition cursor-pointer">
                  Back to Shop
                </button>
              </Link>
            </div>
          </div>
        </div>

        {relatedItems.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">
              Related Products
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedItems.map((rel) => (
                <Link key={rel._id} to={`/details/${rel._id}`}>
                  <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/${rel.image}`}
                      alt={rel.name}
                      className="h-40 w-full object-cover rounded"
                    />
                    <h4 className="mt-3 font-semibold">
                      {rel.name}
                    </h4>
                    <p className="text-green-600 font-bold">
                      ₹{rel.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Details;