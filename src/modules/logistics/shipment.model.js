const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema(
  {
    sender: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      contact: String, // email or phone
    },
    receiver: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      contact: String,
    },
    shipmentDetails: {
      sourceCountry: { type: String, required: true },
      destinationCountry: { type: String, required: true },
    },
    productDetails: {
      productName: { type: String, required: true },
      category: String,
      hsCode: { type: String, required: true },
      quantity: { type: Number, default: 1 },
      weight: Number,
      dimensions: String,
    },
    documentStatus: {
      customsDeclaration: { type: Boolean, default: false },
      dutiesAndTax: { type: Boolean, default: false },
      billOfLading: { type: Boolean, default: false },
      certificateOfOrigin: { type: Boolean, default: false },
      insurance: { type: Boolean, default: false },
      dangerousGoodsDeclaration: { type: Boolean, default: false },
    },
    complianceStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    complianceIssues: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Shipment || mongoose.model('Shipment', shipmentSchema);
