import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme-preference';
  private readonly DARK_THEME = 'dark';
  private readonly LIGHT_THEME = 'light';
  private readonly SYSTEM_THEME = 'system';

  public themeChange = new BehaviorSubject<string>(this.getCurrentTheme());

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme && [this.DARK_THEME, this.LIGHT_THEME, this.SYSTEM_THEME].includes(savedTheme)) {
      this.applyTheme(savedTheme);
    } else {
      this.setTheme(this.SYSTEM_THEME);
    }
  }

  public setTheme(theme: string) {
    if (theme && [this.DARK_THEME, this.LIGHT_THEME, this.SYSTEM_THEME].includes(theme)) {
      localStorage.setItem(this.THEME_KEY, theme);
      this.applyTheme(theme);
      this.themeChange.next(theme);
    }
  }

  public getCurrentTheme(): string {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    return savedTheme && [this.DARK_THEME, this.LIGHT_THEME, this.SYSTEM_THEME].includes(savedTheme)
      ? savedTheme
      : this.SYSTEM_THEME;
  }

  private applyTheme(theme: string) {
    if (theme === this.SYSTEM_THEME) {
      this.applySystemTheme();
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  private applySystemTheme() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', this.DARK_THEME);
    } else {
      document.documentElement.setAttribute('data-theme', this.LIGHT_THEME);
    }
  }

  private getSystemTheme(): string {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? this.DARK_THEME : this.LIGHT_THEME;
  }
}

