const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
dotenv.config({ path: "config.env" });
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/category.route");

// Connect with DB
dbConnection();


// Express app
const app = express();

// Middleware
app.use(express.json());

// Activate morgan in development mode
if (process.env.MODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.MODE_ENV}`);
}

// Mount routes
app.use("/api/v1/categories", categoryRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});
