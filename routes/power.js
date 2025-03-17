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

// 2️⃣ **POST - Add a Power Record**
router.post("/add", async (req, res) => {
  try {
    const { Voltage, Frequency, THD Voltage, Harmonic 3rd, Harmonic 5th,Harmonic 7th } = req.body;

    if (!Voltage || !Frequency || !THD Voltagee || !Harmonic 3rd || !Harmonic 5th,Harmonic 7th ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newPower = new Power({ Voltage, Frequency, THD Voltage, Harmonic 3rd, Harmonic 5th, Harmonic 7th});
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
