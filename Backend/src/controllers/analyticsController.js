const analyticsService = require('../services/analyticsService');

async function get(req, res) {
  const analytics = await analyticsService.getAnalytics();
  res.json({ success: true, analytics });
}

module.exports = { get };
