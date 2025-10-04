/**
 * Country model for phone input component.
 * Represents a selectable country with its ISO 3166-1 alpha-2 code and international dialing prefix.
 *
 * name: Localized display name for the country (FR by default in provided data).
 * iso2: ISO 3166-1 alpha-2 code (e.g., 'FR', 'CH').
 * dial: Dialing prefix with leading '+', as displayed to the user (e.g., '+33').
 * example: Optional example national number for UI hinting/placeholder.
 */
export interface Country {
  name: string;
  iso2: string; // ISO 3166-1 alpha-2
  dial: string; // e.g. "+33"
  example?: string;
}

export type Iso2 = Country['iso2'];
