import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Event} from '../core/store/models/models';
import {Subject, takeUntil} from 'rxjs';
import * as eventReducer from '../core/store/reducers/event.reducer'
import {TranslateService} from '@ngx-translate/core';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import {getAuth} from '../core/store/reducers/auth.reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService]
})
export class AppComponent implements OnInit, OnDestroy {

  public isHeaderShown: boolean;

  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store<{ event: Event }>,
              private translateService: TranslateService,
              private config: PrimeNGConfig,
              private messageService: MessageService,
              private primengConfig: PrimeNGConfig) {
    this.translateService.use('fr');
    this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.checkIfHeaderIsShown();
    this.listenToNotification();

  }

  private checkIfHeaderIsShown(): void {
    this.store.pipe(
      select(getAuth),
      takeUntil(this.unsubscribe$)
    ).subscribe(authState => {
      this.isHeaderShown = authState.isAuthenticated && (!window.location.href.includes('login') || !window.location.href.includes('signup'));
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

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }

}
