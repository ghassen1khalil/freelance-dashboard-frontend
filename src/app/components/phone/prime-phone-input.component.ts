import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {MessageModule} from 'primeng/message';
import {TooltipModule} from 'primeng/tooltip';
import {FloatLabel} from 'primeng/floatlabel';
import {Country} from './country.model';
import {COUNTRIES} from './countries.data';
import {formatAsYouType, toE164} from './phone-format.util';
import {parsePhoneNumberFromString} from 'libphonenumber-js/min';
import {Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';

export interface PhoneI18n {
  label: string; // Label for the field
  invalid: string; // Generic invalid phone message
  required: string; // Required field message
  selectCountryLabel: string; // Label for country dropdown
  example: string; // Prefix for example text
}

export const PHONE_I18N_TOKEN = new InjectionToken<Partial<PhoneI18n>>('PHONE_I18N');

export const PHONE_I18N_DEFAULT: PhoneI18n = {
  label: 'Téléphone',
  invalid: 'Numéro invalide pour le pays sélectionné',
  required: 'Champ requis',
  selectCountryLabel: 'Pays',
  example: 'Exemple'
};

@Component({
  selector: 'app-prime-phone-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule, InputTextModule, MessageModule, TooltipModule, FloatLabel],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PrimePhoneInputComponent), multi: true},
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => PrimePhoneInputComponent), multi: true}
  ],
  template: `
    <div class="flex flex-col gap-2 w-full">
      <div class="flex gap-2 items-center w-full">
        <p-dropdown
          [options]="displayCountries"
          [optionLabel]="'name'"
          [filter]="true"
          [showClear]="false"
          [editable]="false"
          [formControl]="form.controls.country"
          (onChange)="onCountryChange($event.value)"
          [panelStyle]="{width: '24rem'}"
          ariaLabel="{{ i18n.selectCountryLabel }}">
          <ng-template pTemplate="selectedItem">
            <span *ngIf="form.controls.country.value as c">{{ c.name }} {{ c.dial }}</span>
          </ng-template>
          <ng-template let-c pTemplate="item">
            <div class="flex justify-between w-full">
              <span>{{ c.name }}</span>
              <span class="opacity-70">{{ c.dial }}</span>
            </div>
          </ng-template>
        </p-dropdown>

        <p-floatlabel variant="on" class="w-full">
          <input pInputText
                 class="w-full"
                 [attr.id]="inputId"
                 [formControl]="form.controls.national"
                 (input)="onNationalInput($event)"
                 (blur)="onBlur()"
                 [attr.aria-invalid]="isInvalidNonEmpty()"
                 [attr.aria-describedby]="messageId"
                 [pTooltip]="errorMessage()"
                 tooltipPosition="top"
                 [showDelay]="500"
          />
          <label [for]="inputId">{{ label }}</label>
        </p-floatlabel>
      </div>

      <p-message *ngIf="showError()" severity="error" [text]="errorMessage()" [attr.id]="messageId"></p-message>
      <!--<small *ngIf="showExample && form.controls.country.value?.example" class="opacity-70">
        {{ i18n.example }}: {{ form.controls.country.value?.example }}
      </small>-->
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimePhoneInputComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  // Public API
  @Input() countries: Country[] = COUNTRIES;
  @Input() preferred: string[] = ['FR', 'CH'];
  @Input() label = 'Téléphone';
  @Input() placeholder?: string;
  @Input() required = false;
  @Input() showExample = true;
  @Output() e164Change = new EventEmitter<string | null>();
  // Exposed value
  e164: string | null = null;
  displayCountries: Country[] = [];
  // Accessibility ids
  protected inputId = `phone-input-${Math.random().toString(36).slice(2)}`;
  protected messageId = `${this.inputId}-msg`;
  private fb = inject(FormBuilder);
  form = this.fb.group({
    country: this.fb.control<Country>(this.countries[0], {nonNullable: true}),
    national: this.fb.control<string>('', {nonNullable: true, validators: []})
  });
  private providedI18n = inject(PHONE_I18N_TOKEN, {optional: true}) ?? {};
  protected i18n: PhoneI18n = {...PHONE_I18N_DEFAULT, ...this.providedI18n} as PhoneI18n;
  // CVA callbacks and state
  private destroy$ = new Subject<void>();
  private isDisabled = false;

  ngOnInit(): void {
    // order countries (preferred first, then keep original order)
    const preferredSet = new Set(this.preferred.map((c) => c.toUpperCase()));
    const pref = this.countries.filter((c) => preferredSet.has(c.iso2));
    const rest = this.countries.filter((c) => !preferredSet.has(c.iso2));
    this.displayCountries = [...pref, ...rest].filter((c, idx, arr) => arr.findIndex((x) => x.iso2 === c.iso2) === idx);

    // Immediate update for internal e164 and output event
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateE164());

    // Debounced propagation to parent control (CVA)
    this.form.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => this.propagateToParent());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.e164Change.complete();
  }

  onCountryChange(country: Country): void {
    this.form.controls.country.setValue(country);
    // reformat the current input for the new country
    const v = this.form.controls.national.value;
    this.form.controls.national.setValue(formatAsYouType(v, country.iso2));
    this.form.controls.national.updateValueAndValidity();
  }

  onNationalInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const current = input.value ?? '';
    const country = this.form.controls.country.value;
    const formatted = formatAsYouType(current, country.iso2);
    if (formatted !== current) {
      this.form.controls.national.setValue(formatted);
    }
  }

  onBlur(): void {
    this._onTouched();
    this.form.controls.national.markAsTouched();
  }

  public isInvalidNonEmpty(): boolean {
    const n = (this.form.controls.national.value ?? '').trim();
    if (!n) return false;
    const c = this.form.controls.country.value;
    return !toE164(n, c);
  }

  showError(): boolean {
    const ctrl = this.form.controls.national;
    return this.isInvalidNonEmpty() && (ctrl.dirty || ctrl.touched);
  }

  errorMessage(): string {
    return this.i18n.invalid;
  }

  // ControlValueAccessor
  writeValue(value: string | null): void {
    if (!value) {
      // reset but keep selected country as-is
      this.form.patchValue({national: ''}, {emitEvent: false});
      this.e164 = null;
      return;
    }
    const pn = parsePhoneNumberFromString(value);
    if (!pn) {
      this.form.patchValue({national: ''}, {emitEvent: false});
      this.e164 = null;
      return;
    }
    // Try match by ISO2 first, fallback to dial code
    const byIso = this.countries.find(c => c.iso2 === (pn.country || ''));
    const byDial = this.countries.find(c => c.dial === `+${pn.countryCallingCode}`);
    const country = byIso || byDial || this.countries[0];
    this.form.patchValue({
      country,
      national: pn.formatNational()
    }, {emitEvent: false});
    this.e164 = pn.number;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (isDisabled) {
      this.form.disable({emitEvent: false});
    } else {
      this.form.enable({emitEvent: false});
    }
  }

  // Validator
  validate(control: AbstractControl): ValidationErrors | null {
    const n = (this.form.controls.national.value ?? '').trim();
    if (!n) return null; // optional field
    const c = this.form.controls.country.value;
    return toE164(n, c) ? null : {phoneInvalid: true};
  }

  private _onChange: (value: string | null) => void = () => {
  };

  private _onTouched: () => void = () => {
  };

  private updateE164(): void {
    const c = this.form.controls.country.value;
    const n = this.form.controls.national.value;
    const e = toE164(n, c);
    this.e164 = e;
    this.e164Change.emit(e);
  }

  private propagateToParent(): void {
    const c = this.form.controls.country.value;
    const n = (this.form.controls.national.value ?? '').trim();
    const val = n ? toE164(n, c) : null;
    this._onChange(val ?? null);
  }
}
