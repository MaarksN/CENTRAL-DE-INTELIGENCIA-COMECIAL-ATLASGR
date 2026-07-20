/**
 * @file DateRange.ts
 * @description Value Object DateRange imutavel do contexto CRM.
 * @module CRM/ValueObjects
 * @layer Domain
 * @architecture Clean Architecture + DDD
 * @generated PROSPECTOR-ATLAS Fase 9 - CRM Domain
 */


export class DateRange {
  private readonly _startDate: Date;
  private readonly _endDate: Date;

  private constructor(startDate: Date, endDate: Date) {
    this._startDate = startDate;
    this._endDate = endDate;
  }

  public static create(startDate: Date, endDate: Date): DateRange {
    if (startDate.getTime() > endDate.getTime()) {
      throw new Error('startDate must be before endDate');
    }
    return new DateRange(startDate, endDate);
  }

  public get startDate(): Date {
    return this._startDate;
  }

  public get endDate(): Date {
    return this._endDate;
  }

  public contains(date: Date): boolean {
    return date.getTime() >= this._startDate.getTime() && date.getTime() <= this._endDate.getTime();
  }

  public durationInDays(): number {
    const diffMs: number = this._endDate.getTime() - this._startDate.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  public equals(other: DateRange): boolean {
    return this._startDate.getTime() === other.startDate.getTime() && this._endDate.getTime() === other.endDate.getTime();
  }
}
