const express = require('express');
const router = express.Router();
const controller = require('./compliance.controller');

router.get('/check/:shipmentId', controller.checkCompliance);

module.exports = router;
