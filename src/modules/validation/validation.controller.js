const Shipment = require('../logistics/shipment.model');
const RestrictedItem = require('../compliance/RestrictedItem.model');
const { verifyHSCode } = require('../../services/hsCodeValidation.service');

async function getValidationStats(req, res, next) {
  try {
    const [totalOrders, successfulOrders, failedOrders] = await Promise.all([
      Shipment.countDocuments(),
      Shipment.countDocuments({ complianceStatus: 'Approved' }),
      Shipment.countDocuments({ complianceStatus: 'Rejected' }),
    ]);
    res.status(200).json({ totalOrders, successfulOrders, failedOrders });
  } catch (err) {
    next(err);
  }
}

async function validateShipment(req, res, next) {
  try {
    const { shipmentId } = req.params;
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

    const issues = [];

    // 1) Basic party details
    if (!shipment.sender?.name || !shipment.sender?.address ||
        !shipment.receiver?.name || !shipment.receiver?.address) {
      issues.push('Insufficient Shipment Details');
    }

    // 2) HS code validity
    const isHSCodeValid = await verifyHSCode(shipment.productDetails.hsCode);
    if (!isHSCodeValid) issues.push('Incorrect HS Code');

    // 3) Restricted goods (any country)
    const restrictedItem = await RestrictedItem.findOne({ hsCode: shipment.productDetails.hsCode });
    if (restrictedItem) issues.push(`Restricted Goods Item (${restrictedItem.status})`);

    // 4) Critical docs
    const ds = shipment.documentStatus || {};
    if (!ds.billOfLading || !ds.certificateOfOrigin || !ds.insurance) {
      issues.push('Missing Invoice or Permits');
    }

    // 5) Duties/Taxes
    if (!ds.dutiesAndTax) issues.push('Unpaid Duties/Taxes');

    shipment.complianceStatus = issues.length ? 'Rejected' : 'Approved';
    shipment.complianceIssues = issues;
    await shipment.save();

    res.status(200).json({
      shipmentId: shipment._id,
      complianceStatus: shipment.complianceStatus,
      issues: shipment.complianceIssues,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getValidationStats, validateShipment };
