const { default: mongoose } = require("mongoose");

// in models/Badge.js
const badgeSchema = new mongoose.Schema({
  name:       String,
  description:String,
  tokenValue: Number,    // how many “bonus cents” this badge is worth
});
module.exports = mongoose.model('Badge', badgeSchema);
