const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  area: { type: mongoose.Schema.Types.ObjectId, ref: "Area", required: true },
  slotNumber: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  slotType: { type: String, enum: ["car", "bike"], default: "car" },
  pricePerHour: { type: Number, default: 20 },
});

module.exports = mongoose.model("Slot", SlotSchema);
