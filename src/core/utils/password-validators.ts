import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const hasSymbol = /[^A-Za-z0-9]+/.test(value);
    const lengthValid = value.length >= 8;

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSymbol && lengthValid;

    return !passwordValid ? { passwordStrength: true } : null;
  };
}


export function checkPasswords(group: AbstractControl): ValidatorFn | ValidationErrors | null {
  // @ts-ignore
  let pass = group.get('newPassword').value;
  // @ts-ignore
  let confirmPass = group.get('confirmPassword').value
  return pass === confirmPass ? null : {notSame: true}
}

