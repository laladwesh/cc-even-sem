const { default: mongoose } = require("mongoose");

const badgeSchema = new mongoose.Schema({
  name:       String,
  description:String,
  tokenValue: Number, 
});
module.exports = mongoose.model('Badge', badgeSchema);
