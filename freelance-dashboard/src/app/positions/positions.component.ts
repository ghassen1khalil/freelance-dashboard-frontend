import { Component} from '@angular/core';
import {PositionState} from '../../../generated';
import {Router} from '@angular/router';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss']
})
export class PositionsComponent  {

  protected readonly PositionState = PositionState;

  constructor(private router: Router) { }

  public goToAddPosition() {
    this.router.navigate(['/', 'position']);
  }
}
