import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LoggedOutGuard} from '../../core/guards/logged-out.guard';

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
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogInSignUpRoutingModule {
}
