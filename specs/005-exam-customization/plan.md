# Implementation Plan: Exam Customization

**Branch**: `005-exam-customization` | **Date**: 2026-02-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-exam-customization/spec.md`

## Summary

Implement user-configurable parameters for exam generation (Difficulty, Type, Count) and an advanced custom prompt option. This involves updating the UI to include a configuration form and modifying the `generateExam` server action to incorporate these parameters into the LLM prompt.

## Technical Context

**Language/Version**: TypeScript, Next.js 16 (App Router)
**Primary Dependencies**: Supabase (DB, Auth), Google Generative AI (SDK), TailwindCSS
**Storage**: Supabase PostgreSQL
**Testing**: Manual Verification (current project standard)
**Target Platform**: Web
**Project Type**: Web Application
**Performance Goals**: Exam generation < 15s
**Constraints**: LLM prompt length limits (manage custom prompt size)
**Scale/Scope**: Feature limited to "Generate Exam" flow

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Core Principles**: Feature adheres to "Simplicity" (using existing server actions) and "User-First" (addressing P1 user story).
- **Governance**: No specific project constitution found (using template). Standard web app best practices apply.

## Project Structure

### Documentation (this feature)

```text
specs/005-exam-customization/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code

```text
app/
├── dashboard/
│   └── materials/      # UI for triggering generation
├── api/                # (If needed, likely using server actions instead)

components/
├── CreateTestModal.tsx # UPDATE: Add configuration form here

actions/
├── exam.ts             # UPDATE: modify generateExam signature
```

**Structure Decision**: enhance existing `CreateTestModal` and `exam.ts` action.

## Complexity Tracking

N/A - Standard CRUD + LLM integration.
