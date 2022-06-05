import {Component, OnInit, ViewChild} from '@angular/core';
import {Table} from 'primeng/table';
import {Position, PositionsService} from '../../../generated';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @ViewChild('dt') table: Table | undefined;

  public positions: Position[] ;
  public isAddPositionDialogShown: boolean = false;
  public isClosable: boolean = true;

  constructor(private positionService: PositionsService) {
  }

  ngOnInit(): void {
    this.positionService.findAll().subscribe(res => this.positions = res);
  }

  public globalFilter($event: Event) {
    const target = $event.target as HTMLInputElement;
    this.table?.filterGlobal(target.value, 'contains');
  }

  public openAddPositionDialog() {
    this.isAddPositionDialogShown = true;
  }

  public getLatestStatus(position: Position) {
    return position?.statuses?[position.statuses.length - 1] : undefined;
  }

  public handleCloseDialog() {
    this.isAddPositionDialogShown = false;
  }
}
