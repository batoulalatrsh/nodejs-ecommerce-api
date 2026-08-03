const ApiError = require("../utils/apiError");

const sendErrorForDev = (error, res) =>
  res.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });

const sendErrorForProd = (error, res) =>
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });

const handleJwtSihnature = () =>
  new ApiError("Invaild token, please login again", 401);

const handleJwtExpired = () =>
  new ApiError("Expired token, please login again", 401);

const globalError = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "Error";

  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(error, res);
  } else {
    if (error.name === "JsonWebTokenError") {
      error = handleJwtSihnature();
    }
    if (error.name === "TokenExpiredError") {
      error = handleJwtExpired();
    }
    sendErrorForProd(error, res);
  }
};

module.exports = globalError;
