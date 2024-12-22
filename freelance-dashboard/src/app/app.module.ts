import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ButtonModule} from 'primeng/button';
import {BrowserAnimationsModule, provideAnimations} from '@angular/platform-browser/animations';
import {RippleModule} from 'primeng/ripple';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {BasePathProviderService} from '../core/services/base-path-provider.service';
import {environment, environment as env} from '../environments/environment';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {PositionEffects} from '../core/store/effects/position.effects';
import {reducers} from '../core/store/reducers/reducers';
import {ToastModule} from 'primeng/toast';
import {HeaderModule} from '../shared/header/header.module';
import {AuthModule} from '@auth0/auth0-angular';
import {AuthEffects} from '../core/store/effects/auth.effects';
import {LoaderComponent} from '../shared/loader/loader.component';
import {LoaderInterceptor} from '../core/interceptors/loader.interceptor';
import {FilterEffects} from '../core/store/effects/filter.effects';
import {FooterModule} from '../partials/components/footer/footer.module';
import {FreelancerEffects} from '../core/store/effects/freelancer.effects';
import {PasswordResetTokenEffects} from '../core/store/effects/password-reset-token.effects';
import { DrawerComponent } from './drawer/drawer.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    /**Angular**/
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    /**Third parties**/
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'fr'
    }),
    StoreModule.forRoot(reducers, /*{ metaReducers }*/),
    EffectsModule.forRoot([PositionEffects, AuthEffects, FilterEffects, FreelancerEffects, PasswordResetTokenEffects/*HydrationEffects*/]),
    AuthModule.forRoot({...env.auth}),
    !environment.production ? StoreDevtoolsModule.instrument({connectInZone: true}) : [],

    /**PrimeNG**/
    ButtonModule,
    RippleModule,
    ToastModule,

    /**Freelance Dahsboard**/
    AppRoutingModule,
    HeaderModule,
    LoaderComponent,
    FooterModule,
   ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    HttpClient,
    BasePathProviderService,
    provideAnimations()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
