import {Component, Input, OnInit} from '@angular/core';
import {ConfirmationService, MenuItem, PrimeIcons} from 'primeng/api';
import {Position, PositionState} from '../../../generated';
import {EditPosition, UpdatePosition} from '../../core/store/actions/position.actions';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {PositionUtils} from '../../core/utils/position-utils';
import {MenuModule} from 'primeng/menu';
import {DragDropModule} from 'primeng/dragdrop';
import {ButtonModule} from 'primeng/button';

@Component({
  selector: 'app-position-card',
  templateUrl: './position-card.component.html',
  styleUrls: ['./position-card.component.scss'],
  providers: [ConfirmationService, PositionUtils],
  standalone: true,
  imports: [
    MenuModule,
    DragDropModule,
    TranslateModule,
    ButtonModule
  ]
})
export class PositionCardComponent implements OnInit {

  @Input() public position: Position;

  public menuActions: MenuItem[];

  constructor(private translate: TranslateService,
              private store: Store,
              private confirmationService: ConfirmationService,
              private router: Router,
              private positionUtils: PositionUtils) {
  }

  ngOnInit(): void {
    this.initializeActionsMenu(this.position.state!);
  }

  private initializeActionsMenu(state: PositionState) {
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
          this.store.dispatch(UpdatePosition({position: this.positionUtils.updatePositionState(this.position, PositionState.Deleted)}));
        }
      });
    });
  }


  private editPosition() {
    this.store.dispatch(EditPosition({positionToEdit: this.position}));
    this.router.navigate(['/', 'position']);
  }

}
