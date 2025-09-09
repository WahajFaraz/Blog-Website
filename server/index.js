import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false
}));

const allowedOrigins = [
  'https://blogspace-two.vercel.app',
  'http://localhost:5173'];

if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    // For debugging CORS issues
    console.log('Blocked by CORS:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (!process.env.MONGODB_URI || !"mongodb+srv://wahajfaraz93:3E2gMCsYTuoywNCH@cluster0.j9dlacs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" ) {
  console.error('FATAL ERROR: MONGODB_URI is not defined');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://wahajfaraz93:3E2gMCsYTuoywNCH@cluster0.j9dlacs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// API Routes
app.use('/api/users', require('./routes/user'));
app.use('/api/blogs', require('./routes/blog'));
app.use('/api/media', require('./routes/media'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// API 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  const response = {
    success: false,
    error: error.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
  };
  
  if (error.name === 'ValidationError') {
    response.error = 'Validation Error';
    response.details = Object.values(error.errors).map(err => err.message);
    return res.status(400).json(response);
  }
  
  if (error.name === 'CastError') {
    response.error = 'Invalid ID format';
    return res.status(400).json(response);
  }
  
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    response.error = `${field} already exists`;
    return res.status(400).json(response);
  }
  
  res.status(500).json(response);
});

// Start server only when not in Vercel environment
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
  });
}

// Export the Express API for Vercel Serverless Functions
export default app;
