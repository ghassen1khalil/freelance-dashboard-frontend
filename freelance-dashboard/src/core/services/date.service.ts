import {Injectable} from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
// Centralized Date Service for API/Display conversions
export class DateService {

  static readonly YYYY_MM_DD_FORMAT: string = 'YYYY-MM-DD';
  static readonly YYYY_MM_DD_HH_MM_FORMAT: string = 'YYYY-MM-DD HH:mm';

  constructor() {}

  // Date-time to API (ISO 8601 UTC with milliseconds)
  public toApiDateTime(d: Date | string | moment.Moment | null | undefined): string | null {
    if (!d) return null;
    return moment(d).utc().milliseconds(0).toISOString(); // e.g., 2025-08-13T12:45:00.000Z
  }

  // API (ISO UTC) to display local 'YYYY-MM-DD HH:mm'
  public toDisplayDateTime(isoUtc: string | null | undefined): string | null {
    if (!isoUtc) return null;
    return moment.utc(isoUtc).local().format(DateService.YYYY_MM_DD_HH_MM_FORMAT);
  }

  // Date-only to API (YYYY-MM-DD)
  public toApiDateOnly(d: Date | string | moment.Moment | null | undefined): string | null {
    if (!d) return null;
    return moment(d).format(DateService.YYYY_MM_DD_FORMAT);
  }

  // Date-only from API to UI (normalize)
  public toDisplayDateOnly(apiDate: string | null | undefined): string | null {
    if (!apiDate) return null;
    return moment(apiDate, DateService.YYYY_MM_DD_FORMAT).format(DateService.YYYY_MM_DD_FORMAT);
  }
}
