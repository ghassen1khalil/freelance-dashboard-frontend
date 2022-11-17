import {Component, Input, OnInit} from '@angular/core';
import {Position} from '../../../../generated';
import {MenuItem, PrimeIcons} from 'primeng/api';

@Component({
  selector: 'app-position-card',
  templateUrl: './position-card.component.html',
  styleUrls: ['./position-card.component.scss']
})
export class PositionCardComponent implements OnInit {

  @Input() public position: Position;
  public items: MenuItem[];
  public currency: string| undefined;
  public latestStatus: string| undefined;

  constructor() {
  }

  ngOnInit(): void {
    this.initMenuItems();
    this.currency = this.getCurrency();
    this.latestStatus = this.getLatestStatus();
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

  private getLatestStatus(): string| undefined {
    return this.position.statuses?.slice(-1)[0].label
  }

  private getCurrency(): string| undefined {
    /*let index = Object.keys(Currency).indexOf(this.position.dailyRate?.currency as unknown as Currency);
    return Object.values(Currency)[index];*/
    return this.position.dailyRate?.currency;
  }
}
