import {COUNTRIES} from '../../components/phone/countries.data';
import {formatAsYouType, isValid, toE164} from '../../components/phone/phone-format.util';

function country(iso2: string) {
  const c = COUNTRIES.find(c => c.iso2 === iso2);
  if (!c) throw new Error('Country not found: ' + iso2);
  return c;
}

describe('phone-format.util', () => {
  it('should format as you type for FR', () => {
    const iso = 'FR';
    expect(formatAsYouType('0', iso)).toBe('0');
    expect(formatAsYouType('06', iso)).toBe('06');
    expect(formatAsYouType('061', iso)).toBe('06 1');
    expect(formatAsYouType('0612', iso)).toBe('06 12');
  });

  it('FR: 06 12 34 56 78 → +33612345678 (valid)', () => {
    const c = country('FR');
    const e = toE164('06 12 34 56 78', c);
    expect(e).toBe('+33612345678');
    expect(isValid('06 12 34 56 78', c)).toBeTrue();
  });

  it('TN: 20 123 456 → +21620123456 (valid)', () => {
    const c = country('TN');
    const e = toE164('20 123 456', c);
    expect(e).toBe('+21620123456');
    expect(isValid('20 123 456', c)).toBeTrue();
  });

  it('BE: 0470 12 34 56 → +32470123456 (valid)', () => {
    const c = country('BE');
    const e = toE164('0470 12 34 56', c);
    expect(e).toBe('+32470123456');
    expect(isValid('0470 12 34 56', c)).toBeTrue();
  });

  it('Invalid: too short FR number returns null', () => {
    const c = country('FR');
    expect(toE164('0612', c)).toBeNull();
    expect(isValid('0612', c)).toBeFalse();
  });

  it('Invalid: wrong format for TN (non-digit chars)', () => {
    const c = country('TN');
    expect(toE164('ab-20', c)).toBeNull();
  });
});
