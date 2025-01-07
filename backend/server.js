const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors({
  origin: "https://task-manager-frontend-b9ov.onrender.com", // Allow requests from your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // If using cookies or authorization headers
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => console.log('Server running on port 5000'));
  })
  .catch((err) => console.error(err));
