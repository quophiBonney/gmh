const mongoose = require("mongoose");
const beachSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: String,
  type: String,
  lat: Number,
  lon: Number,
  region: String,
  image: String,
  tags: Object,
});

const beachModel = mongoose.model("Beach", beachSchema);
module.exports = beachModel;
