const Shipment = require('../logistics/shipment.model.js');
const RestrictedItem = require('./RestrictedItem.model');
const sendComplianceIssueMail = require('../../services/email.service');

exports.checkCompliance = async (req, res, next) => {
  try {
    const { shipmentId } = req.params;
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

    const issues = [];

    // Document completeness
    const docStatus = shipment.documentStatus || {};
    for (const [doc, status] of Object.entries(docStatus)) {
      if (!status) issues.push(`Missing document: ${doc}`);
    }

    // HS Code restrictions for source/destination
    const restrictions = await RestrictedItem.find({
      hsCode: shipment.productDetails.hsCode,
      country: { $in: [shipment.shipmentDetails.sourceCountry, shipment.shipmentDetails.destinationCountry] }
    });

    restrictions.forEach(r => {
      issues.push(
        `Product ${r.status.toLowerCase()} for ${r.restrictionType.toLowerCase()} in ${r.country}`
      );
    });

    // Update status + notify
    if (issues.length > 0) {
      shipment.complianceStatus = 'Rejected';
      shipment.complianceIssues = issues;
      try {
        await sendComplianceIssueMail(shipment, issues);
      } catch (mailErr) {
        console.warn('⚠️ Failed to send email, continuing:', mailErr.message);
      }
    } else {
      shipment.complianceStatus = 'Approved';
      shipment.complianceIssues = [];
    }

    await shipment.save();
    res.status(200).json({
      complianceStatus: shipment.complianceStatus,
      issues: shipment.complianceIssues,
    });
  } catch (err) {
    next(err);
  }
};
