import { StateGraph } from '@langchain/langgraph';

const graphState = {
    input: {
        value: null,
    },
    qualification: {
        value: null,
    }
};

export class BDRAgent {
    async run(inputData: string) {
        const graph = new StateGraph({ channels: graphState })
            .addNode("qualify", async (state) => {
                return { qualification: `Qualified: ${state.input}` };
            })
            .addEdge("__start__", "qualify")
            .addEdge("qualify", "__end__");

        const compiled = graph.compile();
        const result = await compiled.invoke({ input: inputData });

        return result;
    }
}
