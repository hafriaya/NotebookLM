# Research Findings: Exam Customization

**Feature**: Exam Customization (`005`)

## Unknowns & Decisions

### 1. Prompt Engineering for Parameters
- **Unknown**: How to best format the prompt to ensure the LLM respects "Difficulty" and "Type"?
- **Decision**: Use explicit system instructions in the prompt template.
    - Example: "You are an expert tutor. Generate a {difficulty} {type} exam with {count} questions."
    - Rationale: Direct instruction is effective for current Gemini models.
- **Alternatives**: Fine-tuning (overkill/expensive), Few-shot prompting (good, but context window might be tight with large material content).

### 2. Form UI State
- **Unknown**: How to manage the form state (steps vs single page)?
- **Decision**: Single modal with default collapsed "Advanced" section.
    - Rationale: Reduces friction. Most users just want to click "Generate".
    - Alternatives: Multi-step wizard (too slow).

### 3. Metadata Persistence
- **Unknown**: Where to store the exam settings?
- **Decision**: Add columns to `exams` table (`difficulty`, `type`, `question_count`).
    - Rationale: Allows for future analytics (e.g., "Performance on Hard exams").

## Conclusion

No significant technical blockers. Proceed to Design.
