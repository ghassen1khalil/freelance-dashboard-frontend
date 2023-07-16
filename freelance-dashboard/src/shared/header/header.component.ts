import {Component, OnDestroy, OnInit} from '@angular/core';
import {MenuItem, PrimeIcons} from 'primeng/api';
import {AuthService} from '@auth0/auth0-angular';
import {Freelancer} from '../../../generated';
import {select, Store} from '@ngrx/store';
import {Subject, takeUntil} from 'rxjs';
import {getAuth} from '../../core/store/reducers/auth.reducers';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {Logout} from '../../core/store/actions/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public freelancer: Freelancer | undefined;
  public items: MenuItem[];
  public filteringTerms: string;

  private unsubscribe$ = new Subject<void>();

  constructor(public auth: AuthService,
              private store: Store) {
    this.freelancer = undefined;
  }

  ngOnInit(): void {
    this.store.pipe(
      select(getAuth),
      takeUntil(this.unsubscribe$)
    ).subscribe(authState => {
      if (isNotNullOrUndefined(authState.freelancer)) {
        this.freelancer = {
          name: authState.freelancer?.name,
          firstname: authState.freelancer?.firstname,
          lastname: authState.freelancer?.lastname,
          email: authState.freelancer?.email,
          picture: authState.freelancer?.picture
        }
        this.initMenuItems();
      }
    });
  }

  private initMenuItems() {
    this.items = [{
      label: this.freelancer?.name,
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
    localStorage.clear();
    this.store.dispatch(Logout());
  }

  public filter() {
    //console.log("search for " + this.filteringTerms);
    if (this.filteringTerms === '' || this.filteringTerms === undefined) {
      // TODO reload inital list
    } else {
      // TODO filter positions list
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }

}
