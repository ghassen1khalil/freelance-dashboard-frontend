import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoggedInGuard} from '../core/guards/logged-in.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./log-in-sign-up/log-in-sign-up.module').then(m => m.LogInSignUpModule),
  },
  {
    path: 'main',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule),
    canLoad: [LoggedInGuard]
  },
  {
    path: 'add-position',
    loadChildren: () => import('./add-position/add-position.module').then(m => m.AddPositionModule),
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
