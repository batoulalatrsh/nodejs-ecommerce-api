const express = require("express");

const router = express.Router();
const {
  createCashOrder,
  getAllOrders,
  findSpecificOrder,
  filterOrderForLoggedUser,
  updateOrderToDelivered,
  updateOrderToPaid,
} = require("../services/orderService");
const authService = require("../services/authService");

router.use(authService.protect);
router
  .route("/")
  .get(
    authService.allowedTo("user", "admin", "manager"),
    filterOrderForLoggedUser,
    getAllOrders,
  );
router
  .route("/:id")
  .post(authService.allowedTo("user"), createCashOrder)
  .get(authService.allowedTo("user"), findSpecificOrder);

router.put(
  "/:id/pay",
  authService.allowedTo("admin", "manager"),
  updateOrderToPaid,
);
router.put(
  "/:id/deliver",
  authService.allowedTo("admin", "manager"),
  updateOrderToDelivered,
);

module.exports = router;
