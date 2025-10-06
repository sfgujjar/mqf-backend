require('dotenv').config(); // Top of server.js
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user'); // ✅ Import routes at the top
const testRoute = require('./routes/test');
app.use('/', testRoute);
});


// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Test Route
app.get('/', (req, res) => {
  res.send('MQF backend is running ✅');
});

// ✅ API Routes
app.use('/api/user', userRoutes);

// ✅ MongoDB Connection
console.log("Mongo URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
