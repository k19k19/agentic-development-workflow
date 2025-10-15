# Billing Models for Software Agencies (2-10 Developers)

**Research Date:** 2025-10-15
**Topic:** Typical billing models used by software agencies with 2-10 developers
**Product Context:** dev-management-platform
**Research Method:** Gemini MCP web search and synthesis

---

## Executive Summary

Small software agencies (2-10 developers) serving SMB clients on modern SaaS projects typically use a **hybrid billing model** that combines project-based revenue (for client acquisition) with monthly recurring revenue (for stability). The most successful agencies aim to convert fixed-price or T&M projects into ongoing retainer relationships, using MRR to cover operational costs while treating project revenue as growth capital.

---

## Key Findings

### 1. Most Common Pricing Structures

Agencies use multiple pricing models simultaneously to balance cash flow and client acquisition:

- **Time & Materials (T&M):** Client pays for actual hours worked
  - **Use case:** Projects with evolving scope
  - **Benefit:** Flexibility + protection from scope creep
  - **Risk:** Unpredictable revenue for agency

- **Fixed-Price:** Set price for clearly defined scope
  - **Use case:** Small projects, MVPs with clear requirements
  - **Benefit:** Budget predictability for client
  - **Risk:** Agency bears scope creep risk

- **Retainer (Most Preferred):** Recurring monthly fee for guaranteed availability/work
  - **Use case:** Ongoing maintenance, support, iterative development
  - **Benefit:** Predictable Monthly Recurring Revenue (MRR)
  - **Strategic value:** Foundation of financial stability

- **Value-Based:** Pricing based on business value delivered
  - **Use case:** High-ROI projects where value is quantifiable
  - **Benefit:** Highest profit potential
  - **Challenge:** Requires clear ROI demonstration

### 2. Typical Rate Ranges (North America, 2025)

**Hourly Rates (T&M):**
- Small/emerging agencies: **$90-160/hour**
- Specialized/experienced teams: **$120-250/hour**
- Overall range: **$90-250/hour**

**Fixed-Price Projects:**
- Small projects/MVPs: **$20,000-75,000**
- Medium SaaS applications: **$75,000-250,000+**

**Monthly Retainers:**
- Range: **$2,000-15,000+/month**
- Common structure: Tiered packages (20, 40, 80 hours/month at reduced hourly rate)

### 3. Scope Change Management

**Fixed-Price Projects:**
1. **Initial Definition:** Detailed Statement of Work (SOW) defines inclusions AND exclusions
2. **Change Request Process:** Formal submission for any new feature/modification
3. **Impact Assessment:** Evaluate timeline, budget, feature trade-offs
4. **Approval & Repricing:** Client signs off on addendum with cost/time estimate

**T&M Projects:** Scope changes simply add billable hours (less friction)

**Ongoing Maintenance:**
- Handled via **monthly retainer contracts**
- Defined Service Level Agreements (SLAs):
  - Response times for critical issues (e.g., 4-hour response)
  - Scope of coverage (bug fixes, security patches, monitoring)
  - Distinction between maintenance vs. new development
- Cost & term explicitly stated

### 4. Revenue Mix: MRR vs. Project-Based

**Strategic Hybrid Model** (Most Common):
1. **Project-based work = Client acquisition**
   - Win new clients with fixed-price or T&M projects
   - Build initial SaaS product (V1)
   - Higher one-time revenue fuels growth

2. **Convert to MRR = Stability**
   - Post-launch: transition to monthly retainer
   - Cover maintenance, support, iterative development (V1.1, V1.2)
   - Goal: MRR covers baseline operational costs (salaries, overhead)
   - Project revenue becomes pure profit/reinvestment

**No standard split**, but successful agencies actively build MRR base.

### 5. Industry Profit Margin Benchmarks

**Gross Profit Margin:**
- Healthy range: **30-50%**
- Represents revenue after direct costs (primarily developer salaries)

**Net Profit Margin:**
- Standard benchmark: **10-20%**
- High-performing agencies: **up to 30%** (with premium rates, efficiency, strong client relationships)
- After ALL expenses: salaries, rent, marketing, software, etc.

---

## Implications for Dev-Management Platform

### Persona Insights

**Agency Owner/Manager:**
- Needs visibility into project profitability by pricing model
- Requires tools to track MRR vs. project revenue mix
- Must manage scope change workflow to protect margins
- Values retainer conversion rate as key business metric

**Developer/Team Lead:**
- Needs to log billable hours accurately (T&M model)
- Requires visibility into retainer hour budgets
- Benefits from change request workflow that clarifies scope boundaries

**Client (SMB):**
- Seeks budget predictability → attracted to fixed-price and retainers
- Needs transparency into scope, hours remaining, billing
- Values clear SLA definitions for maintenance contracts

### Feature Priorities Informed by Research

**High Priority:**
1. **Multi-model billing support**
   - T&M hourly tracking with rate tiers
   - Fixed-price project milestones/budgets
   - Retainer monthly credits with rollover/expiry rules
   - Hybrid project→retainer conversion workflow

2. **Scope change management**
   - Change request submission + impact assessment
   - SOW version control
   - Client approval workflow with audit trail

3. **MRR tracking & forecasting**
   - Retainer revenue dashboard
   - Conversion funnel: project → retainer
   - Churn risk indicators

4. **Profitability analytics**
   - Gross margin by project/client/pricing model
   - Net margin after operational costs
   - Benchmark comparisons (10-20% target)

**Medium Priority:**
5. **SLA management for retainers**
   - Response time tracking
   - Maintenance vs. new development hour allocation
   - Client-facing SLA compliance reports

6. **Rate card management**
   - Role-based hourly rates
   - Client-specific rate negotiation tracking
   - Market rate benchmarking tools

**Lower Priority (Value-Based Niche):**
7. **ROI calculator for value-based pricing**
   - Client business impact modeling
   - Pricing proposal generator

---

## Open Questions & Follow-Up Research Needed

1. **Payment terms:** What are typical NET-30/45/60 terms and how does this affect cash flow management?
2. **Retainer structure details:** How do agencies handle unused hours (rollover vs. use-it-or-lose-it)?
3. **Client acquisition cost:** What % of revenue is spent on sales/marketing for agencies in this size range?
4. **Geographic rate variance:** How much do rates differ between US/Canada/Europe/Asia markets?
5. **Technology specialization premium:** Do agencies specializing in specific tech stacks (e.g., AI/ML, blockchain) command higher rates?

---

## Recommended Next Steps

1. **Review existing dev-management-platform charter/features** to validate alignment with billing model requirements
2. **Run `/baw_product_features "dev-management-platform"`** to prioritize billing & invoicing features
3. **Consider `/baw_dev_dependency_plan`** to sequence billing engine implementation (foundational for other features)
4. **Stakeholder validation:** Interview 2-3 small agency owners to validate findings and uncover workflow nuances

---

## Citations & Sources

Research synthesized from Gemini MCP web search on:
- Software agency pricing models and benchmarks
- SaaS development agency rate surveys
- Custom software development profitability standards
- SMB client billing preferences
- Retainer vs. project-based revenue strategies

*(Note: Specific URLs not provided by Gemini synthesis; consider follow-up targeted searches for authoritative sources like Clutch.co, Bonsai pricing reports, or SaaS agency benchmark studies)*

---

**Document Status:** Completed
**Next Action:** Map findings to product feature catalog and dependency plan
