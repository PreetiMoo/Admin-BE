const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, updateUser, deleteUser } = require('../controllers/authController');
const { auth, checkRole } = require('../middleware/auth');


router.post('/register', auth, checkRole('Admin'), registerUser);


router.post('/login', loginUser);

router.post('/logout', logoutUser);


router.patch('/update/:id', auth, checkRole('Admin'), updateUser);


router.delete('/delete/:id', auth, checkRole('Admin'), deleteUser);

module.exports = router;
