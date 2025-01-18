const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product')


const placeOrder = async (req, res) => {
    try {
        const { products, customerName } = req.body;
    
       
        const productIds = products.map(item => item.product);
        const productDetails = await Product.find({ _id: { $in: productIds } });
    
        if (productDetails.length !== products.length) {
          return res.status(400).send({ error: 'One or more products are invalid.' });
        }
    
      
        let total = 0;
        products.forEach(item => {
          const product = productDetails.find(p => p._id.toString() === item.product);
          total += product.price * item.quantity;
        });
    
        
        const order = new Order({
          customerName,
          products,
          status: 'Pending',
          placedBy: req.user._id,
          total,
        });
    
        await order.save();
        res.status(201).send(order);
      } catch (error) {
        console.error(error);
        res.status(400).send({ error: error.message });
      }
    };


 const getOrders = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'Employee') {
      query.placedBy = req.user._id; 
    } else if (req.user.role === 'Manager') {
      const teamMembers = await User.find({ managerId: req.user._id });
      query.placedBy = { $in: teamMembers.map((member) => member._id) }; 
    }

    const orders = await Order.find(query)
      .populate('products.product', 'name price')
      .populate('placedBy', 'name email');
    res.send(orders);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).send({ error: 'Invalid status value.' });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).send({ error: 'Order not found.' });
    }

    order.status = status;
    await order.save();
    res.send(order);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {placeOrder, getOrders, updateOrderStatus}
