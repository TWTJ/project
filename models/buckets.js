const mongoose = require('mongoose');

const bucketSchema = new mongoose.Schema({
  productId: String,
  userId: String
});

module.exports = mongoose.model('bucket', bucketSchema);
