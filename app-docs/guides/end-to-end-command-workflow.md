# End-to-End Command Workflow

The Budget Agentic Workflow now orients every slash command around the three core personas involved in delivering and running a product: product strategy, developer delivery, and operations/support. Use this guide to understand how the commands chain together from the very first discovery conversation to ongoing support.

## 1. Product Strategy Track
| Step | Command | What It Produces | Typical Next Step |
| --- | --- | --- | --- |
| Define the charter | `/baw_product_charter "<product>"` | Personas, value prop, success metrics, discovery gaps | `/baw_product_features` or `/baw_product_helper` |
| Catalog the core features | `/baw_product_features "<product>"` | Priority-ranked feature catalog with dependencies | `/baw_dev_dependency_plan` or `/baw_product_wishlist` |
| Capture stretch ideas | `/baw_product_wishlist "<product>"` | Deferred scope with activation signals | `/baw_product_helper` or `/baw_workflow_radar` |
| Close research gaps | `/baw_product_helper "<topic>"` | Curated research summary with citations | Feeds back into charter, features, or wishlist |

All outputs save workflow status JSON using the `product-charter`, `feature-catalog`, `wishlist`, or `product-research` phases. Documentation lives under `app-docs/` and `ai-docs/workflow/features/<feature-id>/`.

## 2. Developer Delivery Track
| Step | Command | What It Produces | Typical Next Step |
| --- | --- | --- | --- |
| Sequence the roadmap | `/baw_dev_dependency_plan "<initiative>"` | Dependency-ordered milestones with entry/exit criteria | `/baw_dev_breakout_plan` |
| Shape sprint-sized work | `/baw_dev_breakout_plan "<phase>"` | Breakout plan(s) with acceptance criteria | `/baw_dev_execution_prep` |
| Gather task specs | `/baw_dev_execution_prep "<task>"` | Checklist of docs, owners, and validations | `/baw_dev_discovery`, `/baw_dev_build`, or `/baw_dev_test_matrix` |
| Plan validation | `/baw_dev_test_matrix "<release>"` | Test matrix across dev/staging/prod | `/baw_dev_test`, `/baw_uat`, `/baw_dev_deploy_plan` |
| Prepare deployment | `/baw_dev_deploy_plan "<release>"` | Release checklist with rollback strategy | `/baw_dev_deploy_staging`, `/baw_dev_release`, `/baw_workflow_radar` |

The original commands (`/baw_dev_discovery`, `/baw_dev_plan`, `/baw_dev_build`, `/baw_dev_test`, `/baw_dev_deploy_staging`, `/baw_dev_release`, etc.) remain available and are referenced as follow-ups inside these planning steps. Each command emits workflow status JSON with phases like `dependency-plan`, `breakout-plan`, `execution-prep`, `verification`, and `deployment`.

## 3. Operations & Support Track
| Step | Command | What It Produces | Typical Next Step |
| --- | --- | --- | --- |
| Summarize initiative health | `/baw_workflow_radar "<initiative>"` | Persona-based backlog of blockers, missing docs, and KPIs | Drives `/baw_dev_execution_prep`, `/baw_product_helper`, `/baw_support_ticket` |
| Define provider/admin functions | `/baw_provider_functions "<product>"` | Operational workflows, permissions, and analytics needs | `/baw_dev_execution_prep`, `/baw_workflow_radar` |
| Convert feedback into action | `/baw_support_ticket "<queue>"` | Prioritized backlog of fixes, data work, or enhancements | `/baw_triage_bug`, `/baw_workflow_radar`, `/baw_product_wishlist` |

Support-focused commands save workflow status JSON with `ops-coordination`, `provider-functions`, and `support-feedback` phases so the dashboard can surface outstanding work for non-engineering stakeholders.

## 4. Keeping Everything in Sync
1. After any command completes, run `npm run baw:workflow:sync` so the aggregated `status-index.json` stays fresh.
2. Use `npm run baw:work` for a quick CLI dashboard, or `/baw_workflow_radar` for a richer persona view.
3. When discovery introduces new decisions, update or append the relevant docs under `app-docs/` and log the decision in the knowledge ledger (`ai-docs/knowledge-ledger/`).
4. Each command suggests the ideal follow-up so you can stay inside the automation loop without guessing.

Follow this sequence and the workflow keeps context organized from ideation through production support without losing traceability.
