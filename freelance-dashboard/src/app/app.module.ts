import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ButtonModule} from 'primeng/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RippleModule} from 'primeng/ripple';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {BasePathProviderService} from '../core/services/base-path-provider.service';
import {environment, environment as env} from '../environments/environment';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {PositionEffects} from '../core/store/effects/position.effects';
import {reducers} from '../core/store/reducers/reducers';
/*import {MessageService} from 'primeng/api';*/
import {ToastModule} from 'primeng/toast';
import {DashboardAccordionModule} from '../shared/accordion/dashboard-accordion.module';
import {HeaderModule} from '../shared/header/header.module';
import {AuthModule} from '@auth0/auth0-angular';
import {AuthEffects} from '../core/store/effects/auth.effects';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ButtonModule,
    RippleModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'fr'
    }),
    StoreModule.forRoot(reducers),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([PositionEffects, AuthEffects]),
    ToastModule,
    DashboardAccordionModule,
    HeaderModule,
    AuthModule.forRoot({...env.auth}),
  ],
  providers: [
    HttpClient,
    BasePathProviderService,
    /*MessageService*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
