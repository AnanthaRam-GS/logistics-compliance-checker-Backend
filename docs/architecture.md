# Architecture

```mermaid
flowchart TD
  Client[Frontend / Postman] --> API[/Express App (src/app.js)/]
  API -->|/api/compliance| ComplianceRoutes
  API -->|/api/validation| ValidationRoutes
  API -->|/api/analytics| AnalyticsRoutes

  subgraph Modules
    ComplianceRoutes --> ComplianceCtrl
    ValidationRoutes --> ValidationCtrl
    AnalyticsRoutes  --> AnalyticsCtrl
  end

  ComplianceCtrl --> EmailSvc
  ValidationCtrl --> HSCodeSvc
  HSCodeSvc --> AICore[(AI Inference: hsCodeAI.js)]

  Modules -->|Mongoose| Mongo[(MongoDB)]


