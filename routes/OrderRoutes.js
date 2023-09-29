const express = require("express");
const {
  placeOrder,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/OrderController");
const { authenticator } = require("../middlewares/authenticator");

const orderRouter = express.Router();

orderRouter.post("/orders", authenticator, placeOrder);
orderRouter.get("/orders/:id", authenticator, getOrderById);
orderRouter.patch("/orders/:id", authenticator, updateOrderStatus);

module.exports = { orderRouter };
