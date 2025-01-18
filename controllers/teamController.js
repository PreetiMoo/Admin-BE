const User = require('../models/User');


const addTeamMember = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getTeamMembers = async (req, res) => {
  try {
    let query = {};

    
    if (req.user.role === 'Manager') {
      query.managerId = req.user._id;
      console.log("Manager's team query:", query); 
    }

    
    const users = await User.find(query);

    
    console.log("Users found:", users);

    if (users.length === 0) {
      return res.status(404).send({ error: 'No team members found.' });
    }

    res.send(users);
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).send({ error: 'Failed to fetch team members.' });
  }
};


const getUserById = async (req, res) => {
  try {
      const user = await User.findById(req.params.id);

      if (!user) {
          return res.status(404).send({ error: 'User not found!' });
      }

      res.send(user);
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
};


const getUsers = async (req, res) => {
  try {
      const { role } = req.query;

     
      const query = role ? { role } : {}; 

    
      const users = await User.find(query).select('name _id'); 

      
      res.send(users);
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
};


module.exports = { addTeamMember, getTeamMembers , getUserById, getUsers};
