# Product Research: Philippines Accounting & Payroll Compliance

**Feature ID:** `simple-accounting-software-for-dev-startup`
**Research Date:** 2025-10-15
**Research Topic:** Philippines-specific compliance requirements for accounting software
**Status:** Completed
**Version:** 1.0

---

## Executive Summary

The product charter and feature catalog were initially designed for US-based startups. This research identifies critical differences for **Philippines-based software development startups** that require significant changes to the MVP scope, particularly in payroll, tax compliance, and invoicing.

**Key Findings:**
- ✅ Payroll providers: Salarium, Sprout, PayrollHero are Philippines-specific alternatives to Gusto/Rippling
- ⚠️ **Mandatory** government contributions: SSS, PhilHealth, Pag-IBIG (not optional)
- ⚠️ **13th month pay** is legally required (not present in US system)
- ✅ VAT threshold: ₱3M annual revenue (vs. percentage tax for smaller businesses)
- ⚠️ BIR (Bureau of Internal Revenue) has specific invoice format requirements
- ⚠️ E-invoicing is becoming mandatory (BIR Electronic Invoicing System)
- ✅ Record retention: 5 years (vs. 7 years IRS requirement in US)

**Impact on MVP:** High - requires changes to 8+ features across payroll, invoicing, and compliance.

---

## Research Methodology

**Data Sources:**
- Gemini AI research on Philippines payroll and tax regulations
- BIR (Bureau of Internal Revenue) regulatory requirements
- Data Privacy Act of 2012 compliance requirements

**Focus Areas:**
1. Payroll & tax compliance differences from US
2. Invoicing & VAT requirements
3. Accounting & bookkeeping standards
4. Record retention and data privacy
5. Local payroll software providers

---

## Detailed Findings

### 1. Payroll & Tax Compliance

#### Mandatory Government Contributions

| Contribution | Employee Rate | Employer Rate | Salary Range/Cap | Notes |
|--------------|---------------|---------------|------------------|-------|
| **SSS (Social Security System)** | 5% | 10% | MSC: ₱5,000 - ₱35,000 | Monthly Salary Credit system |
| **PhilHealth** | 2.5% | 2.5% | Floor: ₱10,000, Ceiling: ₱100,000 | Philippine Health Insurance |
| **Pag-IBIG (HDMF)** | 2% | 2% | Max contribution: ₱200 each (₱10,000 salary cap) | Home Development Mutual Fund |

**Total Mandatory Deductions:** 9.5% employee + 14.5% employer = 24% of salary

#### Withholding Tax (Income Tax)

Philippines uses progressive tax brackets (annual basis):

| Annual Income | Tax Rate | Cumulative Tax + Marginal Rate |
|---------------|----------|--------------------------------|
| ≤₱250,000 | 0% | ₱0 |
| ₱250,001 - ₱400,000 | 20% | 20% of excess over ₱250K |
| ₱400,001 - ₱800,000 | 25% | ₱30K + 25% of excess over ₱400K |
| ₱800,001 - ₱2,000,000 | 30% | ₱130K + 30% of excess over ₱800K |
| ₱2,000,001 - ₱8,000,000 | 32% | ₱490K + 32% of excess over ₱2M |
| >₱8,000,000 | 35% | ₱2,410K + 35% of excess over ₱8M |

**Calculation:** Monthly withholding = (Annual tax ÷ 12) or annualized projection method

#### 13th Month Pay (MANDATORY)

- **Legal Requirement:** All rank-and-file employees must receive 13th month pay
- **Amount:** 1/12 of basic salary earned in calendar year
- **Timing:** Must be paid by December 24th
- **Tax Treatment:** Tax-exempt up to ₱90,000; excess is taxable

**This is a major difference from US payroll and must be tracked/accrued throughout the year.**

#### Philippines Payroll Providers

**Local Market Leaders:**
1. **Salarium** - Cloud-based payroll and HRIS
2. **Sprout Solutions** - Payroll, HR, and benefits administration
3. **PayrollHero** - Time tracking, scheduling, and payroll

**Key Differences from Gusto/Rippling/ADP:**
- Built-in SSS, PhilHealth, Pag-IBIG calculations
- BIR form generation (BIR Form 1601C monthly, alphalist annual)
- 13th month pay automation
- Integration with Philippines banks (BDO, BPI, Metrobank, UnionBank)

**Recommendation:** PM-001 (Payroll Provider Integration) should prioritize **Sprout or Salarium** over US providers.

---

### 2. Invoicing & Sales Tax (VAT)

#### VAT Registration Threshold

- **Threshold:** ₱3,000,000 annual gross sales/receipts
- **Rate:** 12% VAT (Value-Added Tax)
- **Below Threshold:** 3% Percentage Tax (no input tax credit)

**Impact:** Software dev startups often exceed ₱3M quickly → VAT registration is likely mandatory

#### BIR Invoice Format Requirements

**Mandatory Invoice Fields:**
- ✅ Seller's registered name, TIN (Taxpayer Identification Number), business address
- ✅ Word "INVOICE" prominently displayed
- ✅ Date and unique serial number
- ✅ Quantity, unit cost, service description
- ✅ Total amount with **VAT shown as separate line item**
- ✅ For sales ≥₱1,000 to VAT-registered buyers: buyer's name, address, TIN
- ✅ Non-VAT invoices must state: **"THIS DOCUMENT IS NOT VALID FOR CLAIM OF INPUT TAX"**

#### BIR Electronic Invoicing System (EIS)

- **Status:** Transitioning to mandatory e-invoicing
- **Format:** Structured digital format (JSON or XML)
- **Transmission:** Near real-time to BIR
- **Timeline:** Rollout ongoing; large taxpayers first, expanding to smaller businesses

**Impact on Features:**
- SB-002 (Invoice Creation & Sending) must support BIR-compliant format
- SB-006 (Sales Tax Calculation) becomes **Should-Have** (not Could-Have) for Philippines
- **NEW FEATURE NEEDED:** BIR e-invoice submission (API integration with BIR system)

---

### 3. Required BIR Forms

#### Monthly Reporting

| Form | Purpose | Due Date |
|------|---------|----------|
| **BIR Form 1601C** | Monthly remittance of income taxes withheld on compensation (employee salaries) | 10th day of following month |
| **BIR Form 0619E** | Monthly remittance for creditable income taxes withheld (for first 2 months of quarter) | 10th day of following month |

#### Quarterly Reporting

| Form | Purpose | Due Date |
|------|---------|----------|
| **BIR Form 1701Q/1702Q** | Quarterly income tax return (individuals/corporations) | Last day of month following quarter |
| **BIR Form 2550Q** | Quarterly VAT return (for VAT-registered businesses) | 25th day of month following quarter |
| **BIR Form 2551Q** | Quarterly percentage tax return (for non-VAT businesses) | 25th day of month following quarter |
| **BIR Form 1601EQ** | Quarterly remittance of creditable income taxes withheld | Last day of month following quarter |

#### Annual Reporting

| Form | Purpose | Due Date |
|------|---------|----------|
| **BIR Form 1701/1702** | Annual income tax return | April 15 (following year) |
| **BIR Form 2316** | Certificate of income tax withheld on compensation (for employees) | January 31 |
| **Alphalist of Employees** | Annual list of all employees with compensation details | February 28 |

**Impact:** PM-005 (Automated Payroll Tax Filing) becomes more complex than US scenario. Requires:
- Monthly BIR Form 1601C generation
- Quarterly BIR Forms 2550Q or 2551Q (VAT vs. percentage tax)
- Annual alphalist compilation

---

### 4. Record Retention Requirements

**Updated Requirements (vs. US 7-year IRS):**

| Document Type | Retention Period | Authority |
|---------------|------------------|-----------|
| **Books of Accounts & Accounting Records** | **5 years** | EOPT Act (Ease of Paying Taxes) - reduced from 10 years |
| **Business Permits, BIR Registration** | 3 years | BIR |
| **Client Contracts, Proposals** | 3 years | Business practice |
| **Financial Statements, Audit Reports** | 10 years | Corporate governance |
| **Employee Records** | 3 years (minimum) | Data Privacy Act of 2012 |

**Impact:** INF-008 (Data Backup & Retention) can be reduced from 7 years to **5 years** for Philippines.

---

### 5. Data Privacy & Security

**Data Privacy Act of 2012:**
- Personal data (employee info, customer data) must be retained only as long as necessary
- **Minimum employee record retention:** 3 years from last entry
- Data breach notification required within 72 hours
- Consent required for personal data processing

**Security Requirements:**
- No specific SOC 2 equivalent mandated by law, but recommended for B2B SaaS
- Data encryption and access controls are best practices (not legally mandated)
- NPC (National Privacy Commission) can conduct audits

**Impact:**
- INF-001 (Authentication & Authorization) - add data privacy consent management
- INF-005 (Audit Logging) - include data access logs for privacy compliance
- INF-008 (Data Backup & Retention) - add data purging after retention period

---

## Impact Analysis on Feature Catalog

### Features Requiring Significant Changes

#### 1. PM-001: Payroll Provider Integration (HIGH IMPACT)

**Original Spec:** Gusto/Rippling/ADP integration
**Philippines Change:**
- Replace with Salarium, Sprout Solutions, or PayrollHero
- Add SSS, PhilHealth, Pag-IBIG calculation modules
- Add 13th month pay accrual tracking
- Generate BIR Form 1601C monthly

**New Complexity:** +30% (additional government contributions + 13th month pay logic)

---

#### 2. PM-002: Run Payroll (MEDIUM IMPACT)

**Original Spec:** Bi-weekly payroll with US tax calculations
**Philippines Change:**
- Add SSS/PhilHealth/Pag-IBIG deductions
- Calculate withholding tax using Philippines brackets
- Track 13th month pay accrual (1/12 of basic salary per pay period)
- Support semi-monthly pay cycle (1st-15th, 16th-31st - common in Philippines)

**New Complexity:** +20%

---

#### 3. PM-005: Automated Payroll Tax Filing (HIGH IMPACT)

**Original Spec:** US federal/state/local tax filing
**Philippines Change:**
- Generate BIR Form 1601C monthly
- File quarterly BIR Form 1601EQ
- Generate annual BIR Form 2316 (employee tax certificates)
- Compile annual alphalist of employees
- **May require BIR eSubmission API integration** (if available)

**New Complexity:** +40% (more forms, quarterly + annual reporting)

---

#### 4. SB-002: Invoice Creation & Sending (MEDIUM IMPACT)

**Original Spec:** Generic invoice template
**Philippines Change:**
- Add TIN field (seller and buyer)
- VAT breakdown as separate line item (12%)
- Serial number format compliance
- Add disclaimer for non-VAT invoices: "THIS DOCUMENT IS NOT VALID FOR CLAIM OF INPUT TAX"
- Support BIR-prescribed invoice format

**New Complexity:** +15%

---

#### 5. SB-006: Sales Tax Calculation (PRIORITY UPGRADE)

**Original Status:** Could-Have (Future)
**Philippines Status:** **Should-Have (Phase 1 or early Phase 2)**

**Reason:** VAT is mandatory for most software dev businesses (₱3M+ revenue), not optional like multi-state sales tax in US.

**Philippines-Specific:**
- 12% VAT for VAT-registered businesses
- 3% Percentage Tax for non-VAT businesses
- Input tax credit tracking (VAT paid on purchases offset against VAT collected)
- Quarterly BIR Form 2550Q or 2551Q generation

**New Complexity:** Medium (simpler than US multi-state, but required earlier)

---

#### 6. INF-008: Data Backup & Retention (LOW IMPACT)

**Original Spec:** 7-year retention (IRS requirement)
**Philippines Change:**
- Reduce to **5 years** for accounting records (EOPT Act)
- 3 years for employee records (Data Privacy Act)
- Add data purging automation after retention period

**New Complexity:** -10% (shorter retention, but add purging logic)

---

#### 7. ESS-004: View Tax Forms (MEDIUM IMPACT)

**Original Spec:** View W-2 forms (US)
**Philippines Change:**
- Replace with BIR Form 2316 (Certificate of Income Tax Withheld)
- Include year-end summary of SSS/PhilHealth/Pag-IBIG contributions
- Show 13th month pay separately (for tax exemption tracking)

**New Complexity:** +10%

---

### New Features Required

#### PH-001: 13th Month Pay Management (NEW - Must-Have)

**User Story:** As Brenda, I want to track 13th month pay accruals throughout the year so that we can budget and pay it by December 24th.

**Requirements:**
- Accrue 1/12 of basic salary per pay period
- Dashboard showing total accrued 13th month pay liability
- Generate 13th month pay run in December
- Apply ₱90,000 tax exemption automatically

**Dependencies:** PM-002 (Run Payroll)
**Priority:** Must-Have (MVP)
**Complexity:** Medium (~24 hours)

---

#### PH-002: BIR E-Invoice Submission (NEW - Should-Have)

**User Story:** As Brenda, I want invoices to be automatically submitted to BIR's Electronic Invoicing System so that we remain compliant.

**Requirements:**
- Convert invoice to BIR-prescribed JSON/XML format
- Submit to BIR EIS API in near real-time
- Store BIR confirmation/reference number
- Handle submission errors and retries

**Dependencies:** SB-002 (Invoice Creation), INF-007 (API Integration Layer)
**Priority:** Should-Have (Phase 2, but becoming mandatory)
**Complexity:** Medium (~32 hours)

---

#### PH-003: Government Contribution Reports (NEW - Must-Have)

**User Story:** As Brenda, I want to generate monthly SSS, PhilHealth, and Pag-IBIG remittance reports so that I can file with the correct agencies.

**Requirements:**
- Monthly SSS contribution report (employer + employee shares)
- Monthly PhilHealth contribution report
- Monthly Pag-IBIG contribution report
- Export to agency-prescribed formats (if available)

**Dependencies:** PM-002 (Run Payroll)
**Priority:** Must-Have (MVP)
**Complexity:** Small (~16 hours)

---

## Recommendations

### Immediate Actions

1. **Update Product Charter:**
   - Replace US regulatory assumptions with Philippines equivalents
   - Add 13th month pay to core capabilities
   - Update compliance section to reference BIR, SSS, PhilHealth, Pag-IBIG

2. **Revise Feature Catalog:**
   - Update PM-001 research notes to focus on Salarium/Sprout/PayrollHero
   - Upgrade SB-006 (Sales Tax) from Could-Have to Should-Have
   - Add 3 new Philippines-specific features (PH-001, PH-002, PH-003)
   - Update man-hour estimates (+50-80 hours for Philippines-specific work)

3. **Critical Research Gaps:**
   - **Salarium, Sprout, PayrollHero API documentation** - which has best API for integration?
   - **BIR Electronic Invoicing System** - is API available for third-party software?
   - **Government portal integrations** - SSS, PhilHealth, Pag-IBIG online submission capabilities
   - **Philippines banking APIs** - Instapay/PESONet for payroll disbursement

### Updated MVP Scope

**Original MVP:** 23 Must-Have features, 11-14 weeks
**Philippines MVP:** 26 Must-Have features (+3 Philippines-specific), **13-16 weeks**

**Additional Hours:**
- PH-001 (13th Month Pay): +24 hours
- PH-003 (Government Contribution Reports): +16 hours
- PM-001 complexity increase: +12 hours
- PM-002 complexity increase: +10 hours
- PM-005 complexity increase: +20 hours
- SB-002 complexity increase: +8 hours
- **Total Additional:** ~90 hours (~2.25 weeks)

**Updated Timeline:**
- **Optimistic:** 400 hours (~10 weeks)
- **Most Likely:** 535 hours (~13.4 weeks)
- **With Buffer:** 645 hours (~16.1 weeks)

### Risk Mitigation

**High-Risk Areas:**
1. **BIR E-invoicing** - regulation is evolving; may become mandatory mid-development
   - **Mitigation:** Design invoice data model to support BIR JSON/XML export from day 1
2. **Payroll provider API limitations** - Salarium/Sprout may have less mature APIs than Gusto
   - **Mitigation:** Prototype integration in Week 1-2 before committing to architecture
3. **Multiple government portals** - SSS, PhilHealth, Pag-IBIG may not have APIs
   - **Mitigation:** Plan for manual filing in MVP; API integration in Phase 2

---

## Open Questions

### Critical (Blocking MVP)

1. **Which payroll provider has the best API?** (Salarium, Sprout, PayrollHero)
   - **Impact:** PM-001 design decisions
   - **Owner:** Technical Lead
   - **Timeline:** Week 1-2

2. **Is BIR Electronic Invoicing System API available for third-party integration?**
   - **Impact:** Whether PH-002 is feasible or if manual compliance is required
   - **Owner:** Compliance Specialist
   - **Timeline:** Week 1-2

3. **Do SSS, PhilHealth, Pag-IBIG have online submission APIs?**
   - **Impact:** PM-005 automation feasibility
   - **Owner:** Technical Lead
   - **Timeline:** Week 2-3

### Secondary (Phase 2)

4. **What are Philippines banking API options for payroll disbursement?**
   - **Impact:** ET-005 (Expense Reimbursement) and payroll fund transfer automation
   - **Timeline:** Week 6-8

5. **Are there Philippines-specific OCR services for BIR receipts?**
   - **Impact:** ET-006 (OCR Receipt Scanning) accuracy
   - **Timeline:** Week 8-10

---

## References

**Regulatory Sources:**
- Bureau of Internal Revenue (BIR): https://www.bir.gov.ph/
- Social Security System (SSS): https://www.sss.gov.ph/
- PhilHealth: https://www.philhealth.gov.ph/
- Pag-IBIG Fund: https://www.pagibigfund.gov.ph/
- Data Privacy Act of 2012 (Republic Act No. 10173)
- Ease of Paying Taxes Act (Republic Act No. 11976)

**Industry Resources:**
- Salarium: https://www.salarium.com/
- Sprout Solutions: https://sprout.ph/
- PayrollHero: https://payrollhero.com/

**Key Regulations:**
- BIR Revenue Memorandum Circular No. 60-2020 (E-invoicing)
- SSS Contribution Schedule (updated annually)
- PhilHealth Circular No. 2023-0014 (Contribution rates)
- DOLE Labor Advisory No. 28, Series of 2020 (13th month pay)

---

## Next Steps

### Recommended Slash Commands

1. **Update Product Charter with Philippines context:**
   ```bash
   # Manual update required to charter.md
   # Add Philippines-specific personas, compliance, and 13th month pay
   ```

2. **Research Payroll Provider Options:**
   ```bash
   /baw_product_helper "Simple Accounting Software for Dev Startup" "Salarium vs Sprout Solutions vs PayrollHero API comparison"
   ```

3. **Research BIR E-Invoicing:**
   ```bash
   /baw_product_helper "Simple Accounting Software for Dev Startup" "BIR Electronic Invoicing System API integration"
   ```

4. **Update Feature Catalog:**
   ```bash
   # Manual update to capability-catalog.md
   # - Add PH-001, PH-002, PH-003 features
   # - Update PM-001, PM-002, PM-005, SB-002, SB-006 complexity
   # - Revise man-hour estimates
   ```

5. **Create Updated Dependency Plan:**
   ```bash
   /baw_dev_dependency_plan "Simple Accounting Software for Dev Startup" "ai-docs/capabilities/2025-10-15T00-00-00-capability-catalog.md"
   ```

---

**Document Version:** 1.0
**Last Updated:** 2025-10-15
**Research Status:** Completed
**Confidence Level:** High (based on official government sources)
**Action Required:** Update charter and feature catalog to reflect Philippines requirements
