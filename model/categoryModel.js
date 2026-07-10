const mongoose = require("mongoose");

// 1- Create Schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

// 2- Create model
module.exports = mongoose.model("Category", categorySchema);
