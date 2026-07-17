import { ITool, ToolManifest } from '../Tool.js';
import { RetrievalEngine } from '../../../knowledge/retrieval/RetrievalEngine.js';

export class KnowledgeSearchTool implements ITool {
  manifest: ToolManifest = {
    name: 'KnowledgeSearchTool',
    description: 'Buscador oficial corporativo (RAG). Todo o agente deve consultar isso.',
    version: '1.0.0',
    parametersSchema: {}
  };

  private engine = new RetrievalEngine();

  async execute(params: any, context: any): Promise<any> {
    const results = await this.engine.search(params.query, params.limit || 5);
    return {
      source: 'Enterprise Knowledge Base',
      results
    };
  }
}
