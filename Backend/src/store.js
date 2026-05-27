const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

const defaultDb = {
  users: [],
  products: [
    { id: "1", name: "Royal Red Roses", price: "499", stock: 25, category: "Roses", discount: "10%", desc: "Premium fresh red roses bouquet.", image: "https://images.unsplash.com/photo-1548610762-7c6afe24c261?w=400&q=80" },
    { id: "2", name: "Wedding Special", price: "2499", stock: 5, category: "Wedding", discount: "0%", desc: "Grand floral setup for weddings.", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80" },
    { id: "3", name: "Birthday Lily", price: "799", stock: 12, category: "Birthday", discount: "5%", desc: "Cheerful lilies for birthday surprises.", image: "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=400&q=80" },
  ],
  orders: [
    { id: "ORD-1024", customer: "Anshul Verma", amount: "₹1,250", status: "Pending", payment: "Paid", date: "10/05/2026", email: "anshul@example.com", phone: "+91 9876543210" },
    { id: "ORD-1023", customer: "Riya Sharma", amount: "₹450", status: "Preparing", payment: "COD", date: "10/05/2026", email: "riya@example.com", phone: "+91 8765432109" },
    { id: "ORD-1022", customer: "Amit Singh", amount: "₹2,100", status: "Shipped", payment: "Paid", date: "09/05/2026", email: "amit@example.com", phone: "+91 7654321098" },
    { id: "ORD-1021", customer: "Priya Das", amount: "₹899", status: "Delivered", payment: "Paid", date: "08/05/2026", email: "priya@example.com", phone: "+91 6543210987" },
  ],
  customers: [
    { id: "1", name: "Anshul Verma", email: "anshul@example.com", phone: "+91 9876543210", orders: 5, spent: "₹4,500", joined: "Jan 2026" },
    { id: "2", name: "Riya Sharma", email: "riya@example.com", phone: "+91 8765432109", orders: 2, spent: "₹950", joined: "Feb 2026" },
    { id: "3", name: "Amit Singh", email: "amit@example.com", phone: "+91 7654321098", orders: 12, spent: "₹15,200", joined: "Mar 2026" },
    { id: "4", name: "Priya Das", email: "priya@example.com", phone: "+91 6543210987", orders: 8, spent: "₹8,900", joined: "Apr 2026" },
  ],
  inventory: [
    { id: 1, name: "Red Roses", stock: 15, unit: "stems", status: "In Stock" },
    { id: 2, name: "Yellow Lilies", stock: 4, unit: "bouquets", status: "Low Stock" },
    { id: 3, name: "White Orchids", stock: 0, unit: "pots", status: "Out of Stock" },
    { id: 4, name: "Pink Tulips", stock: 20, unit: "stems", status: "In Stock" },
    { id: 5, name: "Marigold", stock: 8, unit: "kg", status: "Low Stock" },
  ],
  coupons: [
    { id: "1", code: "PHOOL20", discount: "20%", minAmount: "₹499", expiry: "10/06/2026", status: "Active" },
    { id: "2", code: "WEDDING10", discount: "10%", minAmount: "₹1999", expiry: "31/12/2026", status: "Active" },
  ],
  banners: [
    { id: "1", title: "Mother's Day Special", type: "Promo", image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400&q=80" },
    { id: "2", title: "Summer Sale 20%", type: "Flash", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80" },
  ],
  notifications: [
    { id: "1", title: "Mother's Day Sale Live!", message: "Celebrate with 20% off all bouquets.", category: "Promotion", sentAt: "Today, 10:00 AM", reached: 5200, status: "Sent" },
    { id: "2", title: "New Anniversary Collection", message: "Explore our new premium range.", category: "Festival", sentAt: "Yesterday", reached: 4800, status: "Sent" },
  ],
  activities: [
    { id: 1, type: "order", text: "Order #1024 delivered", time: "2 mins ago" },
    { id: 2, type: "stock", text: "New bouquet added", time: "1 hour ago" },
    { id: 3, type: "coupon", text: "Coupon FLOWER20 created", time: "3 hours ago" },
  ],
};

module.exports = { defaultDb };
