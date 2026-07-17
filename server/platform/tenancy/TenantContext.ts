export class TenantContext {
  private static asyncLocalStorage = new Map<string, string>();

  static setTenantId(executionId: string, tenantId: string): void {
    this.asyncLocalStorage.set(executionId, tenantId);
  }

  static getTenantId(executionId: string): string | undefined {
    return this.asyncLocalStorage.get(executionId);
  }

  static clear(executionId: string): void {
    this.asyncLocalStorage.delete(executionId);
  }
}
