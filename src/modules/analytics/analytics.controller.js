const Shipment = require('../logistics/shipment.model');

// Summary numbers
async function getComplianceSummary(req, res, next) {
  try {
    const [totalOrders, successfulCompliance, unsuccessfulCompliance] = await Promise.all([
      Shipment.countDocuments(),
      Shipment.countDocuments({ complianceStatus: 'Approved' }),
      Shipment.countDocuments({ complianceStatus: 'Rejected' }),
    ]);
    res.status(200).json({ totalOrders, successfulCompliance, unsuccessfulCompliance });
  } catch (err) {
    next(err);
  }
}

// List by status
async function getComplianceDetails(req, res, next) {
  try {
    const { status } = req.params;
    let query = {};
    if (status === 'successful') query = { complianceStatus: 'Approved' };
    else if (status === 'unsuccessful') query = { complianceStatus: 'Rejected' };

    const orders = await Shipment.find(query).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (err) {
    next(err);
  }
}

// Pie: failure categories (simple text contains)
async function getComplianceFailureStats(req, res, next) {
  try {
    const failed = await Shipment.find({ complianceStatus: 'Rejected' }, { complianceIssues: 1 });

    const stats = {
      documentationErrors: 0,
      customsRegulatoryIssues: 0,
      financialNonCompliance: 0,
      dataSystemErrors: 0,
    };

    for (const doc of failed) {
      const reasons = (doc.complianceIssues || []).join(' ').toLowerCase();

      if (reasons.match(/missing document|missing invoice|permits?/)) {
        stats.documentationErrors++;
      }
      if (reasons.match(/restricted|banned|incorrect hs code|misclassification/)) {
        stats.customsRegulatoryIssues++;
      }
      if (reasons.match(/unpaid duties|underreported value|tax/)) {
        stats.financialNonCompliance++;
      }
      if (reasons.match(/mismatch|manual entry|system failure|data error/)) {
        stats.dataSystemErrors++;
      }
    }

    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}

// Failed shipments by category
async function getFailedShipmentsByCategory(req, res, next) {
  try {
    const { category } = req.params;

    const categoryRegex = {
      'documentation-errors': /missing document|missing invoice|permits?/i,
      'customs-issues': /(restricted|banned|incorrect hs code|misclassification)/i,
      'financial-non-compliance': /(unpaid duties|underreported value|tax)/i,
      'data-errors': /(mismatch|manual entry|system failure|data error)/i,
    }[category];

    if (!categoryRegex) return res.status(400).json({ message: 'Invalid category' });

    const failedShipments = await Shipment.find({
      complianceStatus: 'Rejected',
      complianceIssues: { $regex: categoryRegex },
    });

    res.status(200).json(failedShipments);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getComplianceSummary,
  getComplianceDetails,
  getComplianceFailureStats,
  getFailedShipmentsByCategory,
};
