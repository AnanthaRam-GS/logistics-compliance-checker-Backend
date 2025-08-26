const express = require('express');
const router = express.Router();
const c = require('./analytics.controller');

router.get('/summary', c.getComplianceSummary);
router.get('/details/:status', c.getComplianceDetails);
router.get('/failure-stats', c.getComplianceFailureStats);
router.get('/failure-details/:category', c.getFailedShipmentsByCategory);

module.exports = router;
