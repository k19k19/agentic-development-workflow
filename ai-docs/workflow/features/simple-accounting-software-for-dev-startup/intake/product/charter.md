# Product Charter: Simple Accounting Software for Dev Startup

**Feature ID:** `simple-accounting-software-for-dev-startup`
**Charter Date:** 2025-10-15
**Status:** Initial Draft

---

## Vision

Build a simple, focused accounting software that enables a 10-person software development startup **in the Philippines** to manage payroll (including mandatory government contributions and 13th month pay), expenses, sales, and billing without requiring deep accounting expertise or paying for enterprise-grade complexity.

---

## Target Market

**Primary:** Software development startups in the Philippines (5-15 employees) with:
- Limited accounting knowledge among founders
- Need for basic financial visibility and BIR compliance
- Desire to minimize administrative overhead
- Preference for simple, affordable tools over enterprise solutions
- Need for Philippines-specific payroll (SSS, PhilHealth, Pag-IBIG, 13th month pay)

---

## Key User Personas

| Role | Persona | Goals | Pain Points |
|------|---------|-------|-------------|
| **Founder/CEO** | Alex | Keep the company financially healthy, understand cash flow at a glance, and spend less time on administrative tasks. | Lacks an accounting background, finds existing software too complex/expensive, and worries about compliance. |
| **Office Manager** | Brenda | Run payroll accurately, track expenses efficiently, manage client billing, and keep records organized. | Tedious manual data entry, chasing payments, managing receipts, and ensuring correct payroll calculations. |
| **Developer** | Charlie | Get paid on time, submit expenses with minimal hassle, and easily access pay stubs. | Clunky expense tools, losing receipts, and uncertainty about reimbursement status. |

---

## Core Product Capabilities

### For Alex (Founder/CEO)
- **Financial Dashboard:** Real-time view of essential metrics:
  - Cash on Hand
  - Monthly Burn Rate
  - Revenue vs. Expenses
  - Profit/Loss
- **Basic Financial Reports:**
  - Profit & Loss (P&L) Statement
  - Cash Flow Statement

### For Brenda (Office Manager)
- **Payroll Management:**
  - Manage profiles for 10 employees
  - Run semi-monthly payroll (1st-15th, 16th-31st) with automated Philippines tax calculations
  - Calculate and track mandatory government contributions (SSS, PhilHealth, Pag-IBIG)
  - Track and manage 13th month pay accruals (1/12 of basic salary per pay period)
  - Generate and distribute digital pay stubs
  - Generate monthly government contribution reports (SSS, PhilHealth, Pag-IBIG)
  - Generate BIR forms (1601C monthly, 2316 annually)
- **Expense Tracking:**
  - Simple workflow for employees to submit expenses with receipt uploads
  - Approval process for managers
  - Status tracking for reimbursements
- **Sales & Billing:**
  - Create BIR-compliant invoices with TIN, VAT breakdown, and serial numbers
  - Send invoices to clients via email
  - Track invoice status (Sent, Paid, Overdue)
  - Record payments against invoices
  - Calculate 12% VAT or 3% percentage tax based on registration status

### For Charlie (Developer)
- **Employee Self-Service Portal:**
  - View and download current and past pay stubs
  - View government contribution summaries (SSS, PhilHealth, Pag-IBIG)
  - View and download BIR Form 2316 (annual tax certificate)
  - View 13th month pay accrual and payment history
  - Submit expenses and view reimbursement status

---

## Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Time Saved** | Reduce manual accounting tasks by ≥5 hours/week for Office Manager | Weekly time tracking survey |
| **User Adoption** | 100% of staff use system for payroll and expenses | System usage analytics |
| **Error Reduction** | Zero payroll or invoicing errors per quarter | Error tracking log |
| **Faster Payments** | Reduce average invoice payment time by 20% | Invoice aging report comparison |
| **User Satisfaction** | ≥8/10 satisfaction score from all personas | Quarterly user survey |

---

## Constraints & Compliance

### MVP Scope Exclusions
The initial product will **NOT** handle:
- Inventory management
- Multi-currency accounting
- Advanced tax planning or direct tax filing (will provide data for accountant)
- Unlimited employees (designed for 10-15 max)
- Multi-state/international operations (Philippines-only)

### Compliance Requirements (Philippines-based)
- **BIR (Bureau of Internal Revenue):**
  - VAT registration and reporting (12% VAT for businesses >₱3M revenue)
  - BIR-compliant invoice format (TIN, serial numbers, VAT breakdown)
  - Monthly BIR Form 1601C (income tax withheld on compensation)
  - Annual BIR Form 2316 (employee tax certificates)
  - Annual alphalist of employees
- **Government Contributions:**
  - SSS (Social Security System): 15% total (5% employee + 10% employer)
  - PhilHealth: 5% total (2.5% each)
  - Pag-IBIG (HDMF): 4% total (2% each)
  - **Recommendation:** Third-party payroll integration (Salarium, Sprout Solutions, PayrollHero) strongly recommended
- **13th Month Pay:**
  - Legally required for all rank-and-file employees
  - Must be paid by December 24th
  - Tax-exempt up to ₱90,000
- **Data Privacy Act of 2012:**
  - Personal data encryption and access controls
  - Data breach notification within 72 hours
  - Consent required for personal data processing
- **Data Security:** All financial and personal employee data must be encrypted and stored securely
- **Record Keeping:** System must support retention of financial records for ≥5 years (EOPT Act requirement)

### Technical Constraints
- **Scalability:** Designed for small teams (up to 15 people), not enterprise-scale
- **Integration:** Must integrate with at least one Philippines payroll service provider (Salarium or Sprout Solutions)
- **Security:** Must meet Philippines Data Privacy Act requirements (encryption, access logs, audit trails)
- **Localization:** Philippines peso (₱) only, Philippines tax rules only

---

## Open Questions & Research Needs

### Critical (Blocking MVP)

1. **Payroll Integration:** Which payroll provider should we integrate with first? (Salarium, Sprout Solutions, PayrollHero?)
   - **Impact:** PM-001 design decisions
   - **Timeline:** Week 1-2
2. **BIR Electronic Invoicing:** Is BIR Electronic Invoicing System API available for third-party integration?
   - **Impact:** Whether automated e-invoice submission is feasible in MVP
   - **Timeline:** Week 1-2
3. **Government Portal APIs:** Do SSS, PhilHealth, Pag-IBIG have online submission APIs?
   - **Impact:** PM-005 automation feasibility
   - **Timeline:** Week 2-3

### Secondary (Phase 2)

4. **Pricing Model:** How should we price this (per user, flat rate, feature tiers)?
5. **Data Migration:** Do we need to support import from existing systems (QuickBooks, Xero)?
6. **Mobile Access:** Is mobile app needed for MVP, or web-responsive sufficient?
7. **Bank Integration:** Philippines banking API options for payroll disbursement (Instapay/PESONet)?

**Recommended Next Steps:**
- Run `/baw_product_helper` to research Salarium vs Sprout vs PayrollHero API comparison
- Run `/baw_product_helper` to research BIR Electronic Invoicing System API integration
- Run `/baw_product_features` to catalog detailed feature breakdown (already completed)
- Run `/baw_dev_dependency_plan` to create phased roadmap (already completed)

---

## Initial Man-Hour Estimate (Philippines-specific)

Based on the charter capabilities, Philippines compliance research, and using the estimation heuristics from `app-docs/guides/product-charter-effort-estimates.md`:

| Capability/Workstream | Complexity | Baseline Hours | Overhead Multiplier | Optimistic (0.75×) | Most Likely | Buffer (0.25×) | Philippines Adjustment |
|----------------------|------------|----------------|---------------------|-------------------|-------------|----------------|----------------------|
| **Financial Dashboard** | Medium | 32 | 1.35 (discovery +20%, testing +15%) | 32 | 43 | 11 | - |
| **Basic Financial Reports** | Small | 12 | 1.15 (testing +15%) | 11 | 14 | 3 | - |
| **Payroll Management (Philippines)** | Large | 78 | 1.45 (discovery +20%, testing +15%, reviews +10%) | 98 | 130 | 33 | +30% (SSS/PhilHealth/Pag-IBIG + 13th month) |
| **Expense Tracking** | Medium | 36 | 1.35 (discovery +20%, testing +15%) | 36 | 49 | 12 | - |
| **Sales & Billing (BIR-compliant)** | Medium | 36 | 1.35 (discovery +20%, testing +15%) | 41 | 55 | 14 | +15% (BIR invoice format, TIN, VAT) |
| **Employee Self-Service Portal** | Small | 16 | 1.15 (testing +15%) | 14 | 18 | 5 | - |
| **Security & Compliance (PH)** | Large | 60 | 1.45 (discovery +20%, testing +15%, reviews +10%) | 65 | 87 | 22 | - |
| **Payroll Integration (Salarium/Sprout)** | Medium | 32 | 1.45 (discovery +20%, testing +15%, reviews +10%) | 45 | 60 | 15 | +30% (Philippines-specific API) |
| **Project Setup & Infrastructure** | Medium | 24 | 1.10 (reviews +10%) | 20 | 26 | 7 | - |
| **13th Month Pay Management (NEW)** | Small | 16 | 1.15 (testing +15%) | 18 | 24 | 6 | Philippines-specific |
| **Government Contribution Reports (NEW)** | Small | 12 | 1.15 (testing +15%) | 14 | 16 | 4 | Philippines-specific |

**Total Estimated Hours (Philippines MVP):**
- **Optimistic:** 394 hours (~9.9 weeks for 1 full-time dev)
- **Most Likely:** 522 hours (~13.1 weeks for 1 full-time dev)
- **With Buffer:** 645 hours (~16.1 weeks for 1 full-time dev)

**vs. Original US Estimate:**
- **Additional Hours:** +90 hours (~2.3 weeks)
- **Key Drivers:** Philippines payroll complexity, BIR compliance, 13th month pay, government reports

### Assumptions
- Single full-stack developer working full-time (40 hrs/week)
- Access to Philippines payroll provider API documentation (Salarium or Sprout Solutions)
- Design assets provided externally
- No major architectural pivots during implementation
- Standard web stack (React/Node.js or similar)
- Payroll provider (Salarium/Sprout) handles tax calculations; system integrates via API
- BIR E-Invoicing API not required for MVP (manual filing acceptable)
- SSS/PhilHealth/Pag-IBIG reports generated but filed manually in MVP

### Trigger Points That Would Change Estimate
- **+40%:** Building Philippines tax calculations in-house instead of using payroll integration
- **+30%:** Implementing BIR E-Invoicing System API integration
- **+20%:** Adding mobile native apps for iOS/Android
- **+20%:** Automating SSS/PhilHealth/Pag-IBIG online submission (if APIs exist)
- **+15%:** Multi-currency support required
- **-15%:** Using pre-built UI component library significantly
- **-20%:** Reducing payroll to integration-only (no custom 13th month pay tracking)

**Estimation Date:** 2025-10-15
**Estimator:** Claude (AI Assistant) + Philippines Compliance Research
**Review Cycle:** Updated based on `/baw_dev_dependency_plan` (completed)

---

## Next Steps

### Immediate Actions (Week 1-2)
1. ✅ **Feature Catalog Created** - `ai-docs/workflow/features/simple-accounting-software-for-dev-startup/intake/product/features/2025-10-15T00-00-00-feature-catalog.md`
2. ✅ **Philippines Compliance Research Completed** - `ai-docs/workflow/features/simple-accounting-software-for-dev-startup/intake/product/research/2025-10-15T00-00-00-philippines-compliance.md`
3. ✅ **Dependency Plan Created** - `ai-docs/workflow/features/simple-accounting-software-for-dev-startup/plans/dependency/2025-10-15T00-00-00-dependency-plan.md`
4. **Select Payroll Provider** (Salarium vs Sprout vs PayrollHero)
   - Request demo and API documentation
   - **Decision Deadline:** End of Week 2
5. **Select Cloud Provider** (AWS vs GCP)
   - Compare pricing for Philippines region
   - **Decision Deadline:** End of Week 1

### Before Planning Phase (Week 3-4)
- [ ] Validate personas with target users (2-3 Philippines startup founders/office managers)
- [ ] Confirm payroll integration partner selection (Salarium or Sprout)
- [ ] Prototype API Integration Layer (INF-007) - OAuth2 flow
- [ ] Define data model for core entities (Employee, Expense, Invoice, Payment, GovernmentContribution, 13thMonthPay)
- [ ] Consult with Philippines accountant on BIR/SSS/PhilHealth/Pag-IBIG report formats

### Before Phase 3 (Week 9-12)
- [ ] Prototype payroll provider integration (Week 7-8)
- [ ] Review BIR invoice format requirements
- [ ] Plan Early Access Program with 3-5 pilot customers

### Stakeholder Sign-off
- [ ] Founder approval on Philippines-specific scope and 16-20 week timeline
- [ ] Accountant review of compliance requirements (BIR, SSS, PhilHealth, Pag-IBIG)
- [ ] Data Privacy Officer review of Data Privacy Act compliance

---

**Document Version:** 2.0 (Philippines-Specific)
**Last Updated:** 2025-10-15
**Changes from v1.0:** Updated for Philippines market (BIR, SSS, PhilHealth, Pag-IBIG, 13th month pay)
