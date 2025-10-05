import {AsYouType, parsePhoneNumberFromString} from 'libphonenumber-js/min';
import {Country} from './country.model';

/**
 * Formats a national phone number as the user types according to the selected country.
 * This function is pure and safe for tree-shaking.
 */
export function formatAsYouType(national: string, iso2: string): string {
  const digits = (national ?? '').replace(/[^\d]/g, '');
  if (!iso2) {
    return digits;
  }
  const typer = new AsYouType(iso2 as any);
  return typer.input(digits);
}

/**
 * Converts a national number to E.164 by prefixing the country dial code and validating it.
 * Returns the normalized E.164 string (e.g., "+33612345678") or null if invalid.
 */
export function toE164(national: string, country: Country | null | undefined): string | null {
  if (!country) return null;
  const digits = (national ?? '').replace(/[^\d]/g, '');
  if (!digits) return null;
  const full = `${country.dial}${digits}`;
  const parsed = parsePhoneNumberFromString(full);
  if (parsed && parsed.isValid()) {
    return parsed.number; // E.164
  }
  return null;
}

/**
 * Checks whether the given national number is a valid phone number for the given country.
 */
export function isValid(national: string, country: Country | null | undefined): boolean {
  return toE164(national, country) !== null;
}
