const express = require("express");
const Product = require("../models/Product");
const { verifyToken, verifyAdmin } = require("../middleware/roleMiddleware");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// Add a product (Admin only)
router.post("/add", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Validate input
    if (!name || !description || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const customId = uuidv4();

    // Save the product
    const product = new Product({ customId, name, description, price });
    await product.save();

    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all products (User and Admin)
router.get("/all", verifyToken, async (req, res) => {
  try {
    const products = await Product.find();
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found." });
    }
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Edit/Update a product (Admin only)
router.put("/edit/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    // Validate input
    if (!name || !description || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the product and update it
    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, price },
      { new: true } // Return the updated document
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a product (Admin only)
router.delete("/delete/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product and delete it
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
