const mongoose = require("mongoose");

const PowerSchema = new mongoose.Schema({
  voltage: { type: Number, required: true },
  frequency: { type: Number, required: true },
  THD_Voltage_1N: { type: Number, required: true },
  Harmonic_3rd: { type: Number, required: true },
  harmonic_5th: { type: Number, required: true },
  harmonic_7th: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Power", PowerSchema);
