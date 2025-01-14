const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'] },
  tokens: { type: String }, 
  name: { type: String },
  contactNumber: {type : Number}
});

module.exports = mongoose.model('User', userSchema);
