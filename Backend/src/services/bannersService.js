const Banner = require('../models/Banner');

async function listBanners() {
  const docs = await Banner.find().lean();
  return docs.map(d => { delete d._id; delete d.__v; return d; });
}

module.exports = { listBanners };
