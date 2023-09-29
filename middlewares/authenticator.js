const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticator = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).send({ message: "Missing Token" });
      return;
    }

    const decoded = jwt.decode(token, process.env.JWT_SECRET);

    if (!decoded) {
      res.status(400).send({ message: "Invalid Token" });
      return;
    }
    req.body.user = decoded.userId;
    next();
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = { authenticator };
