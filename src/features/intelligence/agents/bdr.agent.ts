import { StateGraph, Annotation, START, END } from '@langchain/langgraph';

const GraphState = Annotation.Root({
    input: Annotation<string>(),
    qualification: Annotation<string>(),
});

export class BDRAgent {
    async run(inputData: string) {
        const graph = new StateGraph(GraphState)
            .addNode("qualify", async (state) => {
                return { qualification: `Qualified: ${state.input}` };
            })
            .addEdge(START, "qualify")
            .addEdge("qualify", END);

        const compiled = graph.compile();
        const result = await compiled.invoke({ input: inputData });

        return result;
    }
}
