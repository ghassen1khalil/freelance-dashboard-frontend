import {Component, OnDestroy, OnInit} from '@angular/core';
import {MenuItem, PrimeIcons} from 'primeng/api';
import {AuthService} from '@auth0/auth0-angular';
import {Freelancer} from '../../../generated';
import {select, Store} from '@ngrx/store';
import {debounceTime, Subject, takeUntil} from 'rxjs';
import {getAuth} from '../../core/store/reducers/auth.reducers';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {Logout} from '../../core/store/actions/auth.actions';
import {FetchPositions} from '../../core/store/actions/position.actions';
import {FormControl} from '@angular/forms';
import {distinctUntilChanged} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';
import {FilterPositions, ResetFilter} from '../../core/store/actions/filter.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public freelancer: Freelancer | undefined;
  public items: MenuItem[];
  public searchControl = new FormControl();

  private unsubscribe$ = new Subject<void>();

  constructor(public auth: AuthService,
              private store: Store,
              private router: Router) {
    this.freelancer = undefined;
    this.setupSearchDebouncing();
    this.resetSearchFieldWhenNavigationChange();
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

  private setupSearchDebouncing() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((searchKeyword: string) => {
        if (isNotNullOrUndefined(searchKeyword)) {
          if (searchKeyword.length === 0) {
            this.store.dispatch(ResetFilter());
            this.store.dispatch(FetchPositions());
          } else {
            this.store.dispatch(FilterPositions({keyword: searchKeyword}));
          }
        }
      });
  }

  private resetSearchFieldWhenNavigationChange() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.store.dispatch(ResetFilter());
        this.searchControl.reset();
      }
    })
  }

  //TODO use TranslateService
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

  public isMainPage() {
    return window.location.href.includes('main')
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
