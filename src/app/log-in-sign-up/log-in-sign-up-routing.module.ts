import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LoggedOutGuard} from '../../core/guards/logged-out.guard';
import {ResetPasswordComponent} from './reset-password/reset-password.component';

const routes = [
  {
    path: '',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule),
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedOutGuard]
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogInSignUpRoutingModule {
}
