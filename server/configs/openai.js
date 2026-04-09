import { OpenAI } from "openai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is not defined in environment variables!");
}

const openai = new OpenAI({
    apiKey: apiKey || 'missing-key', // Ensure it doesn't crash during construction
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    dangerouslyAllowBrowser: false
});

export default openai;
