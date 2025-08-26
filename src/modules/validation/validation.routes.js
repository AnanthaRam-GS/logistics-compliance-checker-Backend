const express = require('express');
const router = express.Router();
const { getValidationStats, validateShipment } = require('./validation.controller');

router.get('/stats', getValidationStats);
router.post('/validate/:shipmentId', validateShipment);

module.exports = router;
