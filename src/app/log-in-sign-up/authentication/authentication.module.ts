import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthenticationComponent} from './authentication.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {AuthenticationRoutingModule} from './authentication-routing.module';


@NgModule({
  declarations: [AuthenticationComponent],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    ProgressSpinnerModule
  ]
})
export class AuthenticationModule {
}
