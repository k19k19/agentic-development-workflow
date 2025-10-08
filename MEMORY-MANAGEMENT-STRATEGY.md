

## **🧠 AI Memory Management Strategy for Long-Term Projects**

This document outlines the recommended approach for structuring and managing project knowledge to ensure high token efficiency, prevent repeated mistakes, and scale AI assistance across multiple project rounds (backend/frontend, new features, bug fixes).  
The core strategy is to **Shift Knowledge from Context to Retrieval**—making all project intelligence persistent, structured, and instantly accessible via targeted retrieval (scouting/planning agents) rather than relying on the limited AI context window.  
---

## **1\. Structured Knowledge Base (The Source of Truth)**

The solution to mixed documents and repeated errors is a **strict, centralized, and hierarchical documentation structure** that mirrors your development workflow. All files should be placed under an app-docs/ directory.

| Knowledge Type | Recommended Folder/File | Purpose | Update Cadence |
| :---- | :---- | :---- | :---- |
| **Global AI Rules** | app-docs/guides/implementation-guidelines.md | Contains the **AI User Memory** (e.g., your V3.0 guidelines). **Always provided to the AI.** | Static/Quarterly |
| **Architecture/Design** | app-docs/architecture/ | High-level design, tech stack, and core architectural decisions. | Per Major Round |
| **Feature Specifications** | app-docs/specs/\[round-type\]-\[feature\].md | **Required before implementation.** Detailed requirements for a specific task. *(e.g., 1st-backend-auth.md, 2nd-frontend-billing.md)*. | Per Feature |
| **Code Mappings** | app-docs/mappings/feature-to-source.md | **CRITICAL for efficiency.** A single, indexed file mapping features/functions/modules to their exact file paths. **This prevents duplication.** *(e.g., "UserAuth  src/services/authService.ts:L15-L100")* | Post-Build |
| **Reusable Patterns** | app-docs/guides/common-patterns.md | Document established utility functions, API standards, and design patterns already in use. | Ongoing |
| **Known Issues/Bugs** | app-docs/debugging/known-issues.md | Log major bugs, the fix applied, and the underlying reason to prevent regression. | Ongoing/Post-Deploy |
| **Historical Reports** | ai-docs/reports/\[timestamp\]/report.md | The final output of each "Build" or "Task" phase for audit and historical context. | Post-Build |

**Key Action:** **Enforce strict adherence to this structure.** Use AI to help parse and structure your existing mixed documents into these specific files.  
---

## **2\. Retrieval Protocol and Workflow Integration**

To ensure high token efficiency, the AI must be trained to follow a multi-phase protocol that relies on **targeted retrieval** from the structured knowledge base.

### **Phase A: Pre-Task Retrieval (The Scout) 🔎**

Before the AI engages in *any* expensive code generation, it must execute targeted searches using low-cost tools (grep, indexing agent) to gather only the necessary context.

1. **Read Current Spec**: Retrieve the specific spec for the current task (e.g., 2nd-frontend-billing.md).  
2. **Check Mappings (Anti-Duplication)**: Search **app-docs/mappings/feature-to-source.md** for related features. This instantly tells the AI if a component or function already exists and where to find it.  
3. **Check Patterns**: Retrieve relevant sections from **app-docs/guides/common-patterns.md** to ensure the new code adheres to project standards and avoids duplicating utilities.  
4. **Identify Minimal Files**: Use an internal tool to identify **only** the specific files and line ranges required for the modification.

### **Phase B: Context-Aware Implementation (The Claude Role) 🏗️**

The main AI (e.g., Claude) is engaged only after the minimal context is retrieved.

* The prompt sent to the AI includes the **full AI User Memory** and the **minimal, highly-relevant file snippets** retrieved in Phase A.  
* **Mandatory Rule:** The AI must be programmed to **build upon the existing functions** identified in the Mappings file rather than creating new, slightly different versions.

### **Phase C: Post-Task Update (The Historian) ✍️**

Every successful feature completion or major fix must automatically update the knowledge base.

1. **Update Mappings**: Update app-docs/mappings/feature-to-source.md with the new file paths and features implemented.  
2. **Log New Patterns**: If the implementation introduced a new, reusable utility or pattern, add a brief entry to app-docs/guides/common-patterns.md.  
3. **Final Report**: Save the detailed build report to ai-docs/reports/ for historical logging and metric tracking.

---

## **3\. Mandatory Token-Saving Rules**

To manage token expenses across multiple project rounds (3rd to 10th rounds), enforce these critical rules from your existing memory:

1. **Token Budget Detection**: Run a project scale check on every new task to determine the appropriate workflow (Small  Direct, Medium  /scout\_build, Large  /scout\_plan\_build\_report).  
2. **CRITICAL Pre-Implementation Protocol**: **NEVER skip the pre-approval phase.** This is the primary token gate. The AI must present its **Files to modify, Pattern, Token estimate, and Risks** and **WAIT for explicit user approval** before touching code.  
3. **Delegate Documentation Reading**: Use cheaper tools (like Gemini MCP) to summarize or read documentation and specs. **Do not waste Claude's tokens on reading large documentation files.**  
4. **Avoid Directory Reading**: The AI should **never** read an entire directory (e.g., src/). It must rely exclusively on the **scouting phase** and the **feature-to-source.md mapping file** to find the minimal required context.