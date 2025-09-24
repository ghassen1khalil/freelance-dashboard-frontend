import {TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {PrimePhoneInputComponent} from './prime-phone-input.component';
import {COUNTRIES} from './countries.data';
import {Country} from './country.model';

function country(iso2: string): Country {
  const c = COUNTRIES.find(c => c.iso2 === iso2);
  if (!c) throw new Error('Country not found: ' + iso2);
  return c;
}

describe('PrimePhoneInputComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, PrimePhoneInputComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PrimePhoneInputComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  });

  it('should emit e164Change on valid FR number', () => {
    const fixture = TestBed.createComponent(PrimePhoneInputComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    comp.form.controls.country.setValue(country('FR'));

    let last: string | null | undefined = undefined;
    comp.e164Change.subscribe(v => last = v);

    // simulate typing
    const input = document.createElement('input');
    input.value = '0612345678';
    comp.onNationalInput({target: input} as any);
    fixture.detectChanges();

    expect(comp.e164).toBe('+33612345678');
    // @ts-ignore
    expect(last).toBe('+33612345678');
    expect(comp.form.controls.national.valid).toBeTrue();
  });

  it('should handle country change and reformat input (CH)', () => {
    const fixture = TestBed.createComponent(PrimePhoneInputComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    // Enter a Swiss number pattern
    comp.onCountryChange(country('CH'));
    const input = document.createElement('input');
    input.value = '0791234567';
    comp.onNationalInput({target: input} as any);
    fixture.detectChanges();

    expect(comp.form.controls.national.value).toContain('079'); // formatted
    expect(comp.e164?.startsWith('+41')).toBeTrue();
  });

  it('should validate BE number and update e164', () => {
    const fixture = TestBed.createComponent(PrimePhoneInputComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    comp.onCountryChange(country('BE'));
    const input = document.createElement('input');
    input.value = '0470123456';
    comp.onNationalInput({target: input} as any);
    fixture.detectChanges();

    expect(comp.e164).toBe('+32470123456');
  });

  it('invalid to valid transition should emit null then value', () => {
    const fixture = TestBed.createComponent(PrimePhoneInputComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    comp.onCountryChange(country('FR'));

    const values: Array<string | null> = [];
    comp.e164Change.subscribe(v => values.push(v));

    // invalid short
    let input = document.createElement('input');
    input.value = '0612';
    comp.onNationalInput({target: input} as any);
    fixture.detectChanges();

    // valid
    input = document.createElement('input');
    input.value = '0612345678';
    comp.onNationalInput({target: input} as any);
    fixture.detectChanges();

    expect(values[values.length - 2]).toBeNull();
    expect(values[values.length - 1]).toBe('+33612345678');
  });
});
