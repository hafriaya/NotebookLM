-- Enable vector extension for embeddings
create extension if not exists vector;

-- Create Study Materials Table
create table public.study_materials (
  id uuid default gen_random_uuid() primary key,
  user_id uuid, -- Loose reference to auth.users to allow Mock User ID
  title text not null,
  original_file_url text,
  processed_text_content text,
  created_at timestamp with time zone default now()
);

-- Create Document Sections Table (for RAG)
create table public.document_sections (
  id uuid default gen_random_uuid() primary key,
  material_id uuid references public.study_materials on delete cascade,
  content_chunk text not null,
  embedding vector(1536)
);

-- Create Exams Table
create table public.exams (
  id uuid default gen_random_uuid() primary key,
  user_id uuid, -- Loose reference
  material_source_id uuid references public.study_materials on delete set null,
  title text not null,
  difficulty text check (difficulty in ('Easy', 'Medium', 'Hard')),
  status text check (status in ('generating', 'ready', 'completed')),
  score integer,
  created_at timestamp with time zone default now(),
  user_answers jsonb -- For storing user submissions
);

-- Create Questions Table
create table public.questions (
  id uuid default gen_random_uuid() primary key,
  exam_id uuid references public.exams on delete cascade,
  question_text text not null,
  options jsonb, -- Array of strings or objects
  correct_answer text not null,
  explanation text,
  order_index integer
);

-- Profiles (Optional but good to have)
create table public.profiles (
  id uuid primary key, -- References auth.users
  full_name text,
  role text,
  created_at timestamp with time zone default now()
);

-- RLS Policies (Open for Dev - Secure later!)
alter table public.study_materials enable row level security;
alter table public.document_sections enable row level security;
alter table public.exams enable row level security;
alter table public.questions enable row level security;
alter table public.profiles enable row level security;

-- Policy: Allow all for now (simulating "public" access for dev)
create policy "Allow all access to study_materials" on public.study_materials for all using (true) with check (true);
create policy "Allow all access to document_sections" on public.document_sections for all using (true) with check (true);
create policy "Allow all access to exams" on public.exams for all using (true) with check (true);
create policy "Allow all access to questions" on public.questions for all using (true) with check (true);
create policy "Allow all access to profiles" on public.profiles for all using (true) with check (true);
