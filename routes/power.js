const express = require("express");
const router = express.Router();
const Power = require("../models/Power");

// 1️⃣ **GET All Power Records**
router.get("/getall", async (req, res) => {
  try {
    const powerData = await Power.find();
    
    // console.log("Fetched Data:", powerData);cls  // Debugging log

    if (!powerData.length) {
      return res.status(404).json({ message: "No records found" });
    }

    res.json(powerData);
  } catch (error) {
    console.error("Error Fetching Data:", error);
    res.status(500).send("Server Error");
  }
});

router.post("/add", async (req, res) => {
  try {
    const { voltage, frequency, THD_voltage_1N, harmonic_3rd, harmonic_5th, harmonic_7th } = req.body;

    // Only required fields
    if (!voltage || !frequency || !THD_voltage_1N) {
      return res.status(400).json({ error: "Voltage, Frequency, and THD_voltage_1N are required" });
    }

    // Create object dynamically (optional fields will be omitted if undefined)
    const newPower = new Power({
      voltage,
      frequency,
      THD_voltage_1N,
      ...(harmonic_3rd !== undefined && { harmonic_3rd }),
      ...(harmonic_5th !== undefined && { harmonic_5th }),
      ...(harmonic_7th !== undefined && { harmonic_7th }),
    });

    await newPower.save();
    res.json({ message: "Power data added successfully", data: newPower });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});



// 4️⃣ **DELETE - Remove a Power Record by ID**
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedPower = await Power.findByIdAndDelete(req.params.id);

    if (!deletedPower) return res.status(404).json({ error: "Record not found" });

    res.json({ message: "Power data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
