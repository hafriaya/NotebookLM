# Implementation Tasks: Moraja3aAI MVP

**Feature**: Initialize Database & Core Features (from `specs/001-database-schema`)
**Status**: In Progress

## Dependencies

- Phase 1 (Foundation) MUST be complete before Phase 2.
- Phase 2 (RAG) MUST be complete before Phase 3.
- Phase 3 (Exam Engine) MUST be complete before Phase 4.

## Phase 1: Foundation & Type Safety (Completed)

Goal: Initialize project structure and type safety.

- [x] T001 Initialize Next.js 14 project with Tailwind & TypeScript
- [x] T002 Install `@supabase/supabase-js` and `@supabase/ssr`
- [x] T003 Create `types/supabase.ts` with database definitions
- [x] T004 Create `types/index.ts` with global type helpers

## Phase 2: RAG Pipeline [US2]

Goal: Enable users to upload study materials and generate vector embeddings.
**Independent Test**: Upload a file and verify chunks/embeddings in `document_sections` table.

- [x] T005 [US2] Create `components/upload/FileUploader.tsx` (UI Component)
- [x] T006 [US2] Create `actions/materials.ts` with skeleton `uploadMaterial` function
- [x] T007 [US2] Implement file handling and storage upload in `uploadMaterial`
- [x] T008 [US2] Implement text parsing and chunking logic in `uploadMaterial`
- [x] T009 [US2] Implement OpenAI embedding generation in `uploadMaterial`
- [x] T010 [US2] Implement database insertion for materials and embeddings in `uploadMaterial`

## Phase 3: Exam Engine [US3]

Goal: Generate questions from materials and provide exam interface.
**Independent Test**: Generate an exam from a material and verify questions in DB.

- [x] T011 [US3] Create `actions/exam.ts` with skeleton `generateExam` function
- [x] T012 [US3] Implement vector similarity search in `generateExam`
- [x] T013 [US3] Implement OpenAI prompt for question generation in `generateExam`
- [x] T014 [US3] Implement exam and question insertion in `generateExam`
- [x] T015 [US3] Create `app/exam/[id]/page.tsx` with exam wizard UI

## Phase 4: Results & Dashboard [US4]

Goal: Score exams and display visualization.
**Independent Test**: Submit an exam and verify score calculation and status update.

- [x] T016 [US4] Create `submitExam` server action in `actions/exam.ts`
- [x] T017 [US4] Implement scoring logic and status update in `submitExam`
- [x] T018 [US4] Create `app/dashboard/page.tsx` with performance charts

## Implementation Strategy

- Follow strict type safety using `types/supabase.ts`.
- Use Server Actions for all data mutations.
- Ensure RLS policies are respected (already enabled in DB).
