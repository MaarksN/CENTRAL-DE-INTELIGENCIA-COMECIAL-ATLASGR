import { describe, it, expect } from 'vitest';
import { MessageTemplateEngine } from '../../../../server/communication-hub/templates/MessageTemplateEngine.js';

describe('MessageTemplateEngine', () => {
  it('substitutes known variables', () => {
    expect(MessageTemplateEngine.render('Hi {{name}}, welcome to {{company}}!', { name: 'Ana', company: 'Atlas' })).toBe(
      'Hi Ana, welcome to Atlas!',
    );
  });

  it('leaves unknown placeholders untouched', () => {
    expect(MessageTemplateEngine.render('Hi {{name}}', {})).toBe('Hi {{name}}');
  });
});
