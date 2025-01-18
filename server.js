const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();


app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,  
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));


mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});


app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});


app.use('/api/auth', authRoutes);  
app.use('/api/team', teamRoutes);  
app.use('/api/products', productRoutes);  
app.use('/api/orders', orderRoutes);  


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});


const PORT = process.env.PORT || 5001;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
