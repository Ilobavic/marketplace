---
name: README
model: inherit
is_background: true
---

# Custom Subagents

This project now defines a focused multi-agent workflow in `.cursor/agents/` for the React + FastAPI + Stripe stack used in LuxMarket.

## Core agents

- `planner`: intake, sequencing, delegation, and final merge
- `system-designer`: architecture, data flow, and implementation strategy
- `repo-architect`: folder structure, module placement, naming conventions, and cleanup strategy
- `frontend-builder`: React UI, state flow, routing, and styling work
- `backend-api`: FastAPI routes, validation, server-side integrations, and data handling
- `checkout-guardian`: Stripe checkout, return flows, webhook safety, and commerce edge cases
- `test-automation`: smoke tests, API tests, regression coverage, and verification plans
- `debugging`: root-cause analysis and focused defect repair
- `code-reviewer`: correctness, maintainability, security, and regression review
- `documentation`: setup docs, change notes, and operational guidance
- `ui-ux`: layout, interaction, accessibility, and responsive polish

## Supporting compatibility agent

- `code-generator`: general implementation fallback when work does not fit a more specific builder

## Recommended flow

1. `planner` scopes the request and selects the smallest useful set of specialists.
2. `system-designer` is used for non-trivial features, refactors, or integration changes.
3. `repo-architect` is used when files are drifting, folders feel messy, or a refactor needs a cleaner project layout.
4. Implementation is delegated to one or more of `frontend-builder`, `backend-api`, `checkout-guardian`, or `code-generator`.
5. `test-automation` verifies behavior and proposes missing regression coverage.
6. `debugging` is used when failures, flaky behavior, or unclear defects appear.
7. `code-reviewer` checks for bugs, quality issues, and production risks.
8. `documentation` updates setup notes or change guidance when behavior changes.
9. `ui-ux` is brought in for experience polish, accessibility, or responsive layout work.

## Practical usage notes

- Prefer specialist agents over `code-generator` when the task clearly belongs to frontend, backend, payments, or testing.
- Use `repo-architect` before large refactors, when adding new feature areas, or when the folder structure has become hard to scan.
- Use `checkout-guardian` whenever changes touch Stripe sessions, redirect URLs, webhooks, payment confirmation, or order state.
- Use `test-automation` before shipping changes that cross the frontend/backend boundary.
- Keep agent prompts explicit about scope, files, constraints, and definition of done.
