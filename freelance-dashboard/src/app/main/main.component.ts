import {Component, OnDestroy, OnInit} from '@angular/core';
import {Position, State} from '../../../generated';
import {select, Store} from '@ngrx/store';
import {Subject, takeUntil} from 'rxjs';
import * as positionReducer from '../../core/store/reducers/position.reducer'
import moment from 'moment';
import {Router} from '@angular/router';
import {SetFilteredPositions} from '../../core/store/actions/position.actions';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  public activePositions: Position[];
  public archivedPositions: Position[];
  public positionsYears: Set<number>;
  public isFilterSet: boolean;

  private unsubscribe$ = new Subject<void>();

  constructor(private router: Router,
              private store: Store) {
    this.positionsYears = new Set;
  }

  ngOnInit(): void {
    this.store.pipe(
      select(positionReducer.getPositions),
      takeUntil(this.unsubscribe$)
    ).subscribe((positions) => {
      if (positions && positions.length > 0) {
        this.archivedPositions = this.extractPositionsByState(positions, State.Archived);
        this.activePositions = this.extractPositionsByState(positions, State.Active);
        this.extractYearsFromPositions(this.activePositions);
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
        let activePosition: Position[] = [];
        let archivedPosition: Position[] = [];
        filteredPositions.forEach(pos => {
          if (State.Active === pos.state) {
            activePosition.push(pos);
          } else if (State.Archived === pos.state) {
            archivedPosition.push(pos);
          }
        })
        this.archivedPositions = archivedPosition;
        this.activePositions = activePosition;
        this.extractYearsFromPositions(this.activePositions);
      }
    });
  }

  private extractPositionsByState(positions: Position[], state: State): Position[] {
    return positions.filter(pos => pos.state === state);
  }

  private extractYearsFromPositions(positions: Position[]) {
    this.positionsYears = new Set;
    positions.map(position => {
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
    return this.activePositions.filter(position => moment(position.startingDate, "YYYY-MM-DD").year() === year);
  }

  public goToAddPosition() {
    this.router.navigate(['/', 'add-position']);
  }

  public isNoResultForFilter(): boolean {
    return this.isFilterSet !== undefined && !(this.activePositions.length > 0 || this.archivedPositions.length > 0);
  }

  public isNoPositionsYet(): boolean {
    return this.isFilterSet === undefined && this.activePositions.length === 0 && this.archivedPositions.length === 0;
  }

  ngOnDestroy(): void {
    this.store.dispatch(SetFilteredPositions({positions: undefined}))
    this.unsubscribe$.complete();
  }
}
