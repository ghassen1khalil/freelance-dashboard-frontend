import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {DragDropModule} from 'primeng/dragdrop';
import {CardModule} from 'primeng/card';
import {OrderListModule} from 'primeng/orderlist';
import {select, Store} from '@ngrx/store';
import {Subject, takeUntil} from 'rxjs';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {Position, PositionState, Status, StatusLabelEnum} from '../../../generated';

import * as positionReducer from '../../core/store/reducers/position.reducer'
import {TranslateModule} from '@ngx-translate/core';


@Component({
  selector: 'app-status-board',
  templateUrl: './status-board.component.html',
  styleUrls: ['./status-board.component.scss'],
  standalone: true,
  imports: [NgFor, OrderListModule, CardModule, DragDropModule, CommonModule, TranslateModule]
})
export class StatusBoardComponent implements OnInit, OnDestroy{

  @Input() public positionState: PositionState;

  draggedPosition: Position | null = null;
  sourcePosition: Position | null = null;
  draggedOver: string | null = null;

  protected readonly StatusLabelEnum = StatusLabelEnum;
  protected readonly PositionState = PositionState;


  public positions: {[statusKey: string]: Array<Position>} = {};


  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.pipe(
      select(positionReducer.getPositions),
      takeUntil(this.unsubscribe$)
    ).subscribe((positions) => {
      if (positions !== undefined) {

        this.positions = positions[this.positionState];
      }
    });
  }

  getPositionByStateAndStatus(status: string): Array<Position> {
    return this.positions[status];
  }

  dragStart(position: Position) {
    this.draggedPosition = position;
    this.sourcePosition = position;
  }

  dragEnd() {
    this.draggedPosition = null;
    this.sourcePosition = null;
    this.draggedOver = null;
  }

  dragEnter(status: StatusLabelEnum) {
    this.draggedOver = status;
  }

  dragLeave() {
    this.draggedOver = null;
  }

  drop(event: DragEvent, newStatus: StatusLabelEnum) {
    if (this.draggedPosition) {
      const positionIndex = this.positions[newStatus].findIndex(position => position.id === this.draggedPosition!.id);
      if (positionIndex !== -1) {
        const updatedPosition = this.positions[newStatus][positionIndex];
        updatedPosition.statuses?.push({
          'date': new Date().toDateString(),
          'label': newStatus
        });
        this.positions[newStatus][positionIndex] = updatedPosition;
      }
    }
    this.draggedOver = null;
    this.sourcePosition = null;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
