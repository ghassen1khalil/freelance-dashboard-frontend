import { Component} from '@angular/core';
import {PositionState} from '../../../generated';
import {Router} from '@angular/router';
import {Store} from "@ngrx/store";
import {OpenPositionDetailsDrawer} from "../../core/store/actions/position-details-drawer.actions";

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss']
})
export class PositionsComponent  {

  protected readonly PositionState = PositionState;

  constructor(private router: Router,
              private store: Store) { }

  public goToAddPosition() {
    let position = {}
    this.store.dispatch(OpenPositionDetailsDrawer({
      position: position,
      isDrawerShown: true,
      isCreation: true,
      isDuplication: false
    }));
  }
}
