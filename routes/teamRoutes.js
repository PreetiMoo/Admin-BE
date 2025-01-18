const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const { addTeamMember, getTeamMembers, getUserById, getUsers } = require('../controllers/teamController');


router.post('/', auth, checkRole('Admin'), addTeamMember);


router.get('/', auth, checkRole('Admin', 'Manager'), getTeamMembers);

router.get('/users/:id', auth, getUserById);


router.get('/users', auth, getUsers);

module.exports = router;
