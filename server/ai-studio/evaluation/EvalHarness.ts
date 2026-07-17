export interface EvalCase {
  input: string;
  expectedContains: string[];
}

export interface EvalResult {
  passed: number;
  failed: number;
  total: number;
}

export class EvalHarness {
  static async run(cases: EvalCase[], generate: (input: string) => Promise<string>): Promise<EvalResult> {
    let passed = 0;

    for (const testCase of cases) {
      const output = await generate(testCase.input);
      const ok = testCase.expectedContains.every((token) => output.includes(token));
      if (ok) passed += 1;
    }

    return { passed, failed: cases.length - passed, total: cases.length };
  }
}
