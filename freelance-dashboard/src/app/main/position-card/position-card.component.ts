import {Component, Input, OnInit} from '@angular/core';
import {Position} from '../../../../generated';

@Component({
  selector: 'app-position-card',
  templateUrl: './position-card.component.html',
  styleUrls: ['./position-card.component.scss']
})
export class PositionCardComponent implements OnInit {

  @Input() public position: Position;

  constructor() { }

  ngOnInit(): void {
  }

}
