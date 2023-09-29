const mongoose = require("mongoose");
const restaurantSchema = new mongoose.Schema({
  name: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zip: String,
  },
  menu: [
    {
      name: String,
      description: String,
      price: Number,
      image: String,
    },
  ],
});
const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = {
  Restaurant,
};
