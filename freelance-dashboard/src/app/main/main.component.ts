import {Component, OnDestroy, OnInit} from '@angular/core';
import {Position} from '../../../generated';
import {select, Store} from '@ngrx/store';
import {Subject, takeUntil} from 'rxjs';
import * as positionReducer from '../../core/store/reducers/position.reducer'
import moment from 'moment';
import {Router} from '@angular/router';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  public positions: Position[];
  public positionsYears: Set<number>;
  public isFilterSet: boolean;

  private unsubscribe$ = new Subject<void>();

  constructor(private router: Router,
              private store: Store<{ positions: Position[] }>) {
    this.positionsYears = new Set;
  }

  ngOnInit(): void {
    this.store.pipe(
      select(positionReducer.getPositions),
      takeUntil(this.unsubscribe$)
    ).subscribe((positions) => {
      if (positions && positions.length > 0) {
        this.updatePositionsData(positions);
      }
    });

    this.store.pipe(
      select(positionReducer.getFilter),
      takeUntil(this.unsubscribe$)
    ).subscribe(filter => {
      if (filter !== undefined && filter.length > 0) {
        this.isFilterSet = true;
      }
    });

    this.store.pipe(
      select(positionReducer.getFilteredPositions),
      takeUntil(this.unsubscribe$)
    ).subscribe((filteredPositions) => {
      if (filteredPositions !== undefined) {
        this.updatePositionsData(filteredPositions);
      }
    });
  }

  private updatePositionsData(positions: Position[]) {
    this.positions = positions;
    this.extractYearsFromPositions();
  }

  private extractYearsFromPositions() {
    this.positionsYears = new Set;
    this.positions.map(position => {
      let year = moment(position.startingDate, "YYYY-MM-DD").year();
      this.positionsYears.add(year);
    });
    this.positionsYears = new Set(
      Array.from(this.positionsYears)
        .sort((a, b) => b - a) // sort in descending order
    );
  }

  /**
   * return True is year is the biggest one
   */
  public isLatestYear(year: any): boolean {
    return year === Math.max(...Array.from(this.positionsYears).map(Number));
  }

  public getPositionsByYear(year: number) {
    return this.positions.filter(position => moment(position.startingDate, "YYYY-MM-DD").year() === year);
  }

  public goToAddPosition() {
    this.router.navigate(['/', 'add-position']);
  }

  /*public getLatestStatus(position: Position) {
    return position?.statuses ? [position.statuses.length - 1] : undefined;
  }*/

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
