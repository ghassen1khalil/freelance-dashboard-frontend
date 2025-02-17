import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoggedInGuard} from '../core/guards/logged-in.guard';
import {AppRoutes} from "../core/utils/app-routes.util";

//TODO handle deprecated canLoad (Use canMatch instead cf. https://angular.dev/api/router/CanMatch)
export const routes: Routes = [
  {
    path: AppRoutes.ROOT,
    loadChildren: () => import('./log-in-sign-up/log-in-sign-up.module').then(m => m.LogInSignUpModule),
  },
  {
    path: AppRoutes.POSITIONS,
    loadChildren: () => import('./positions/positions.module').then(m => m.PositionsModule),
    canLoad: [LoggedInGuard]
  },
  {
    path: AppRoutes.MAIN,
    loadChildren: () => import('./main/main.module').then(m => m.MainModule),
    canLoad: [LoggedInGuard]
  },
  {
    path: AppRoutes.PROFILE,
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
    canLoad: [LoggedInGuard]
  },
  {
    path: AppRoutes.WILDCARD,
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
