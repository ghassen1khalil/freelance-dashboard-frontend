import {Component, Input, OnInit} from '@angular/core';
import {Position} from '../../../../generated';
import {MenuItem, PrimeIcons} from 'primeng/api';
import {Currency} from '../../core/domain/models/models';

@Component({
  selector: 'app-position-card',
  templateUrl: './position-card.component.html',
  styleUrls: ['./position-card.component.scss']
})
export class PositionCardComponent implements OnInit {

  @Input() public position: Position;

  public items: MenuItem[];

  constructor() {
  }

  ngOnInit(): void {
    this.initMenuItems();
  }

  private initMenuItems() {
    this.items = [{
      label: 'Gérer',
      items: [
        {label: 'Éditer', icon: PrimeIcons.PENCIL},
        {label: 'Supprimer', icon: PrimeIcons.TRASH}
      ]
    }];
  }

  public getLatestStatus() {
    return this.position.statuses?.slice(-1)[0].label
  }

  public getCurrency() {
    let index = Object.keys(Currency).indexOf(this.position.dailyRate?.currency as unknown as Currency);
    return Object.values(Currency)[index];
  }
}
