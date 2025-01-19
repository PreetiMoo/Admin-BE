const Product = require('../models/Product');
const User = require('../models/User');



const addProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      createdBy: req.user._id
    });
    if(req.user.role === 'Admin'){
      product.isAdmin = true;
    }
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


const editProduct = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'price', 'image'];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({ error: 'Invalid update fields!' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ error: 'Product not found!' });
    }

    
    if (req.user._id.toString() !== product.createdBy.toString() && !['Admin', 'Manager'].includes(req.user.role)) {
      return res.status(403).send({ error: 'You do not have permission to edit this product.' });
    }

    updates.forEach((update) => product[update] = req.body[update]);

    await product.save();
    res.send(product);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


const getAllProducts = async (req, res) => {
  try {
    console.log("USER",req.user)
    let userId = req.user._id;
    if(req.user.role==='Employee'){
      userId = req.user.managerId
    }
    const products = await Product.find({
  $or: [
    { createdBy: userId },
    { isAdmin: true }
  ]
});

    res.send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};


const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params; 
    const product = await Product.findById(id); 

    if (!product) {
      return res.status(404).send({ error: 'Product not found' }); 
    }

    res.send(product); 
  } catch (error) {
    res.status(500).send({ error: error.message }); 
  }
};



const deleteProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
  
      if (!product) {
        return res.status(404).send({ error: 'Product not found!' });
      }
  
     
      if (req.user._id.toString() !== product.createdBy.toString() && !['Admin', 'Manager'].includes(req.user.role)) {
        return res.status(403).send({ error: 'You do not have permission to delete this product.' });
      }
  
      await product.remove();
      res.send({ message: 'Product deleted successfully.' });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };
  
module.exports = { addProduct, editProduct, getAllProducts, getOneProduct, deleteProduct };