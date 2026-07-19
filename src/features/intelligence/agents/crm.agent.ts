import { StateGraph, Annotation, START, END } from '@langchain/langgraph';

const GraphState = Annotation.Root({
    input: Annotation<string>(),
    action: Annotation<string>(),
});

export class CRMAgent {
    async run(inputData: string) {
        const graph = new StateGraph(GraphState)
            .addNode("updateStatus", async (state) => {
                return { action: `Status updated for: ${state.input}` };
            })
            .addEdge(START, "updateStatus")
            .addEdge("updateStatus", END);

        const compiled = graph.compile();
        const result = await compiled.invoke({ input: inputData });

        return result;
    }
}
