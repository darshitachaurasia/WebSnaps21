const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    match: /^https?:\/\/[^\s$.?#].[^\s]*$/i
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Url', urlSchema);

