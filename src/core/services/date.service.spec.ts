import { DateService } from './date.service';
import moment from 'moment';

describe('DateService', () => {
  let service: DateService;

  beforeEach(() => {
    service = new DateService();
  });

  it('toApiDateTime should serialize to ISO UTC with milliseconds', () => {
    const d = new Date(Date.UTC(2025, 7, 13, 12, 45, 0)); // 2025-08-13T12:45:00Z
    const iso = service.toApiDateTime(d);
    expect(iso).toBe('2025-08-13T12:45:00.000Z');
  });

  it('toDisplayDateTime should convert ISO UTC to local formatted string', () => {
    const iso = '2025-08-13T12:45:00.000Z';
    const expected = moment.utc(iso).local().format(DateService.YYYY_MM_DD_HH_MM_FORMAT);
    const display = service.toDisplayDateTime(iso);
    expect(display).toBe(expected);
  });

  it('toApiDateOnly should format date-only as YYYY-MM-DD', () => {
    const dateStr = '2025-09-01';
    expect(service.toApiDateOnly(dateStr)).toBe('2025-09-01');
  });

  it('toDisplayDateOnly should normalize date-only as YYYY-MM-DD', () => {
    const dateStr = '2025-09-01';
    expect(service.toDisplayDateOnly(dateStr)).toBe('2025-09-01');
  });
});
