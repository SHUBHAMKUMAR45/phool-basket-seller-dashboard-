const dashboardService = require('../services/dashboardService');

async function get(req, res) {
  const dashboard = await dashboardService.getDashboard();
  res.json({ success: true, dashboard });
}

module.exports = { get };
