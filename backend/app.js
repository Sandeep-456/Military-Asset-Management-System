const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const purchasesRoute = require('./routes/purchases');
const expendituresRoute = require('./routes/expenditures');
const transfers = require('./routes/transfers');
const assignments = require('./routes/assignments');
const authRoute = require('./routes/auth');
const dashboardRoute = require('./routes/dashboard'); 
const authenticateToken = require('./auth/auth');

const app = express();
app.use(cors({
  origin: 'https://military-asset-management-system-1.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']}));
app.use(bodyParser.json());

// Public login route
app.use('/api/login', authRoute);

// Protected routes
app.use('/api/purchases', authenticateToken, purchasesRoute);
app.use('/api/expenditures', authenticateToken, expendituresRoute);
app.use('/api/transfers', authenticateToken, transfers);
app.use('/api/assignments', authenticateToken, assignments);
app.use('/api/dashboard', authenticateToken, dashboardRoute); 

module.exports = app;
