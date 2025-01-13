const express = require("express");
const Product = require("../models/Product");
const { verifyToken, verifyAdmin } = require("../middleware/roleMiddleware");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// Add a product (Admin only)
router.post("/add", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, role } = req.body;

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
    res.status(500).json({ error: err.message });
  }
});

// Get all products (User and Admin)
router.get("/dashboad", verifyToken, async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
