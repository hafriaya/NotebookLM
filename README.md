# Moraja3aAI - AI-Powered Exam Preparation Platform

Transform your study materials into personalized practice exams and flashcards with the power of AI.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![Google Gemini](https://img.shields.io/badge/Google-Gemini_AI-orange?style=for-the-badge&logo=google)

## 🎯 Features

### 📚 Smart Material Upload
- **PDF & Text Support** - Upload study materials in PDF or plain text format
- **Intelligent Text Extraction** - Automatically extracts content using `pdf2json`
- **Material Preview** - View extracted content before generating exams
- **Material Library** - Organize and reuse your study materials

### 🤖 AI-Powered Exam Generation
- **Google Gemini Integration** - Leverages Gemini 1.5 Flash for intelligent question generation
- **Customizable Difficulty** - Choose from Easy, Medium, or Hard difficulty levels
- **Question Types** - Multiple Choice, True/False, or Mixed question formats
- **Flexible Question Count** - Generate 5-50 questions per exam
- **Custom Prompts** - Advanced users can provide custom generation prompts

### ✍️ Interactive Exam Experience
- **Timer** - Configurable countdown timer with auto-submit
- **Question Navigation** - Jump between questions with progress tracking
- **Flag for Review** - Mark questions to revisit before submission
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### 📊 Results & Analytics
- **Detailed Score Breakdown** - See correct, incorrect, and skipped questions
- **Question Review** - Review each question with explanations
- **Exam Retake** - Regenerate exams with the same questions

### 🎴 Flashcard Generation
- **Auto-Generate from Exams** - Convert exam questions into flashcards
- **Interactive Study Mode** - Flip cards to reveal answers
- **Mastery Tracking** - Mark cards as Easy, Medium, or Hard

## 🚀 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **AI**: Google Gemini 1.5 Flash
- **PDF Parsing**: pdf2json

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Google Gemini API key

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/hafriaya/Moraja3aAI.git
cd Moraja3aAI
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key
```

4. **Set up the database**

Run the SQL schema in your Supabase project (located in `spec/database.sql`)

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📝 Usage

1. **Sign Up / Login** - Create an account or sign in
2. **Upload Study Material** - Upload a PDF or text file
3. **Preview Content** - Verify the extracted text
4. **Configure Exam** - Choose difficulty, type, and question count
5. **Generate Exam** - AI creates personalized questions
6. **Take Exam** - Answer questions with timer
7. **View Results** - See your score and review answers
8. **Generate Flashcards** - Convert exam to flashcards (optional)
9. **Study Flashcards** - Use spaced repetition for learning

## 🗄️ Database Schema

Core tables:
- **profiles** - User data and preferences
- **study_materials** - Uploaded files and extracted text
- **exams** - Exam metadata and configuration
- **questions** - Individual exam questions
- **flashcard_sets** - Flashcard collections
- **flashcards** - Individual flashcards with mastery tracking

See `spec/database.sql` for the complete schema.

## 🎨 Project Structure

```
app/
├── page.tsx                    # Landing page
├── dashboard/                  # Dashboard and materials
├── exam/[id]/                  # Exam interface and results
└── flashcards/[id]/           # Flashcard study

actions/
├── materials.ts               # File upload & management
├── exam.ts                    # Exam generation & submission
└── flashcards.ts              # Flashcard generation

lib/
├── gemini.ts                  # AI integration
└── supabase/                  # Database client
```

## 🐛 Known Issues & Fixes

### PDF Upload
- **Fixed**: Replaced `pdf-parse` with `pdf2json` for reliable Node.js PDF parsing
- **Fixed**: Resolved "fake worker" errors in Next.js/Webpack environment

### Results Page 404
- **Fixed**: Clear Next.js cache with `rm -rf .next` if routes don't load

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Google Gemini** - AI-powered question generation
- **Supabase** - Backend infrastructure
- **Next.js** - React framework
- **pdf2json** - PDF text extraction

---

**Built with ❤️ for students who want to study smarter, not harder.**
