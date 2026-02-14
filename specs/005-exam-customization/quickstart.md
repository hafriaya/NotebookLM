# Quickstart: Exam Customization

## Prerequisites

- Feature branch `005-exam-customization` checked out.
- Database migration applied (see `data-model.md`).

## Verification Steps

1.  **Open Dashboard**: navigate to `/dashboard/materials`.
2.  **Generate**: Click "Generate Test" on any material.
3.  **Configure**:
    -   Select Difficulty: "Hard".
    -   Select Type: "Practical".
    -   Set Count: 5.
    -   (Optional) Open Advanced, add "Focus on dates".
4.  **Submit**: Click "Generate".
5.  **Verify UI**:
    -   Exam page loads.
    -   Header shows "Difficulty: Hard".
6.  **Verify DB**:
    -   Check `exams` table for new columns.
