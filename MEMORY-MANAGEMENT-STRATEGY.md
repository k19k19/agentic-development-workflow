## **🧠 Enterprise AI Memory Management Strategy (Hybrid Model)**

This document outlines the definitive strategy for structuring and managing project knowledge for a large-scale enterprise application. The goal is to ensure maximum token efficiency, prevent repeated mistakes, and enable the AI to "learn" and scale its assistance across dozens of development rounds.

The core strategy is a **Hybrid AI Memory Solution**:
1.  **Vectorized Knowledge Base (V-KB):** All project documentation (specs, architecture, issues) is converted into a searchable vector index, serving as the AI's long-term memory.
2.  **LLM for Reasoning:** The expensive, powerful AI model (e.g., Claude) is reserved for what it does best: reasoning, planning, and code generation, using the hyper-relevant context retrieved from the V-KB.

This **Shift from In-Context Knowledge to On-Demand Retrieval** is the foundation of a scalable and cost-effective multi-round workflow.

---

## **1. The Vectorized Knowledge Base (V-KB)**

The V-KB is a strict, centralized, and version-controlled documentation structure. All documents are maintained within the `app-docs/` and `ai-docs/` directories and are automatically indexed for semantic search.

### **Phase 1: Pre-Project & Planning (Semantic Memory Foundation)**

| Category | Recommended Document | Purpose for AI Agent |
| :--- | :--- | :--- |
| **Global Rules** | `app-docs/guides/ai-agent-memory.md` | Your **AI User Memory**. Sets preferred style, environment, efficiency rules, and tool delegation strategy. |
| **Requirements** | `app-docs/specs/[feature-name].md` | The definitive source for what a feature **must do**. Used for planning and post-build validation. |
| **System Architecture** | `app-docs/architecture/system-design.md` | High-level component diagrams, data flow, service boundaries. **Crucial for multi-file context.** |
| **API Contracts** | `app-docs/api/open-api-spec.yaml` | Detailed specifications (endpoints, request/response formats). **Prevents inconsistent interfaces.** |
| **Development Guides**| `app-docs/guides/common-patterns.md` | **Semantic Memory.** Documents reusable utilities and established class structures. **Prevents code duplication.** |

### **Phase 2: During Implementation (Procedural & Episodic Logging)**

| Category | Recommended Document | Purpose for AI Agent |
| :--- | :--- | :--- |
| **Feature Mapping** | `app-docs/mappings/feature-to-source.md` | **CRITICAL Retrieval Index.** Maps every feature to the *exact file path* and *line range*. **The AI must search this first.** |
| **Test Coverage** | `app-docs/qa/test-plan-[feature].md` | Defines **what** was tested. Used by the AI during debugging to check test integrity. |
| **Build Reports** | `ai-docs/reports/[timestamp]/build-report.md`| **Episodic Memory.** The final output of the `/build` phase. Used for project history and efficiency review. |

### **Phase 3: Post-Deployment & Maintenance (Corrective Learning)**

| Category | Recommended Document | Purpose for AI Agent |
| :--- | :--- | :--- |
| **Known Issues Log** | `app-docs/debugging/known-issues.md` | **Consolidated Episodic Memory.** A running log of all major bugs, the component affected, and the definitive fix. **The AI must check this before starting any bug fix.** |
| **Troubleshooting** | `app-docs/debugging/troubleshooting-guide.md` | **Procedural Memory.** Documents the *process* for fixing common deployment or environment issues. |
| **Incident Reports** | `ai-docs/incidents/[timestamp]/report.md` | Detailed report on production outages. Used for the AI's reflection and learning phase. |

---

## **2. The Hybrid Retrieval & Implementation Workflow**

The AI must follow a multi-phase protocol that delegates retrieval to a cheap vector search tool and reserves the LLM for high-level tasks.

### **Phase A: Automated Retrieval (The Scout Agent) 🔎**

Before any expensive code generation, the agent **must** use a vector search tool to query the V-KB.

1.  **Parse Current Spec**: The agent reads the new feature spec (e.g., `app-docs/specs/new-billing-feature.md`).
2.  **Semantic Search for Duplicates**: It performs a semantic search against the **`feature-to-source.md`** index to find existing, related code. This is the primary defense against code duplication.
3.  **Semantic Search for Risks**: It searches the **`known-issues.md`** index for past bugs related to the components or features identified in the spec.
4.  **Gather Patterns**: It retrieves relevant sections from the **`common-patterns.md`** index to ensure adherence to project standards.
5.  **Synthesize Minimal Context**: The search results (small, relevant snippets of text) are compiled into a minimal context bundle.

### **Phase B: Context-Aware Implementation (The Builder Agent) 🏗️**

The main AI (e.g., Claude) is engaged **only after** the minimal context is retrieved.

*   The prompt to the Builder Agent includes the **AI User Memory**, the **current spec**, and the **hyper-relevant snippets** retrieved by the Scout Agent.
*   **Mandatory Rule:** The AI must be programmed to **build upon the existing functions** identified in the retrieval phase rather than creating new, slightly different versions.

### **Phase C: Knowledge Base Update (The Historian Agent) ✍️**

After a successful build, the V-KB must be automatically updated to facilitate continuous learning.

1.  **Update Mappings**: The agent updates `app-docs/mappings/feature-to-source.md` with the new file paths and features implemented.
2.  **Log New Patterns**: If a new reusable pattern was created, it is added to `app-docs/guides/common-patterns.md`.
3.  **Re-Index the V-KB**: A script is triggered to re-vectorize the updated documents, ensuring the new knowledge is immediately available for the next task.

---

## **3. Technical Implementation & Mandatory Rules**

1.  **Vectorization Tooling**: Implement two core scripts:
    *   `scripts/vectorize-docs.js`: A script that reads all files in `app-docs/` and `ai-docs/`, chunks them, and stores them in a local vector database (e.g., ChromaDB, FAISS).
    *   `scripts/search-docs.js`: A script that takes a query string and returns the top N relevant document chunks from the vector database.

2.  **CRITICAL Pre-Implementation Protocol**: **NEVER skip the pre-approval phase.** The AI must present its **Plan, Files to modify, Retrieved Context, and Risks** and **WAIT for explicit user approval** before generating code. This is the primary cost-control gate.

3.  **Delegate All Reading**: Use the `search-docs.js` script for all knowledge retrieval. **Do not waste expensive model tokens on reading full documentation files.** The AI should never read directories or files directly unless they are the specific, targeted files returned by the search.