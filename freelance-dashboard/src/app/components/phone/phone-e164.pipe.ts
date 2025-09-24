import {Pipe, PipeTransform} from '@angular/core';
import {Country} from './country.model';
import {toE164} from './phone-format.util';

/**
 * Standalone pipe that converts a national phone number and a country to E.164.
 * Returns an empty string when conversion isn't possible.
 */
@Pipe({name: 'phoneE164', standalone: true})
export class PhoneE164Pipe implements PipeTransform {
  transform(national: string | null | undefined, country: Country | null | undefined): string {
    return toE164(national ?? '', country) ?? '';
  }
}
