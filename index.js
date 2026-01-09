const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const lawFirmRoutes = require('./routes/lawFirmRoutes');
const caseDetailsRoutes = require('./routes/caseDetailsRoutes');
const caseAccusedDetailsRoutes = require('./routes/caseAccusedDetailsRoutes');
const caseComplainantDetailsRoutes = require('./routes/caseComplainantDetailsRoutes');
const petitionTemplateMasterRoutes = require('./routes/petitionTemplateMasterRoutes');
const casePetitionDetailsRoutes = require('./routes/casePetitionDetailsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const initDatabase = require('./database/init');
const { testConnection } = require('./config/database');
const { initEmailService } = require('./services/emailService');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - Allow all origins for development
app.use(cors({
  origin: true, // Allow all origins
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (PDFs, uploads)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/law-firms', lawFirmRoutes);
app.use('/api/case-details', caseDetailsRoutes);
app.use('/api/case-accused-details', caseAccusedDetailsRoutes);
app.use('/api/case-complainant-details', caseComplainantDetailsRoutes);
app.use('/api/petition-templates', petitionTemplateMasterRoutes);
app.use('/api/case-petition-details', casePetitionDetailsRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Mansoor App API' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection first
    console.log('Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('\n❌ Cannot connect to database. Server will not start.');
      console.error('Please fix the database connection issue and try again.');
      process.exit(1);
    }
    
    // Initialize database tables
    console.log('Initializing database...');
    await initDatabase();
    
    // Initialize email service
    console.log('Initializing email service...');
    initEmailService();
    
    // Start server - listen on all interfaces (0.0.0.0) to allow emulator access
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n✅ Server is running on port ${PORT}`);
      console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
      console.log(`📡 For Android emulator: http://10.0.2.2:${PORT}/api`);
      console.log(`📡 For iOS simulator: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

