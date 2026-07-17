export interface ProcessEvent {
  caseId: string;
  activity: string;
  timestamp: Date;
}

export interface DiscoveredProcess {
  path: string[];
  frequency: number;
}

export class ProcessMiningEngine {
  static discover(events: ProcessEvent[]): DiscoveredProcess[] {
    const cases = new Map<string, ProcessEvent[]>();
    for (const event of events) {
      const list = cases.get(event.caseId) ?? [];
      list.push(event);
      cases.set(event.caseId, list);
    }

    const pathCounts = new Map<string, number>();
    for (const caseEvents of cases.values()) {
      const path = caseEvents
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        .map((e) => e.activity)
        .join(' -> ');
      pathCounts.set(path, (pathCounts.get(path) ?? 0) + 1);
    }

    return Array.from(pathCounts.entries()).map(([path, frequency]) => ({ path: path.split(' -> '), frequency }));
  }
}
