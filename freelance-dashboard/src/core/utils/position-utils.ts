import {Position, State} from '../../../generated';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {DateService} from '../services/date.service';
import * as PositionActions from '../store/actions/position.actions';
import {Store} from '@ngrx/store';
import {Injectable} from '@angular/core';

@Injectable()
export class PositionUtils {

  constructor(private dateService: DateService,
              private store: Store) {
  }

  public initPositionFormGroup(positionToEdit: Position | undefined): FormGroup {
    return new FormGroup({
      startingDate: new FormControl(isNotNullOrUndefined(positionToEdit) ? this.parseStartingDate(positionToEdit?.startingDate) : '', [Validators.required]),
      client: new FormControl(isNotNullOrUndefined(positionToEdit) ? positionToEdit?.client : '', [Validators.required]),
      address: new FormControl(isNotNullOrUndefined(positionToEdit) ? positionToEdit?.address : '', [Validators.required]),
      isFullRemote: new FormControl(isNotNullOrUndefined(positionToEdit) ? positionToEdit?.isFullRemote : ''),
      dailyRate: new FormControl(isNotNullOrUndefined(positionToEdit) ? positionToEdit?.dailyRate?.amount : '', [Validators.required]),
      currency: new FormControl(isNotNullOrUndefined(positionToEdit) ? positionToEdit?.dailyRate?.currency : '', [Validators.required]),
      role: new FormControl(isNotNullOrUndefined(positionToEdit) ? positionToEdit?.mission?.role : '', [Validators.required]),
      project: new FormControl(isNotNullOrUndefined(positionToEdit) ? positionToEdit?.mission?.project : ''),
      tribe: new FormControl(isNotNullOrUndefined(positionToEdit) ? positionToEdit?.mission?.tribe : ''),
      manager: new FormControl(isNotNullOrUndefined(positionToEdit) ? positionToEdit?.mission?.manager : ''),
      intermediaryCorporation: new FormControl(isNotNullOrUndefined(positionToEdit) ? positionToEdit?.intermediary?.corporation : '', [Validators.required]),
      intermediaryName: new FormControl(isNotNullOrUndefined(positionToEdit) ? positionToEdit?.intermediary?.name : '', [Validators.required]),
      intermediaryPhones: new FormControl(isNotNullOrUndefined(positionToEdit) ? positionToEdit?.intermediary?.phones : ''),
      intermediaryEmail: new FormControl(isNotNullOrUndefined(positionToEdit) ? positionToEdit?.intermediary?.email : '', [Validators.email]),
      remarks: new FormControl(isNotNullOrUndefined(positionToEdit) ? positionToEdit?.remarks : ''),
      initialStatus: new FormControl('', isNotNullOrUndefined(positionToEdit) ? [] : [Validators.required]),
    });
  }

  public createPositionFromForm(isEditMode: boolean, form: FormGroup, position: Position | undefined): Position {
    return {
      startingDate: this.dateService.format(form.controls['startingDate'].value, DateService.YYYY_MM_DD_FORMAT),
      creationDate: isEditMode ? position?.creationDate : this.dateService.today(DateService.YYYY_MM_DD_FORMAT),
      updateDate: isEditMode ? this.dateService.today(DateService.YYYY_MM_DD_FORMAT) : undefined,
      client: form.controls['client'].value,
      address: form.controls['address'].value,
      isFullRemote: form.controls['isFullRemote'].value,
      dailyRate: {
        amount: form.controls['dailyRate'].value,
        currency: form.controls['currency'].value
      },
      mission: {
        role: form.controls['role'].value,
        project: form.controls['project'].value,
        tribe: form.controls['tribe'].value,
        manager: form.controls['manager'].value,
      },
      intermediary: {
        corporation: form.controls['intermediaryCorporation'].value,
        name: form.controls['intermediaryName'].value,
        phones: form.controls['intermediaryPhones'].value,
        email: form.controls['intermediaryEmail'].value
      },
      remarks: form.controls['remarks'].value,
      statuses: [{
        label: form.controls['initialStatus'].value,
        date: this.dateService.today(DateService.YYYY_MM_DD_FORMAT)
      }],
      state: State.Active
    };
  }

  public parseStartingDate(inputDate: string | undefined) {
    if (inputDate === undefined) {
      return;
    }
    return this.dateService.format(inputDate, DateService.YYYY_MM_DD_FORMAT)
  }

  public resetForm(form: FormGroup, position: Position | undefined) {
    if (isNotNullOrUndefined(position)) {
      this.store.dispatch(PositionActions.ResetPositionToEdit())
      form.setValue({
        startingDate: '',
        client: '',
        address: '',
        isFullRemote: '',
        dailyRate: '',
        currency: '',
        role: '',
        project: '',
        tribe: '',
        manager: '',
        intermediaryCorporation: '',
        intermediaryName: '',
        intermediaryPhones: '',
        intermediaryEmail: '',
        remarks: '',
        initialStatus: '',
      });
    }
  }
}
