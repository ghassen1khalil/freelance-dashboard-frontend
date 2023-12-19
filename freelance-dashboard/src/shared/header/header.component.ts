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
import {TranslateService} from '@ngx-translate/core';

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
              private router: Router,
              private translate: TranslateService,) {
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

  private initMenuItems() {
    this.translate.get([
      'profile',
      'logOut'
    ]).subscribe(res => {
      this.items = [{
        label: this.getFreelancerFullName(),
        items: [
          {
            label: res['profile'],
            icon: PrimeIcons.USER_EDIT,
            command: event => {
              this.router.navigate(['/', 'profile']);
            }
          },
          {
            label: res['logOut'],
            icon: PrimeIcons.SIGN_OUT,
            command: event => {
              this.logout()
            }
          }
        ]
      }];
    });
  }

  private getFreelancerFullName() {
    return this.freelancer?.name !== '' ? this.freelancer?.name : `${this.freelancer?.firstname}  ${this.freelancer?.lastname}`
  }

  private logout() {
    localStorage.clear();
    this.store.dispatch(Logout());
  }

  public isMainPage() {
    return window.location.href.includes('main')
  }

  public goToHome() {
    this.router.navigate(['/', 'main'])
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }


}
