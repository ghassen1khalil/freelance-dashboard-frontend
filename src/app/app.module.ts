import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ButtonModule} from 'primeng/button';
import {BrowserAnimationsModule, provideAnimations} from '@angular/platform-browser/animations';
import {RippleModule} from 'primeng/ripple';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {BasePathProviderService} from '../core/services/base-path-provider.service';
import {environment, environment as env} from '../environments/environment';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {PositionEffects} from '../core/store/effects/position.effects';
import {reducers} from '../core/store/reducers/reducers';
import {ToastModule} from 'primeng/toast';
import {AuthModule} from '@auth0/auth0-angular';
import {AuthEffects} from '../core/store/effects/auth.effects';
import {LoaderComponent} from '../shared/loader/loader.component';
import {LoaderInterceptor} from '../core/interceptors/loader.interceptor';
import {FilterEffects} from '../core/store/effects/filter.effects';
import {FooterModule} from '../partials/components/footer/footer.module';
import {FreelancerEffects} from '../core/store/effects/freelancer.effects';
import {PasswordResetTokenEffects} from '../core/store/effects/password-reset-token.effects';
import {SkillsEffects} from '../core/store/effects/skills.effects';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Material from '@primeng/themes/material';
import {definePreset} from '@primeng/themes';
import {NavigationMenuComponent} from './navigation-menu/navigation-menu.component';
import {HeaderComponent} from './header/header.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

//TODO : to be handler when dealing with theming ticket (cf. issue #80)
const MyPreset = definePreset(Material, {
  components: {
    button: {
      css: () =>
        `.p-button {
            border-radius: 2rem;
        }`
    },
    inputtext: {
      css: () =>
        `.p-inputtext {
            min-width: 100%;
            border-radius: 2rem;
        }`
    },
    select: {
      css: () =>
        `.p-select {
            border-radius: 2rem;
            height: 2.813rem;
        }`
    },
    fieldset: {
      css: () =>
        `.p-fieldset {
            border-radius: 2rem;
        }`
    },
    dialog: {
      css: () =>
        `.p-dialog {
            border-radius: 2rem;
        }`
    },
    menu: {
      css: () =>
        `.p-menu {
            border-radius: 0;
        }`
    },
  }
});

@NgModule({
  declarations: [
    AppComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    /**Angular**/
    BrowserModule,
    BrowserAnimationsModule,
    /**Third parties**/
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'fr'
    }),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([PositionEffects, AuthEffects, FilterEffects, FreelancerEffects, PasswordResetTokenEffects, SkillsEffects /*HydrationEffects*/]),
    AuthModule.forRoot({
      domain: env.auth.domain,
      clientId: env.auth.clientId,
      authorizationParams: {
        redirect_uri: env.auth.redirectUri
      }
    }),
    !environment.production ? StoreDevtoolsModule.instrument({connectInZone: true}) : [],
    /**PrimeNG**/
    ButtonModule,
    RippleModule,
    ToastModule,
    /**Freelance Dahsboard**/
    AppRoutingModule,
    LoaderComponent,
    FooterModule,
    NavigationMenuComponent,
    HeaderComponent
  ],
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset
      }
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    BasePathProviderService,
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class AppModule {
}
