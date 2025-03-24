const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { errorHandler } = require('./middleware/authMiddleware');
const path = require('path');

//  Load environment variables
dotenv.config();

//  Connect to MongoDB
connectDB();

//  Initialize Express App
const app = express();

// Middlewares
app.use(cors({ origin: 'https://task-manager-1-od1t.onrender.com', credentials: true })); // Enable Cross-Origin requests
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

//  API Routes
app.use('/api/auth', authRoutes);
app.use('api/tasks', taskRoutes);
app.get('api/tasks', (req, res) => {
  // Respond with tasks data or a success message
  res.send('This is the tasks endpoint.'); // Example response
});

//  Error Handling Middleware
app.use(errorHandler);

//  Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});
