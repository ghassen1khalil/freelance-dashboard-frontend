import {Component, OnInit} from '@angular/core';
import {Divider} from 'primeng/divider';
import {Router, RouterLink} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {Menu} from 'primeng/menu';
import {Badge, BadgeDirective} from 'primeng/badge';
import {Avatar} from 'primeng/avatar';
import {TranslatePipe} from '@ngx-translate/core';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {Card} from 'primeng/card';

@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [
    Divider,
    RouterLink,
    Menu,
    Badge,
    Avatar,
    TranslatePipe,
    NgOptimizedImage,
    Card,
    BadgeDirective,
    NgIf
  ],
  templateUrl: './navigation-menu.component.html',
  styleUrl: './navigation-menu.component.scss'
})
export class NavigationMenuComponent implements OnInit {

  items: MenuItem[] | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        separator: true
      },
      {
        label: 'Menu',
        items: [
          {
            label: 'Tableau de bord',
            icon: 'pi pi-chart-bar',
            shortcut: '⌘+N'
          },
          {
            label: 'Positionnements',
            icon: 'pi pi-building-columns',
            shortcut: '⌘+S'
          }
        ]
      },
      {
        label: 'Mon compte',
        items: [
          {
            label: 'Paramètres',
            icon: 'pi pi-cog',
            shortcut: '⌘+O'
          },
          /*{
            label: 'Messages',
            icon: 'pi pi-inbox',
            badge: '2'
          },*/
          {
            label: 'Se déconnecter',
            icon: 'pi pi-sign-out',
            shortcut: '⌘+Q'
          }
        ]
      },
      {
        separator: true
      }
    ];
  }

  public goToHome() {
    this.router.navigate(['/', 'main'])
  }
}
