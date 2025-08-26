const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const complianceRoutes = require('./modules/compliance/compliance.routes');
const validationRoutes = require('./modules/validation/validation.routes');
const analyticsRoutes  = require('./modules/analytics/analytics.routes');

const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/compliance', complianceRoutes);
app.use('/api/validation', validationRoutes);
app.use('/api/analytics',  analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
