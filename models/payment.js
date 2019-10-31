const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  productId: String,
  userId: String
});

module.exports = mongoose.model('payment', paymentSchema);
