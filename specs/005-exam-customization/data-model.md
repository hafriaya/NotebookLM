# Data Model: Exam Customization

## Entity: Exam

Extends existing `exams` table.

### New Fields

| Field Name | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| `difficulty` | text (enum) | Yes | 'Medium' | 'Easy', 'Medium', 'Hard' |
| `exam_type` | text (enum) | Yes | 'Mixed' | 'Conceptual', 'Practical', 'Mixed' |
| `question_count` | integer | Yes | 10 | Number of questions generated |
| `custom_prompt` | text | No | NULL | User-provided instructions |

### Constraints

- `question_count` must be between 1 and 50.
- `difficulty` must be one of the allowed enum values.

## Database Migration (SQL)

```sql
ALTER TABLE exams 
ADD COLUMN difficulty text DEFAULT 'Medium',
ADD COLUMN exam_type text DEFAULT 'Mixed',
ADD COLUMN question_count integer DEFAULT 10,
ADD COLUMN custom_prompt text;
```
