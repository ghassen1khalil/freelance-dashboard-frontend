import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// Removed incorrect import of ThemeService
// Correctly inject ThemeService from the app's core services
import { ThemeService } from './app/core/services/theme.service';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(moduleRef => {
    const themeService = moduleRef.injector.get(ThemeService); // Ensure ThemeService is injected correctly
    themeService.themeChange.subscribe((theme: string) => {
      document.documentElement.setAttribute('data-theme', theme);
    });
  })
  .catch(err => console.error(err));
