import {Component, Input, OnInit} from '@angular/core';
import {Position} from '../../../../generated';
import {MenuItem} from 'primeng/api';
import {Currency} from '../../core/domain/models/models';

@Component({
  selector: 'app-position-card',
  templateUrl: './position-card.component.html',
  styleUrls: ['./position-card.component.scss']
})
export class PositionCardComponent implements OnInit {

  @Input() public position: Position;

  public items: MenuItem[];

  constructor() { }

  ngOnInit(): void {
    this.initMenuItems();
  }

  private initMenuItems() {
    this.items = [{
      label: 'File',
      items: [
        {label: 'New', icon: 'pi pi-fw pi-plus'},
        {label: 'Download', icon: 'pi pi-fw pi-download'}
      ]
    },
      {
        label: 'Edit',
        items: [
          {label: 'Add User', icon: 'pi pi-fw pi-user-plus'},
          {label: 'Remove User', icon: 'pi pi-fw pi-user-minus'}
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
