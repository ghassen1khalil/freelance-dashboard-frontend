import {Component, Input, OnInit} from '@angular/core';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {Position, PositionState, StatusLabelEnum} from '../../../generated';
import {UpdatePosition} from '../../core/store/actions/position.actions';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {PositionDetailUtilService} from '../position-detail/position-detail-util.service';
import {MenuModule} from 'primeng/menu';
import {DragDropModule} from 'primeng/dragdrop';
import {ButtonModule} from 'primeng/button';
import {OpenPositionDetailsDrawer} from '../../core/store/actions/position-details-drawer.actions';
import {Tooltip} from 'primeng/tooltip';
import {Tag} from 'primeng/tag';
import {PositionCardUtilsService} from './position-card-utils.service';

@Component({
  selector: 'app-position-card',
  templateUrl: './position-card.component.html',
  styleUrls: ['./position-card.component.scss'],
  providers: [ConfirmationService, PositionDetailUtilService],
  standalone: true,
  imports: [
    MenuModule,
    DragDropModule,
    TranslateModule,
    ButtonModule,
    Tooltip,
    Tag
  ]
})
export class PositionCardComponent implements OnInit {

  @Input() public position: Position;

  public menuActions: MenuItem[];

  protected readonly StatusLabelEnum = StatusLabelEnum;

  ngOnInit(): void {
    //this.initializeActionsMenu(this.position.state!);
  }

  public viewPositionDetails() {
    this.store.dispatch(OpenPositionDetailsDrawer({
      position: this.position,
      isDrawerShown: true,
      isCreation: false
    }));
  }

  /*private initializeActionsMenu(state: PositionState) {
    this.translate.get(
      ['position-contextual-menu.title',
        'position-contextual-menu.edit',
        'position-contextual-menu.remove',
        'position-contextual-menu.archive',
        'position-contextual-menu.enable']
    ).subscribe(res => {
      this.menuActions = [{
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
                  position: this.positionUtils.updatePositionState(this.position, state === PositionState.Active ? PositionState.Archived : PositionState.Active)
                })
              );
            }
          }
        ]
      }];
    });
  }*/


  /*public editPosition() {
    this.store.dispatch(EditPosition({positionToEdit: this.position}));
    //this.router.navigate(['/', 'position']);
  }*/

  /*private confirmDeletion() {
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
          this.store.dispatch(UpdatePosition({position: this.positionUtils.updatePositionState(this.position, PositionState.Deleted)}));
        }
      });
    });
  }*/

  public switchPositionState() {
    this.store.dispatch(
      UpdatePosition({
        position: this.positionUtils.updatePositionState(this.position, this.position.state === PositionState.Active ? PositionState.Archived : PositionState.Active)
      })
    );
  }

  protected readonly PositionState = PositionState;

  constructor(private translate: TranslateService,
              private store: Store,
              private confirmationService: ConfirmationService,
              private router: Router,
              private positionUtils: PositionDetailUtilService,
              protected positionCardUtils: PositionCardUtilsService) {
  }
}
