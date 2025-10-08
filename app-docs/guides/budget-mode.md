# Budget Mode Workflow

Budget Mode keeps the multi-agent pipeline affordable when you live on the $20 Claude plan, $20 ChatGPT plan, and Gemini free tier. Use it whenever you are touching one or two files, applying documentation updates, or iterating on an existing feature.

## When To Enable
- Small deltas or follow-up fixes (e.g., lint cleanups, copy edits, quick bug fixes).
- Iterating on a feature that already has a plan in `ai-docs/`.
- Any task where the scout output is obvious and you already know the target files.

## How To Run
```bash
# Minimal run: scout with reduced scale, concise plan
/scout_plan_build "<prompt>" "" "budget"
```
- Scout drops to scale 2 and appends `[BUDGET MODE]` so down-stream agents keep their responses short.
- The plan command limits itself to a ~350-word summary with four key steps.
- Generator, Researcher, and Coordinator agents already understand `budget=true` and will avoid unnecessary tests, refactors, or follow-up requests.

## Manual Tips
- Reuse previous plans stored in `ai-docs/` rather than rerunning the full workflow.
- Cap `npm run search` with `--limit=3`; expand only if you fail to find the right doc.
- Prefer Gemini or local shell tools for reconnaissance, then switch to Claude or GPT for final reasoning.
- If the work ever exceeds three files or requires new architecture decisions, exit Budget Mode and run the standard pipeline.

Budget Mode is about keeping velocity high without blowing through tokens—flip it on by default and opt into the heavier loop only when the task truly demands it.
