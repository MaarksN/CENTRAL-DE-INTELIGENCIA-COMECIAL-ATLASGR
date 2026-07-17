import { describe, it, expect } from 'vitest';
import { UnifiedInbox } from '../../../../server/communication-hub/inbox/UnifiedInbox.js';

describe('UnifiedInbox', () => {
  it('returns threads with channel and unread metadata', async () => {
    const threads = await UnifiedInbox.getThreads('tenant-1');
    expect(threads.length).toBeGreaterThan(0);
    expect(threads[0]).toHaveProperty('channel');
    expect(threads[0]).toHaveProperty('unread');
  });
});
