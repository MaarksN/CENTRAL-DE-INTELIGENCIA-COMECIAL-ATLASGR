import { StateGraph } from '@langchain/langgraph';
import { prisma } from '../../../lib/prisma.js';

const graphState = {
    input: {
        value: null,
    },
    output: {
        value: null,
    }
};

export class SDRAgent {
    async run(inputData: string, sessionId: string) {
        const graph = new StateGraph({ channels: graphState })
            .addNode("formatCall", async (state) => {
                return { output: `Formatted cold call for: ${state.input}` };
            })
            .addEdge("__start__", "formatCall")
            .addEdge("formatCall", "__end__");

        const compiled = graph.compile();
        const result = await compiled.invoke({ input: inputData });

        await this.updateMemory(sessionId, { input: inputData, output: result.output });

        return result;
    }

    private async updateMemory(sessionId: string, messages: any) {
        await prisma.agentMemory.create({
            data: {
                sessionId,
                agentType: 'SDR',
                messages
            }
        });
    }
}
