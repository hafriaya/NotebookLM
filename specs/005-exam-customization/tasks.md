# Tasks: Exam Customization

**Feature**: Exam Customization (`005`)
**Status**: Pending

## Dependencies

- **US1** (Parameters) must be completed before **US2** (Custom Prompts) can be fully integrated (though they share the same form).
- Database migration (Phase 2) is a blocker for all.

## Implementation Strategy

We will implement this by expanding the `CreateTestModal` to be a configuration form. We'll start by ensuring the database can store the new metadata, then build the UI controls for US1, and finally add the collapsible advanced section for US2.

---

## Phase 1: Setup

- [x] T001 Checkout feature branch `005-exam-customization` (if not already)

## Phase 2: Foundational

*Goal: Ensure database schema supports new exam properties.*

- [x] T002 Execute SQL migration from `data-model.md` to add `difficulty`, `exam_type`, `question_count`, `custom_prompt` to `exams` table via Supabase SQL Editor or migration tool.

## Phase 3: Configure Exam Parameters (US1)

*Goal: User can select Difficulty, Type, and Question Count.*

- [x] T003 [US1] Update `components/CreateTestModal.tsx` to add local state for `difficulty`, `examType`, and `questionCount`.
- [x] T004 [US1] Update `components/CreateTestModal.tsx` UI to replace the simple "Generate" button with a form containing:
    -   Select: Difficulty (Easy, Medium, Hard)
    -   Select: Type (Conceptual, Practical, Mixed)
    -   Select: Question Count (5, 10, 15, 20)
- [x] T005 [US1] Update `actions/exam.ts` `generateExam` signature to accept `ExamConfiguration` object (or individual params).
- [x] T006 [US1] Update `actions/exam.ts` to insert the selected parameters into the `exams` table during creation.
- [x] T007 [US1] Refactor `lib/gemini.ts` (or existing prompt logic in `actions/exam.ts`) to dynamically construct the system prompt based on `difficulty`, `type`, and `count`.
- [x] T008 [US1] Connect `CreateTestModal.tsx` submit handler to pass the new state values to `generateExam`.

## Phase 4: Advanced Custom Prompts (US2)

*Goal: Advanced users can provide specific instructions.*

- [x] T009 [US2] Update `components/CreateTestModal.tsx` to add a collapsible `<details>` or state-managed "Advanced Options" section.
- [x] T010 [US2] Add a `textarea` for `customPrompt` within the advanced section.
- [x] T011 [US2] Update `actions/exam.ts` `generateExam` to accept and save `customPrompt`.
- [x] T012 [US2] Update Prompt Logic in `actions/exam.ts` to append the `customPrompt` to the LLM instructions if provided.

## Phase 5: Polish & Verification

- [x] T013 Verify that the `exams` table correctly stores all new metadata after generation.
- [x] T014 Verify that "Hard" exams actually generate more complex questions (manual spot check).
- [x] T015 Verify that `question_count` is respected by the LLM (Prompt adherence check).
