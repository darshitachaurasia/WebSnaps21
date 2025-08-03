const express = require("express");
const urlModel = require('./url.model');
const axios = require('axios');

const urlRouter = express.Router();

// Shorten URL Route
urlRouter.post("/shorten", async (req, res, next) => {
  try {
    const { originalUrl } = req.body;

    // Validate request
    if (!originalUrl || !/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(originalUrl)) {
      return res.status(400).json({ message: "Invalid URL" });
    }

    // Check if already exists
    let url = await urlModel.findOne({ originalUrl });
    if (url) return res.json(url);

    // Call Bitly API
    const response = await axios.post(
      'https://api-ssl.bitly.com/v4/shorten',
      { long_url: originalUrl },
      { headers: { Authorization: `Bearer ${process.env.BITLY_ACCESS_TOKEN}` } }
    );

    const shortUrl = response.data.link;

    // Save to DB
    url = new urlModel({ originalUrl, shortUrl });
    await url.save();

    res.json(url);
  } catch (error) {
    console.error("Error in /shorten:", error.message);
    next(error);
  }
});

module.exports = urlRouter;
