const { v4: uuidv4 } = require('uuid');
const Product = require('../models/Product');
const Activity = require('../models/Activity');

async function listProducts() {
  const docs = await Product.find().lean();
  return docs.map(d => { delete d._id; delete d.__v; return d; });
}

async function createProduct({ name, price, stock, category, desc, discount, image }) {
  const product = new Product({
    id: uuidv4(),
    name,
    price: String(price),
    stock: Number(stock) || 0,
    category: category || 'Roses',
    desc: desc || '',
    discount: discount || '0%',
    image: image || 'https://images.unsplash.com/photo-1522673607200-1648832cee98?w=400&q=80',
  });
  const saved = await product.save();
  await Activity.create({ id: Date.now(), type: 'stock', text: `New product added: ${saved.name}`, time: 'Just now' });
  const obj = saved.toObject(); delete obj._id; delete obj.__v; return obj;
}

async function deleteProduct(id) {
  const res = await Product.findOneAndDelete({ id });
  return !!res;
}

module.exports = { listProducts, createProduct, deleteProduct };
