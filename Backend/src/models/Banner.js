const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  id: String,
  title: String,
  type: String,
  image: String,
});

module.exports = mongoose.model('Banner', BannerSchema);
