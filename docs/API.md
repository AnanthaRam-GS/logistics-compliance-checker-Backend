### B) `docs/API.md` (endpoint quick reference)
```md
# API Reference

Base URL: `http://localhost:<PORT>/api`

## Compliance
- `GET /compliance/check/:shipmentId`
  - Returns `{ complianceStatus, issues[] }`

## Validation
- `GET /validation/stats`
  - `{ totalOrders, successfulOrders, failedOrders }`
- `POST /validation/validate/:shipmentId`
  - Validates a shipment; returns `{ shipmentId, complianceStatus, issues[] }`

## Analytics
- `GET /analytics/summary`
  - `{ totalOrders, successfulCompliance, unsuccessfulCompliance }`
- `GET /analytics/details/:status`
  - `status` ∈ `successful | unsuccessful | total`
- `GET /analytics/failure-stats`
  -  Pie data: `{ documentationErrors, customsRegulatoryIssues, financialNonCompliance, dataSystemErrors }`
- `GET /analytics/failure-details/:category`
  - `category` ∈ `documentation-errors | customs-issues | financial-non-compliance | data-errors`
