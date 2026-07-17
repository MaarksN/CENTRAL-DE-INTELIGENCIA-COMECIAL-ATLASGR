import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6Kc3nAojxvAxWnG92t57yM8Y5eT6yl7Lc7ezI6N4nilaQ' });
async function run() {
    try {
        const response = await ai.models.list();
        for await (const m of response) {
            console.log(m.name);
        }
    } catch (e) {
        console.error(e);
    }
}
run();
