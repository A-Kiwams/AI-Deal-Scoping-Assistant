[Video Demonstration](https://drive.google.com/file/d/1Hzh_8ZUEwWPIQYkWl9dVjRaYvGMek0JE/view?usp=sharing)

..

# ScopeAI

ScopeAI is a browser-based AI-assisted solution-scoping workspace that transforms customer requirements into a structured, reviewable, and traceable solution package.

The application supports requirements analysis, functional scoping, cloud architecture, data and integration planning, AI recommendations, effort estimation, ROM commercials, change-impact analysis, quality validation, export, and local project backup.

> **Important:** ScopeAI is a scoping aid. Generated content must be reviewed and approved by qualified humans before being used for contractual, delivery, security, compliance, or financial decisions.

---

## 1. Core Features

- Customer and opportunity context capture
- Customer requirement ingestion from text, Markdown, RFP-style content, and discovery notes
- Mock AI analysis without a paid AI provider
- Structured requirements with stable identifiers
- Requirement origins:
  - Customer-requested
  - AI-recommended
  - Assumed
  - Out-of-scope
- Source references and traceability
- Human review and editing of requirements
- Assumptions and clarification-question management
- Functional scope, capabilities, modules, workstreams, and delivery packages
- Cloud-specific architecture generation for AWS, Azure, and GCP
- Data, integration, and AI strategy generation
- Explainable effort, timeline, and ROM commercial estimates
- Change-impact analysis
- Controlled regeneration workflow
- Quality-gate checks
- Markdown, DOCX, and print/PDF export
- Project backup and import
- Local browser persistence
- No authentication in the MVP, as required by the challenge

---

## 2. Technology Stack

- React
- TypeScript
- Vite
- React Router
- Zustand
- Zod
- Lucide React
- React Flow
- DOCX export support
- Browser local storage

The MVP currently uses an in-browser architecture with rule-based Mock AI services. Optional live-provider integration can be added through the AI-provider abstraction.

---

## 3. Running ScopeAI Locally

### Prerequisites

Install:

- Node.js
- npm
- Git
- A modern browser such as Chrome, Edge, or Firefox

### Installation

Clone the repository and enter the project directory:

```bash
git clone <YOUR_REPOSITORY_URL>
cd scopeai
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually similar to:

```text
http://localhost:5173
```

### Production build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 4. Optional AI Provider Configuration

ScopeAI is designed to work in Mock AI Mode without a paid AI service.

An optional live AI provider may be connected through the analysis-provider abstraction. A live provider should be implemented behind a service boundary rather than being called directly from React components.

Recommended configuration pattern:

1. Create a local environment file:

```text
.env.local
```

2. Add the provider configuration expected by the implemented adapter, for example:

```env
VITE_AI_PROVIDER=mock
VITE_AI_API_URL=
VITE_AI_MODEL=
```

3. Keep Mock AI Mode enabled unless a compatible provider adapter has been implemented and tested.

### Security note

Do not place private API keys in variables exposed to the browser, such as `VITE_*` variables. Browser-exposed variables can be inspected by users.

For production use, route live-provider requests through a secure server-side backend and store secrets only in server-side environment variables.

If no live provider is configured, ScopeAI continues to operate using Mock AI Mode.

---

## 5. How Mock AI Mode Works

Mock AI Mode is a deterministic, rule-based demonstration provider.

It does not call an external AI model and does not require a paid account.

The mock services inspect customer input using predefined rules and keyword patterns. They then produce seeded or rule-derived outputs such as:

- Functional requirements
- Non-functional requirements
- Security requirements
- Integration requirements
- Assumptions
- Clarification questions
- Functional scope
- Cloud architecture components
- Data entities and data flows
- Integration considerations
- AI decision points
- Responsible-AI considerations
- Evaluation criteria
- Estimates
- Quality-gate results

Mock AI Mode exists to make the application:

- Easy to run locally
- Reproducible during evaluation
- Demonstrable without internet access or paid AI services
- Suitable for testing the workflow and user interface

Mock outputs are illustrative and must not be interpreted as production-grade AI analysis.

---

## 6. How Customer Requirements Are Processed

The general processing flow is:

```text
Customer input
      ↓
Project and opportunity context
      ↓
Requirement ingestion
      ↓
Requirement analysis
      ↓
Structured requirement records
      ↓
Human review and editing
      ↓
Approved scope model
      ↓
Downstream generation
```

A customer can provide:

- Plain text
- Markdown
- RFP-style content
- Discovery notes

The input is stored as the original requirement source for the project.

The analysis layer identifies candidate items such as:

- Business requirements
- Functional requirements
- Non-functional requirements
- Security requirements
- Integration requirements
- Data requirements
- Constraints
- Dependencies

Each extracted requirement receives a structured identifier such as:

```text
BR_01
FR_01
NFR_01
INT_01
DATA_01
SEC_01
CONSTRAINT_01
DEPENDENCY_01
```

The requirement record includes, where available:

- Requirement ID
- Requirement type
- Description
- Priority
- Source reference
- Origin
- Dependencies
- Open questions

---

## 7. How the Scope Model Is Produced and Reviewed

The scope model is a structured representation of the customer opportunity.

It contains:

- Structured requirements
- Assumptions
- Clarification questions
- Source references
- Provider metadata
- Analysis metadata

The model is not treated as final immediately after analysis.

The intended review process is:

1. Analyze the original customer input.
2. Inspect extracted requirements.
3. Edit incorrect or incomplete descriptions.
4. Assign or update priorities.
5. Review requirement origins.
6. Review assumptions.
7. Resolve or track clarification questions.
8. Add missing requirements when necessary.
9. Remove invalid or unsupported items.
10. Use the reviewed model as the basis for downstream outputs.

This human-review step is important because AI-generated or rule-derived interpretations can be incomplete or incorrect.

---

## 8. Source Traceability

ScopeAI maintains traceability by assigning identifiers to requirements and linking downstream outputs to those identifiers.

A requirement may contain a source reference with information such as:

- Source type
- Source section
- Source text or excerpt
- Source location, where available

Downstream records can reference requirement IDs.

Examples:

```text
FR_01 → Customer registration capability
FR_02 → Account-information viewing capability
INT_01 → CRM integration
NFR_01 → Scalability requirement
SEC_01 → Encryption requirement
```

These identifiers can then be referenced by:

- Capabilities
- Modules
- Workstreams
- Delivery packages
- Architecture components
- Data flows
- Integration considerations
- Estimation line items
- Quality checks
- Change-impact results

Traceability helps reviewers identify why an item exists and which customer requirement it supports.

---

## 9. PRD and Functional Scope Generation

The functional-scope layer transforms reviewed requirements into delivery-oriented structures.

It can produce:

- Capabilities
- Modules
- Workstreams
- Delivery packages
- Out-of-scope items

Each generated item should distinguish between:

- Customer-requested content
- AI-recommended content
- Assumptions
- Out-of-scope content

The generated functional scope is linked back to the relevant requirement IDs.

The PRD/export layer combines the available project information into a scoping package containing, where available:

- Executive summary
- Customer context
- Business objectives
- Original requirements
- Structured requirements
- Functional scope
- Assumptions
- Open questions
- Architecture
- Data and integration strategy
- AI approach
- Estimates
- Quality-gate results
- Change history
- Known limitations

Generated outputs must be reviewed before being treated as an approved product or delivery specification.

---

## 10. Cloud-Architecture Generation

ScopeAI supports cloud-specific architecture mappings for:

- AWS
- Microsoft Azure
- Google Cloud Platform
- Undecided

The architecture generator maps logical components to cloud services.

Typical logical components include:

- Frontend
- Backend
- Database
- Integration layer
- Security layer
- Messaging layer
- Monitoring
- Storage

Each architecture component can include:

- Component ID
- Component name
- Component type
- Description
- Cloud-service mapping
- Rationale
- Trade-offs
- Requirement IDs

The architecture workspace also displays connections between components and provides a visual architecture diagram.

The generated architecture is a starting point for technical review. It does not replace detailed production architecture, threat modeling, capacity planning, or implementation design.

---

## 11. Data, Integration, and AI Recommendations

The Data & AI workspace organizes recommendations into several areas.

### Data strategy

The generated model can identify:

- Data entities
- Data classifications
- Data storage considerations
- Processing types
- Data flows

### Integration strategy

The model can identify:

- External systems
- Integration purposes
- Integration patterns
- Data exchanged
- Open integration questions

### AI solution strategy

The model distinguishes between:

- Deterministic processing
- Optional AI-assisted processing
- Human decisions

It can propose AI decision points such as:

- Request categorization
- Routing recommendations
- Assistance with prioritization

It also includes responsible-AI considerations such as:

- Privacy
- Security
- Transparency
- Human oversight
- Reliability

Evaluation criteria may include:

- Classification accuracy
- Recommendation acceptance
- Fallback success
- Response time

These recommendations are illustrative and require validation against the customer’s actual data, risk profile, compliance requirements, and operating environment.

---

## 12. Effort and Timeline Estimation

The estimation component uses visible line items rather than presenting a single unexplained number.

Each estimate line can include:

- Workstream
- Description
- Role
- Effort in hours
- Hourly rate
- Subtotal
- Related requirement IDs
- Assumptions

The basic calculation is:

```text
Line-item subtotal = effort hours × hourly rate
```

The total effort is calculated as:

```text
Total effort = sum of all line-item hours
```

The timeline is represented using phases that may include:

- Phase name
- Description
- Duration in weeks
- Dependencies
- Related workstreams

Timeline duration should be interpreted as a planning estimate rather than a guaranteed delivery date. Parallel work, staffing, dependencies, review cycles, and customer availability can affect the actual duration.

---

## 13. ROM Commercial Calculation

ROM means Rough Order of Magnitude.

The commercial calculation follows this general structure:

```text
Subtotal = sum of all estimate-line subtotals

Contingency amount =
    subtotal × contingency percentage

ROM total =
    subtotal + contingency amount
```

For example:

```text
Subtotal:             $63,600
Contingency:          15%
Contingency amount:   $9,540

ROM total:            $73,140
```

The estimate must be interpreted together with:

- Role rates
- Effort assumptions
- Timeline assumptions
- Scope boundaries
- Contingency percentage
- Confidence level
- Known limitations

ROM values are not fixed quotes and should not be used as contractual commitments without further discovery and commercial review.

---

## 14. Change-Impact Analysis

A change can be recorded against:

- A requirement
- An assumption
- Cloud configuration
- Scope configuration

A change record includes:

- Change type
- Title
- Description
- Related requirement IDs
- Creation date

The change-impact service evaluates which output areas may be affected.

Potential output areas include:

- Requirements
- Functional scope
- Architecture
- Data & AI
- Estimation
- Quality Gate

Each impact record can include:

- Impact level
- Reason
- Affected IDs
- Recommended action
- Whether regeneration is required

The intended workflow is:

```text
Record change
      ↓
Analyze affected outputs
      ↓
Review impact assessment
      ↓
Regenerate affected outputs
      ↓
Recalculate affected estimates
      ↓
Run quality checks again
      ↓
Export updated package
```

Unaffected outputs should not be silently replaced.

---

## 15. Consistency and Coverage Checks

The quality gate checks the available scope package for issues such as:

- Empty requirement descriptions
- Unassigned priorities
- Unresolved clarification questions
- Missing functional-scope coverage
- Missing architecture
- Missing requirement traceability
- Missing Data & AI or integration information
- Missing responsible-AI considerations
- Invalid or incomplete estimates
- Unconfirmed assumptions
- Unsupported or unclear requirement origins

The quality gate produces:

- Individual check results
- Severity
- Status
- Related IDs
- Recommendations
- An overall status

The overall status may be:

- Passed
- Passed with Warnings
- Blocked

The quality gate is a review aid. It does not guarantee that the scope package is complete or correct.

---

## 16. Customer Data Storage and Protection

The current MVP stores project data in the browser using Zustand persistence and local storage.

This means:

- Data remains available after a browser refresh on the same browser profile.
- Data is stored locally on the user’s device.
- Data is not automatically sent to a server in Mock AI Mode.
- Data can be exported through the project-backup feature.

### Important limitations

Browser local storage is not a secure enterprise data store.

The current MVP does not provide:

- User authentication
- Role-based access control
- Server-side encryption management
- Centralized audit logs
- Multi-user collaboration
- Enterprise retention policies
- Automatic server-side backups

Do not use the MVP with sensitive customer information unless the deployment environment and data-handling controls have been reviewed and approved.

For production deployment, consider:

- Secure server-side storage
- Encryption at rest and in transit
- Access control
- Tenant isolation
- Audit logging
- Data retention policies
- Secure secret management
- Redaction of sensitive input
- Provider-specific data-processing controls

---

## 17. Architecture Overview

The intended application architecture is:

```text
Browser UI
   ↓
Workspace and interaction components
   ↓
Application services
   ↓
Structured scope model
   ↓
Generation, estimation, validation, export, and change-impact services
   ↓
Local persistence or optional backend/provider integrations
```

The detailed submission architecture diagram should show:

- Browser application
- Requirements-ingestion layer
- AI orchestration layer
- Structured scope model
- PRD and scope generator
- Cloud-architecture generator
- Data and integration strategy generator
- AI solution generator
- Estimation component
- Traceability component
- Change-impact component
- Quality-validation component
- Export/document-generation layer
- Mock AI provider

---

## 18. Assumptions

The MVP is based on the following assumptions:

1. The application is primarily used by one local user.
2. Mock AI Mode is sufficient for demonstration and evaluation.
3. Customer requirements are supplied as text-based content.
4. Source references may be limited by the format and detail of the original input.
5. Generated recommendations are reviewed by a human.
6. Cloud-service mappings are illustrative rather than production-ready designs.
7. Estimates are ROM-level planning estimates.
8. The current persistence model is browser-local storage.
9. The application does not implement authentication.
10. Optional live AI-provider integration requires a compatible adapter and secure deployment design.

---

## 19. Known Limitations

- The MVP uses in-memory application behavior together with browser persistence rather than a full backend database.
- Mock AI analysis is rule-based and not equivalent to a production LLM.
- Some generators use seeded demonstration logic.
- PDF export currently relies on the browser print workflow.
- DOCX export is basic and may not include every advanced document feature.
- Architecture diagrams are generated from logical components and should receive technical review.
- Change-impact analysis is rule-based.
- Regeneration behavior must be verified carefully to ensure only affected outputs are replaced.
- No authentication or multi-user collaboration is included.
- No enterprise-grade security or compliance controls are implemented.
- File ingestion support may vary depending on the implemented upload handlers.
- The quality gate is a review aid and cannot prove that every issue has been detected.

---

## 20. Suggested Demonstration Scenario

Use a customer-portal modernization scenario containing:

- Customer registration and secure login
- Account-information viewing
- Service requests
- CRM integration
- Email notifications
- Scalability requirements
- Availability requirements
- Encryption requirements
- A missing CRM API document
- A six-month delivery constraint

During the demonstration:

1. Create a project.
2. Enter the customer requirements.
3. Run Mock AI analysis.
4. Review and edit extracted requirements.
5. Review assumptions and clarification questions.
6. Generate functional scope.
7. Select Azure and generate architecture.
8. Review data, integration, and AI recommendations.
9. Review effort, timeline, and ROM calculations.
10. Run the quality gate.
11. Change the expected customer volume.
12. Review the change-impact analysis.
13. Regenerate or recalculate affected outputs.
14. Run the quality gate again.
15. Export the final scoping package.
16. Export a project backup.

---

## 21. Project Status

ScopeAI is an MVP demonstration and learning project.

Its purpose is to demonstrate how a structured, reviewable, traceable solution-scoping workflow can be built with React, TypeScript, modular services, and a Mock AI provider.

It should not be represented as a production-ready enterprise consulting platform without further engineering, security, testing, and operational work.
