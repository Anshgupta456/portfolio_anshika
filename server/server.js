const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./src/config/db');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const experienceRoutes = require('./src/routes/experienceRoutes');
const skillRoutes = require('./src/routes/skillRoutes');
const educationRoutes = require('./src/routes/educationRoutes');
const achievementRoutes = require('./src/routes/achievementRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (schema updated)
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
const path = require('path');
app.use(express.json());

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Anshika Gupta Portfolio & Admin API',
    timestamp: new Date().toISOString()
  });
});

// Mount Resource Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/experience', experienceRoutes);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/education', educationRoutes);
app.use('/api/v1/achievements', achievementRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Portfolio API running on http://localhost:${PORT}`);
  console.log(`📋 Admin auth endpoint: http://localhost:${PORT}/api/v1/auth/login`);
});
