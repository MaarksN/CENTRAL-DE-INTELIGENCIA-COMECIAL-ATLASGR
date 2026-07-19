import { StateGraph } from '@langchain/langgraph';

const graphState = {
    input: {
        value: null,
    },
    action: {
        value: null,
    }
};

export class CRMAgent {
    async run(inputData: string) {
        const graph = new StateGraph({ channels: graphState })
            .addNode("updateStatus", async (state) => {
                return { action: `Status updated for: ${state.input}` };
            })
            .addEdge("__start__", "updateStatus")
            .addEdge("updateStatus", "__end__");

        const compiled = graph.compile();
        const result = await compiled.invoke({ input: inputData });

        return result;
    }
}
