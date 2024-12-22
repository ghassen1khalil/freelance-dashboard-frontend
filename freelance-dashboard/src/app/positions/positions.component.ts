import {Component, OnInit} from '@angular/core';
import {Position, PositionState} from '../../../generated';
import {Router} from '@angular/router';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss']
})
export class PositionsComponent implements OnInit {

  positions: Position[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public goToAddPosition() {
    this.router.navigate(['/', 'position']);
  }

  protected readonly PositionState = PositionState;
}
