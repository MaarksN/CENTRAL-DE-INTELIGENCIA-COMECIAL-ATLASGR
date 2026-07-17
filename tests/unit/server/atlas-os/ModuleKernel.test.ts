import { describe, it, expect } from 'vitest';
import { ModuleKernel } from '../../../../server/atlas-os/kernel/ModuleKernel.js';

describe('ModuleKernel', () => {
  it('registers a module and lists it as active', () => {
    ModuleKernel.register({ id: 'mod-1', name: 'Test Module', version: '1.0.0', status: 'active' });
    expect(ModuleKernel.list().find((m) => m.id === 'mod-1')?.status).toBe('active');
  });

  it('disable() flips a registered module to disabled', () => {
    ModuleKernel.register({ id: 'mod-2', name: 'Test Module 2', version: '1.0.0', status: 'active' });
    ModuleKernel.disable('mod-2');
    expect(ModuleKernel.list().find((m) => m.id === 'mod-2')?.status).toBe('disabled');
  });

  it('disable() is a no-op for an unregistered module id', () => {
    expect(() => ModuleKernel.disable('does-not-exist')).not.toThrow();
  });
});
