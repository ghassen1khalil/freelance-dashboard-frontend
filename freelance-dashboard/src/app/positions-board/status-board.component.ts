import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {DragDropModule} from 'primeng/dragdrop';
import {CardModule} from 'primeng/card';
import {OrderListModule} from 'primeng/orderlist';
import {select, Store} from '@ngrx/store';
import {Subject, takeUntil} from 'rxjs';
import {Position, PositionState, Status, StatusLabelEnum} from '../../../generated';

import * as positionReducer from '../../core/store/reducers/position.reducer'
import {TranslateModule} from '@ngx-translate/core';
import {PositionCardComponent} from '../position-card/position-card.component';
import {UpdatePosition} from '../../core/store/actions/position.actions';


@Component({
  selector: 'app-status-board',
  templateUrl: './status-board.component.html',
  styleUrls: ['./status-board.component.scss'],
  standalone: true,
  imports: [NgFor, OrderListModule, CardModule, DragDropModule, CommonModule, TranslateModule, PositionCardComponent]
})
export class StatusBoardComponent implements OnInit, OnDestroy{

  @Input() public positionState: PositionState;

  public positions: {[statusKey: string]: Array<Position>} = {};
  public statusLabels = Object.values(StatusLabelEnum);
  public draggedPosition: Position | undefined;

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

  onDrop(event: any, status: string ) {
    const latestStatus = this.getLatestStatus(this.draggedPosition!);
    const targetStatus = this.buildTargetStatus(status);
    const draggedPositionIndex = this.getDraggedPositionIndexFromStatusColumn(this.positions, latestStatus);

    if (latestStatus.label !== targetStatus.label) {
      const updatedPosition = this.buildUpdatedPositions(this.draggedPosition!, targetStatus);
      this.positions = {
        ...this.positions,
        [latestStatus.label!]: [...this.removedDraggedPositionFromPreviousStatusColumn(this.positions[latestStatus.label!], draggedPositionIndex)],
        [targetStatus.label!]: [...(this.positions[targetStatus.label!] || []), updatedPosition],
      };
      // Dispatch update action to store
      this.store.dispatch(UpdatePosition({ position: updatedPosition }));
    }

    this.draggedPosition = undefined;
  }

  private getDraggedPositionIndexFromStatusColumn(positions: {[statusKey: string]: Array<Position>}, status: Status): number {
    return positions[status.label!].findIndex(pos => pos.id === this.draggedPosition!.id);
  }

  private getLatestStatus(draggedPosition: Position): Status {
    return draggedPosition!.statuses![this.draggedPosition!.statuses!.length - 1];
  }

  private buildTargetStatus(status: string): Status {
    return {
      label: this.findStatusLabelFromValue(status),
      date: new Date().toISOString()
    };
  }

  private buildUpdatedPositions(draggedPosition: Position, targetStatus: Status): Position {
    return {
      ...draggedPosition,
      statuses: [...draggedPosition!.statuses!, targetStatus]
    };
  }

  private removedDraggedPositionFromPreviousStatusColumn(listOfPositions: Position[], index: number) {
    const updatedPositions = [...listOfPositions];
    updatedPositions.splice(index, 1);
    return updatedPositions;
  }

  getPositionsForStatus(status: StatusLabelEnum): Position[] {
    return this.positions[status] || [];
  }

  public findStatusLabelFromValue(value: string): StatusLabelEnum {
    for (const key in StatusLabelEnum) {
      if (StatusLabelEnum[key as keyof typeof StatusLabelEnum] === value) {
        return StatusLabelEnum[key as keyof typeof StatusLabelEnum];
      }
    }
    throw new Error('Invalid StatusLabelEnum value: ' + value);
  }

  onDragStart(position: Position) {
    console.log('dragging position ' + position.client);
    this.draggedPosition = position;
  }

  onDragEnd() {
  }

  ngOnDestroy(): void {
    //TODO updated this.positions /!\
    this.unsubscribe$.complete();
  }
}
