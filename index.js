const express = require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/UserRoutes");
const { restaurantRouter } = require("./routes/RestaurantRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());

//user
app.use("/api", userRouter);

//Restaurants
app.use("/api", restaurantRouter);
app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB!");
  } catch (error) {
    console.log("Error Connecting to DB! ", error);
  }

  console.log(`Server is listening on PORT ${process.env.PORT}`);
});
