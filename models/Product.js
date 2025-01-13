const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  customId: { type: String, unique: true },
});

module.exports = mongoose.model('Product', productSchema);
