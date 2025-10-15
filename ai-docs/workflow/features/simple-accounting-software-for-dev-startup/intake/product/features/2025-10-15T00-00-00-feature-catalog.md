# Feature Catalog: Simple Accounting Software for Dev Startup

**Feature ID:** `simple-accounting-software-for-dev-startup`
**Catalog Date:** 2025-10-15
**Status:** Updated for Philippines Market
**Version:** 2.0

---

## Overview

This feature catalog breaks down the core capabilities from the product charter into specific, actionable features with clear dependencies, priorities, and readiness assessments. Each feature includes user stories tied to personas and measurable success criteria.

**IMPORTANT:** This catalog has been updated for **Philippines-based software development startups** with mandatory government contributions (SSS, PhilHealth, Pag-IBIG), 13th month pay, and BIR compliance requirements.

**Related Documents:**
- Product Charter: `ai-docs/workflow/features/simple-accounting-software-for-dev-startup/intake/product/charter.md` (v2.0 - Philippines-specific)
- Philippines Compliance Research: `ai-docs/workflow/features/simple-accounting-software-for-dev-startup/intake/product/research/2025-10-15T00-00-00-philippines-compliance.md`

---

## Technical Infrastructure Requirements

These foundational components must be established before feature development can begin. Multiple features depend on these infrastructure elements.

| ID | Requirement | Description | Dependencies | Priority | Readiness | Research Notes |
|----|-------------|-------------|--------------|----------|-----------|----------------|
| **INF-001** | User Authentication & Authorization | Secure user login and role-based access control (RBAC) for sensitive data | None | Must-Have | Needs Spec | Define roles: Admin (Founder/Office Manager), Employee, Accountant (read-only) |
| **INF-002** | Secure Database | Database designed for security and data integrity, meeting SOC 2 requirements | None | Must-Have | Needs Research | PostgreSQL with row-level security vs. MongoDB with field-level encryption |
| **INF-003** | Cloud Hosting | Secure and scalable cloud infrastructure (AWS/GCP/Azure) compliant with SOC 2 | None | Must-Have | Needs Research | AWS RDS + EC2 vs. GCP Cloud SQL + Compute Engine vs. managed platforms (Heroku, Render) |
| **INF-004** | Data Encryption | Encryption of all sensitive data at rest and in transit | INF-002, INF-003 | Must-Have | Ready | Standard TLS 1.3 for transit, AES-256 for at-rest |
| **INF-005** | Audit Logging | System for logging all significant actions (payments, approvals) for security/compliance | INF-001 | Must-Have | Needs Spec | Define events to log, retention policy, access controls |
| **INF-006** | Scheduled Job Runner | Service for background tasks (recurring invoices, report generation) | INF-003 | Should-Have | Ready | Node-cron, Bull/BullMQ, or cloud-native scheduler |
| **INF-007** | 3rd Party API Integration Layer | Secure framework for integrating external services (payroll, banks) | INF-003 | Must-Have | Needs Spec | OAuth2 handling, credential vault, retry logic, webhook receiver |
| **INF-008** | Data Backup & Retention | Automated backups and 5-year retention policy (Philippines EOPT Act requirement) | INF-002, INF-003 | Must-Have | Needs Research | Backup frequency, point-in-time recovery, archival storage costs; 5 years for accounting records (EOPT Act), 3 years for employee records (Data Privacy Act of 2012) |

---

## Capability 1: Financial Dashboard

**Business Value:** Provides real-time visibility into company financial health for data-driven decision making.

**Target Personas:** Alex (Founder/CEO), Brenda (Office Manager)

| Feature ID | Feature Name | User Story | Primary Persona | Business Problem | Success Criteria | Dependencies | Priority | Readiness | Research Notes |
|------------|--------------|------------|-----------------|------------------|------------------|--------------|----------|-----------|----------------|
| **FD-001** | Real-time Cash Flow View | As Alex, I want to see our real-time cash flow so that I can make informed spending decisions | Founder/CEO | Lack of visibility into daily cash position | Dashboard shows accurate, up-to-date cash balance within 1-hour latency | SB-003, ET-005 | Must-Have | Ready | Aggregate from bank balance + pending transactions |
| **FD-002** | Profit & Loss Statement | As Alex, I want to view a monthly P&L statement so that I can understand our profitability | Founder/CEO | Inability to track revenue vs. expenses effectively | P&L report can be generated for any month with drill-down capability | SB-003, ET-005 | Must-Have | Ready | Standard accounting P&L format with revenue/COGS/operating expenses |
| **FD-003** | Burn Rate Calculation | As Alex, I want to see our monthly cash burn rate so that I can manage our runway | Founder/CEO | Uncertainty about cash consumption velocity | Dashboard displays average net negative cash flow per month (3-month rolling) | FD-001, FD-002 | Must-Have | Ready | Formula: (Starting Cash - Ending Cash) / Number of Months |
| **FD-004** | Runway Projection | As Alex, I want a projection of our financial runway so that I know how long we can operate | Founder/CEO | Difficulty forecasting when company will run out of money | Dashboard shows estimated months of runway remaining with confidence interval | FD-003 | Should-Have | Needs Spec | Requires assumptions about future revenue/expenses; linear vs. trend-based projection |
| **FD-005** | Customizable Reporting | As Brenda, I want to create custom financial reports so that I can analyze specific business areas | Office Manager | Standard reports lack flexibility for deep analysis | Users can select date ranges, accounts, categories to build custom reports | FD-001, FD-002 | Could-Have | Needs Spec | Report builder UI, saved report templates, export to CSV/PDF |

---

## Capability 2: Payroll Management

**Business Value:** Automates payroll processing to ensure accurate, timely employee compensation and tax compliance.

**Target Personas:** Brenda (Office Manager), Charlie (Developer)

| Feature ID | Feature Name | User Story | Primary Persona | Business Problem | Success Criteria | Dependencies | Priority | Readiness | Research Notes |
|------------|--------------|------------|-----------------|------------------|------------------|--------------|----------|-----------|----------------|
| **PM-001** | Payroll Provider Integration | As Brenda, I want to connect our payroll provider (Salarium/Sprout Solutions/PayrollHero) so that I can sync employee and payroll data | Office Manager | Manual data entry between systems is error-prone | System securely connects to Philippines payroll provider API and syncs employee data bidirectionally | INF-007 | Must-Have | Needs Research | **CRITICAL:** Evaluate Salarium, Sprout Solutions, PayrollHero APIs; select primary integration partner; must handle SSS, PhilHealth, Pag-IBIG contributions |
| **PM-002** | Run Payroll | As Brenda, I want to run our semi-monthly payroll so that everyone gets paid on time | Office Manager | Payroll is critical, time-consuming, recurring task | Payroll processed successfully with funds transferred, pay stubs generated, SSS/PhilHealth/Pag-IBIG contributions calculated, and 13th month pay accrued (1/12 of basic salary) | PM-001, PH-001, ESS-001 | Must-Have | Blocked | Blocked by PM-001 (integration research); Philippines payroll cycles: 1st-15th and 16th-31st of month |
| **PM-003** | View Payroll History | As Brenda, I want to view history of all past payroll runs so that I can answer employee questions | Office Manager | Difficult to access historical payroll data | List of past payroll runs with key details (date, amount, employees) available | PM-002 | Must-Have | Blocked | Blocked by PM-002 |
| **PM-004** | Off-cycle Payroll | As Brenda, I want to run off-cycle payroll for bonuses/corrections so that I can handle special payments | Office Manager | Inflexible payroll system can't handle exceptions | Off-cycle payroll can be processed outside regular schedule | PM-002 | Should-Have | Blocked | Blocked by PM-002 |
| **PM-005** | Automated Payroll Tax Filing | As Brenda, I want the system to automatically file payroll taxes so that we remain compliant | Office Manager | Manual BIR and government contribution filing is complex and risky | Payroll taxes and contributions filed with correct agencies on time: Monthly BIR Form 1601C, Annual BIR Form 2316, Annual Alphalist, SSS/PhilHealth/Pag-IBIG monthly reports | PM-001, PH-003 | Should-Have | Needs Research | **CRITICAL:** Depends heavily on payroll provider API capabilities; research BIR Electronic Filing and Payment System (eFPS) integration; SSS/PhilHealth/Pag-IBIG may require manual filing in MVP |

---

## Capability 3: Philippines-Specific Compliance (NEW)

**Business Value:** Ensures legal compliance with Philippines labor laws and BIR requirements specific to the Philippines market.

**Target Personas:** Brenda (Office Manager), Charlie (Developer), Alex (Founder/CEO)

| Feature ID | Feature Name | User Story | Primary Persona | Business Problem | Success Criteria | Dependencies | Priority | Readiness | Research Notes |
|------------|--------------|------------|-----------------|------------------|------------------|--------------|----------|-----------|----------------|
| **PH-001** | 13th Month Pay Management | As Brenda, I want to track 13th month pay accruals so that I can ensure we comply with Philippines labor law | Office Manager | 13th month pay is legally required by December 24th; manual tracking is error-prone | System automatically accrues 1/12 of basic salary per pay period, displays total accrued liability on dashboard, and generates 13th month pay run in December with ₱90,000 tax exemption | PM-001 | Must-Have | Needs Spec | Legal requirement: 1/12 of basic salary per pay period; payment deadline: December 24th; tax-exempt up to ₱90,000; separate from regular payroll |
| **PH-002** | BIR E-Invoice Submission | As Brenda, I want to submit invoices to BIR electronically so that we comply with BIR e-invoicing requirements | Office Manager | BIR may mandate electronic invoice submission; manual filing is slow | Invoices can be submitted to BIR Electronic Invoicing System API with acknowledgment receipt | SB-002, INF-007 | Should-Have | Needs Research | **CRITICAL BLOCKER:** Research if BIR Electronic Invoicing System has public API for third-party integration; may not be required for MVP if API unavailable |
| **PH-003** | Government Contribution Reports | As Brenda, I want to generate monthly government contribution reports so that I can file with SSS, PhilHealth, and Pag-IBIG | Office Manager | Manual calculation and reporting of government contributions is time-consuming and error-prone | Monthly reports generated showing employer + employee contributions for SSS (15% total), PhilHealth (5% total), and Pag-IBIG (4% total) with downloadable CSV/PDF | PM-001, PM-002 | Must-Have | Needs Spec | Generate monthly reports for: SSS R3 form, PhilHealth RF-1 form, Pag-IBIG MCR form; reports show employee names, contribution amounts (employee + employer shares), totals; MVP may require manual submission to government portals |

---

## Capability 4: Expense Tracking

**Business Value:** Streamlines expense submission, approval, and reimbursement to reduce administrative burden and improve employee experience.

**Target Personas:** Charlie (Developer), Brenda (Office Manager)

| Feature ID | Feature Name | User Story | Primary Persona | Business Problem | Success Criteria | Dependencies | Priority | Readiness | Research Notes |
|------------|--------------|------------|-----------------|------------------|------------------|--------------|----------|-----------|----------------|
| **ET-001** | Manual Expense Entry | As Charlie, I want to manually enter an expense so that I can get reimbursed for a purchase | Developer | No standardized way to submit expenses | Employee can fill out form with date, amount, category, description | ESS-001 | Must-Have | Ready | Form fields: date, merchant, amount, category, description, project (optional) |
| **ET-002** | Receipt Upload | As Charlie, I want to upload a photo of my receipt so that I have proof of my expense | Developer | Lost receipts and lack of documentation | User can attach digital file (PDF, JPG, PNG, max 10MB) to expense entry | ET-001 | Must-Have | Ready | Cloud storage for attachments (S3/GCS), virus scanning |
| **ET-003** | Expense Approval Workflow | As Brenda, I want to approve or deny expense reports so that I can ensure they are valid | Office Manager | No formal process for expense approval | Expense submitted by employee can be approved/denied by manager with comments | ET-001 | Must-Have | Ready | Email notifications on submission/approval/denial |
| **ET-004** | Corporate Card Integration | As Brenda, I want to link our corporate credit cards so that transactions are automatically imported | Office Manager | Manual reconciliation of credit card statements | Card transactions appear in system and can be categorized/matched to expenses | INF-007 | Should-Have | Needs Research | Research Plaid, Yodlee, or direct bank APIs; PCI compliance implications |
| **ET-005** | Expense Reimbursement | As Brenda, I want to process expense reimbursements so that employees are paid back timely | Office Manager | Ad-hoc reimbursement process is inefficient | Approved expenses bundled and paid out via ACH or included in next payroll | ET-003, PM-001 | Must-Have | Blocked | Blocked by ET-003 (approval workflow) |
| **ET-006** | OCR for Receipt Scanning | As Charlie, I want the system to automatically read vendor, date, and amount from my receipt photo | Developer | Manual data entry from receipts is tedious | OCR extracts key data from uploaded receipts with >90% accuracy | ET-002 | Should-Have | Needs Research | Research Google Vision AI, AWS Textract, or similar OCR APIs; cost per scan |

---

## Capability 5: Sales & Billing

**Business Value:** Simplifies invoicing and payment tracking to improve cash flow and reduce time chasing payments.

**Target Personas:** Brenda (Office Manager), Alex (Founder/CEO)

| Feature ID | Feature Name | User Story | Primary Persona | Business Problem | Success Criteria | Dependencies | Priority | Readiness | Research Notes |
|------------|--------------|------------|-----------------|------------------|------------------|--------------|----------|-----------|----------------|
| **SB-001** | Customer & Project Management | As Brenda, I want to manage a list of customers and their projects so that I can organize our billing | Office Manager | No central place to track client work | Users can create, update, view customers and associated projects | INF-001 | Must-Have | Ready | Data model: Customer (name, contact, address, payment terms), Project (name, customer, billing type, rate) |
| **SB-002** | Invoice Creation & Sending | As Brenda, I want to create and send a BIR-compliant invoice to a customer so that we can bill for our work | Office Manager | Manual invoice creation in Word/Excel is inefficient and non-compliant | Invoice can be generated for customer following BIR format (TIN, VAT breakdown, serial numbers) and sent via email with PDF attachment | SB-001, SB-006 | Must-Have | Ready | BIR-compliant invoice template: Company TIN, Customer TIN, Serial number, 12% VAT breakdown or 3% percentage tax, payment terms; company branding |
| **SB-003** | Invoice Tracking | As Brenda, I want to track the status of invoices (sent, paid, overdue) so that I can manage collections | Office Manager | Difficult to know which invoices are outstanding | System displays status of each invoice and flags overdue ones (>30 days) | SB-002 | Must-Have | Blocked | Blocked by SB-002; automated reminders for overdue invoices |
| **SB-004** | Online Payment Processing | As Alex, I want our customers to be able to pay invoices online so that we get paid faster | Founder/CEO | Slow payment times due to manual payment methods | Customers can pay invoice via credit card or ACH through payment link | SB-002, INF-007 | Should-Have | Needs Research | Research Stripe, PayPal, Square; transaction fees; PCI compliance |
| **SB-005** | Recurring Invoicing | As Brenda, I want to set up recurring invoices for retainer clients so that I don't have to create them manually each month | Office Manager | Repetitive manual work for fixed contracts | Invoices automatically generated and sent on predefined schedule (monthly/quarterly) | SB-002, INF-006 | Should-Have | Blocked | Blocked by SB-002 and INF-006 (job runner) |
| **SB-006** | VAT/Percentage Tax Calculation | As Brenda, I want the system to calculate VAT or percentage tax on invoices so that we are BIR compliant | Office Manager | VAT calculation (12%) is mandatory for businesses >₱3M revenue; percentage tax (3%) below threshold | Tax correctly calculated based on registration status: 12% VAT for VAT-registered businesses, 3% percentage tax for non-VAT | SB-001 | Should-Have | Needs Research | Implement VAT registration status flag in company settings; apply 12% VAT or 3% percentage tax based on status; research BIR Electronic Invoicing System API integration |

---

## Capability 6: Employee Self-Service Portal

**Business Value:** Empowers employees to access their own information without involving HR/office manager, reducing administrative overhead.

**Target Persona:** Charlie (Developer)

| Feature ID | Feature Name | User Story | Primary Persona | Business Problem | Success Criteria | Dependencies | Priority | Readiness | Research Notes |
|------------|--------------|------------|-----------------|------------------|------------------|--------------|----------|-----------|----------------|
| **ESS-001** | User Profile & Access | As Charlie, I want to log in and see my own information so that I can manage my profile and expenses | Developer | Employees have no direct access to their own data | User can log in and view personal dashboard with profile, pay stubs, expenses | INF-001 | Must-Have | Blocked | Blocked by INF-001 (auth/RBAC); employees see only their own data |
| **ESS-002** | View Pay Stubs | As Charlie, I want to view and download my past pay stubs so that I have a record of my earnings | Developer | Employees have to request pay stubs from office manager | User can see list of their pay stubs and download them as PDFs | ESS-001, PM-003 | Must-Have | Blocked | Blocked by PM-003 (payroll history) |
| **ESS-003** | Submit Expenses | As Charlie, I want to submit my expenses through the portal so that I can get reimbursed easily | Developer | Expense submission is manual, email-based process | User can access expense submission form from their dashboard | ESS-001, ET-001 | Must-Have | Blocked | Blocked by ET-001 (expense entry form) |
| **ESS-004** | View BIR Form 2316 (Tax Certificate) | As Charlie, I want to access my annual BIR Form 2316 so that I can file my taxes | Developer | Distribution of tax forms is manual process | User can view and download their annual BIR Form 2316 (Certificate of Compensation Payment/Tax Withheld), view government contribution summaries (SSS, PhilHealth, Pag-IBIG), and view 13th month pay history | ESS-001, PM-001, PH-001 | Must-Have | Blocked | Blocked by PM-001 (payroll integration); BIR Form 2316 typically comes from payroll provider; include SSS/PhilHealth/Pag-IBIG contribution summaries |
| **ESS-005** | Time Tracking for Billable Hours | As Charlie, I want to log my hours worked on different projects so that we can bill clients accurately | Developer | Inaccurate tracking of billable hours | User can submit weekly timesheet allocating hours to projects | ESS-001, SB-001 | Should-Have | Blocked | Blocked by SB-001 (project management); timesheet approval workflow |

---

## Feature Summary by Priority

### Must-Have (MVP Core - 26 features) - Philippines Edition

**Infrastructure (7):**
- INF-001: User Authentication & Authorization
- INF-002: Secure Database
- INF-003: Cloud Hosting
- INF-004: Data Encryption
- INF-005: Audit Logging
- INF-007: 3rd Party API Integration Layer
- INF-008: Data Backup & Retention (5-year Philippines requirement)

**Financial Dashboard (3):**
- FD-001: Real-time Cash Flow View
- FD-002: Profit & Loss Statement
- FD-003: Burn Rate Calculation

**Payroll (3):**
- PM-001: Payroll Provider Integration (Salarium/Sprout/PayrollHero)
- PM-002: Run Payroll (with SSS/PhilHealth/Pag-IBIG)
- PM-003: View Payroll History

**Philippines-Specific Compliance (2):**
- PH-001: 13th Month Pay Management
- PH-003: Government Contribution Reports (SSS, PhilHealth, Pag-IBIG)

**Expense Tracking (4):**
- ET-001: Manual Expense Entry
- ET-002: Receipt Upload
- ET-003: Expense Approval Workflow
- ET-005: Expense Reimbursement

**Sales & Billing (3):**
- SB-001: Customer & Project Management
- SB-002: Invoice Creation & Sending (BIR-compliant)
- SB-003: Invoice Tracking

**Employee Self-Service (4):**
- ESS-001: User Profile & Access
- ESS-002: View Pay Stubs
- ESS-003: Submit Expenses
- ESS-004: View BIR Form 2316 (Tax Certificate)

### Should-Have (Phase 2 - 11 features)

- INF-006: Scheduled Job Runner
- FD-004: Runway Projection
- PM-004: Off-cycle Payroll
- PM-005: Automated Payroll Tax Filing (BIR eFPS integration)
- PH-002: BIR E-Invoice Submission
- SB-006: VAT/Percentage Tax Calculation (12% VAT or 3% percentage tax)
- ET-004: Corporate Card Integration
- ET-006: OCR for Receipt Scanning
- SB-004: Online Payment Processing
- SB-005: Recurring Invoicing
- ESS-005: Time Tracking for Billable Hours

### Could-Have (Future Enhancements - 1 feature)

- FD-005: Customizable Reporting

---

## Dependency Analysis

### Critical Path Features (Must be built first)

1. **INF-001** (User Authentication & Authorization) - Blocks 5 features
2. **INF-002** (Secure Database) - Blocks 2 features
3. **INF-003** (Cloud Hosting) - Blocks 4 features
4. **INF-007** (3rd Party API Integration Layer) - Blocks 5 features (including PH-002)
5. **PM-001** (Payroll Provider Integration - Salarium/Sprout/PayrollHero) - Blocks 6 features (including PH-001, PH-003)
6. **PH-001** (13th Month Pay Management) - Blocks PM-002, ESS-004
7. **SB-001** (Customer & Project Management) - Blocks 3 features (including SB-006)
8. **ET-001** (Manual Expense Entry) - Blocks 2 features
9. **SB-002** (Invoice Creation & Sending - BIR-compliant) - Blocks 4 features

### Highest Dependency Features (Most blockers)

- **ESS-001** (User Profile & Access): Blocked by INF-001 → Blocks 4 features
- **PM-002** (Run Payroll): Blocked by PM-001, PH-001, ESS-001 → Blocks 3 features (PM-003, PH-003, ET-005)
- **PH-003** (Government Contribution Reports): Blocked by PM-001, PM-002 → Enables PM-005
- **SB-003** (Invoice Tracking): Blocked by SB-002 → Enables FD-001
- **ET-005** (Expense Reimbursement): Blocked by ET-003, PM-001 → Enables FD-001

---

## Research Requirements

### Immediate Research Needed (Blocking MVP)

1. **Philippines Payroll Integration Partner Selection** (Blocks PM-001, PH-001, PH-003) - **CRITICAL**
   - Evaluate Salarium, Sprout Solutions, PayrollHero APIs
   - Compare features, pricing, developer experience
   - Assess SSS/PhilHealth/Pag-IBIG calculation capabilities
   - Verify 13th month pay tracking support
   - Assess BIR tax filing capabilities (Forms 1601C, 2316, Alphalist)
   - **Owner:** Technical Lead + Office Manager
   - **Timeline:** Week 1-2
   - **Decision Deadline:** End of Week 2

2. **BIR Electronic Invoicing System API** (Blocks PH-002) - **CRITICAL BLOCKER**
   - Research if BIR Electronic Invoicing System has public API for third-party integration
   - If no API: MVP will generate BIR-compliant invoices but require manual filing
   - If API exists: Investigate authentication, invoice format, acknowledgment receipt
   - **Owner:** Technical Lead + Compliance Specialist
   - **Timeline:** Week 1-2
   - **Decision Deadline:** End of Week 8 (determines if PH-002 is feasible for MVP)

3. **Database & Hosting Architecture** (Blocks INF-002, INF-003)
   - PostgreSQL vs. MongoDB for financial data
   - AWS vs. GCP (Philippines region availability and pricing)
   - Philippines Data Privacy Act of 2012 compliance requirements
   - Cost projections for 10-50 users
   - **Owner:** Technical Lead
   - **Timeline:** Week 1-2
   - **Decision Deadline:** End of Week 1

4. **API Integration Framework** (Blocks INF-007)
   - OAuth2 flow implementation
   - Credential vault selection (HashiCorp Vault, AWS Secrets Manager)
   - Webhook receiver architecture
   - Retry/error handling patterns
   - **Owner:** Technical Lead
   - **Timeline:** Week 2-3

5. **Data Backup & Retention Policy** (Blocks INF-008)
   - Backup frequency and restoration SLA
   - 5-year retention archival storage costs (Philippines EOPT Act requirement)
   - Point-in-time recovery requirements
   - Disaster recovery plan
   - **Owner:** Technical Lead + Compliance
   - **Timeline:** Week 2-3

### Secondary Research (Phase 2)

6. **Government Portal Online Submission APIs** (Blocks PM-005 automation)
   - Research if SSS, PhilHealth, Pag-IBIG have online submission APIs
   - If no APIs: MVP will generate reports for manual submission
   - If APIs exist: Investigate authentication, submission format, acknowledgment receipt
   - **Timeline:** Week 10-12
   - **Decision Deadline:** End of Week 12

7. **Philippines Banking API Options** (Blocks ET-004, payroll disbursement)
   - Research Philippines bank APIs: Instapay, PESONet integration
   - Plaid/Yodlee support for Philippines banks
   - PCI compliance requirements
   - Transaction import accuracy
   - **Timeline:** Week 6-8

8. **OCR Service Selection** (Blocks ET-006)
   - Google Vision AI vs. AWS Textract
   - Cost per scan analysis
   - Accuracy benchmarks
   - **Timeline:** Week 8-10

9. **Payment Gateway Integration** (Blocks SB-004)
   - Stripe vs. PayPal vs. Square (Philippines support)
   - Transaction fees comparison for Philippine Peso
   - PCI compliance handling
   - **Timeline:** Week 10-12

---

## Specification Gaps

### Features Needing Detailed Specs Before Planning

1. **INF-001** (User Authentication & Authorization)
   - Role definitions and permissions matrix
   - Password policy and MFA requirements
   - Session management and timeout rules
   - Philippines Data Privacy Act compliance (consent management, access logs)

2. **INF-005** (Audit Logging)
   - Events to log (comprehensive list)
   - Log retention policy and access controls
   - Alerting for suspicious activity
   - Philippines Data Privacy Act compliance (breach detection, 72-hour notification)

3. **INF-007** (3rd Party API Integration Layer)
   - Error handling and retry logic
   - Rate limiting strategy
   - API versioning approach
   - OAuth2 flow for Philippines payroll providers (Salarium, Sprout, PayrollHero)

4. **PH-001** (13th Month Pay Management)
   - Accrual calculation logic (1/12 of basic salary per pay period)
   - Dashboard display of total accrued liability
   - 13th month pay run workflow in December
   - Tax exemption application (₱90,000 threshold)

5. **PH-003** (Government Contribution Reports)
   - SSS R3 form format and data requirements
   - PhilHealth RF-1 form format and data requirements
   - Pag-IBIG MCR form format and data requirements
   - Contribution calculation formulas (SSS 15%, PhilHealth 5%, Pag-IBIG 4%)

6. **FD-004** (Runway Projection)
   - Projection algorithm (linear vs. trend-based)
   - User inputs for revenue/expense assumptions
   - Confidence interval calculation

7. **FD-005** (Customizable Reporting)
   - Report builder UI/UX design
   - Saved report template structure
   - Export format options

---

## Next Steps

### Immediate Actions (Already Completed)

1. ✅ **Philippines Compliance Research:**
   - Completed: `ai-docs/workflow/features/simple-accounting-software-for-dev-startup/intake/product/research/2025-10-15T00-00-00-philippines-compliance.md`

2. ✅ **Create Dependency Plan:**
   - Completed: `ai-docs/workflow/features/simple-accounting-software-for-dev-startup/plans/dependency/2025-10-15T00-00-00-dependency-plan.md`

3. **Define Wishlist (Optional):**
   ```bash
   /baw_product_wishlist "Simple Accounting Software for Dev Startup"
   ```

### Before Planning Phase (Week 1-2)

- [ ] **CRITICAL:** Select Philippines payroll integration partner (Salarium vs Sprout vs PayrollHero)
  - Request API documentation and demo access
  - Verify SSS/PhilHealth/Pag-IBIG calculation support
  - Verify 13th month pay tracking support
  - **Decision Deadline:** End of Week 2

- [ ] **CRITICAL:** Research BIR Electronic Invoicing System API availability
  - Determines if PH-002 is feasible for MVP
  - **Decision Deadline:** End of Week 8

- [ ] Select cloud provider (AWS vs GCP)
  - Evaluate Philippines region availability and pricing
  - **Decision Deadline:** End of Week 1

- [ ] Complete all "Immediate Research Needed" items
- [ ] Write detailed specs for INF-001, INF-005, INF-007, PH-001, PH-003
- [ ] Validate feature priorities with stakeholders
- [ ] Consult with Philippines accountant on BIR/SSS/PhilHealth/Pag-IBIG report formats
- [ ] Confirm MVP scope doesn't exceed budget/timeline (13-16 weeks)

### Stakeholder Sign-offs Required

- [ ] Founder approval on Philippines-specific scope and 16-20 week timeline
- [ ] MVP scope sign-off from Office Manager
- [ ] Technical architecture approval from CTO/Lead Dev
- [ ] Compliance review of Philippines Data Privacy Act requirements
- [ ] Accountant review of BIR, SSS, PhilHealth, Pag-IBIG compliance requirements

---

## Metrics for Success

Track these metrics post-launch to validate feature effectiveness:

| Feature Area | Metric | Target | Measurement |
|--------------|--------|--------|-------------|
| Financial Dashboard | CEO dashboard views per week | ≥3 | Analytics |
| Payroll | Zero payroll errors | 100% | Error log |
| Expense Tracking | Time to reimbursement | <7 days | System reports |
| Sales & Billing | Invoice payment time | -20% vs. baseline | Aging report |
| Self-Service | Support tickets reduction | -50% | Ticket system |

---

**Document Version:** 2.0 (Philippines Edition)
**Last Updated:** 2025-10-15
**Total Features:** 38 (26 Must-Have, 11 Should-Have, 1 Could-Have)
**Estimated MVP Timeline:** 13-16 weeks (most likely); 16-20 weeks (with buffer) - based on Philippines compliance requirements
**Changes from v1.0:** Updated for Philippines market (BIR, SSS, PhilHealth, Pag-IBIG, 13th month pay); added 3 new Philippines-specific features (PH-001, PH-002, PH-003); upgraded SB-006 from Could-Have to Should-Have; changed payroll providers from US (Gusto/Rippling/ADP) to Philippines (Salarium/Sprout/PayrollHero)
