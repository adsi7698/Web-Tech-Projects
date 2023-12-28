const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  item_id: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  price: {
    type: String
  },
  shipping_option: {
    type: String
  },
  image_url: {
    type: String
  },
  shipping_details: {
    type: [[String]]
  },
  keyword: {
    type: String
  },
  return_accepted: {
    type: Boolean
  },
  facebook_url: {
    type: String
  }
});

module.exports = mongoose.model('wishlists', wishlistSchema);