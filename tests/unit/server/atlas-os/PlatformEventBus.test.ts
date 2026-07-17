import { describe, it, expect, vi, afterEach } from 'vitest';
import { PlatformEventBus } from '../../../../server/atlas-os/eventbus/PlatformEventBus.js';
import { eventBus } from '../../../../server/services/workflow/bus/MemoryEventBus.js';

describe('PlatformEventBus', () => {
  afterEach(() => vi.restoreAllMocks());

  it('broadcast() delegates to the underlying workflow event bus', async () => {
    const publishSpy = vi.spyOn(eventBus, 'publish').mockResolvedValue('evt-1');

    const id = await PlatformEventBus.broadcast('atlas_os.module.registered', 'AtlasOS', { moduleId: 'mod-1' });

    expect(id).toBe('evt-1');
    expect(publishSpy).toHaveBeenCalledWith({
      eventType: 'atlas_os.module.registered',
      source: 'AtlasOS',
      payload: { moduleId: 'mod-1' },
    });
  });
});
