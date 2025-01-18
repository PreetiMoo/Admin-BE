const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: {
      type: String,
      required: true
    },
    products: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }],
    status: {
      type: String,
      enum: ['Pending', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    placedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  }, {
    timestamps: true
  });
  

    const Order = mongoose.model('Order', orderSchema);
    
    module.exports = Order;