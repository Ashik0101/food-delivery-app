const express = require("express");
const {
  addRestaurant,
  getRestaurant,
  getRestaurantById,
  getMenuOfARestaurantById,
  addMenuToARestaurant,
  deleteAMenuOfARestaurant,
} = require("../controllers/RestaurantController");

const restaurantRouter = express.Router();

restaurantRouter.post("/restaurants", addRestaurant);
restaurantRouter.get("/restaurants", getRestaurant);
restaurantRouter.get("/restaurants/:id", getRestaurantById);
restaurantRouter.get("/restaurants/:id/menu", getMenuOfARestaurantById);
restaurantRouter.put("/restaurants/:id/menu", addMenuToARestaurant);
restaurantRouter.delete(
  "/restaurants/:id/menu/:menuId",
  deleteAMenuOfARestaurant
);

module.exports = { restaurantRouter };
