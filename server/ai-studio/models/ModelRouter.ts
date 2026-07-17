import { AIProvider } from '../../agent-runtime/providers/AIProvider.js';
import { MockProvider } from '../../agent-runtime/providers/MockProvider.js';

export type ModelTier = 'fast' | 'balanced' | 'reasoning';

export class ModelRouter {
  private static providers: Record<ModelTier, AIProvider> = {
    fast: new MockProvider(),
    balanced: new MockProvider(),
    reasoning: new MockProvider(),
  };

  static route(tier: ModelTier): AIProvider {
    return this.providers[tier];
  }

  static selectTierForTask(estimatedComplexity: number): ModelTier {
    if (estimatedComplexity < 0.3) return 'fast';
    if (estimatedComplexity < 0.7) return 'balanced';
    return 'reasoning';
  }
}
