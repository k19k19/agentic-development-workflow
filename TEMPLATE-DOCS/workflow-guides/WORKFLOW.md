## **Final Unified Agentic Development Workflow**

This document represents the final, complete workflow, integrating all your feature development steps, learning loops, hotfix procedures, and the best practices adapted from Google's engineering principles for a single developer relying on an AI agent.

### **I. Core Feature Development Workflow**

This 9-step process is the standard for implementing a new feature defined in Roadmap.md.

| Step | Command | Phase | Agent's Primary Action and Constraints |
| :---- | :---- | :---- | :---- |
| **0\. Init** | **/START\_FEATURE \<ID\>** | Initialization/Hermeticism | **Clears context**, loads feature details, and **initializes the feature inside a clean, containerized environment** (ensuring a hermetic build state). |
| **1\. Discovery** | **/SCOUT\_RESEARCH** | Scout | Gathers information (internal, web, code context). Prioritizes analysis of any existing FAILURE\_REPORT or BUG\_REPORT. |
| **1.5. Verification** | **/VERIFY\_SCOUT** | **Verification Gate** | **Self-Assesses** information sufficiency. Generates **SCOUTING\_VERDICT.md** (Confidence Score, Unanswered Questions). **IF Confidence \< Threshold:** Loops back to targeted /SCOUT\_RESEARCH. |
| **2\. Strategy** | **/PLAN\_TASKS** | Plan | **1\. Complexity Check:** Assesses difficulty. **IF Complexity \> Threshold:** Executes /PAUSE\_FEATURE. **2\. Plan Generation:** Generates TASKS.json, constrained to favor **readability and simple logic** over complex syntax. |
| **3\. Build** | **/BUILD\_IMPLEMENT** | Build | Implements code in small, atomic commits. **Continuous Vetting:** Executes local pre-commit hooks (linting/tests) before *every* commit. If checks fail, agent self-initiates debugging. |
| **3.5. Review** | **/WAIT\_FOR\_REVIEW** | **Human/Critique Gate** | **Agent Action:** Generates a **Code Critique Summary** (analyzing complexity, adherence to standards, and risk) and pauses. **Human Action:** Reviews the critique and code before merging the branch. |
| **4\. Internal V\&V** | **/TEST\_DEV\_UNIT** | Test (Dev) | Runs hermetic Unit & Integration Tests **inside the container** using mock data. **IF FAILURE, EXECUTE LEARNING LOOP (Section II).** |
| **5\. Staging** | **/DEPLOY\_STAGING** | Deploy (Staging) | Executes deployment script and monitors logs. |
| **6\. UAT** | **/TEST\_UAT\_DATA** | Test (Real-World) | Runs validation against the live staging environment using real-world data. |
| **7\. Finalize** | **/DOCUMENT\_RELEASE** | Document | Finalizes documentation, updates external trackers (for bugs), and updates Roadmap.md status. |
| **8\. Publication** | **/RELEASE\_PROD** | Release | Executes the final production deployment. |
| **9\. Loop** | **/NEXT\_FEATURE** | Repeat/Prioritization | Selects the next item from Roadmap.md based on priority and lowest complexity/highest ease score. |

### **II. Auxiliary Workflows**

#### **A. The Failure and Learning Loop (Self-Correction)**

Triggered by a failure in **Step 4 (/TEST\_DEV\_UNIT)**.

1. **Failure:** /TEST\_DEV\_UNIT reports an error.  
2. **Learning:** Agent executes **/REPORT\_FAILURE**.  
   * *Action:* Generates a structured **FAILURE\_REPORT.md** detailing the root cause.  
3. **Restart:** Agent executes **/RESTART\_FEATURE \<Feature\_ID\>**.  
   * *Action:* Immediately jumps back to **Step 1 (/SCOUT\_RESEARCH)** to incorporate the lesson learned into the next planning cycle.

#### **B. Hotfix and Bug Triage Workflow**

Used for external, user-reported issues (post-release).

1. **Start:** You run **/INGEST\_BUG \<Ticket\_ID\>**.  
   * *Action:* System pulls external data and creates internal **BUG\_REPORT\_\<ID\>.md**.  
2. **Targeted Scout:** Agent executes **/TRIAGE\_BUG**.  
   * *Action:* Highly focused analysis to pinpoint the bug and propose a fix.  
3. **Re-Entry:** The agent proceeds directly to **Step 2 (/PLAN\_TASKS)** or **Step 3 (/BUILD\_IMPLEMENT)** of the Core Workflow with high priority.  
4. **Finalization:** The final /DOCUMENT\_RELEASE action includes closing the external bug ticket.

### **III. Complete Command Reference**

| Command | Path/Trigger | Description |
| :---- | :---- | :---- |
| **/START\_FEATURE \<ID\>** | Core | Initiates a new feature cycle in a **hermetic environment**. |
| **/RESUME\_FEATURE \<ID\>** | Manual | Loads a paused feature state. |
| **/SCOUT\_RESEARCH** | Core, Learning | Gathers information. |
| **/VERIFY\_SCOUT** | **Core (Gate)** | Self-assessment of information quality; loops if confidence is low. |
| **/PLAN\_TASKS** | Core, Hotfix | Assesses complexity and generates TASKS.json with **clarity constraints**. |
| **/PAUSE\_FEATURE** | Core (Decision) | Commits work, marks feature "Paused," and switches context via /NEXT\_FEATURE. |
| **/BUILD\_IMPLEMENT** | Core, Hotfix | Implements code; enforces **continuous vetting/pre-commit checks**. |
| **/WAIT\_FOR\_REVIEW** | **Core (Gate)** | Agent generates **Code Critique Summary** and waits for human sign-off. |
| **/TEST\_DEV\_UNIT** | Core, Hotfix | Runs hermetic unit/integration tests. |
| **/DEPLOY\_STAGING** | Core, Hotfix | Deploys to staging. |
| **/TEST\_UAT\_DATA** | Core, Hotfix | Runs real-world data validation on staging. |
| **/DOCUMENT\_RELEASE** | Core, Hotfix | Finalizes documentation and updates status. |
| **/RELEASE\_PROD** | Core, Hotfix | Deploys the final, approved code to production. |
| **/NEXT\_FEATURE** | Core | Selects the next feature based on priority/ease logic. |
| **/REPORT\_FAILURE** | Learning Loop | Formalizes internal test failure into FAILURE\_REPORT.md. |
| **/RESTART\_FEATURE \<ID\>** | Learning Loop | Jumps to Step 1, prioritizing the failure context. |
| **/INGEST\_BUG \<ID\>** | Hotfix | Starts the hotfix workflow by pulling external bug data. |
| **/TRIAGE\_BUG** | Hotfix | Targeted analysis to pinpoint a user-reported bug's root cause. |

