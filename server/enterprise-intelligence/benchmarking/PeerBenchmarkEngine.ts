export interface BenchmarkResult {
  metric: string;
  value: number;
  peerMedian: number;
  percentile: number;
}

export class PeerBenchmarkEngine {
  static compare(metric: string, value: number, peerValues: number[]): BenchmarkResult {
    const sorted = [...peerValues].sort((a, b) => a - b);
    const peerMedian = sorted.length ? sorted[Math.floor(sorted.length / 2)] : value;
    const below = sorted.filter((v) => v <= value).length;
    const percentile = sorted.length ? Math.round((below / sorted.length) * 100) : 50;

    return { metric, value, peerMedian, percentile };
  }
}
