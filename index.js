const express = require("express");
const { connection } = require("./config/db");
const app = express();
require("dotenv").config();

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB!");
  } catch (error) {
    console.log("Error Connecting to DB! ", error);
  }

  console.log(`Server is listening on PORT ${process.env.PORT}`);
});
