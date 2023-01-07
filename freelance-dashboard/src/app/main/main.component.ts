import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Position, PositionsService} from '../../../generated';
import {select, Store} from '@ngrx/store';
import {Subject, takeUntil} from 'rxjs';
import * as positionReducer from '../../core/store/reducers/position.reducer'
import moment from 'moment';
import {Router} from '@angular/router';
import {AuthService} from '@auth0/auth0-angular';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  public positions: Position[];
  public positionsYears: Set<number>;

  private unsubscribe$ = new Subject<void>();

  constructor(private router: Router,
              private positionService: PositionsService,
              private store: Store<{ positions: Position[] }>,
              private authService: AuthService) {
    this.positionsYears = new Set;
  }

  ngOnInit(): void {
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
      let year = moment(position.startingDate, "YYYY-MM-DD").year();
      this.positionsYears.add(year);
    })
  }

  public getPositionsByYear(year: number) {
    return this.positions.filter(position => moment(position.startingDate, "YYYY-MM-DD").year() === year);
  }

  /*public globalFilter($event: Event) {
    const target = $event.target as HTMLInputElement;
    this.table?.filterGlobal(target.value, 'contains');
  }*/


  public goToAddPosition() {
    this.router.navigate(['/','add-position']);
  }

  /*public getLatestStatus(position: Position) {
    return position?.statuses ? [position.statuses.length - 1] : undefined;
  }*/

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
