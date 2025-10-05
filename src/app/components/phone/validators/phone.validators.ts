import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Country} from '../country.model';
import {isValid, toE164} from '../phone-format.util';

/**
 * Validates that the national phone number (control value) is valid for the selected country.
 * Empty value is considered valid; combine with Validators.required when needed.
 */
export function phoneByCountryValidator(countryCtrl: AbstractControl<Country>): ValidatorFn {
  return (ctrl: AbstractControl<string | null>): ValidationErrors | null => {
    const country = countryCtrl.value;
    const value = ctrl.value ?? '';
    if (!value) return null; // let required handle empty
    return isValid(value, country) ? null : {phoneInvalid: true};
  };
}

/**
 * Validates that a national phone number can be converted to a valid E.164 output (using the selected country).
 * Empty value is considered valid; combine with Validators.required when needed.
 */
export function e164RequiredValidator(countryCtrl: AbstractControl<Country>): ValidatorFn {
  return (ctrl: AbstractControl<string | null>): ValidationErrors | null => {
    const country = countryCtrl.value;
    const value = ctrl.value ?? '';
    if (!value) return null; // let required handle
    const e164 = toE164(value, country ?? null);
    return e164 ? null : {e164Required: true};
  };
}
