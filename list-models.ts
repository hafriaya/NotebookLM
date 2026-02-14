
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
    console.error("API Key missing!");
    process.exit(1);
}

async function listModelsDirectly() {
    console.log("Fetching models via REST API...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`HTTP Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error("Response body:", text);
            return;
        }
        const data = await response.json();
        console.log("Supported Models:");
        if (data.models) {
            const names = data.models
                .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
                .map((m: any) => m.name.replace('models/', ''));
            console.log(names.join('\n'));
        } else {
            console.log("No models found in response:", data);
        }
    } catch (error) {
        console.error("Fetch request failed:", error);
    }
}

listModelsDirectly();
