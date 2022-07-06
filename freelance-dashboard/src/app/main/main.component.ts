import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Table} from 'primeng/table';
import {Position, PositionsService} from '../../../generated';
import {select, Store} from '@ngrx/store';
import * as PositionActions from '../core/store/position.action';
import {map, Observable, Subject, Subscription, takeUntil} from 'rxjs';
import * as positionReducer from '../core/store/position.reducer'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  @ViewChild('dt') table: Table | undefined;

  public positions: Position[];
  public isAddPositionDialogShown: boolean = false;
  public isClosable: boolean = true;

  private unsubscribe$ = new Subject<void>();

  positions$: Observable<Position[]>;
  positionSubscription: Subscription;

  constructor(private positionService: PositionsService,
              private store: Store<{ positions: Position[] }>) {
    this.positions$ = store.select(positionReducer.getPositions);
    //store.pipe(select('positions')).subscribe(positions => console.log(positions));
  }

  ngOnInit(): void {

    /*this.store.pipe(
      select(selectApis),
      takeUntil(this.unsubscribe$)
    ).subscribe(state => {
      this.apis = state.apis;
    });*/


    this.store.dispatch(PositionActions.FetchPositions());
    this.store.pipe(
      select('positions'),
      takeUntil(this.unsubscribe$)
    ).subscribe(positions => console.log(positions));
    /*this.store.pipe(
      select('positions'),
      takeUntil(this.unsubscribe$)
    ).subscribe((positions: Position[]) => {
      /!*console.log(positions);
      console.log(JSON.stringify(positions));*!/
      if (isNotNullOrUndefined(positions)) {
        this.positions = positions;
      }
    });*/


    /*this.positionSubscription = this.positions$
      .pipe(
        map(x => {
          this.positions = x.Positions;
        })
      ).subscribe();*/
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
