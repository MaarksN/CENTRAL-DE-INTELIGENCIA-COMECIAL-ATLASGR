import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6Kc3nAojxvAxWnG92t57yM8Y5eT6yl7Lc7ezI6N4nilaQ' });
const modelsToTest = [
    'gemini-flash-latest',
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash-lite-001',
    'gemini-2.0-flash-001'
];
async function run() {
    for (const m of modelsToTest) {
        try {
            console.log(`Testing ${m}...`);
            await ai.models.generateContent({
                model: m,
                contents: 'Hello'
            });
            console.log(`SUCCESS: ${m}`);
            break;
        } catch (e: any) {
            console.log(`FAILED: ${m} - ${e.message}`);
        }
    }
}
run();
