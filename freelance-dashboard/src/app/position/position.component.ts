import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Currency, Position} from '../../../generated';
import {select, Store} from '@ngrx/store';
import * as PositionActions from '../../core/store/actions/position.actions';
import {Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {getPositionToEdit} from '../../core/store/reducers/position.reducer';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {PositionUtils} from '../../core/utils/position-utils';

@Component({
  selector: 'app-add-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss'],
  providers: [PositionUtils]
})
export class PositionComponent implements OnInit, OnDestroy {

  public positionForm: FormGroup;
  public currencies: string[] = Object.values(Currency);
  public isEditMode: boolean;
  public positionToEdit: Position | undefined;

  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store<{ positions: Position[] }>,
              private router: Router,
              private positionUtils: PositionUtils) {
  }

  ngOnInit(): void {
    this.store.pipe(
      select(getPositionToEdit),
      takeUntil(this.unsubscribe$)
    ).subscribe(positionToEdit => {
      if (isNotNullOrUndefined(positionToEdit)) {
        this.positionToEdit = positionToEdit;
        this.isEditMode = true;
      }
      this.positionForm = this.positionUtils.initPositionFormGroup(positionToEdit);
    });
  }

  public savePosition() {
    if (this.positionForm.valid) {
      this.store.dispatch(PositionActions.SavePosition({
        position: this.positionUtils.createPositionFromForm(false, this.positionForm, this.positionToEdit)
      }));
    }
  }

  public updatePosition() {
    let editedPosition = this.positionUtils
      .createPositionFromForm(true, this.positionForm, this.positionToEdit);
    editedPosition.id = this.positionToEdit?.id;
    this.store.dispatch(PositionActions.UpdatePosition({position: editedPosition}))
  }

  public cancel() {
    this.router.navigate(['/main']);
  }

  ngOnDestroy(): void {
    this.positionUtils.clearPositionToEditAndForm(this.positionForm, this.positionToEdit);
    this.unsubscribe$.complete();
  }

  /*public addStatus() {
    if (isNotNullOrUndefined(this.addPositionForm.controls['newStatus'].value)) {
      this.statusHistory.push(this.addPositionForm.controls['newStatus'].value);
    }
  }*/
}
