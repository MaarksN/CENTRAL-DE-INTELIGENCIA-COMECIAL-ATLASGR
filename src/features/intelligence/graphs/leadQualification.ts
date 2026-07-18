import { StateGraph, START, END, Annotation } from '@langchain/langgraph';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { getAiModel } from '../../../lib/ai/gateway.js';

// Define the state for the graph
const LeadQualificationState = Annotation.Root({
    leadId: Annotation<string>(),
    companyInfo: Annotation<string>(),
    qualificationScore: Annotation<number>(),
    summary: Annotation<string>(),
    status: Annotation<string>(),
});

export const leadQualificationGraph = new StateGraph(LeadQualificationState)
    .addNode('research', async (state) => {
        // Dummy research node for now - in reality, we would use Firecrawl or Serper
        return {
            companyInfo: `The company has been operating in the software industry for 5 years and shows strong growth potential.`,
        };
    })
    .addNode('analyze', async (state) => {
        const model = getAiModel('gemini-pro', 0.1);
        
        const response = await model.invoke([
            new SystemMessage("You are an expert Sales Development Representative. Your job is to analyze lead data and provide a qualification score from 0 to 100."),
            new HumanMessage(`Analyze this lead and company info: ${state.companyInfo}. Provide only a JSON response with keys: score (number) and summary (string).`)
        ]);

        try {
            // Very naive JSON parsing for demo purposes
            const jsonText = (response.content as string).replace(/```json/g, '').replace(/```/g, '').trim();
            const result = JSON.parse(jsonText);
            return {
                qualificationScore: result.score || 50,
                summary: result.summary || "No summary provided",
                status: result.score > 70 ? "QUALIFIED" : "UNQUALIFIED"
            };
        } catch (e) {
            return {
                qualificationScore: 50,
                summary: "Failed to parse AI response",
                status: "UNQUALIFIED"
            };
        }
    })
    .addEdge(START, 'research')
    .addEdge('research', 'analyze')
    .addEdge('analyze', END);

export const compileLeadGraph = () => leadQualificationGraph.compile();
