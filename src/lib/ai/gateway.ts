import { ChatOpenAI } from '@langchain/openai';

const LITELLM_URL = process.env.LITELLM_URL || 'http://localhost:4000/v1';
const LITELLM_KEY = process.env.LITELLM_KEY || 'sk-prospector-litellm-key';

export const getAiModel = (modelName: string = 'gemini-pro', temperature: number = 0.7) => {
    return new ChatOpenAI({
        modelName,
        temperature,
        openAIApiKey: LITELLM_KEY,
        configuration: {
            baseURL: LITELLM_URL,
        },
    });
};
