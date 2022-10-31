import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Table} from 'primeng/table';
import {Position, PositionsService} from '../../../generated';
import {select, Store} from '@ngrx/store';
import * as PositionActions from '../core/store/actions/position.action';
import {Subject, takeUntil} from 'rxjs';
import * as positionReducer from '../core/store/reducers/position.reducer'
import * as moment from 'moment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  @ViewChild('dt') table: Table | undefined;

  public positions: Position[];
  public isAddPositionDialogShown: boolean = false;
  public positionsYears: Set<number>;

  private unsubscribe$ = new Subject<void>();

  constructor(private positionService: PositionsService,
              private store: Store<{ positions: Position[] }>) {
    this.positionsYears = new Set;
  }

  ngOnInit(): void {

    this.store.dispatch(PositionActions.FetchPositions());

    this.store.pipe(
      select(positionReducer.getPositions),
      takeUntil(this.unsubscribe$)
    ).subscribe((positions) => {
      if (positions.length > 0) {
        this.positions = positions;
        this.extractYearsFromPositions();
      }
    });
  }

  private extractYearsFromPositions() {
    this.positions.map(position => {
      let year = moment(position.creationDate, "YYYY-MM-DD").year();
      this.positionsYears.add(year);
    })
  }

  public getPositionsByYear(year: number) {
    return this.positions.filter(position => moment(position.creationDate, "YYYY-MM-DD").year() === year);
  }

  public globalFilter($event: Event) {
    const target = $event.target as HTMLInputElement;
    this.table?.filterGlobal(target.value, 'contains');
  }

  public openAddPositionDialog() {
    this.isAddPositionDialogShown = true;
  }

  public getLatestStatus(position: Position) {
    return position?.statuses ? [position.statuses.length - 1] : undefined;
  }

  public handleCloseDialog() {
    this.isAddPositionDialogShown = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
