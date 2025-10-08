## **📚 Comprehensive Documentation Types for AI Agent Memory**

All documents should be maintained within the app-docs/ and ai-docs/ directories for easy identification by the AI's scouting phase.

### **Phase 1: Pre-Project & Planning (Semantic Memory Foundation)**

These documents establish the **Architectural Rules and Definitions**.

| Category | Recommended Document | Purpose for AI Agent |
| :---- | :---- | :---- |
| **Global Rules** | app-docs/guides/ai-agent-memory.md | Your **AI User Memory**. Sets preferred style, environment, efficiency rules, and tool delegation strategy. |
| **Requirements** | app-docs/specs/\[feature-name\].md | The definitive source for what a feature **must do**. Used by the AI for planning and post-build validation. |
| **System Architecture** | app-docs/architecture/system-design.md | High-level component diagrams, data flow, service boundaries, and external APIs. **Crucial for multi-file context.** |
| **API Contracts** | app-docs/api/open-api-spec.yaml | Detailed specifications (endpoints, request/response formats, errors). **Prevents inconsistent interfaces.** |
| **Development Guides** | app-docs/guides/common-patterns.md | **Semantic Memory.** Documents reusable utilities, established class structures, and how to handle common tasks (e.g., logging, error formatting). **Prevents code duplication.** |

### **Phase 2: During Implementation (Procedural & Episodic Logging)**

These documents record **how** the feature was built and its physical location.

| Category | Recommended Document | Purpose for AI Agent |
| :---- | :---- | :---- |
| **Feature Mapping** | app-docs/mappings/feature-to-source.md | **CRITICAL Retrieval Index.** Maps every major function/feature name to the *exact file path* and *line range*. **The AI must search this first to find existing code.** |
| **Test Coverage** | app-docs/qa/test-plan-\[feature\].md | Defines **what** was tested. Includes unit, integration, and E2E test scripts. Used by the AI during debugging to check test integrity. |
| **Build Reports** | ai-docs/reports/\[timestamp\]/build-report.md | **Episodic Memory.** The final output of the /build phase. Includes git diff stats, test results, and final token usage. Used for project history and efficiency review. |
| **Database Schema** | app-docs/data/schema.sql (or migration scripts) | Source of truth for data structures. Essential when building new features that touch the database. |

### **Phase 3: Post-Deployment & Maintenance (Corrective Learning)**

This is the most important set for continuous rounds (3rd to 10th) and fixing the "mixed documents" problem, as it focuses on capturing **failures and resolutions**.

| Category | Recommended Document | Purpose for AI Agent |
| :---- | :---- | :---- |
| **Known Issues Log** | app-docs/debugging/known-issues.md | **Consolidated Episodic Memory.** A running log of all *major* bugs found in production, the file and component affected, the root cause, and the definitive fix/PR link. **The AI must check this before starting any bug fix.** |
| **Troubleshooting Guide** | app-docs/debugging/troubleshooting-guide.md | **Semantic/Procedural Memory.** Documents the *process* for fixing common deployment or environment issues. E.g., "If environment X fails, check ENV VAR Y." |
| **Data Correction Playbook** | app-docs/operations/data-fix-queries.md | Specific SQL or script commands used to correct wrong data values reported by users. **Prevents the AI from guessing or making irreversible data changes.** |
| **Incident Reports** | ai-docs/incidents/\[timestamp\]/report.md | Detailed report on production outages or critical bugs (e.g., P0/P1). Includes timeline, root cause analysis, and preventative actions. Used for AI's reflection phase. |
| **Release Notes** | app-docs/releases/v\[x.y.z\].md | Summarizes changes, new features, and bug fixes in a user-facing way. Used to ensure the AI's commits are accurately reflected in the final product state. |

## **🚀 Recommended Workflow for Continuous Rounds**

For every new round (e.g., 2nd Round: Backend New Feature):

1. **Specification (Prep):** Create app-docs/specs/2nd-backend-new-feature.md.  
2. **Scouting (Retrieval):**  
   * AI reads the **new spec**.  
   * AI checks **feature-to-source.md** for related functions to *avoid duplication*.  
   * AI checks **known-issues.md** for bugs related to the affected area.  
3. **Planning (Claude):** Claude uses the minimal context retrieved in step 2 to create the **plan**.  
4. **Pre-Approval (Gate):** You approve the plan, preventing token waste.  
5. **Build (Implement):** Code is generated.  
6. **Post-Build (Update):** **Automate the update of feature-to-source.md** and save the final report.

By centralizing the **failure history** (known-issues.md) and the **code map** (feature-to-source.md), you give the AI the long-term memory it needs to evolve, avoid repetition, and troubleshoot efficiently.