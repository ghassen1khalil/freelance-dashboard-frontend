import {Component, OnInit} from '@angular/core';
import {MenuItem, PrimeIcons} from 'primeng/api';
import {AuthService} from '@auth0/auth0-angular';
import {Router, RouterModule} from '@angular/router';
import {Freelancer} from '../../../generated';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public freelancer: Freelancer | undefined;
  public items: MenuItem[];

  constructor(public auth: AuthService, private router: Router) {
    this.freelancer = undefined;
  }

  ngOnInit(): void {
    this.initMenuItems();
    this.auth.user$.subscribe(profile => {
      if (profile?.name) {
        this.freelancer = {
          name: profile?.name,
          email: profile?.email,
          picture: profile?.picture
        }
      } else {
        this.freelancer = {
          firstname: profile?.given_name,
          lastname: profile?.family_name,
          email: profile?.email,
          picture: profile?.picture
        }
      }

    });
  }

  private initMenuItems() {
    this.items = [{
      label: 'Compte',
      items: [
        {label: 'Profile', icon: PrimeIcons.USER_EDIT},
        {
          label: 'Se déconnecter', icon: PrimeIcons.SIGN_OUT, command: event => {
            this.logout()
          }
        }
      ]
    }];
  }

  private logout() {
    this.router.navigateByUrl('login').then(() => this.auth.logout());
  }

  public login() {
    /*this.auth.loginWithRedirect();
    this.auth.user$.subscribe(profile => {
      this.user = {
        firstname: profile?.name,
        email: profile?.email
      }
    });*/
  }
}
