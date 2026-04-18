import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/OrderModel.js";

// ✅ CREATE ORDER
export const createOrder = async (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "order_" + Date.now(),
  };

  const order = await razorpay.orders.create(options);

  res.json(order);
};

// ✅ VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSign === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
};