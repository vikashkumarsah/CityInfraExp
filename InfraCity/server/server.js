console.log('=== Server.js Starting ===');

// Load environment variables
try {
  console.log('Loading dotenv...');
  require("dotenv").config();
  console.log('Dotenv loaded successfully');
} catch (error) {
  console.error('Error loading dotenv:', error);
  process.exit(1);
}

console.log('=== Server Startup Debug ===');
console.log('Environment variables loaded:');
console.log('- PORT:', process.env.PORT);
console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);

try {
  console.log('Checking ACCESS_TOKEN_SECRET...');
  console.log('- ACCESS_TOKEN_SECRET exists:', !!process.env.ACCESS_TOKEN_SECRET);
  console.log('- ACCESS_TOKEN_SECRET length:', process.env.ACCESS_TOKEN_SECRET ? process.env.ACCESS_TOKEN_SECRET.length : 0);
  console.log('ACCESS_TOKEN_SECRET check completed');
} catch (error) {
  console.error('Error checking ACCESS_TOKEN_SECRET:', error);
  process.exit(1);
}

try {
  console.log('Checking REFRESH_TOKEN_SECRET...');
  console.log('- REFRESH_TOKEN_SECRET exists:', !!process.env.REFRESH_TOKEN_SECRET);
  console.log('- REFRESH_TOKEN_SECRET length:', process.env.REFRESH_TOKEN_SECRET ? process.env.REFRESH_TOKEN_SECRET.length : 0);
  console.log('REFRESH_TOKEN_SECRET check completed');
} catch (error) {
  console.error('Error checking REFRESH_TOKEN_SECRET:', error);
  process.exit(1);
}

// Declare variables at top level
let mongoose, express, session, MongoStore, cors;

try {
  console.log('Loading mongoose...');
  mongoose = require("mongoose");
  console.log('Mongoose loaded successfully');
} catch (error) {
  console.error('Error loading mongoose:', error);
  process.exit(1);
}

try {
  console.log('Loading express...');
  express = require("express");
  console.log('Express loaded successfully');
} catch (error) {
  console.error('Error loading express:', error);
  process.exit(1);
}

try {
  console.log('Loading other dependencies...');
  session = require("express-session");
  MongoStore = require('connect-mongo');
  cors = require("cors");
  console.log('Other dependencies loaded successfully');
} catch (error) {
  console.error('Error loading dependencies:', error);
  process.exit(1);
}

try {
  console.log('Loading route modules...');
  const basicRoutes = require("./routes/index");
  const authRoutes = require("./routes/authRoutes");
  const userRoutes = require("./routes/userRoutes");
  const seedRoutes = require("./routes/seedRoutes");
  const infrastructureRoutes = require("./routes/infrastructureRoutes");
  const metricsRoutes = require("./routes/metricsRoutes");
  const issueRoutes = require("./routes/issueRoutes");
  const roadSegmentRoutes = require("./routes/roadSegmentRoutes");
  const intersectionAnalysisRoutes = require("./routes/intersectionAnalysisRoutes");
  const decongestionPlanRoutes = require("./routes/decongestionPlanRoutes");
  const taskRoutes = require("./routes/taskRoutes");
  const analyticsRoutes = require("./routes/analyticsRoutes");
  const planningSessionRoutes = require("./routes/planningSessionRoutes");
  const reportRoutes = require("./routes/reportRoutes");
  console.log('Route modules loaded successfully');
} catch (error) {
  console.error('Error loading route modules:', error);
  console.error('Error stack:', error.stack);
  process.exit(1);
}

try {
  console.log('Loading database config...');
  const { connectDB } = require("./config/database");
  console.log('Database config loaded successfully');
} catch (error) {
  console.error('Error loading database config:', error);
  process.exit(1);
}

console.log('Validating environment variables...');

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL variables in .env missing.");
  process.exit(-1);
}

if (!process.env.ACCESS_TOKEN_SECRET) {
  console.error("Error: ACCESS_TOKEN_SECRET missing in .env file.");
  process.exit(-1);
}

if (!process.env.REFRESH_TOKEN_SECRET) {
  console.error("Error: REFRESH_TOKEN_SECRET missing in .env file.");
  process.exit(-1);
}

console.log('Environment validation completed');

console.log('Creating Express app...');
const app = express();
const port = process.env.PORT || 3000;

// Pretty-print JSON responses
app.enable('json spaces');
// We want to be consistent with URL paths, so we enable strict routing
app.enable('strict routing');

console.log('Setting up middleware...');
app.use(cors({}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
console.log('Connecting to database...');
connectDB();

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

console.log('Setting up routes...');
// Basic Routes
app.use(basicRoutes);
// Authentication Routes
app.use('/api/auth', authRoutes);
// User Routes
app.use('/api/users', userRoutes);
// Seed Routes
app.use('/api/seed', seedRoutes);
// Infrastructure Routes
app.use('/api/infrastructure', infrastructureRoutes);
// Metrics Routes
app.use('/api/metrics', metricsRoutes);
// Issue Routes
app.use('/api/issues', issueRoutes);
// Road Segment Routes
app.use('/api/road-segments', roadSegmentRoutes);
// Intersection Analysis Routes
app.use('/api/intersections/analysis', intersectionAnalysisRoutes);
// Decongestion Plan Routes
app.use('/api/decongestion-plans', decongestionPlanRoutes);
// Task Routes
app.use('/api/tasks', taskRoutes);
// Analytics Routes
app.use('/api/analytics', analyticsRoutes);
// Planning Session Routes
app.use('/api/planning-sessions', planningSessionRoutes);
// Report Routes
app.use('/api/reports', reportRoutes);

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

console.log('Starting server...');
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

console.log('Server.js execution completed');