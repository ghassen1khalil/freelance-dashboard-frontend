import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Event} from '../core/store/models/models';
import {Subject, takeUntil} from 'rxjs';
import * as eventReducer from '../core/store/reducers/event.reducer'
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {AppRoutes} from '../core/utils/app-routes.util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService]
})
export class AppComponent implements OnInit, OnDestroy {

  sidebarVisible: boolean = true;
  isMobile: boolean = false;

  public isLoginOrSignupOrPasswordReset: boolean;

  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store<{ event: Event }>,
              private translateService: TranslateService,
              private messageService: MessageService,
              private router: Router) {
    this.translateService.use('fr'); // TODO to handle translations
    //this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
  }

  ngOnInit() {
    this.checkIfHeaderAndNavigationAreShown();
    this.listenToNotification();

  }

  private checkIfHeaderAndNavigationAreShown(): void {
    this.router.events.subscribe(value => {
      this.isLoginOrSignupOrPasswordReset = this.router.url === '/' || this.router.url.includes(AppRoutes.LOGIN)
        || this.router.url.includes(AppRoutes.SIGNUP)
        || this.router.url.includes(AppRoutes.PASSWORD_RESET);
    });
  }

  private listenToNotification(): void {
    this.store.pipe(
      select(eventReducer.getEvent),
      takeUntil(this.unsubscribe$)
    ).subscribe(event => {
      this.messageService.add({severity: event?.type, summary: event?.title, detail: event?.body});
    });
  }

  @HostListener('window:resize', ['$event'])
  checkScreenSize() {
    this.isMobile = window.innerWidth < 992;
    if (!this.isMobile) {
      this.sidebarVisible = true;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

}
