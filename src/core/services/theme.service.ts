import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {BehaviorSubject} from 'rxjs';
import {PrimeNG} from 'primeng/config';
import {definePreset} from '@primeng/themes';
import Lara from '@primeng/themes/lara';

type ThemeMode = 'light' | 'dark';

const BLUE_PRIMARY_PALETTE = {
  50: '{blue.50}',
  100: '{blue.100}',
  200: '{blue.200}',
  300: '{blue.300}',
  400: '{blue.400}',
  500: '{blue.500}',
  600: '{blue.600}',
  700: '{blue.700}',
  800: '{blue.800}',
  900: '{blue.900}',
  950: '{blue.950}'
};

const LARA_BLUE_PRESET = definePreset(Lara, {
  semantic: {
    primary: BLUE_PRIMARY_PALETTE
  }
});

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'freelance-dashboard-theme';
  private readonly themeSubject = new BehaviorSubject<ThemeMode>('light');
  public readonly theme$ = this.themeSubject.asObservable();
  private initialized = false;

  constructor(@Inject(DOCUMENT) private document: Document,
              @Inject(PLATFORM_ID) private platformId: Object,
              private primeNg: PrimeNG) {
  }

  public initializeTheme(): void {
    if (this.initialized || !this.isBrowser()) {
      return;
    }

    this.configurePrimeNgTheme();
    const storedTheme = this.getStoredTheme();
    const mode: ThemeMode = this.isValidTheme(storedTheme) ? storedTheme as ThemeMode : 'light';
    this.applyTheme(mode);
    this.initialized = true;
  }

  public setTheme(mode: ThemeMode): void {
    if (!this.isBrowser() || !this.isValidTheme(mode)) {
      return;
    }

    this.applyTheme(mode);
  }

  public toggleTheme(): void {
    const nextTheme: ThemeMode = this.themeSubject.value === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  public get currentTheme(): ThemeMode {
    return this.themeSubject.value;
  }

  private applyTheme(mode: ThemeMode): void {
    const isDark = mode === 'dark';
    this.updateHostClasses(isDark);
    this.persistTheme(mode);
    this.themeSubject.next(mode);
  }

  private updateHostClasses(isDarkTheme: boolean): void {
    const rootElement = this.document.documentElement;
    const body = this.document.body;

    rootElement.classList.toggle('dark', isDarkTheme);
    body.classList.toggle('dark', isDarkTheme);
    rootElement.style.setProperty('color-scheme', isDarkTheme ? 'dark' : 'light');
  }

  private getStoredTheme(): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem(this.storageKey);
  }

  private persistTheme(mode: ThemeMode): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem(this.storageKey, mode);
  }

  private configurePrimeNgTheme(): void {
    this.primeNg.setThemeConfig({
      theme: {
        preset: LARA_BLUE_PRESET,
        options: {
          darkModeSelector: 'class'
        }
      }
    });
  }

  private isValidTheme(theme: string | null): theme is ThemeMode {
    return theme === 'light' || theme === 'dark';
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
