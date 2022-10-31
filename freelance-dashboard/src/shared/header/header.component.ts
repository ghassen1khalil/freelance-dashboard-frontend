import {Component, OnInit} from '@angular/core';
import {MenuItem, PrimeIcons} from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public user: any = undefined;
  public items: MenuItem[];

  constructor() {

  }

  ngOnInit(): void {
    this.initMenuItems();
  }

  private initMenuItems() {
    this.items = [{
      label: 'Compte',
      items: [
        {label: 'Profile', icon: PrimeIcons.USER_EDIT},
        {label: 'Se déconnecter', icon: PrimeIcons.SIGN_OUT, command: event => {this.logout()}}
      ]
    }];
  }

  private logout() {
    this.user = undefined;
  }

  public login() {
    this.user = {
      firstname: 'Ghassen Khalil',
      lastname: 'Ati',
      email: 'ghassen1khalil@gmail.com'
    }
  }
}
