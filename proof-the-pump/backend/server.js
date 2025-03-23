const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/proof-the-pump"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Pump Schema
const pumpSchema = new mongoose.Schema({
  name: String,
  creator: String,
  requiredEth: Number,
  participants: [String],
  createdAt: { type: Date, default: Date.now },
});

const Pump = mongoose.model("Pump", pumpSchema);

app.get("/", async (req, res) => {
  try {
    res.send("Hello World");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Routes
// Get all pumps
app.get("/api/pumps", async (req, res) => {
  try {
    const pumps = await Pump.find().sort({ createdAt: -1 });
    res.json(pumps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new pump
app.post("/api/pumps", async (req, res) => {
  const pump = new Pump({
    name: req.body.name,
    creator: req.body.creator,
    requiredEth: req.body.requiredEth,
    participants: [],
  });

  try {
    const newPump = await pump.save();
    res.status(201).json(newPump);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add participant to a pump
app.post("/api/pumps/:id/participants", async (req, res) => {
  try {
    const pump = await Pump.findById(req.params.id);
    if (!pump) {
      return res.status(404).json({ message: "Pump not found" });
    }

    const participant = req.body.participant;
    if (!pump.participants.includes(participant)) {
      pump.participants.push(participant);
      await pump.save();
    }

    res.json(pump);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
