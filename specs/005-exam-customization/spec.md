# Feature Specification: Exam Customization

**Feature Branch**: `005-exam-customization`
**Created**: 2026-02-14
**Status**: Draft
**Input**: User description: "Refine exam generation with parameters and custom prompt"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure Exam Parameters (Priority: P1)

As a student, I want to configure specific parameters for my practice exam (difficulty, type, question count) so that the generated questions are relevant to my current study needs and skill level.

**Why this priority**: High. Currently, exams are generated without user control, leading to inconsistent quality and difficulty mismatches. This is the core value of the "smart" exam feature.

**Independent Test**: Can be tested by generating two exams with different settings (e.g., "Beginner" vs "Advanced") and verifying the difference in content complexity.

**Acceptance Scenarios**:

1. **Given** I am on the dashboard or material page, **When** I click "Generate Exam", **Then** a configuration modal/form appears instead of immediate generation.
2. **Given** the configuration form, **When** I select "Hard" difficulty and "20" questions, **Then** the generated exam contains 20 questions of high complexity.
3. **Given** the form, **When** I select "Practical/Scenario-based" as the exam type, **Then** the questions focus on applying concepts rather than just definitions.

---

### User Story 2 - Advanced Custom Prompts (Priority: P2)

As an advanced learner, I want to provide custom instructions to the AI (e.g., "Focus on legal dates", "Ask only about specific case studies") so that I can drill down into very specific areas or testing styles.

**Why this priority**: Medium. Adds significant flexibility for power users who know exactly what they want to practice, covering edge cases the standard form might miss.

**Independent Test**: Can be tested by adding a specific instruction like "Include only True/False questions" (if supported) or "Focus on Chapter 3" and verifying the output adheres to it.

**Acceptance Scenarios**:

1. **Given** the configuration form, **When** I expand the "Advanced Options" section, **Then** I see a "Custom Instructions" text area.
2. **Given** I enter "Focus exclusively on numerical values and statistics", **When** I generate the exam, **Then** the resulting questions predominantly test data and numbers from the material.

---

### Edge Cases

- **Contradictory Instructions**: If a user selects "Easy" difficulty but writes "Make the questions extremely difficult" in the custom prompt, the custom prompt instruction should take precedence as it is more specific.
- **Empty Custom Prompt**: The system handles an empty custom prompt gracefully by simply omitting that section from the LLM instructions.
- **Malicious/Nonsense Input**: If the custom prompt contains gibberish or attempts to jailbreak the LLM, the standard AI safety filters (if any) or simply the confusion of the model will apply; no specific UI validation beyond length is required for MVP.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present an exam configuration form before generating a new exam.
- **FR-002**: The form MUST allow selection of **Difficulty Level** (options: Easy, Medium, Hard).
- **FR-003**: The form MUST allow selection of **Question Count** (options: 5, 10, 15, 20; default: 10).
- **FR-004**: The form MUST allow selection of **Exam Type** (options: Conceptual/Theoretical, Practical/Applied, Mixed).
- **FR-005**: The form MUST provide an **Advanced Options** section (collapsible by default).
- **FR-006**: The Advanced Options section MUST include a **Custom Prompt** text area (max 500 characters).
- **FR-007**: The system MUST construct the LLM prompt using ALL selected parameters (Difficulty, Type, Count) and append the Custom Prompt instructions if provided.
- **FR-008**: The system MUST persist the selected "Difficulty" and "Type" as metadata for the generated exam (for history/analytics purposes).

### Key Entities

- **ExamConfiguration**:
    - `difficulty`: enum (Easy, Medium, Hard)
    - `question_count`: integer
    - `exam_type`: enum (Conceptual, Practical, Mixed)
    - `custom_prompt`: string (optional)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: generated exams with "Hard" difficulty have a measurably higher complexity (longer question text, more complex options) than "Easy" exams.
- **SC-002**: Users can successfully generate a "Practical" exam where >70% of questions involve a scenario or application of knowledge (verified by manual review of sample set).
- **SC-003**: 95% of generated exams adhere to the requested "Question Count" exactly.
