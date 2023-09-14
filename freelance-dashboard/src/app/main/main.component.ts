import {Component, OnDestroy, OnInit} from '@angular/core';
import {Position, State} from '../../../generated';
import {select, Store} from '@ngrx/store';
import {Subject, takeUntil} from 'rxjs';
import * as positionReducer from '../../core/store/reducers/position.reducer'
import {Router} from '@angular/router';
import {SetFilteredPositions} from '../../core/store/actions/position.actions';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  public activePositions: Position[] = [];
  public archivedPositions: Position[] = [];

  public positionsMap: { [key: string]: Array<Position> };
  public onlyArchived: boolean;
  public positionsYears: string[] = [];
  public isFilterSet: boolean | undefined;

  private unsubscribe$ = new Subject<void>();

  constructor(private router: Router,
              private store: Store) {}

  ngOnInit(): void {
    this.store.pipe(
      select(positionReducer.getPositions),
      takeUntil(this.unsubscribe$)
    ).subscribe((positions) => {
      if (positions) {
        this.positionsMap = positions;
        this.onlyArchived = Object.keys(this.positionsMap).length === 1 && this.positionsMap[State.Archived].length > 0;
        this.positionsYears = this.getPositionsYears();
      }
    });

    this.store.pipe(
      select(positionReducer.getFilter),
      takeUntil(this.unsubscribe$)
    ).subscribe(filter => {
      if (filter !== undefined && filter.length > 0) {
        this.isFilterSet = true;
      } else {
        this.isFilterSet = undefined;
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
        /*this.archivedPositions = archivedPosition;
        this.activePositions = activePosition;
        this.getPositionsYears(this.activePositions);*/
      }
    });
  }


  private getPositionsYears(): string[] {
    let years: string[] = [];
    Object.keys(this.positionsMap).forEach(key => {
      if (State.Archived !== key) {
        years.push(key);
      }
    });
    return years;
  }

  /**
   * return True is year is the biggest one
   */
  public isLatestYear(key: any): boolean {
    return key === Math.max(...Array.from(this.positionsYears).map(Number)).toString();
  }

  public goToAddPosition() {
    this.router.navigate(['/', 'position']);
  }

  public isNoResultForFilter(): boolean {
    return this.isFilterSet !== undefined && !(this.activePositions?.length > 0 || this.archivedPositions?.length > 0);
  }

  public isNoPositionsYet(): boolean {
    return this.isFilterSet === undefined && Object.keys(this.positionsMap).length === 0;
  }

  ngOnDestroy(): void {
    this.store.dispatch(SetFilteredPositions({positions: undefined}))
    this.unsubscribe$.complete();
  }
}
