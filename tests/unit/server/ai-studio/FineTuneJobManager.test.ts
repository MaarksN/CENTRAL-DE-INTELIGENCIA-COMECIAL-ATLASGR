import { describe, it, expect } from 'vitest';
import { FineTuneJobManager } from '../../../../server/ai-studio/finetuning/FineTuneJobManager.js';

describe('FineTuneJobManager', () => {
  it('submits a job in the queued state', async () => {
    const job = await FineTuneJobManager.submit('base-model-v1');
    expect(job.status).toBe('queued');
    expect(job.baseModel).toBe('base-model-v1');
  });

  it('reports failed for an unknown job id', () => {
    expect(FineTuneJobManager.getStatus('unknown-job-id')).toBe('failed');
  });

  it('progresses a submitted job to succeeded', async () => {
    const job = await FineTuneJobManager.submit('base-model-v2');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(FineTuneJobManager.getStatus(job.id)).toBe('succeeded');
  });
});
