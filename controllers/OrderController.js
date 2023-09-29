const Joi = require("joi");
const { Order } = require("../models/Order");
const { ObjectId } = require("bson");

/* Place Order Controller */
const placeOrder = async (req, res) => {
  console.log(req.body);
  try {
    const orderSchema = Joi.object({
      user: Joi.string().required(),
      restaurant: Joi.string().required(),
      items: Joi.array()
        .items(
          Joi.object({
            name: Joi.string().required(),
            price: Joi.number().min(0).required(),
            quantity: Joi.number().integer().min(1).required(),
          })
        )
        .required(),
      totalPrice: Joi.number().min(0).required(),
      deliveryAddress: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        zip: Joi.string().required(),
      }).required(),
      status: Joi.string()
        .valid("placed", "preparing", "on the way", "delivered")
        .required(),
    });

    const { error } = orderSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { user, restaurant, items, totalPrice, deliveryAddress, status } =
      req.body;

    const order = new Order({
      user,
      restaurant,
      items,
      totalPrice,
      deliveryAddress,
      status,
    });

    await order.save();

    return res
      .status(201)
      .json({ message: "Order created successfully", order });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

/* Controller to get a order details */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id })
      .populate("user")
      .populate("restaurant");
    if (!order) {
      res.status(404).send({ message: "Order Not Found" });
      return;
    }

    return res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

/* Controller to update order status */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, status } = req.body;

    const schema = Joi.object({
      user: Joi.string().required(),
      status: Joi.string()
        .valid("placed", "preparing", "on the way", "delivered")
        .required(),
    }).required();

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    //check if user is modifying his own order or not
    const order = await Order.findOne({ _id: id });
    if (order.user != user) {
      return res.send({ message: "Not Authorized" });
    }
    order.status = status;
    const updatedOrder = await order.save();
    return res.send({ message: "Order Status Updated", updatedOrder });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { placeOrder, getOrderById, updateOrderStatus };
