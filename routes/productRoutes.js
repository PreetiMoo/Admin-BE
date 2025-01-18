const express = require('express');
const { auth, checkRole } = require('../middleware/auth');
const { addProduct, editProduct, getAllProducts, deleteProduct, getOneProduct } = require('../controllers/productController');

const router = express.Router();


router.post('/', auth, checkRole('Admin', 'Manager'), addProduct);


router.patch('/:id', auth, checkRole('Admin', 'Manager'), editProduct);


router.get('/', auth, getAllProducts);

router.get('/:id', auth, getOneProduct);


router.delete('/:id', auth, checkRole('Admin', 'Manager'), deleteProduct);


  



module.exports = router;
