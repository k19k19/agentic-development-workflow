# Dependency Plan: Simple Accounting Software for Dev Startup (Philippines)

**Feature ID:** `simple-accounting-software-for-dev-startup`
**Plan Date:** 2025-10-15
**Status:** Ready for Breakout Planning
**Version:** 1.0

---

## Executive Summary

This dependency plan sequences **26 Must-Have features** into **5 phased milestones** spanning **16-20 weeks**, optimized for the Philippines market. The plan minimizes blocking dependencies, enables parallel development, and provides clear gates for Early Access (Phase 3) and Full MVP (Phase 5) releases.

**Key Milestones:**
- **Phase 1:** Foundation & Infrastructure (Weeks 1-4)
- **Phase 2:** Core Services & API Layer (Weeks 5-8)
- **Phase 3:** Financial Operations & Integrations → **Early Access Release** (Weeks 9-12)
- **Phase 4:** Payroll & Employee Services (Weeks 13-16)
- **Phase 5:** Philippines Compliance & Reporting → **Full MVP Release** (Weeks 17-20)

**Related Documents:**
- Product Charter: `ai-docs/workflow/features/simple-accounting-software-for-dev-startup/intake/product/charter.md`
- Feature Catalog: `ai-docs/workflow/features/simple-accounting-software-for-dev-startup/intake/product/features/2025-10-15T00-00-00-feature-catalog.md`
- Philippines Research: `ai-docs/workflow/features/simple-accounting-software-for-dev-startup/intake/product/research/2025-10-15T00-00-00-philippines-compliance.md`

---

## Dependency Analysis Summary

### Critical Path Features (Longest Blocking Chain)

```
INF-001 (Auth) → ESS-001 (User Profile)
                 └→ ET-001 (Expense Entry) → ET-003 (Approval) → ET-005 (Reimbursement)
                 └→ SB-001 (Customer Mgmt) → SB-002 (Invoice Creation) → SB-003 (Invoice Tracking) → FD-001 (Cash Flow)

INF-003 (Cloud) → INF-007 (API Layer) → PM-001 (Payroll Integration) → PM-002 (Run Payroll) → PH-001 (13th Month Pay)
                                                                                            → PH-003 (Govt Reports)
                                                                                            → PM-003 (Payroll History)
```

**Longest Dependency Chain:** 6 features (INF-003 → INF-007 → PM-001 → PM-002 → PH-001/PH-003)

### High-Risk Features (Require Early Prototyping)

| Feature ID | Name | Risk Level | Mitigation Strategy |
|------------|------|------------|---------------------|
| **INF-007** | API Integration Layer | High | Prototype OAuth2 flow and webhook receiver in Week 3-4 |
| **PM-001** | Payroll Provider Integration | High | Select Salarium/Sprout by Week 2; prototype API in Week 5-6 |
| **PH-003** | Government Contribution Reports | High | Validate SSS/PhilHealth/Pag-IBIG report formats with accountant Week 15-16 |

### Parallelization Opportunities

**Phase 1:** INF-001, INF-002, INF-003 can be built in parallel (all have no dependencies)
**Phase 2:** SB-001, ESS-001, ET-001 can be built in parallel (all depend only on INF-001)
**Phase 3:** SB-002, ET-002, ET-003 can be built in parallel once their blockers complete

---

## Phase 1: Foundation & Infrastructure

**Duration:** 4 weeks (Weeks 1-4)
**Team Capacity:** 1 full-stack developer (160 hours)
**Estimated Effort:** 130-150 hours

### Goals

1. Establish secure authentication and role-based access control
2. Provision production-ready database and cloud infrastructure
3. Set up data encryption and backup systems
4. Create audit logging framework for compliance

### Features in Phase

| Feature ID | Feature Name | Est. Hours | Dependencies | Can Parallelize? |
|------------|--------------|------------|--------------|------------------|
| **INF-001** | User Authentication & Authorization | 32 | None | ✅ Yes |
| **INF-002** | Secure Database | 24 | None | ✅ Yes |
| **INF-003** | Cloud Hosting | 28 | None | ✅ Yes |
| **INF-004** | Data Encryption | 16 | INF-002, INF-003 | ⏸️ After Week 2 |
| **INF-005** | Audit Logging | 20 | INF-001 | ⏸️ After Week 2 |
| **INF-008** | Data Backup & Retention | 18 | INF-002, INF-003 | ⏸️ After Week 2 |

**Total Phase 1 Effort:** 138 hours

### Completion Criteria

- ✅ Users can register, log in, and be assigned roles (Admin, Employee, Accountant)
- ✅ PostgreSQL database provisioned on cloud with row-level security enabled
- ✅ Cloud infrastructure (AWS/GCP) operational with TLS 1.3 encryption
- ✅ All sensitive data encrypted at rest (AES-256) and in transit
- ✅ Audit log captures authentication events, data access, and modifications
- ✅ Automated daily database backups with 5-year retention policy

### Parallel Work Streams

**Weeks 1-2:**
- Stream A: INF-001 (Auth & Authorization)
- Stream B: INF-002 (Database setup)
- Stream C: INF-003 (Cloud hosting)

**Weeks 3-4:**
- Stream A: INF-004 (Data Encryption) + INF-005 (Audit Logging)
- Stream B: INF-008 (Backup & Retention)
- Stream C: **Prototype INF-007 (API Integration Layer)** - OAuth2 flow testing

### Risks & Mitigations

**Risk:** Cloud provider selection delays infrastructure setup
- **Mitigation:** Finalize AWS vs. GCP decision in Week 1; use managed services (RDS, Cloud SQL) to accelerate

**Risk:** Role-based access control (RBAC) scope creep
- **Mitigation:** Limit to 3 roles in Phase 1 (Admin, Employee, Accountant); add granular permissions in Phase 4

### Outputs

- Working authentication system with JWT tokens
- Production database with seed data for testing
- Cloud infrastructure documentation (VPC, security groups, IAM roles)
- Data encryption key management setup (AWS KMS or GCP Cloud KMS)
- Audit log schema and query dashboard

---

## Phase 2: Core Services & API Layer

**Duration:** 4 weeks (Weeks 5-8)
**Team Capacity:** 1 full-stack developer (160 hours)
**Estimated Effort:** 120-140 hours

### Goals

1. Build API integration framework for external services (payroll, banks)
2. Implement customer/project management and expense tracking foundations
3. Enable employee self-service profile management
4. Establish scheduled job runner for recurring tasks

### Features in Phase

| Feature ID | Feature Name | Est. Hours | Dependencies | Can Parallelize? |
|------------|--------------|------------|--------------|------------------|
| **INF-007** | 3rd Party API Integration Layer | 40 | INF-003 | ⏸️ Start Week 5 |
| **SB-001** | Customer & Project Management | 28 | INF-001 | ✅ Yes (Week 5) |
| **ESS-001** | User Profile & Access | 20 | INF-001 | ✅ Yes (Week 5) |
| **ET-001** | Manual Expense Entry | 16 | ESS-001 | ⏸️ After Week 6 |
| **ET-002** | Receipt Upload | 14 | ET-001 | ⏸️ After Week 7 |
| **INF-006** | Scheduled Job Runner | 12 | INF-003 | ✅ Yes (Week 7) |

**Total Phase 2 Effort:** 130 hours

### Completion Criteria

- ✅ API integration layer supports OAuth2, credential vault (AWS Secrets Manager), retry logic
- ✅ Customers and projects can be created, updated, and viewed
- ✅ Employees can log in and view/edit their profile
- ✅ Expense submission form accepts date, merchant, amount, category, description
- ✅ Receipt files (PDF, JPG, PNG) can be uploaded to cloud storage (S3/GCS)
- ✅ Scheduled job runner can execute recurring tasks (cron-based)

### Parallel Work Streams

**Weeks 5-6:**
- Stream A: INF-007 (API Integration Layer) - OAuth2 implementation
- Stream B: SB-001 (Customer & Project Management)
- Stream C: ESS-001 (User Profile & Access)

**Weeks 7-8:**
- Stream A: ET-001 (Manual Expense Entry) + ET-002 (Receipt Upload)
- Stream B: INF-006 (Scheduled Job Runner)
- Stream C: **Prototype PM-001 (Payroll Provider Integration)** - API exploration with Salarium/Sprout

### Risks & Mitigations

**Risk:** Payroll provider API documentation is incomplete or access delayed
- **Mitigation:** Contact Salarium/Sprout sales in Week 2; request sandbox API access by Week 4; prototype in Week 7-8

**Risk:** File upload security vulnerabilities (malware, oversized files)
- **Mitigation:** Implement virus scanning (ClamAV) and size limits (10MB) in ET-002

### Critical Decision Point

**By End of Week 6:** Must finalize payroll provider selection (Salarium vs. Sprout vs. PayrollHero)
- **Decision Criteria:** API maturity, documentation quality, sandbox availability, pricing, Philippines compliance features

### Outputs

- API integration framework with reusable OAuth2 client
- Customer and project CRUD endpoints with validation
- Employee dashboard with profile editing
- Expense submission form with receipt upload
- Background job scheduler configured (Bull/BullMQ or cloud-native)

---

## Phase 3: Financial Operations & Key Integrations

**Duration:** 4 weeks (Weeks 9-12)
**Team Capacity:** 1 full-stack developer (160 hours)
**Estimated Effort:** 140-160 hours

### Goals

1. **Integrate with Philippines payroll provider** (Salarium or Sprout)
2. Launch invoicing and expense approval workflows
3. Enable basic financial reporting
4. **Deploy Early Access Program (EAP) release** at end of Phase 3

### Features in Phase

| Feature ID | Feature Name | Est. Hours | Dependencies | Can Parallelize? |
|------------|--------------|------------|--------------|------------------|
| **PM-001** | Payroll Provider Integration | 60 | INF-007 | ⏸️ Start Week 9 |
| **SB-002** | Invoice Creation & Sending | 32 | SB-001 | ✅ Yes (Week 9) |
| **ET-003** | Expense Approval Workflow | 20 | ET-001 | ✅ Yes (Week 9) |
| **SB-003** | Invoice Tracking | 24 | SB-002 | ⏸️ After Week 10 |
| **ET-005** | Expense Reimbursement | 18 | ET-003, PM-001 | ⏸️ After Week 11 |

**Total Phase 3 Effort:** 154 hours

### Completion Criteria

- ✅ System syncs employee data with payroll provider (Salarium/Sprout) bidirectionally
- ✅ Invoices can be generated with BIR-compliant format (TIN, VAT breakdown, serial number)
- ✅ Invoices can be emailed to customers as PDF attachments
- ✅ Expense approval workflow allows managers to approve/deny with comments
- ✅ Invoice status tracking shows Sent, Paid, Overdue (>30 days)
- ✅ Approved expenses can be marked for reimbursement via payroll or ACH

### Parallel Work Streams

**Weeks 9-10:**
- Stream A: PM-001 (Payroll Provider Integration) - **CRITICAL PATH**
- Stream B: SB-002 (Invoice Creation & Sending)
- Stream C: ET-003 (Expense Approval Workflow)

**Weeks 11-12:**
- Stream A: PM-001 (continued testing and error handling)
- Stream B: SB-003 (Invoice Tracking)
- Stream C: ET-005 (Expense Reimbursement)

### Early Access Program (EAP) Release

**Target:** End of Week 12
**Included Features:** 14 features across Infrastructure, Invoicing, Expense Management, Customer Management

**EAP Feature List:**
1. User Authentication (INF-001)
2. Customer & Project Management (SB-001, SB-002, SB-003)
3. Expense Management (ET-001, ET-002, ET-003, ET-005)
4. Employee Self-Service (ESS-001)
5. Infrastructure (INF-001 through INF-008)

**EAP Success Criteria:**
- 3-5 pilot customers (Philippines-based dev startups with 5-10 employees)
- Collect feedback on invoicing and expense workflows
- Validate payroll provider integration stability
- Identify performance bottlenecks before Phase 4

### Risks & Mitigations

**Risk:** Payroll provider API integration takes longer than 4 weeks (60 hours)
- **Mitigation:** Allocate 75% of developer time to PM-001 in Weeks 9-10; defer SB-003 to Phase 4 if needed

**Risk:** BIR invoice format non-compliance discovered during EAP
- **Mitigation:** Review BIR Revenue Memorandum Circular No. 60-2020 with accountant in Week 10

**Risk:** Email deliverability issues for invoice sending
- **Mitigation:** Use transactional email service (SendGrid, AWS SES) with SPF/DKIM configuration

### Outputs

- Functioning payroll provider integration with sync logs
- Invoice generation engine with BIR-compliant template
- Expense approval notification system (email alerts)
- Invoice aging report (30/60/90 days overdue)
- **Early Access Program deployed to staging/production**

---

## Phase 4: Payroll & Employee Services

**Duration:** 4 weeks (Weeks 13-16)
**Team Capacity:** 1 full-stack developer (160 hours)
**Estimated Effort:** 120-140 hours

### Goals

1. Enable full payroll processing with SSS, PhilHealth, Pag-IBIG deductions
2. Implement 13th month pay accrual and tracking
3. Enhance employee self-service with pay stubs and tax forms
4. Complete financial dashboard with real-time cash flow

### Features in Phase

| Feature ID | Feature Name | Est. Hours | Dependencies | Can Parallelize? |
|------------|--------------|------------|--------------|------------------|
| **PM-002** | Run Payroll | 50 | PM-001, ESS-001 | ⏸️ Start Week 13 |
| **PH-001** | 13th Month Pay Management | 24 | PM-002 | ⏸️ After Week 14 |
| **PM-003** | View Payroll History | 16 | PM-002 | ⏸️ After Week 14 |
| **ESS-002** | View Pay Stubs | 14 | ESS-001, PM-003 | ⏸️ After Week 15 |
| **ESS-003** | Submit Expenses | 12 | ESS-001, ET-001 | ✅ Yes (Week 13) |
| **FD-001** | Real-time Cash Flow View | 20 | SB-003, ET-005 | ✅ Yes (Week 15) |

**Total Phase 4 Effort:** 136 hours

### Completion Criteria

- ✅ Payroll can be run semi-monthly (1st-15th, 16th-31st) with Philippines tax calculations
- ✅ SSS (15%), PhilHealth (5%), Pag-IBIG (4%) automatically deducted and tracked
- ✅ Withholding tax calculated using Philippines progressive brackets
- ✅ 13th month pay accrued at 1/12 of basic salary per pay period
- ✅ Dashboard shows total 13th month pay liability
- ✅ Employees can view/download pay stubs as PDFs from employee portal
- ✅ Real-time cash flow dashboard aggregates bank balance + pending transactions

### Parallel Work Streams

**Weeks 13-14:**
- Stream A: PM-002 (Run Payroll) - **CRITICAL PATH**
- Stream B: ESS-003 (Submit Expenses via employee portal)

**Weeks 15-16:**
- Stream A: PH-001 (13th Month Pay Management) + PM-003 (Payroll History)
- Stream B: ESS-002 (View Pay Stubs)
- Stream C: FD-001 (Real-time Cash Flow View)

### Risks & Mitigations

**Risk:** Payroll calculation errors due to complex Philippines tax rules
- **Mitigation:** Unit test all tax bracket calculations; validate with sample payrolls from accountant

**Risk:** 13th month pay accrual logic incorrect (doesn't handle mid-year hires, resignations)
- **Mitigation:** Define business rules in Week 13; test edge cases (pro-rated 13th month for partial year)

**Risk:** Pay stub generation fails due to missing data from payroll provider
- **Mitigation:** Implement graceful degradation; show "Processing" state if data not yet synced

### Critical Validation Point

**End of Week 14:** Run test payroll for 10 employees and validate:
- SSS/PhilHealth/Pag-IBIG deductions match official contribution tables
- Withholding tax matches BIR tax calculator
- Net pay calculation is accurate
- Pay stubs generate correctly

### Outputs

- End-to-end payroll processing system (manual trigger in MVP; automation in Phase 5)
- 13th month pay accrual dashboard with liability tracking
- Employee self-service portal with pay stub download
- Cash flow dashboard with drill-down to transactions
- Payroll history log with audit trail

---

## Phase 5: Philippines Compliance & Reporting

**Duration:** 4 weeks (Weeks 17-20)
**Team Capacity:** 1 full-stack developer (160 hours)
**Estimated Effort:** 110-130 hours

### Goals

1. Generate all mandatory BIR and government agency reports
2. Implement BIR Form 2316 (annual tax certificate) generation
3. Complete financial reporting suite (P&L, burn rate, runway)
4. **Deploy Full MVP Release** at end of Phase 5

### Features in Phase

| Feature ID | Feature Name | Est. Hours | Dependencies | Can Parallelize? |
|------------|--------------|------------|--------------|------------------|
| **PH-003** | Government Contribution Reports | 32 | PM-002 | ⏸️ Start Week 17 |
| **PM-005** | Automated Payroll Tax Filing | 40 | PM-001 | ⏸️ Start Week 17 |
| **ESS-004** | View W-2s/Tax Forms (BIR 2316) | 16 | ESS-001, PM-001 | ⏸️ After Week 18 |
| **FD-002** | Profit & Loss Statement | 18 | SB-003, ET-005 | ✅ Yes (Week 19) |
| **FD-003** | Burn Rate Calculation | 12 | FD-001, FD-002 | ⏸️ After Week 19 |

**Total Phase 5 Effort:** 118 hours

### Completion Criteria

- ✅ Monthly SSS, PhilHealth, Pag-IBIG contribution reports generated in correct format
- ✅ BIR Form 1601C (monthly income tax withholding) auto-generated
- ✅ BIR Form 2316 (annual tax certificate) generated for all employees by January 31
- ✅ Employees can view/download BIR Form 2316 from employee portal
- ✅ P&L statement shows revenue, COGS, operating expenses, net income
- ✅ Burn rate calculated as 3-month rolling average of net negative cash flow

### Parallel Work Streams

**Weeks 17-18:**
- Stream A: PH-003 (Government Contribution Reports) - **HIGH RISK**
- Stream B: PM-005 (Automated Payroll Tax Filing)

**Weeks 19-20:**
- Stream A: ESS-004 (View BIR Form 2316)
- Stream B: FD-002 (Profit & Loss Statement) + FD-003 (Burn Rate Calculation)
- Stream C: **Full MVP Release Preparation** (QA, documentation, deployment)

### Full MVP Release

**Target:** End of Week 20
**Included Features:** All 26 Must-Have features + infrastructure

**MVP Feature Checklist:**
- ✅ Infrastructure (8): INF-001 through INF-008
- ✅ Financial Dashboard (3): FD-001, FD-002, FD-003
- ✅ Payroll Management (5): PM-001, PM-002, PM-003, PM-005, PH-001
- ✅ Expense Tracking (4): ET-001, ET-002, ET-003, ET-005
- ✅ Sales & Billing (3): SB-001, SB-002, SB-003
- ✅ Employee Self-Service (4): ESS-001, ESS-002, ESS-003, ESS-004
- ✅ Philippines Compliance (3): PH-001, PH-003, PM-005 (BIR forms)

**MVP Success Criteria:**
- All core workflows tested end-to-end with real data
- Performance benchmarks met (page load <2s, API response <500ms)
- Security audit passed (penetration testing, vulnerability scan)
- Documentation complete (user guides, API docs, deployment runbooks)
- 5+ pilot customers successfully migrated from EAP

### Risks & Mitigations

**Risk:** Government report formats don't match official agency requirements
- **Mitigation:** **CRITICAL - Validate report outputs with licensed accountant in Week 16-17 before development starts**

**Risk:** BIR Form 2316 generation fails due to missing payroll data
- **Mitigation:** Implement data completeness checks; alert office manager if payroll data missing

**Risk:** Automated tax filing may not be feasible if BIR/SSS/PhilHealth lack APIs
- **Mitigation:** Fallback to "Export for Manual Filing" feature; generate files in agency-prescribed formats

### Critical Validation Point

**End of Week 18:** Review all government reports with accountant:
- SSS contribution report matches official RS-5 format
- PhilHealth contribution report matches official RF-1 format
- Pag-IBIG contribution report matches official MCRF format
- BIR Form 1601C matches official BIR template

### Outputs

- Automated monthly government contribution report generation
- BIR Form 1601C auto-generation with digital signature support
- BIR Form 2316 annual tax certificate for employees
- Complete financial reporting suite (P&L, cash flow, burn rate)
- **Production-ready Full MVP deployment**

---

## Release Strategy

### Early Access Program (EAP) - End of Phase 3 (Week 12)

**Target Audience:** 3-5 friendly pilot customers (dev startups in Philippines with 5-10 employees)

**Included Capabilities:**
- Customer & project management
- Invoice creation and tracking
- Expense submission, approval, and reimbursement
- Basic employee self-service

**Success Metrics:**
- User adoption: 80% of pilot customer employees actively use expense tracking
- Invoice processing time: <5 minutes from creation to email sent
- Expense approval SLA: <24 hours from submission to approval
- Zero critical bugs in production for 2 consecutive weeks

**Feedback Loops:**
- Weekly check-ins with pilot customers
- In-app feedback widget for bug reports and feature requests
- Monthly retrospective to prioritize Phase 4/5 adjustments

---

### Full MVP Release - End of Phase 5 (Week 20)

**Target Audience:** General availability for Philippines software development startups (5-15 employees)

**Included Capabilities:**
- **All EAP features plus:**
- Full payroll processing (SSS, PhilHealth, Pag-IBIG, withholding tax)
- 13th month pay management
- Government contribution reporting (SSS, PhilHealth, Pag-IBIG)
- BIR tax form generation (1601C, 2316)
- Financial reporting (P&L, cash flow, burn rate)

**Success Metrics:**
- User onboarding time: <2 hours from signup to first payroll run
- Payroll accuracy: Zero calculation errors in first month
- Government report compliance: 100% acceptance by agencies (no rejections)
- System uptime: 99.5% availability
- Customer satisfaction: NPS score ≥40

**Go-to-Market Strategy:**
- Launch blog post: "Philippines Accounting Software Built for Dev Startups"
- Partnerships with Philippines startup accelerators (Ideaspace, QBO Innovation Hub)
- Referral program: Existing customers get 1 month free for each successful referral

---

## Dependencies & Sequencing Rules

### Foundational Features (Must Complete First)

**Phase 1 Blockers:**
- INF-001 (Auth) → Blocks ESS-001, SB-001, ET-001
- INF-002 (Database) → Blocks INF-004, INF-008
- INF-003 (Cloud) → Blocks INF-006, INF-007

**Phase 2 Blockers:**
- INF-007 (API Layer) → Blocks PM-001, ET-004, SB-004
- SB-001 (Customer Mgmt) → Blocks SB-002, ESS-005
- ET-001 (Expense Entry) → Blocks ET-002, ET-003

**Phase 3 Blockers:**
- PM-001 (Payroll Integration) → Blocks PM-002, PM-005, ET-005, ESS-004, PH-001
- SB-002 (Invoice Creation) → Blocks SB-003, SB-005, FD-001

**Phase 4 Blockers:**
- PM-002 (Run Payroll) → Blocks PM-003, PH-001, PH-003, ESS-002

### Features with Multiple Blockers

| Feature | Blockers | Earliest Start |
|---------|----------|----------------|
| ET-005 (Expense Reimbursement) | ET-003 AND PM-001 | Week 11 (Phase 3) |
| ESS-002 (View Pay Stubs) | ESS-001 AND PM-003 | Week 15 (Phase 4) |
| ESS-004 (View Tax Forms) | ESS-001 AND PM-001 | Week 18 (Phase 5) |
| FD-001 (Cash Flow View) | SB-003 AND ET-005 | Week 15 (Phase 4) |
| FD-002 (P&L Statement) | SB-003 AND ET-005 | Week 19 (Phase 5) |

### Sequencing Constraints

**Cannot Start Before:**
- Phase 2 → Phase 1 must be 100% complete (all infrastructure operational)
- Phase 3 → INF-007 (API Layer) must be complete and tested
- Phase 4 → PM-001 (Payroll Integration) must be stable (no critical bugs)
- Phase 5 → PM-002 (Run Payroll) must be validated with test payroll

**Can Start Early:**
- INF-006 (Scheduled Job Runner) can start in Phase 2 once INF-003 complete
- ESS-003 (Submit Expenses) can start in Phase 4 once ESS-001 + ET-001 complete
- FD-002 (P&L Statement) can start in Phase 5 once SB-003 + ET-005 complete

---

## Risk Management

### High-Risk Features (Require Prototyping)

**1. INF-007 (API Integration Layer) - WEEK 3-4 PROTOTYPE**
- **Risk:** OAuth2 flow complexity, credential management, webhook security
- **Prototype:** Build minimal OAuth2 client for test API (e.g., GitHub API)
- **Success Criteria:** Successfully authenticate, refresh token, receive webhook

**2. PM-001 (Payroll Provider Integration) - WEEK 7-8 PROTOTYPE**
- **Risk:** Payroll provider API may lack critical features or have poor documentation
- **Prototype:** Connect to Salarium/Sprout sandbox, sync 1 employee, fetch pay stubs
- **Success Criteria:** Employee data syncs bidirectionally, no data loss

**3. PH-003 (Government Contribution Reports) - WEEK 16-17 VALIDATION**
- **Risk:** Report formats may not match official SSS/PhilHealth/Pag-IBIG requirements
- **Validation:** Generate sample reports, review with licensed accountant
- **Success Criteria:** Accountant confirms 100% compliance with agency formats

### Medium-Risk Features

**1. SB-002 (Invoice Creation) - BIR Compliance**
- **Risk:** BIR invoice format requirements may be misunderstood
- **Mitigation:** Review BIR Revenue Memorandum Circular No. 60-2020 in Week 10

**2. PM-002 (Run Payroll) - Tax Calculation Accuracy**
- **Risk:** Philippines tax bracket calculations may have edge cases
- **Mitigation:** Unit test all scenarios; validate with accountant in Week 14

**3. ET-005 (Expense Reimbursement) - Payment Integration**
- **Risk:** Philippines bank APIs may not support automated ACH transfers
- **Mitigation:** Fallback to manual reimbursement via payroll in MVP

### Risk Mitigation Timeline

| Week | Risk Activity | Owner |
|------|---------------|-------|
| 1 | Select cloud provider (AWS vs GCP) | Tech Lead |
| 2 | Finalize payroll provider (Salarium vs Sprout) | Tech Lead + Office Manager |
| 4 | Prototype INF-007 (OAuth2 flow) | Developer |
| 8 | Prototype PM-001 (payroll API integration) | Developer |
| 10 | Review BIR invoice format with accountant | Office Manager |
| 14 | Validate payroll tax calculations | Office Manager + Accountant |
| 17 | Validate government report formats | Office Manager + Accountant |

---

## Success Metrics by Phase

### Phase 1 (Foundation)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Authentication success rate | 99.9% | Login analytics |
| Database query performance | <50ms p95 | APM monitoring |
| Infrastructure uptime | 99.5% | Cloud provider SLA |
| Security audit score | 0 critical vulnerabilities | Penetration test report |

### Phase 2 (Core Services)

| Metric | Target | Measurement |
|--------|--------|-------------|
| API integration success rate | 95% | API call logs |
| Customer onboarding time | <10 minutes | User analytics |
| Expense submission time | <2 minutes | User analytics |
| File upload success rate | 99% | Upload logs |

### Phase 3 (Financial Operations)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Payroll sync success rate | 98% | Integration logs |
| Invoice generation time | <30 seconds | Performance monitoring |
| Expense approval SLA | <24 hours | Workflow analytics |
| EAP user adoption | 80% active users | Usage analytics |

### Phase 4 (Payroll & Employees)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Payroll calculation accuracy | 100% (zero errors) | Accountant validation |
| Pay stub generation time | <10 seconds | Performance monitoring |
| 13th month pay accrual accuracy | 100% | Accountant validation |
| Employee portal engagement | 60% monthly active users | Analytics |

### Phase 5 (Compliance & Reporting)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Government report accuracy | 100% acceptance by agencies | Agency submission logs |
| BIR form generation success | 100% | Form generation logs |
| P&L report accuracy | Match accountant's manual P&L | Accountant validation |
| MVP customer satisfaction | NPS ≥40 | Customer survey |

---

## Open Questions & Research Needs

### Critical (Blocking Phase 3)

**Q1: Which payroll provider should we integrate with first?**
- **Options:** Salarium, Sprout Solutions, PayrollHero
- **Decision Criteria:** API maturity, documentation quality, pricing, Philippines compliance features, sandbox availability
- **Owner:** Tech Lead + Office Manager
- **Deadline:** End of Week 2 (before Phase 2 prototyping)

**Q2: Is BIR Electronic Invoicing System API available for third-party integration?**
- **Impact:** Whether PH-002 (BIR E-Invoice Submission) is feasible in Phase 5 or deferred to Phase 6
- **Owner:** Compliance Specialist
- **Deadline:** End of Week 8 (before Phase 3 planning)

**Q3: Do SSS, PhilHealth, Pag-IBIG have online submission APIs?**
- **Impact:** Whether PM-005 (Automated Tax Filing) can be fully automated or requires manual export
- **Owner:** Tech Lead
- **Deadline:** End of Week 12 (before Phase 5 planning)

### Secondary (Phase 2 Planning)

**Q4: What Philippines banking APIs are available for payroll disbursement?**
- **Impact:** ET-005 (Expense Reimbursement) automation feasibility
- **Timeline:** Research in Week 6-8

**Q5: Are there Philippines-specific OCR services for BIR receipts?**
- **Impact:** ET-006 (OCR Receipt Scanning) accuracy for future phase
- **Timeline:** Research in Week 10-12

---

## Next Steps

### Immediate Actions (This Week)

1. **Finalize Cloud Provider Selection (AWS vs GCP)**
   - Compare pricing for 10-50 users
   - Evaluate managed services (RDS, Cloud SQL, Lambda, Cloud Functions)
   - **Decision Deadline:** End of Week 1

2. **Select Payroll Provider (Salarium vs Sprout vs PayrollHero)**
   - Request demo and API documentation from all 3 providers
   - Evaluate sandbox access, pricing, support quality
   - **Decision Deadline:** End of Week 2

3. **Create Phase 1 Breakout Plan**
   ```bash
   /baw_dev_breakout_plan "Phase 1: Foundation & Infrastructure" "ai-docs/workflow/features/simple-accounting-software-for-dev-startup/plans/dependency/2025-10-15T00-00-00-dependency-plan.md"
   ```

### Before Phase 2 (Week 5)

4. **Validate API Integration Architecture**
   - Prototype OAuth2 flow with test API (Week 3-4)
   - Document integration patterns for reuse

5. **Confirm BIR Invoice Format Requirements**
   - Review BIR Revenue Memorandum Circular No. 60-2020
   - Consult with accountant if ambiguous

### Before Phase 3 (Week 9)

6. **Prototype Payroll Provider Integration**
   - Connect to payroll provider sandbox (Week 7-8)
   - Test employee sync, pay stub retrieval, contribution calculations

7. **Plan Early Access Program Launch**
   - Identify 3-5 pilot customers
   - Create onboarding checklist and success metrics

### Before Phase 4 (Week 13)

8. **Conduct EAP Retrospective**
   - Collect feedback from pilot customers
   - Prioritize bug fixes and feature adjustments for Phase 4

9. **Validate Payroll Tax Calculation Logic**
   - Unit test all Philippines tax brackets
   - Review with accountant

### Before Phase 5 (Week 17)

10. **Validate Government Report Formats**
    - Generate sample SSS, PhilHealth, Pag-IBIG reports
    - **CRITICAL:** Review with licensed accountant before development

11. **Plan Full MVP Launch**
    - Prepare go-to-market materials (website, blog post, demo video)
    - Set up customer support channels (email, chat, knowledge base)

---

## Appendix: Feature Dependency Graph

```
Phase 1: Foundation (Weeks 1-4)
├── INF-001 (Auth) ─┬─→ ESS-001 (Phase 2)
│                   ├─→ SB-001 (Phase 2)
│                   ├─→ ET-001 (Phase 2)
│                   └─→ INF-005 (Phase 1)
├── INF-002 (Database) ─┬─→ INF-004 (Phase 1)
│                       └─→ INF-008 (Phase 1)
└── INF-003 (Cloud) ─┬─→ INF-006 (Phase 2)
                     └─→ INF-007 (Phase 2)

Phase 2: Core Services (Weeks 5-8)
├── INF-007 (API Layer) ─┬─→ PM-001 (Phase 3) ★HIGH RISK★
│                        ├─→ ET-004 (Phase 6)
│                        └─→ SB-004 (Phase 6)
├── SB-001 (Customer Mgmt) ─┬─→ SB-002 (Phase 3)
│                           └─→ ESS-005 (Phase 6)
├── ESS-001 (User Profile) ─┬─→ ET-001 (Phase 2)
│                           ├─→ ESS-002 (Phase 4)
│                           ├─→ ESS-003 (Phase 4)
│                           └─→ ESS-004 (Phase 5)
└── ET-001 (Expense Entry) ─┬─→ ET-002 (Phase 2)
                            └─→ ET-003 (Phase 3)

Phase 3: Financial Operations (Weeks 9-12) → EAP RELEASE
├── PM-001 (Payroll Integration) ★HIGH RISK★ ─┬─→ PM-002 (Phase 4)
│                                              ├─→ PM-005 (Phase 5)
│                                              ├─→ ET-005 (Phase 3)
│                                              └─→ ESS-004 (Phase 5)
├── SB-002 (Invoice Creation) ─┬─→ SB-003 (Phase 3)
│                              ├─→ SB-005 (Phase 6)
│                              └─→ FD-001 (Phase 4)
├── ET-003 (Expense Approval) ─→ ET-005 (Phase 3)
├── SB-003 (Invoice Tracking) ─┬─→ FD-001 (Phase 4)
│                              └─→ FD-002 (Phase 5)
└── ET-005 (Expense Reimbursement) ─┬─→ FD-001 (Phase 4)
                                    └─→ FD-002 (Phase 5)

Phase 4: Payroll & Employees (Weeks 13-16)
├── PM-002 (Run Payroll) ─┬─→ PM-003 (Phase 4)
│                         ├─→ PH-001 (Phase 4) [13th Month Pay]
│                         └─→ PH-003 (Phase 5) [Govt Reports]
├── PM-003 (Payroll History) ─→ ESS-002 (Phase 4)
├── PH-001 (13th Month Pay) [NEW - Philippines]
├── ESS-002 (View Pay Stubs)
├── ESS-003 (Submit Expenses)
└── FD-001 (Cash Flow View) ─┬─→ FD-002 (Phase 5)
                             └─→ FD-003 (Phase 5)

Phase 5: Compliance & Reporting (Weeks 17-20) → FULL MVP RELEASE
├── PH-003 (Govt Contribution Reports) ★HIGH RISK★ [NEW - Philippines]
├── PM-005 (Automated Tax Filing)
├── ESS-004 (View BIR Form 2316) [Philippines-specific]
├── FD-002 (P&L Statement) ─→ FD-003 (Phase 5)
└── FD-003 (Burn Rate Calculation)
```

**Legend:**
- ★HIGH RISK★ = Requires early prototyping/validation
- [NEW - Philippines] = Philippines-specific feature (not in original US catalog)
- → = Dependency (must complete before next feature can start)

---

**Document Version:** 1.0
**Last Updated:** 2025-10-15
**Total Phases:** 5
**Total Duration:** 16-20 weeks
**Total Features:** 26 Must-Have
**Early Access Release:** End of Phase 3 (Week 12)
**Full MVP Release:** End of Phase 5 (Week 20)
