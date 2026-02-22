const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [{
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
  }],
  shippingAddress: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // Pending, Delivered
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
