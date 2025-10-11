# Budget Agentic Workflow Template Evaluation

## Context

The repository at <https://github.com/k19k19/budget-agentic-workflow> advertises significant token savings and parallel multi-agent orchestration for Claude-based development workflows. We reviewed the latest default branch to confirm whether the implementation supports those claims.

## Advertised Capabilities

The public README markets the template as a "multi-agent" system that delivers "90%" token efficiency by delegating work across Gemini, Codex, and Claude. For example, the headline reads:

> "Ship enterprise-scale projects using Claude ($20/month)  free Gemini/Codex with intelligent multi-agent orchestration"
>
> "**Token Efficiency**: 90%"

The pitch section further promises:

> "This template: 90% token efficiency, handle 80 tasks/month, build continuously."
>
> "Result: 40-60% token savings vs. all-Claude approach"

These excerpts set the expectation that the repository includes implemented automation to realize those savings.

## Token-Saving Mechanics in the Codebase

The runtime scripts do not automatically meter or optimize Claude usage. The central budget helper, `scripts/manage-tasks.js`, simply persists user-supplied estimates and manual token counts:

```javascript
async function completeTask(taskId, tokensUsed) {
  const data = await loadTasks();
  const taskIndex = data.tasks.findIndex(t => t.id === taskId);
  ...
  task.actualTokens = tokensUsed;
  ...
  data.tokenBudget.used = tokensUsed;
  data.tokenBudget.remaining = data.tokenBudget.dailyLimit - data.tokenBudget.used;
  await saveTasks(data);
}
```

Because `tokensUsed` is a required argument, the user must type the number—there is no integration with Claude, Gemini, or any metering API. The only "optimization" is advisory text about preferred models. Likewise, the `scout` instruction is a thin wrapper around a local search command:

```markdown
allowed-tools: ["run_shell_command"]
...
Construct the shell command: `npm run search -- "[USER_PROMPT]"`.
Execute the command using `run_shell_command`.
```

The workflow therefore never reaches out to Gemini or Codex automatically. Token accounting is manual, so the repository does not implement the advertised 90% savings—it merely documents suggested habits.

## Multi-Agent and Parallel Task Claims

The template also claims to orchestrate multiple agents in parallel, but the instructions contradict that promise:

```markdown
**Critical**: Commands execute sequentially, not in parallel. Each step must complete before the next begins.
```

Even the `plan` command tells Claude to "Use the Task tool in parallel" while simultaneously restricting its allowed tools to `Read`, `Write`, `Edit`, `Glob`, `Grep`, and `MultiEdit`, preventing it from launching additional agents. Taken together, the workflow runs as a single sequential agent that issues shell commands. The references to "parallel agents" are aspirational documentation, not functioning code.

## Conclusion

The budget-agentic-workflow repository markets automated token reductions and parallel multi-agent execution, but the inspected code only provides manual tracking utilities and sequential Claude instructions. Neither the advertised 90% token efficiency nor the parallel orchestration exists in the actual implementation.

## Remediation Strategy

The marketing claims can be made accurate by delivering two concrete capabilities: (1) automated token measurement and budgeting, and (2) orchestrated multi-agent execution with true parallelism. The following plan outlines a staged approach that keeps the "budget" ethos intact while aligning implementation with the promises.

### 1. Instrument Real Token Accounting

1. **Add API-facing usage collectors.** Wrap every LLM call (Claude, Gemini, and any auxiliary model) in a shared `recordUsage(provider, model, prompt, response)` helper that queries the provider's billing/usage endpoint (e.g., Claude's `/usage` API or OpenAI's `usage` field) and persists the actual prompt/completion tokens instead of asking the user to guess.
2. **Persist budgets and alerts centrally.** Replace the JSON file with a lightweight SQLite or Postgres table that stores daily and monthly budgets per provider, remaining tokens, and historical usage. Schedule a cron (or background job) that recalculates remaining budgets and sends Slack/email warnings when thresholds are crossed.
3. **Automate routing decisions.** Introduce a `TokenBudgetPlanner` service that decides, per task, whether to call Claude or route to a cheaper/free model (Gemini/Codex) based on remaining budget, latency targets, and confidence requirements. The planner can return a structured directive to the orchestrator (see below) so model selection is no longer manual copywriting in the README.

### 2. Deliver Actual Parallel Multi-Agent Orchestration

1. **Define agent roles and tool contracts.** Promote the existing slash-command instructions into explicit worker definitions (e.g., `Planner`, `Researcher`, `Coder`, `Reviewer`) with JSON tool schemas. Each agent should run in its own worker process so that multiple roles can execute concurrently.
2. **Implement a task queue.** Introduce a broker (Redis or a simple in-process priority queue for MVP) where the Planner enqueues sub-tasks with dependencies. Workers subscribe to task types and pull new work, enabling concurrent execution whenever dependencies allow.
3. **Add coordination primitives.** Build a lightweight orchestrator that tracks task DAG state, prevents conflicts via optimistic locking on shared files, and merges outputs when tasks complete. Include a "heartbeat" monitor so stalled workers can be reassigned, delivering the operational reliability implied by the README.

### 3. Roadmap & Rollout

| Milestone | Deliverables | Proof of Claim |
|-----------|--------------|----------------|
| **M1: Automated Usage MVP (2 weeks)** | Provider-specific usage collectors, budget DB, CLI dashboard, alerting hooks | Demo showing real token consumption logs and automatic budget enforcement |
| **M2: Parallel Agent Orchestrator (4 weeks)** | Worker processes, Redis queue, task DAG executor, end-to-end flow with two concurrent workers | Load test demonstrating overlapping agent execution and reduced wall-clock time |
| **M3: Intelligent Routing (3 weeks)** | TokenBudgetPlanner integrating usage data, routing policies, evaluation harness comparing cost vs. quality | Benchmark that validates 40–60% token reduction relative to all-Claude baseline |
| **M4: Production Hardening (2 weeks)** | Observability (metrics, traces), failure recovery, documentation updates, marketing copy revision | Public README reflects real capabilities with audited metrics |

Executing this roadmap converts the repository from aspirational documentation into an operationally sound workflow that measurably saves tokens and truly runs multiple agents in parallel.
