const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const urlRouter = require("./url.routes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Validate ENV variables
if (!process.env.MONGODB_URI || !process.env.BITLY_ACCESS_TOKEN) {
  console.error("❌ Missing environment variables");
  process.exit(1);
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api', urlRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
