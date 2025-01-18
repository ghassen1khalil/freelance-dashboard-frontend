import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoggedInGuard} from '../core/guards/logged-in.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./log-in-sign-up/log-in-sign-up.module').then(m => m.LogInSignUpModule),
  },
  {
    path: 'positions',
    loadChildren: () => import('./positions/positions.module').then(m => m.PositionsModule),
    canLoad: [LoggedInGuard]
  },
  {
    path: 'main',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule),
    canLoad: [LoggedInGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
    canLoad: [LoggedInGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [LoggedInGuard]
})
export class AppRoutingModule {
}
