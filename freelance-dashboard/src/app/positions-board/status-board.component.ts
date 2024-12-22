import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {DragDropModule} from 'primeng/dragdrop';
import {CardModule} from 'primeng/card';
import {OrderListModule} from 'primeng/orderlist';
import {select, Store} from '@ngrx/store';
import {Subject, takeUntil} from 'rxjs';
import {Position, PositionState, StatusLabelEnum} from '../../../generated';

import * as positionReducer from '../../core/store/reducers/position.reducer'
import {TranslateModule} from '@ngx-translate/core';
import {PositionCardComponent} from '../position-card/position-card.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {StatusBoardService} from './status-board.service';


@Component({
  selector: 'app-status-board',
  templateUrl: './status-board.component.html',
  styleUrls: ['./status-board.component.scss'],
  standalone: true,
  providers: [StatusBoardService, ConfirmationService],
  imports: [NgFor, OrderListModule, CardModule, DragDropModule, CommonModule, TranslateModule, PositionCardComponent, ConfirmDialogModule]
})
export class StatusBoardComponent implements OnInit, OnDestroy {

  @Input() public positionState: PositionState;

  public positions: { [statusKey: string]: Array<Position> } = {};
  public statusLabels = Object.values(StatusLabelEnum);
  public draggedPosition: Position | undefined;

  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store, private statusBoardService: StatusBoardService) {
  }

  ngOnInit(): void {
    this.store.pipe(select(positionReducer.getPositions), takeUntil(this.unsubscribe$)).subscribe((positions) => {
      if (positions !== undefined) {
        this.positions = positions[this.positionState];
      }
    });
  }


  onDrop(status: string) {
    this.statusBoardService.handlePositionWhenStatusChanged(this.positions, this.draggedPosition!, status);
  }

  getPositionsForStatus(status: StatusLabelEnum): Position[] {
    return this.positions[status] || [];
  }

  public findStatusLabelFromValue(literalStatusValue: string): StatusLabelEnum {
    return this.statusBoardService.findStatusLabelFromValue(literalStatusValue);
  }

  onDragStart(position: Position) {
    this.draggedPosition = position;
  }

  onDragEnd(status: String) {
  }

  ngOnDestroy(): void {
    //TODO updated this.positions /!\
    this.unsubscribe$.complete();
  }
}
