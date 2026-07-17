export type FineTuneStatus = 'queued' | 'training' | 'succeeded' | 'failed';

export interface FineTuneJob {
  id: string;
  baseModel: string;
  status: FineTuneStatus;
}

export class FineTuneJobManager {
  private static jobs: Map<string, FineTuneJob> = new Map();

  static async submit(baseModel: string): Promise<FineTuneJob> {
    const job: FineTuneJob = { id: crypto.randomUUID(), baseModel, status: 'queued' };
    this.jobs.set(job.id, job);

    // Mock async progression to completion
    setTimeout(() => {
      const current = this.jobs.get(job.id);
      if (current) current.status = 'succeeded';
    }, 0);

    return job;
  }

  static getStatus(jobId: string): FineTuneStatus {
    return this.jobs.get(jobId)?.status ?? 'failed';
  }
}
