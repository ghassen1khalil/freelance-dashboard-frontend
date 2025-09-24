import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {PrimePhoneInputComponent} from '../components/phone/prime-phone-input.component';
import {COUNTRIES} from '../components/phone/countries.data';
import {Country} from '../components/phone/country.model';

@Component({
  selector: 'app-phone-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimePhoneInputComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-3">
      <app-prime-phone-input
        [countries]="customCountries"
        [preferred]="['FR','TN']"
        label="Numéro de téléphone"
        (e164Change)="onPhoneChange($event)">
      </app-prime-phone-input>

      <div>Valeur E.164: <strong>{{ form.value.phoneE164 || '—' }}</strong></div>

      <button type="submit" class="p-button p-component">
        <span class="p-button-label">Soumettre</span>
      </button>
    </form>
  `
})
export class PhoneDemoComponent {
  // Example: how to pass a custom country list (subset here)
  customCountries: Country[] = COUNTRIES.filter(c => ['FR', 'TN', 'BE', 'CH', 'US', 'CA'].includes(c.iso2));
  private fb = inject(FormBuilder);
  form = this.fb.group({
    phoneE164: this.fb.control<string | null>(null)
  });

  onPhoneChange(e164: string | null) {
    this.form.patchValue({phoneE164: e164});
  }

  submit() {
    // Best practice: only submit E.164
    // eslint-disable-next-line no-console
    console.log('Submit phone (E.164):', this.form.value.phoneE164);
  }
}
