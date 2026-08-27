const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

dotenv.config({ path: "config.env" });

const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");
// Routes
const mountRoutes = require("./routes");
const { webhookCheckout } = require("./services/orderService");

// Connect with DB
dbConnection();

// Express app
const app = express();

// Enable other domains to access your application
app.use(cors());
app.options("/{*splat}", cors());

// Compression all responses
app.use(compression());

// Checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout,
);

// extended parser (convert query)
app.set("query parser", "extended");

// Middleware
app.use(express.json());

// Express enable us to serve static files
app.use(express.static(path.join(__dirname, "uploads")));

// Activate morgan in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

// Mount routes
mountRoutes(app);

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
