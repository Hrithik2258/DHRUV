const mongoose = require("mongoose");

const PowerSchema = new mongoose.Schema({
  voltage: { type: Number, required: true },
  frequency: { type: Number, required: true },
  THD_voltage_1N: { type: Number, required: true },
  harmonic_3rd: { type: Number },
  harmonic_5th: { type: Number },
  harmonic_7th: { type: Number },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Power", PowerSchema);
