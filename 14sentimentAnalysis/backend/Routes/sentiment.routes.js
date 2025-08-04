const express = require("express");
const axios = require("axios");
require("dotenv").config();

const sentimentRouter = express.Router();

sentimentRouter.post("/sentiment", async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          
          "Content-Type": "application/json",
        },

      }
    );
   

    const sentimentResult = response.data;
    res.json({ result: sentimentResult });
  } catch (error) {
    console.error("Error fetching sentiment:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to analyze sentiment" });
  }
});

module.exports = sentimentRouter;
