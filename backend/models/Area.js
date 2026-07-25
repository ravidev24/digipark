const mongoose = require("mongoose");

const AreaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  totalSlots: { type: Number, default: 0 },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  type: { type: String, enum: ['Mall', 'Theater', 'General'], default: 'General' },
  image: { type: String }, // For a nice UI
});

module.exports = mongoose.model("Area", AreaSchema);
