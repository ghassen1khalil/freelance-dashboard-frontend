import { Component, OnInit } from '@angular/core';
import {Position, PositionState} from '../../../generated';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss']
})
export class PositionsComponent implements OnInit {

  positions: Position[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  protected readonly PositionState = PositionState;
}
