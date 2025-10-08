description: Prepare for a new task by gathering context and priming the AI.
argument-hint: [user_prompt]
model: claude-sonnet-4-5

# Prepare for Task

## Purpose
Run a sequence of commands to gather context and prime the AI before starting a new task.

## Variables
USER_PROMPT: $1

## Workflow
1. Run SlashCommand(`/background "[USER_PROMPT]"`)
2. Run SlashCommand(`/load_ai_docs "[USER_PROMPT]"`)
3. Run SlashCommand(`/prime_cc`)

## Report
- Summarize the information gathered from the `/background`, `/load_ai_docs`, and `/prime_cc` commands.
