import {Component, OnDestroy, OnInit} from '@angular/core';
import {Position, State} from '../../../generated';
import {select, Store} from '@ngrx/store';
import {Subject, takeUntil} from 'rxjs';
import * as positionReducer from '../../core/store/reducers/position.reducer'
import * as filterReducer from '../../core/store/reducers/filter.reducer'
import {Router} from '@angular/router';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {SetFilteredPositions} from '../../core/store/actions/filter.actions';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  public positionsMap: {[key: string]: Array<Position>};
  public onlyArchived: boolean;
  public positionsYears: string[] = [];
  public isFilterSet: boolean | undefined;

  private unsubscribe$ = new Subject<void>();

  constructor(private router: Router,
              private store: Store) {
  }

  ngOnInit(): void {
    this.store.pipe(
      select(positionReducer.getPositions),
      takeUntil(this.unsubscribe$)
    ).subscribe((positions) => {
      if (positions !== undefined) {
        this.positionsMap = positions;
        this.onlyArchived = Object.keys(this.positionsMap).length === 1 && isNotNullOrUndefined(this.positionsMap[State.Archived]);
        this.positionsYears = this.getPositionsYears();
      }
    });

    this.store.pipe(
      select(filterReducer.getFilter),
      takeUntil(this.unsubscribe$)
    ).subscribe(filter => {
      if (filter !== undefined && filter.length > 0) {
        this.isFilterSet = true;
      } else {
        this.isFilterSet = undefined;
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
    years.sort((a, b) => parseInt(b) - parseInt(a));
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
    return this.isFilterSet !== undefined && Object.keys(this.positionsMap)?.length === 0;
  }

  public isNoPositionsYet(): boolean {
    return this.isFilterSet === undefined && Object.keys(this.positionsMap)?.length === 0;
  }

  ngOnDestroy(): void {
    this.store.dispatch(SetFilteredPositions({positions: undefined}))
    this.unsubscribe$.complete();
  }
}
