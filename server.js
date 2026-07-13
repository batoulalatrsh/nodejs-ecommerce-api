const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });

const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/category.route");
const subCategoryRoute = require("./routes/subCategory.route");

// Connect with DB
dbConnection();

// Express app
const app = express();

// Middleware
app.use(express.json());

// Activate morgan in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

// Mount routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);

app.all("/{*splat}", (req, res, next) => {
  // Create error and sent it to erorr handler middleware
  // const err = new Error(`Can not find this route: ${req.originalUrl}`);
  // Send error to erorr handler middleware
  next(new ApiError(`Can not find this route: ${req.originalUrl}`, 400));
});

// Global erorr handler middleware
app.use(globalError);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down...`);
    process.exit(1);
  });
});
