import {Component, OnDestroy, OnInit} from '@angular/core';
/*import {MessageService, PrimeNGConfig} from 'primeng/api';*/
import {select, Store} from '@ngrx/store';
import {Event} from './core/store/models/models';
import {Subject, takeUntil} from 'rxjs';
import * as eventReducer from './core/store/reducers/event.reducer'
import * as PositionActions from './core/store/actions/position.action';
import {TranslateService} from '@ngx-translate/core';
import {PrimeNGConfig} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public isHeaderShown: boolean;

  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store<{ event: Event }>,
              private translateService: TranslateService,
              private config: PrimeNGConfig,
              /*private messageService: MessageService,*/
              /*private primengConfig: PrimeNGConfig*/) {
    this.translateService.use('fr');
    this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));

    this.isHeaderShown = !(window.location.href.includes('login') || window.location.href.includes('signin'));
  }

  ngOnInit() {
    //this.primengConfig.ripple = true;
    this.store.dispatch(PositionActions.FetchPositions());
    this.store.pipe(
      select(eventReducer.getEvent),
      takeUntil(this.unsubscribe$)
    ).subscribe(event => {
      //console.log(event?.body);
      //this.messageService.add({severity:'success', summary: event?.title, detail: event?.body});
    });
  }

  /*onConfirm() {
    this.messageService.clear('c');
  }*/

  /*onReject() {
    this.messageService.clear('c');
  }*/

  /*clear() {
    this.messageService.clear();
  }*/

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }

}
