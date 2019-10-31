const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  Id:String,
  email: String,
  password: String,
  salt : String
   
});

module.exports = mongoose.model('user', userSchema);
