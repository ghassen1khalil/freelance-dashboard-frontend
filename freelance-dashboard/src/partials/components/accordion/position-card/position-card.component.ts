import {Component, Input, OnInit} from '@angular/core';
import {MenuItem, PrimeIcons} from 'primeng/api';
import {Position, State} from '../../../../../generated';
import {TranslateService} from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import {UpdatePosition} from '../../../../core/store/actions/position.actions';

@Component({
  selector: 'app-position-card',
  templateUrl: './position-card.component.html',
  styleUrls: ['./position-card.component.scss']
})
export class PositionCardComponent implements OnInit {

  @Input() public position: Position;
  public items: MenuItem[];
  public currency: string | undefined;
  public latestStatus: string | undefined;


  constructor(private translate: TranslateService,
              private store: Store) {
  }

  ngOnInit(): void {
    if (this.position.state !== null && this.position.state !== undefined) {
      this.initMenuItems(this.position.state);
    }
    this.currency = this.getCurrency();
    this.latestStatus = this.getLatestStatus();
  }

  private initMenuItems(state: State) {
    this.translate.get('position-contextual-menu.title').subscribe(title => {
      this.translate.get(['position-contextual-menu.edit', 'position-contextual-menu.remove', 'position-contextual-menu.archive', 'position-contextual-menu.enable']).subscribe(res => {
        this.items = [{
          label: title,
          items: [
            {label: res['position-contextual-menu.edit'], icon: PrimeIcons.PENCIL},
            {label: res['position-contextual-menu.remove'], icon: PrimeIcons.TRASH},
            {
              label: res[state === State.Active ? 'position-contextual-menu.archive' : 'position-contextual-menu.enable'],
              icon: state === State.Active ? PrimeIcons.BRIEFCASE : PrimeIcons.REFRESH,
              command: () => {
                this.store.dispatch(UpdatePosition({position: this.updatePositionState(this.position, state === State.Active ? State.Archived : State.Active)}));
              }
            }
          ]
        }];
      });
    });
  }

  private updatePositionState(position: Position, state: State): Position {
    let updatedPosition: Position = {
      ...position,
      state: state
    };
    return updatedPosition;
  }

  private getLatestStatus(): string | undefined {
    return this.position.statuses?.slice(-1)[0].label
  }

  private getCurrency(): string | undefined {
    /*let index = Object.keys(Currency).indexOf(this.position.dailyRate?.currency as unknown as Currency);
    return Object.values(Currency)[index];*/
    return this.position.dailyRate?.currency;
  }


}
