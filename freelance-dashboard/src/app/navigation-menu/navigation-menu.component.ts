import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {Menu} from 'primeng/menu';
import {Badge} from 'primeng/badge';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {AppRoutes} from "../../core/utils/app-routes.util";
import {Logout} from "../../core/store/actions/auth.actions";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [
    Menu,
    Badge,
    TranslatePipe,
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './navigation-menu.component.html',
  styleUrl: './navigation-menu.component.scss'
})
export class NavigationMenuComponent implements OnInit {

  public navigationMenuItems: MenuItem[] | undefined;

  protected readonly AppRoutes = AppRoutes;

  constructor(private router: Router,
              private translate: TranslateService,
              private store: Store) {}

  ngOnInit() {
    this.initializeActionsMenu();
  }

  private initializeActionsMenu() {
    this.translate.get(['navigation-menu.menu',
      'navigation-menu.dashboard',
      'navigation-menu.positions',
      'navigation-menu.myAccount',
      'navigation-menu.settings',
      'navigation-menu.logout',]).subscribe(res => {
        this.navigationMenuItems = [{
          separator: true
        },
          {
            label: res['navigation-menu.menu'],
            items: [
              {
                label: res['navigation-menu.dashboard'],
                icon: 'pi pi-chart-bar',
                command: () => {
                  this.goToRoute(AppRoutes.MAIN);
                }
                //shortcut: '⌘+N'
              },
              {
                label: res['navigation-menu.positions'],
                icon: 'pi pi-building-columns',
                command: () => {
                  this.goToRoute(AppRoutes.POSITIONS);
                }
                //shortcut: '⌘+S'
              }
            ]
          },
          {
            label: res['navigation-menu.myAccount'],
            items: [
              {
                label: res['navigation-menu.settings'],
                icon: 'pi pi-cog',
                command: () => {
                  this.goToRoute(AppRoutes.PROFILE);
                }
                //shortcut: '⌘+O'
              },
              {
                label: res['navigation-menu.logout'],
                icon: 'pi pi-sign-out',
                command: () => {
                  this.logout();
                }
                //shortcut: '⌘+Q'
              }
            ]
          },
          {
            separator: true
          }]
    });

  }

  public goToRoute(route: string) {
    this.router.navigate(['/', route])
  }

  private logout() {
    localStorage.clear();
    this.store.dispatch(Logout());
  }
}
