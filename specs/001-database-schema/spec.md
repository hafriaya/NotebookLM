# Feature Specification: Initialize Database Specification

**Feature Branch**: `001-database-schema`
**Created**: 2026-02-13
**Status**: Draft
**Input**: User description: "Initialize Database Specification"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - System Initialization (Priority: P1)

The system needs a foundational database structure to support user profiles, content management, and exam generation.

**Why this priority**: Without the database schema, no other features can be built.

**Independent Test**: Can be fully tested by running the SQL script against a Supabase instance and verifying table creation.

**Acceptance Scenarios**:

1. **Given** a fresh Supabase project, **When** the `database.sql` script is executed, **Then** all specified tables (profiles, study_materials, document_sections, exams, questions) are created successfully.
2. **Given** the database is set up, **When** checking extensions, **Then** the `vector` extension is enabled.
3. **Given** the tables are created, **When** checking security settings, **Then** RLS is enabled for profiles, study_materials, and exams.

### User Story 2 - RAG Support (Priority: P1)

The system must support Vector Search to enable Retrieval Augmented Generation (RAG) for exam creation.

**Why this priority**: Core value proposition of Moraja3aAI.

**Independent Test**: Verify the `document_sections` table has a vector column of dimension 1536.

**Acceptance Scenarios**:

1. **Given** the `document_sections` table, **When** inspecting the `embedding` column, **Then** it should be of type `vector(1536)`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST enable the `vector` extension for AI RAG.
- **FR-002**: System MUST have a `profiles` table linked to `auth.users` with `full_name` and `role` (student/teacher).
- **FR-003**: System MUST have a `study_materials` table to store metadata and extracted text from uploaded files.
- **FR-004**: System MUST have a `document_sections` table to store text chunks and 1536-dimensional vector embeddings, linked to study materials.
- **FR-005**: System MUST have an `exams` table to track exam generation status, difficulty, and scores.
- **FR-006**: System MUST have a `questions` table linked to exams, supporting JSONB options and correct answers.
- **FR-007**: System MUST enable Row Level Security (RLS) on `profiles`, `study_materials`, and `exams` tables.

### Key Entities

- **Profiles**: Extended user data linked to authentication.
- **Study Materials**: Source documents uploaded by users for generating exams.
- **Document Sections**: Checkable parts of study materials with vector embeddings for search.
- **Exams**: A session where a user takes a test based on a study material.
- **Questions**: Individual test items generated from the study material.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: SQL script executes without errors on a standard Supabase PostgreSQL instance.
- **SC-002**: Database schema supports 100% of the defined entities and relationships.
- **SC-003**: Vector embeddings storage is compatible with OpenAI's `text-embedding-3-small` model (1536 dimensions).
