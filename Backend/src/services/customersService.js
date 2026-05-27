const Customer = require('../models/Customer');

async function listCustomers() {
  const docs = await Customer.find().lean();
  return docs.map(d => { delete d._id; delete d.__v; return d; });
}

module.exports = { listCustomers };
