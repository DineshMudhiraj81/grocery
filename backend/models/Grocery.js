import mongoose from "mongoose";

const grocerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    image: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const Grocery = mongoose.model("Grocery", grocerySchema);

export default Grocery;