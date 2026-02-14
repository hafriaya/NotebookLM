import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface GeneratedQuestion {
    question_text: string;
    options: string[];
    correct_answer: string;
    explanation: string;
}

export async function generateExamQuestions(
    contextText: string,
    count: number = 10,
    difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium',
    examType: 'Conceptual' | 'Practical' | 'Mixed' = 'Mixed',
    customPrompt?: string,
    materialTitle?: string // Add Material Title
): Promise<GeneratedQuestion[]> {
    if (!genAI) {
        console.warn("GOOGLE_GENERATIVE_AI_API_KEY is missing. Falling back to Mock AI.");
        throw new Error("Google Gemini API Key is missing in .env.local");
    }

    // 1. Validate Context
    if (!contextText || contextText.length < 50 || contextText.includes("Failed to extract content")) {
        throw new Error("Insufficient content to generate exam. The document content is too short or failed to process.")
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Truncate context if too long
    const truncatedContext = contextText.slice(0, 30000);
    const titleContext = materialTitle ? `Document Title: "${materialTitle}"` : "the provided text";

    const prompt = `
    You are a strict, technical university professor creating a final exam based on ${titleContext}.
    The goal is to test DEEP UNDERSTANDING of the subject matter.
    
    CRITICAL INSTRUCTIONS:
    1. Questions must be based ONLY on the provided text overlaying ${titleContext}.
    2. **DO NOT start questions with "Based on the provided text" or "According to the document".** 
       Instead, directly reference the subject (e.g., "In the context of [Subject]...", "What is the primary function of [Concept]...", "How does [Author/Person] describe...").
    3. Difficulty Level: ${difficulty.toUpperCase()}.
       - Easy: Basic recall of facts.
       - Medium: Application of concepts or comparing ideas.
       - Hard: Complex analysis / synthesis.
    4. Exam Type: ${examType.toUpperCase()}.
       - Conceptual: Focus on definitions, theories, and "what is" questions.
       - Practical: Focus on scenarios, "how to", and application of knowledge.
       - Mixed: A balance of both.
    5. Options should be plausible. The correct answer must be unambiguous.
    ${customPrompt ? `6. CUSTOM INSTRUCTOR NOTES: ${customPrompt}` : ''}

    Generate ${count} multiple-choice questions.

    The output MUST be a valid JSON array of objects.
    Each object must have this exact structure:
    {
        "question_text": "The technical question stem",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": "The distinct text of the correct option (must match one of the options exactly)",
        "explanation": "Quote the specific sentence from the text that supports this answer."
    }

    Text Content:
    "${truncatedContext}"

    Return ONLY the JSON array. No markdown formatting like \`\`\`json.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown if Gemini adds it despite instructions
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const questions: GeneratedQuestion[] = JSON.parse(cleanText);

        // Basic validation
        if (!Array.isArray(questions)) {
            throw new Error("AI response was not an array");
        }

        return questions.slice(0, count); // Ensure we don't get more than requested
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        throw new Error("Failed to generate questions with Google Gemini");
    }
}

export interface GeneratedFlashcard {
    front: string;
    back: string;
}

export async function generateFlashcardsFromText(
    contextText: string,
    count: number = 10
): Promise<GeneratedFlashcard[]> {
    if (!genAI) {
        console.warn("GOOGLE_GENERATIVE_AI_API_KEY is missing.");
        throw new Error("Google Gemini API Key is missing");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const truncatedContext = contextText.slice(0, 30000);

    const prompt = `
    You are an expert tutor creating study flashcards.
    Based strictly on the following text, generate ${count} flashcards.

    CRITICAL INSTRUCTIONS:
    1. Focus on key terms, definitions, and core concepts found in the text.
    2. 'Front' should be a term or a question.
    3. 'Back' should be the definition or answer, concise (under 20 words).

    The output MUST be a valid JSON array of objects.
    Structure:
    {
        "front": "Term / Question",
        "back": "Definition / Answer"
    }

    Text:
    "${truncatedContext}"

    Return ONLY the JSON array.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const cards: GeneratedFlashcard[] = JSON.parse(cleanText);

        if (!Array.isArray(cards)) throw new Error("AI response was not an array");
        return cards.slice(0, count);
    } catch (error) {
        console.error("Gemini Flashcard Error:", error);
        throw new Error("Failed to generate flashcards with Google Gemini");
    }
}
