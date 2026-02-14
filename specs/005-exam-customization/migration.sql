ALTER TABLE exams 
ADD COLUMN if not exists difficulty text DEFAULT 'Medium';

ALTER TABLE exams
ADD COLUMN if not exists exam_type text DEFAULT 'Mixed';

ALTER TABLE exams
ADD COLUMN if not exists question_count integer DEFAULT 10;

ALTER TABLE exams
ADD COLUMN if not exists custom_prompt text;
