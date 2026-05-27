const bannersService = require('../services/bannersService');

async function list(req, res) {
  const banners = await bannersService.listBanners();
  res.json({ success: true, banners });
}

module.exports = { list };
