const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const mongoose = require('mongoose');

const registerUser = async (req, res) => {
  try {
      const { name, email, password, role, managerId } = req.body;

      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).send({ error: 'User already exists' });
      }

      
      if (role === 'Employee') {
          if (!managerId || !mongoose.Types.ObjectId.isValid(managerId)) {
              return res.status(400).send({ error: 'Invalid or missing managerId' });
          }

          
          const manager = await User.findById(managerId);
          if (!manager || manager.role !== 'Manager') {
              return res.status(400).send({ error: 'Invalid managerId. Manager must exist and have role "Manager".' });
          }
      } else if (role === 'Manager') {
          
          if (managerId && managerId !== '') {
              return res.status(400).send({ error: 'Manager should not have a managerId.' });
          }
      }

      
      const hashedPassword = await bcrypt.hash(password, 12);

      
      const newUser = new User({
          name,
          email,
          password: hashedPassword,
          role,
          managerId: role === 'Employee' ? managerId : undefined, 
      });

      
      await newUser.save();

      
      res.status(201).send({ message: 'User registered successfully' });

  } catch (error) {
      res.status(400).send({ error: error.message });
  }
};



const loginUser = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        throw new Error('Invalid login credentials');
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      delete user.password
      console.log("Token",token)
     
      res
        // .cookie('accessToken', token, {
        //   httpOnly: true, 
        //   secure: false, 
        //   maxAge: 24 * 60 * 60 * 1000, 
        //   sameSite: 'None',
        // })
        .send({ message: 'Login successful' , user, accessToken:token});
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };
  

  const updateUser = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'email', 'role', 'managerId'];
        const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidUpdate) {
            return res.status(422).send({ 
                error: 'Invalid update fields! Allowed fields: name, email, role, managerId.' 
            });
        }

        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ error: 'User not found!' });
        }

        
        if (req.body.role === 'Employee' && req.body.managerId) {
            const manager = await User.findOne({ _id: req.body.managerId, role: 'Manager' });
            if (!manager) {
                return res.status(422).send({ 
                    error: `Invalid managerId. Ensure the manager exists and has role "Manager".` 
                });
            }
        }

        
        if (user.role === 'Employee' && req.body.role === 'Manager') {
            user.managerId = undefined; 
        }

        
        updates.forEach((update) => {
            user[update] = req.body[update];
        });

        
        await user.save();
        res.status(200).send({ user });
    } catch (error) {
        res.status(500).send({ error: 'Internal server error. ' + error.message });
    }
};


  const deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).send({ error: 'User not found!' });
      }
      res.send({ message: 'User deleted successfully!' });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };

  const logoutUser = (req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false, 
        sameSite: 'None', 
        path: '/',          
    });
    res.status(200).send({ message: 'Logout successful' });
};


module.exports = { registerUser, loginUser, updateUser, deleteUser, logoutUser };
