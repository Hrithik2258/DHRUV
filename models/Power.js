const mongoose = require("mongoose");

const PowerSchema = new mongoose.Schema({
  voltage: { type: Number, required: true },
  frequency: { type: Number, required: true },
  thresholdVoltage: { type: Number, required: true },
  thirdHarmonic: { type: Number, required: true },
  fifthHarmonic: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Power", PowerSchema);
