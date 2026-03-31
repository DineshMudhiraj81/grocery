import Grocery from "../models/Grocery.js";

// Add Grocery
export const addGrocery = async (req, res) => {
  try {
    const grocery = await Grocery.create({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      discount: req.body.discount,
      stock: req.body.stock,
      description: req.body.description,
      image: req.file ? req.file.filename : "",
    });

    res.status(201).json(grocery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Groceries
export const getGroceries = async (req, res) => {
  const groceries = await Grocery.find();
  res.json(groceries);
};

// Delete Grocery
export const deleteGrocery = async (req, res) => {
  try {
    const grocery = await Grocery.findById(req.params.id);

    if (!grocery) {
      return res.status(404).json({ message: "Product not found" });
    }

    await grocery.deleteOne();
    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Grocery
export const updateGrocery = async (req, res) => {
  try {
    const grocery = await Grocery.findById(req.params.id);

    if (!grocery) {
      return res.status(404).json({ message: "Product not found" });
    }

    grocery.name = req.body.name;
    grocery.category = req.body.category;
    grocery.price = req.body.price;
    grocery.discount = req.body.discount;
    grocery.stock = req.body.stock;
    grocery.description = req.body.description;

    if (req.file) {
      grocery.image = req.file.filename;
    }

    const updated = await grocery.save();

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Grocery
export const getSingleGrocery = async (req, res) => {
  try {
    const grocery = await Grocery.findById(req.params.id);

    if (!grocery) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(grocery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};