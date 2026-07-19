import { StateGraph, Annotation, START, END } from '@langchain/langgraph';
import { prisma } from '../../../lib/prisma.js';

const GraphState = Annotation.Root({
    input: Annotation<string>(),
    output: Annotation<string>(),
});

export class SDRAgent {
    async run(inputData: string, sessionId: string) {
        const graph = new StateGraph(GraphState)
            .addNode("formatCall", async (state) => {
                return { output: `Formatted cold call for: ${state.input}` };
            })
            .addEdge(START, "formatCall")
            .addEdge("formatCall", END);

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
