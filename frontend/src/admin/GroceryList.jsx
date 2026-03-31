import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

function GroceryList() {
    const [groceries, setGroceries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  const fetchGroceries = async () => {
    const { data } = await axios.get(
      "http://localhost:5000/api/groceries",
      config
    );
    setGroceries(data);
  };

  useEffect(() => {
    fetchGroceries();
  }, []);

  const deleteHandler = async (id) => {
    try {
      if (window.confirm("Are you sure?")) {
        await axios.delete(
          `http://localhost:5000/api/groceries/${id}`,
          config
        );
        fetchGroceries();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
    };
    
    const updateHandler = async () => {
  try {
    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("category", editForm.category);
    formData.append("price", editForm.price);
    formData.append("discount", editForm.discount);
    formData.append("stock", editForm.stock);
    formData.append("description", editForm.description);

    if (editForm.image) {
      formData.append("image", editForm.image);
    }

    await axios.put(
      `http://localhost:5000/api/groceries/${editItem._id}`,
      formData,
      config
    );

    // ✅ Success Toast
  toast.success("Product updated successfully!");

    setShowModal(false);
    fetchGroceries();
  } catch (error) {
    toast.error(error.response?.data?.message || "Update failed");
  }
    };
    
    const [showModal, setShowModal] = useState(false);
const [editItem, setEditItem] = useState(null);
const [editForm, setEditForm] = useState({
  name: "",
  category: "",
  price: "",
  discount: "",
  stock: "",
  description: "",
  image: null,
});
    const handleEditChange = (e) => {
  if (e.target.name === "image") {
    setEditForm({ ...editForm, image: e.target.files[0] });
  } else {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }
    };
    
    // Pagination Logic
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = groceries.slice(indexOfFirstItem, indexOfLastItem);

const totalPages = Math.ceil(groceries.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-green-600 mb-6">
        Grocery List 🛒
      </h2>

      <div className="bg-white shadow-lg rounded-xl p-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-100 text-left">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((item) => (
              <tr key={item._id} className="border-t">

                <td className="p-3">
                  {item.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>

                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.category}</td>
                <td className="p-3">₹{item.price}</td>
                <td className="p-3">{item.stock}</td>

                <td className="p-3">
                <div className="flex justify-center items-center gap-4 h-full">
                            <button
  onClick={() => {
    setEditItem(item);
    setEditForm({
      name: item.name,
      category: item.category,
      price: item.price,
      discount: item.discount,
      stock: item.stock,
      description: item.description,
      image: null,
    });
    setShowModal(true);
  }}
  className="text-blue-500 hover:text-blue-700 cursor-pointer"
>
  <Pencil size={18} />
</button>

                    <button
                    onClick={() => deleteHandler(item._id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                    <Trash2 size={18} />
                    </button>
                </div>
                </td>

              </tr>
            ))}
          </tbody>
              </table>

              {/* Pagination */}
{groceries.length > itemsPerPage && (
  <div className="flex justify-center items-center gap-2 mt-6">

    <button
      onClick={() => setCurrentPage((prev) => prev - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
    >
      Prev
    </button>

    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentPage(index + 1)}
        className={`px-3 py-1 rounded ${
          currentPage === index + 1
            ? "bg-green-600 text-white"
            : "bg-gray-200"
        }`}
      >
        {index + 1}
      </button>
    ))}

    <button
      onClick={() => setCurrentPage((prev) => prev + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
    >
      Next
    </button>

  </div>
)}
              
              {showModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Edit Grocery</h2>

      <div className="space-y-3">

        <input
          type="text"
          name="name"
          value={editForm.name}
          onChange={handleEditChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="category"
          value={editForm.category}
          onChange={handleEditChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="price"
          value={editForm.price}
          onChange={handleEditChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="stock"
          value={editForm.stock}
          onChange={handleEditChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="file"
          name="image"
          onChange={handleEditChange}
          className="w-full"
        />

        <textarea
          name="description"
          value={editForm.description}
          onChange={handleEditChange}
          className="w-full border p-2 rounded"
        />

      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 bg-gray-400 text-white rounded cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={updateHandler}
          className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}

        {groceries.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No products available.
          </p>
        )}
      </div>
    </div>
  );
}

export default GroceryList;