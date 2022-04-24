import {Component, OnInit, ViewChild} from '@angular/core';
import {Position} from '../core/domain/models/position';
import {Table} from 'primeng/table';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @ViewChild('dt') table: Table | undefined;

  public positions: Position[] = [
    {
      year: 2022,
      client: 'TDS',
      projectOrEntity: 'Digital Factory',
      localisation: {
        isFullRemote: true,
        address: '10 avenue Hoche 75008 Paris'
      },
      intermediary: {
        corporation: 'ECONOCOM',
        name: 'Mariame KARAMA',
        phones: ['06 01 02 03 04'],
        email: 'kmaraiame@econocom.fr'
      },
      statusHistory: ['Entretien planifié le XX/XX', 'Validated'],
      remarks: 'GO pour le 11/04'
    },
    {
      year: 2022,
      client: 'Société Général',
      projectOrEntity: 'SGCIB',
      localisation: {
        isFullRemote: false,
        address: 'La Défense'
      },
      intermediary: {
        corporation: 'OMICRONE',
        name: 'Paul PETIT',
        phones: ['06 66 24 45 88'],
        email: 'paulpetit@omicrone.fr'
      },
      statusHistory: ['Entretien planifié le XX/XX', 'Abandonné'],
      remarks: 'Le client n a pas donné son retour'
    },
  ]
  public isAddPositionDialogShown: boolean = false;
  public isClosable: boolean = true;

  constructor() {
  }

  ngOnInit(): void {
  }

  public globalFilter($event: Event) {
    const target = $event.target as HTMLInputElement;
    this.table?.filterGlobal(target.value, 'contains');
  }

  public openAddPositionDialog() {
    this.isAddPositionDialogShown = true;
  }

  public getLatestStatus(position: Position) {
    if (position === null || position === undefined) {
      return undefined;
    }
    return position.statusHistory[position.statusHistory.length - 1];
  }

  public handleCloseDialog() {
    this.isAddPositionDialogShown = false;
  }
}
