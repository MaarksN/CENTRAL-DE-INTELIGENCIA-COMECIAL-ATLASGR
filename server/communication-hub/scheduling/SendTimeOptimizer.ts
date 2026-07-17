export class SendTimeOptimizer {
  static nextOptimalSlot(timezoneOffsetMinutes: number, now: Date = new Date()): Date {
    // Mock heuristic: schedule for 9am in the recipient's local timezone
    const local = new Date(now.getTime() + timezoneOffsetMinutes * 60_000);
    local.setHours(9, 0, 0, 0);
    if (local.getTime() < now.getTime()) {
      local.setDate(local.getDate() + 1);
    }
    return local;
  }
}
