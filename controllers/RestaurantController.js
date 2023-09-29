const Joi = require("joi");
const { Restaurant } = require("../models/Restaurant");

/* Add Restaurant Controller */
const addRestaurant = async (req, res) => {
  try {
    // Validation schema for restaurant creation
    const restaurantSchema = Joi.object({
      name: Joi.string().required(),
      address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        zip: Joi.string().required(),
      }).required(),
      menu: Joi.array()
        .items(
          Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().min(0).required(),
            image: Joi.string(),
          })
        )
        .required(),
    });

    const { error } = restaurantSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const restaurant = new Restaurant(req.body);

    await restaurant.save();

    return res
      .status(201)
      .json({ message: "Restaurant added successfully", restaurant });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/*Get All the available Restaurant Controller */
const getRestaurant = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.status(200).json(restaurants);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

/*Get A particular  Restaurant by it's id  */
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({ _id: id });
    if (!restaurant) {
      res.status(404).send({ message: "No Restaurant Found For This ID" });
      return;
    }

    res.status(200).send(restaurant);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

/*Get Menu of a specific Restaurant by it's id */
const getMenuOfARestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({ _id: id });
    if (!restaurant) {
      res.status(404).send({ message: "No Restaurant Found For This ID" });
      return;
    }

    res.status(200).send(restaurant.menu);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

/*Add Menu to a specific Restaurant Identified by it's ID */
const addMenuToARestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    //validate the menu data
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().min(0).required(),
      image: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    //first find if restaurant exists
    const isRestaurant = await Restaurant.findOne({ _id: id });
    if (!isRestaurant) {
      return res
        .status(404)
        .send({ message: "No Restaurant Found For This ID" });
    }

    isRestaurant.menu.push(req.body);
    const updatedRestaurant = await isRestaurant.save();

    res.status(201).json(updatedRestaurant);
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/* Delete a Menu by it's id from a specific Restaurant identified by it's id */
const deleteAMenuOfARestaurant = async (req, res) => {
  try {
    const { id, menuId } = req.params;
    //check if restaurant exist

    const restaurant = await Restaurant.findOne({ _id: id });
    if (!restaurant) {
      res.status(404).send({ message: "No Restaurant Found For This ID" });
      return;
    }

    const updatedMenu = restaurant.menu.filter((menu) => menu._id != menuId);
    restaurant.menu = updatedMenu;
    const updatedRestaurant = await restaurant.save();

    res.status(202).send({ message: "Menu Deleted", updatedRestaurant });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};
module.exports = {
  addRestaurant,
  getRestaurant,
  getRestaurantById,
  getMenuOfARestaurantById,
  addMenuToARestaurant,
  deleteAMenuOfARestaurant,
};
