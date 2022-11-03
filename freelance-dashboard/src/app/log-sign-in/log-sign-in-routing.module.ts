import {LoginComponent} from './login/login.component';
import {SigninComponent} from './signin/signin.component';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

const routes  = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signin',
    component: SigninComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogSignInRoutingModule {}
