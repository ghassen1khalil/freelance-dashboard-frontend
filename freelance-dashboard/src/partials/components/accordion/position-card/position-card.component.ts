import {Component, Input, OnInit} from '@angular/core';
import {ConfirmationService, MenuItem, PrimeIcons, PrimeNGConfig} from 'primeng/api';
import {Position, PositionState} from '../../../../../generated';
import {TranslateService} from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import {EditPosition, UpdatePosition} from '../../../../core/store/actions/position.actions';
import {Router} from '@angular/router';

@Component({
  selector: 'app-position-card',
  templateUrl: './position-card.component.html',
  styleUrls: ['./position-card.component.scss'],
  providers: [ConfirmationService]
})
export class PositionCardComponent implements OnInit {

  @Input() public position: Position;
  public items: MenuItem[];
  public currency: string | undefined;
  public latestStatus: string | undefined;


  constructor(private translate: TranslateService,
              private store: Store,
              private confirmationService: ConfirmationService,
              private primengConfig: PrimeNGConfig,
              private router: Router) {
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    if (this.position.state !== null && this.position.state !== undefined) {
      this.initMenuItems(this.position.state);
    }
    this.currency = this.getCurrency();
    this.latestStatus = this.getLatestStatus();
  }

  private initMenuItems(state: PositionState) {
    this.translate.get(
      ['position-contextual-menu.title',
        'position-contextual-menu.edit',
        'position-contextual-menu.remove',
        'position-contextual-menu.archive',
        'position-contextual-menu.enable']
    ).subscribe(res => {
      this.items = [{
        label: res['position-contextual-menu.title'],
        items: [
          {
            label: res['position-contextual-menu.edit'],
            icon: PrimeIcons.PENCIL,
            command: () => {
              this.editPosition();
            }
          },
          {
            label: res['position-contextual-menu.remove'],
            icon: PrimeIcons.TRASH,
            command: () => {
              this.confirmDeletion();
            }
          },
          {
            label: res[state === PositionState.Active ? 'position-contextual-menu.archive' : 'position-contextual-menu.enable'],
            icon: state === PositionState.Active ? PrimeIcons.BRIEFCASE : PrimeIcons.REFRESH,
            command: () => {
              this.store.dispatch(
                UpdatePosition({
                  position: this.updatePositionState(this.position, state === PositionState.Active ? PositionState.Archived : PositionState.Active)
                })
              );
            }
          }
        ]
      }];
    });
  }

  private confirmDeletion() {
    this.translate.get([
      'delete-modal.position.areYouSure',
      'delete-modal.confirmation',
      'delete-modal.confirmed',
      'delete-modal.rejected',
      'delete-modal.cancelled',
    ]).subscribe(res => {
      this.confirmationService.confirm({
        message: res['delete-modal.position.areYouSure'],
        header: res['delete-modal.confirmation'],
        icon: 'pi pi-info-circle',
        accept: () => {
          this.store.dispatch(UpdatePosition({position: this.updatePositionState(this.position, PositionState.Deleted)}));
        }
      });
    });
  }

  private updatePositionState(position: Position, state: PositionState): Position {
    return {
      ...position,
      state: state
    };
  }

  private getLatestStatus(): string | undefined {
    return this.position.statuses?.slice(-1)[0].label
  }

  private getCurrency(): string | undefined {
    return this.position.dailyRate?.currency;
  }


  private editPosition() {
    this.store.dispatch(EditPosition({positionToEdit: this.position}));
    this.router.navigate(['/', 'position']);
  }
}
