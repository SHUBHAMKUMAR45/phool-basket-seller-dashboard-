const productsService = require('../services/productsService');

async function list(req, res) {
  const products = await productsService.listProducts();
  res.json({ success: true, products });
}

async function create(req, res) {
  const product = await productsService.createProduct(req.body);
  res.status(201).json({ success: true, product });
}

async function remove(req, res) {
  const found = await productsService.deleteProduct(req.params.id);
  if (!found) return res.status(404).json({ success: false, message: 'Product not found.' });
  res.json({ success: true });
}

function aiScan(req, res) {
  res.json({ success: true, suggestion: {
    name: 'Designer Bouquet Mix',
    price: '1299',
    stock: '15',
    category: 'Anniversary',
    desc: 'A premium blend of seasonal exotic flowers detected by AI scan.',
    discount: '10%',
  }});
}

module.exports = { list, create, remove, aiScan };
