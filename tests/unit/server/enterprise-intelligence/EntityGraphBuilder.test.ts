import { describe, it, expect } from 'vitest';
import { EntityGraphBuilder } from '../../../../server/enterprise-intelligence/graph/EntityGraphBuilder.js';

describe('EntityGraphBuilder', () => {
  it('drops edges referencing nodes that are not present', () => {
    const graph = EntityGraphBuilder.build(
      [{ id: 'acc-1', type: 'account' }],
      [{ from: 'acc-1', to: 'contact-missing', relation: 'employs' }],
    );
    expect(graph.edges).toHaveLength(0);
  });

  it('keeps edges whose endpoints both exist', () => {
    const graph = EntityGraphBuilder.build(
      [
        { id: 'acc-1', type: 'account' },
        { id: 'contact-1', type: 'contact' },
      ],
      [{ from: 'acc-1', to: 'contact-1', relation: 'employs' }],
    );
    expect(graph.edges).toHaveLength(1);
  });
});
