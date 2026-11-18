# Every plan item is a move

18 November 2026 · Kate Hester

The product called the things on a person's plan three names: step (onboarding, most of Home), move (the Plan page's "Move 1 of 5") and action (a few lines on Home and the Signals page). It now says **move** everywhere the person sees one. The rule is in the Onboarding spec, decision 47.

## What changed on screen

| Where | Was | Now |
| --- | --- | --- |
| Onboarding, Your plan | Start your first step · 3 steps / 1 step | Start your first move · 3 moves / 1 move |
| Onboarding, plan picks | Your first step · a clearer first step | Your first move · a clearer first move |
| Onboarding, step bar | First step | First move |
| Home, next card | Your next step · A next step | Your next move · A next move |
| Home, rings | Four actions on your plan · Every short-term action is done · New actions come… | Four moves on your plan · Every short-term move is done · New moves come… |
| Plan page | Why this step? · Open this step · Your steps · Next action · Step from your plan | Why this move? · Open this move · Your moves · Next move · Move from your plan |
| Signals, momentum | plan steps · completed actions · actions done this month | plan moves · completed moves · moves done this month |
| Playbook | Your next step (after a draft) · a step on your plan · the first step on your plan | Your next move · a move on your plan · the first move on your plan |
| Advisor chat | Here’s your next step. · It’s your next step now. | Here’s your next move. · It’s your next move now. |
| Settings, notifications | a nudge when a step is due | a nudge when a move is due |

The advisor also understands "next move" when the person types it, as it understood "next step".

## What stays

- **Step** for moving through a flow: "Step 2 of 5" in a builder, "Send it in four steps", LinkedIn's export steps.
- **Step** in its career sense and as a figure of speech: "A promotion is the next step", "the first step toward a broader organization".
- **The Enterprise Dashboard** still says "planned actions" in its measures and statements. Not decided: to an employer, "planned moves" can read as people moving jobs.
- Code names (`ActionStep`, `stepId`, `?step=`) are unchanged; only the words on screen changed.
