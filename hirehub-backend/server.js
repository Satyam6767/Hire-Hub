const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ CORS configuration to allow only your frontend URL
const allowedOrigins = [process.env.CLIENT_URL];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Serve static files (like resumes) from the "uploads" folder
// This should be ABOVE your protected API routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// ✅ Test endpoint
app.get('/test', (req, res) => {
  console.log('✅ /test endpoint hit!');
  res.send('Test endpoint is working!');
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
