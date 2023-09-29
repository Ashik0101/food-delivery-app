const Joi = require("joi");
const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Register Controller is here
const register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    //check if email already exists
    const isEmailExists = await User.findOne({ email });
    if (isEmailExists) {
      res.status(400).send({ message: "Email Already Exists" });
      return;
    }

    //Doing validatin using joi library
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(5).max(30).required(),
      address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        zip: Joi.string().required(),
      }).required(),
    });
    const { error } = schema.validate(req.body);
    // console.log(error.details);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      address,
    });

    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//Login Controller is here
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(5).max(30).required(),
    }).required();

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send({ message: "User Not Found" });
      return;
    }
    //verify the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Incorrect Password" });
      return;
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    console.error("Error while login:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//Password Change controller is here
const resetPassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const { id } = req.params;
    if (!id) {
      res.status(400).send({ message: "Id Is Missing" });
      return;
    }

    //validate for passwords
    const schema = Joi.object({
      password: Joi.string().min(5).max(30).required(),
      newPassword: Joi.string().min(5).max(30).required(),
    }).required();

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    //find the user with this id
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).send({ message: "User Not Found" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(400).send({ message: "Incorrect Password" });
      return;
    }

    //hash the new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedPassword;

    await user.save();
    res.status(200).send({ message: "Password Resetted Successfully!" });
  } catch (error) {
    console.log("Error while resetting the passoword: ", error);
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { register, login, resetPassword };
