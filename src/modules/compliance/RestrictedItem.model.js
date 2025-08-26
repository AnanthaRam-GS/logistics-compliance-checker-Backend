const mongoose = require('mongoose');

const restrictedItemSchema = new mongoose.Schema(
  {
    hsCode: { type: String, required: true },
    country: { type: String, required: true },
    restrictionType: { type: String, enum: ['Import', 'Export'], required: true },
    status: { type: String, enum: ['Banned', 'Restricted'], required: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.RestrictedItem ||
  mongoose.model('RestrictedItem', restrictedItemSchema);
