import {Component, Input, OnInit} from '@angular/core';
import {ConfirmationService, MenuItem, PrimeIcons} from 'primeng/api';
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
import {ConfirmDialog} from 'primeng/confirmdialog';

@Component({
  selector: 'app-position-card',
  templateUrl: './position-card.component.html',
  styleUrls: ['./position-card.component.scss'],
  providers: [PositionDetailUtilService],
  standalone: true,
  imports: [
    MenuModule,
    DragDropModule,
    TranslateModule,
    ButtonModule,
    Tooltip,
    Tag,
    ConfirmDialog
  ]
})
export class PositionCardComponent implements OnInit {

  @Input() public position: Position;

  public menuActions: MenuItem[];

  protected readonly StatusLabelEnum = StatusLabelEnum;

  constructor(private translate: TranslateService,
              private store: Store,
              private confirmationService: ConfirmationService,
              private positionUtils: PositionDetailUtilService,
              protected positionCardUtils: PositionCardUtilsService) {
  }

  ngOnInit(): void {
    this.initializeActionsMenu(this.position.state!);
  }

  public viewPositionDetails() {
    this.store.dispatch(OpenPositionDetailsDrawer({
      position: this.position,
      isDrawerShown: true,
      isCreation: false,
      isDuplication: false
    }));
  }

  public duplicatePosition() {
    this.store.dispatch(OpenPositionDetailsDrawer({
      position: this.position,
      isDrawerShown: true,
      isCreation: false,
      isDuplication: true
    }));
  }

  public onMenuButtonClick(event: MouseEvent, menu: any) {
    event.preventDefault();
    event.stopPropagation();
    if (menu && typeof menu.toggle === 'function') {
      menu.toggle(event);
    }
  }

  private initializeActionsMenu(state: PositionState) {
    this.translate.get(
      ['position-contextual-menu.title',
        'position-contextual-menu.edit',
        'position-contextual-menu.remove',
        'position-contextual-menu.archive',
        'position-contextual-menu.duplicate',
        'position-contextual-menu.enable']
    ).subscribe(res => {
      this.menuActions = [{
        label: res['position-contextual-menu.title'],
        items: [
          {
            label: res['position-contextual-menu.duplicate'],
            icon: 'pi pi-copy',
            command: () => this.duplicatePosition()
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
        key: 'delete-confirmation',
        accept: () => {
          this.store.dispatch(UpdatePosition({position: this.positionUtils.updatePositionState(this.position, PositionState.Deleted)}));
        },
        reject: () => {
          this.confirmationService.close();
        }
      });
    });
  }


  public switchPositionState() {
    this.store.dispatch(
      UpdatePosition({
        position: this.positionUtils.updatePositionState(this.position, this.position.state === PositionState.Active ? PositionState.Archived : PositionState.Active)
      })
    );
  }

  protected readonly PositionState = PositionState;
}
