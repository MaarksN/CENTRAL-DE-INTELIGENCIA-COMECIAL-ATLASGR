import { describe, it, expect } from 'vitest';
import { OSAppLauncher } from '../../../../server/atlas-os/marketplace-bridge/OSAppLauncher.js';
import { ModuleKernel } from '../../../../server/atlas-os/kernel/ModuleKernel.js';

describe('OSAppLauncher', () => {
  it('launches a known marketplace app and registers it in the module kernel', () => {
    const result = OSAppLauncher.launch('app-forecast-plus');
    expect(result.launched).toBe(true);
    expect(result.appName).toBe('Forecast+');
    expect(ModuleKernel.list().some((m) => m.id === 'app-forecast-plus')).toBe(true);
  });

  it('reports launched: false for an unknown app id', () => {
    expect(OSAppLauncher.launch('app-does-not-exist')).toEqual({ launched: false });
  });
});
