require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ItemsSchema = new mongoose.Schema({
  text: String,
});

const Items = mongoose.model("Item", ItemsSchema, "Items_Collection");

// Routes
app.get("/items", async (req, res) => {
  const items = await Items.find();
  res.json(items);
});

app.post("/items", async (req, res) => {
  const newItem = new Items({ text: req.body.text });
  await newItem.save();
  res.json(newItem);
});

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));