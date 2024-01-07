import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {LogInSignUpRoutingModule} from './log-in-sign-up-routing.module';
import {TranslateModule} from '@ngx-translate/core';
import {DividerModule} from 'primeng/divider';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import {MessageModule} from 'primeng/message';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ResetPasswordComponent
  ],
    imports: [
        CommonModule,
        LogInSignUpRoutingModule,
        TranslateModule,
        DividerModule,
        ReactiveFormsModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        ButtonModule,
        RippleModule,
        MessageModule
    ]
})
export class LogInSignUpModule {
}
