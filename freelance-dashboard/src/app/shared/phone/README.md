# Composant téléphone (PrimeNG + libphonenumber-js)

Ce module fournit un champ de téléphone prêt pour la prod, standalone (sans NgModule), 100% PrimeNG, strictement typé, avec formatage as‑you‑type, validation par pays et sortie normalisée E.164.

## Pourquoi E.164 côté backend ?

- E.164 est le format international canonique (« +<indicatif><numéro> »), indépendant du pays ou des espaces.
- Simplifie le stockage, la recherche, la comparaison et l’envoi de SMS/WhatsApp.
- Évite les ambiguïtés (zéros initiaux, formats locaux, espaces) et les erreurs dues au copy/paste.

Recommandation: ne stocker/échanger que des E.164 côté backend et API.

## Installation

- Dépendance: libphonenumber-js (import en « /min » pour limiter le bundle).

```
npm i libphonenumber-js
```

## API publique

- Modèle `Country` (src/app/components/phone/country.model.ts)
- Données `COUNTRIES` (src/app/components/phone/countries.data.ts)
- Utilitaires purs (src/app/components/phone/phone-format.util.ts)
  - `formatAsYouType(national: string, iso2: string): string`
  - `toE164(national: string, country: Country): string | null`
  - `isValid(national: string, country: Country): boolean`
- Validators (src/app/components/phone/validators/phone.validators.ts)
  - `phoneByCountryValidator(countryCtrl)`
  - `e164RequiredValidator(countryCtrl)`
- Pipe standalone `PhoneE164Pipe` (src/app/components/phone/phone-e164.pipe.ts)
- Composant standalone `PrimePhoneInputComponent` (src/app/components/phone/prime-phone-input.component.ts)
  - Inputs
    - `countries: Country[] = COUNTRIES`
    - `preferred: string[] = ['FR','CH']`
    - `label = 'Téléphone'`
    - `placeholder?: string`
    - `required = true`
    - `showExample = true`
  - Outputs
    - `e164Change: EventEmitter<string | null>`
  - Propriété exposée
    - `e164: string | null` (mise à jour en temps réel)
  - i18n: `PHONE_I18N_TOKEN` (injection optionnelle) et `PHONE_I18N_DEFAULT`

## Exemple d’intégration (form parent)

Template:

```
<app-prime-phone-input
  [countries]="myCountries"
  [preferred]="['FR','TN']"
  label="Numéro de téléphone"
  (e164Change)="onPhoneChange($event)">
</app-prime-phone-input>
```

Composant parent:

```
onPhoneChange(e164: string | null) {
  this.form.patchValue({ phoneE164: e164 });
}
```

Voir la démo: src/app/example/phone-demo.component.ts.

## Étendre la liste des pays

- Le fichier `countries.data.ts` contient FR et CH en tête, puis les pays européens et quelques extras.
- Pour ajouter un pays, renseigner `name`, `iso2` (ISO 3166‑1 alpha‑2) et `dial` (ex.: "+33").
- Référence: https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes

## Accessibilité (A11y)

- Label associé via `for`/`aria-labelledby`.
- `aria-invalid` sur l’input.
- Messages d’erreur lisibles (`p-message`) + tooltip.

## i18n

- Textes FR par défaut via `PHONE_I18N_DEFAULT`.
- Surcharge possible en fournissant `PHONE_I18N_TOKEN` (InjectionToken<Partial<PhoneI18n>>).

## Pièges & bonnes pratiques

- Espaces et copy/paste: l’input et `formatAsYouType` nettoient/formatent automatiquement; côté backend ne conservez que l’E.164.
- Changement de pays: la saisie est reformatée et la validation recalculée.
- Toujours valider en E.164 pour éviter les faux positifs.

## Performances

- Import « libphonenumber-js/min » uniquement (métadonnées réduites), pas d’imports inutiles.
- Les utilitaires sont purs pour un bon treeshaking.

## Tests

- `src/app/shared/phone/phone-format.util.spec.ts`: cas FR/TN/BE, invalides, as-you-type.
- `src/app/components/phone/prime-phone-input.component.spec.ts`: création, changement de pays, invalid→valid, émission `e164Change`.
