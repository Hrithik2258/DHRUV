const mongoose = require("mongoose");

const PowerSchema = new mongoose.Schema({
  Voltage: { type: Number, required: true },
  Frequency: { type: Number, required: true },
  THD Voltage: { type: Number, required: true },
  Harmonic 3rd: { type: Number, required: true },
  harmonic 5th: { type: Number, required: true },
  harmonic 7th: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Power", PowerSchema);
