export class AuditLogger {
  static log(action: string, metadata: any): void {
    console.log(`[AuditLog] ACTION: ${action} | META: ${JSON.stringify(metadata)}`);
    // In a real system, insert this to a secure audit table
  }
}
