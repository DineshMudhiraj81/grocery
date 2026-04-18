import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    orderItems: [
      {
        name: String,
        quantity: Number,
        price: Number,
        product: String,
      },
    ],

    shippingAddress: {
      name: String,
      phone: String,
      city: String,
      pincode: String,
      addressLine: String,
    },

    totalPrice: Number,

    paymentId: String,

    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);