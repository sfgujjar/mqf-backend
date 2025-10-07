require('dotenv').config(); // Top of server.js
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.js'); // ✅ Import routes at the top
const testRoute = require('./routes/test.js');
app.use('/test', testRoute); // ✅ Better route
app.get('/', (req, res) => {
  res.send('MQF backend is running ✅');
}); // ✅ Only one closing bracket

// ✅ Middleware
app.use(express.json());

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
     process.exit(1); // graceful shutdown
});

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
