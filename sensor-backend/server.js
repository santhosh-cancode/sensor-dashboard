const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔹 Connect to MongoDB Compass
// Replace <username>, <password>, <cluster-url> with your Atlas or local MongoDB
mongoose.connect("mongodb+srv://zeno:123@sensordp.ctwa3na.mongodb.net/?appName=sensordp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// 🔹 Create schema & model
const sensorSchema = new mongoose.Schema({
  label: String,         // e.g., S1, S2, S3
  value: Number,
  timestamp: { type: Date, default: Date.now }
});

const Sensor = mongoose.model("Sensor", sensorSchema);

// 🔹 API to receive sensor data (POST)
app.post("/api/sensors", async (req, res) => {
  const data = req.body; // { S1: 28.5, S2: 97, S3: 0.95 }

  try {
    const entries = Object.entries(data).map(([label, value]) => ({
      label,
      value
    }));

    await Sensor.insertMany(entries);
    res.json({ success: true, message: "Data saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to save data" });
  }
});

// 🔹 API to get latest readings (GET)
app.get("/api/sensors/latest", async (req, res) => {
  try {
    const latest = await Sensor.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: { _id: "$label", value: { $first: "$value" }, timestamp: { $first: "$timestamp" } } }
    ]);
    // Convert _id to label
    const result = latest.map(item => ({ label: item._id, value: item.value, timestamp: item.timestamp }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching latest readings" });
  }
});

// 🔹 API to get all history (optional)
app.get("/api/sensors/history", async (req, res) => {
  try {
    const history = await Sensor.find({}).sort({ timestamp: 1 });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching history" });
  }
});

// 🔹 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
