
import { useState } from "react";
import { addGrocery } from "../redux/grocerySlice";
import { toast } from "react-toastify";
import axios from "axios";

function Admin() {

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    discount: "",
    stock: "",
    image: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.price || !form.category) {
    alert("Please fill required fields");
    return;
  }

  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("discount", form.discount);
    formData.append("stock", form.stock);
    formData.append("description", form.description);
    formData.append("image", form.image);

    await axios.post(
      
      `${import.meta.env.VITE_API_URL}/api/groceries`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );

    // ✅ Success Toast
    toast.success("Product added successfully!");

    setForm({
      name: "",
      category: "",
      price: "",
      discount: "",
      stock: "",
      image: "",
      description: "",
    });

  } catch (error) {
    toast.error(
    error.response?.data?.message || "Failed to add product"
  );
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-2xl p-8">
        <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">
          Admin - Add Grocery Item 🛒
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="text"
            name="category"
            placeholder="Category (Vegetable, Fruit, Dairy)"
            value={form.category}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <input
              type="number"
              name="discount"
              placeholder="Discount %"
              value={form.discount}
              onChange={handleChange}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
  type="file"
  name="image"
  accept="image/*"
  onChange={(e) =>
    setForm({ ...form, image: e.target.files[0] })
  }
  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
/>

          <textarea
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            type="submit"
            className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold cursor-pointer"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default Admin;