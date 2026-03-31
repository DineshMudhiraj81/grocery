import Cart from "../models/cartModel.js";

/* =============================
   ADD TO CART
============================= */
const addToCart = async (req, res) => {
  const { productId, name, image, price, quantity } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      cartItems: [],
    });
  }

  const itemExists = cart.cartItems.find(
    (item) => item.product.toString() === productId
  );

  if (itemExists) {
    itemExists.quantity += quantity;
  } else {
    cart.cartItems.push({
      product: productId,
      name,
      image,
      price,
      quantity,
    });
  }

  await cart.save();

  res.status(200).json(cart);
};

/* =============================
   GET USER CART
============================= */
const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.json({ cartItems: [] });
  }

  res.json(cart);
};

/* =============================
   UPDATE CART ITEM
============================= */
const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.cartItems.find(
    (item) => item.product.toString() === productId
  );

  if (item) {
    item.quantity = quantity;
  }

  await cart.save();

  res.json(cart);
};

/* =============================
   REMOVE ITEM
============================= */
const removeCartItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  cart.cartItems = cart.cartItems.filter(
    (item) => item.product.toString() !== req.params.id
  );

  await cart.save();

  res.json(cart);
};

/* =============================
   CLEAR CART
============================= */
const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  cart.cartItems = [];

  await cart.save();

  res.json({ message: "Cart cleared" });
};

export {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};