import {Position, PositionState, StatusLabelEnum} from '../../../generated';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DateService} from '../../core/services/date.service';
import * as PositionActions from '../../core/store/actions/position.actions';
import {Store} from '@ngrx/store';
import {Injectable} from '@angular/core';
import {NullityUtilService} from '../../core/utils/nullity-util.service';
import {SelectOption} from './select-option.interface';


@Injectable()
export class PositionDetailUtilService {

  constructor(private dateService: DateService,
              private store: Store,
              private nullityUtilService: NullityUtilService) {
  }

  public initPositionFormGroup(position: Position | undefined): FormGroup {
    let positionForm = new FormGroup({
      startingDate: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.startingDate : '', [Validators.required]),
      client: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.client : '', [Validators.required]),
      address: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.address : '', [Validators.required]),
      remoteDays: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? this.getRemoteDaysByValue(position?.remoteDays!) : ''),
      dailyRate: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.dailyRate?.amount : '', [Validators.required]),
      currency: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.dailyRate?.currency : '', [Validators.required]),
      role: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.mission?.role : '', [Validators.required]),
      project: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.mission?.project : ''),
      team: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.mission?.team : ''),
      manager: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.mission?.manager : ''),
      intermediaryCorporation: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.intermediary?.corporation : '', [Validators.required]),
      intermediaryName: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.intermediary?.name : '', [Validators.required]),
      intermediaryPhones: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.intermediary?.phones : ''),
      intermediaryEmail: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.intermediary?.email : '', [Validators.email]),
      note: new FormControl(''),
    });
    this.handleFormDisable(positionForm, position);
    return positionForm;
  }

  public createPositionFromForm(isEditMode: boolean, form: FormGroup, position: Position | undefined): Position {
    return {
      startingDate: this.dateService.format(form.controls['startingDate'].value, DateService.YYYY_MM_DD_FORMAT),
      creationDate: isEditMode ? position?.creationDate : this.dateService.today(DateService.YYYY_MM_DD_FORMAT),
      updateDate: isEditMode ? this.dateService.today(DateService.YYYY_MM_DD_FORMAT) : undefined,
      client: form.controls['client'].value,
      address: form.controls['address'].value,
      remoteDays: form.controls['remoteDays'].value,
      isFreelancerAccepted: isEditMode ? position?.isFreelancerAccepted : false,
      dailyRate: {
        amount: form.controls['dailyRate'].value,
        currency: form.controls['currency'].value
      },
      mission: {
        role: form.controls['role'].value,
        project: form.controls['project'].value,
        team: form.controls['team'].value,
        manager: form.controls['manager'].value,
      },
      intermediary: {
        corporation: form.controls['intermediaryCorporation'].value,
        name: form.controls['intermediaryName'].value,
        phones: form.controls['intermediaryPhones'].value,
        email: form.controls['intermediaryEmail'].value
      },
      statuses: isEditMode ? position?.statuses :
        [{
          'label': StatusLabelEnum.CommercialSuggestion,
          'date': this.dateService.today(DateService.YYYY_MM_DD_FORMAT)
        }],
      state: PositionState.Active
    };
  }

  public buildRemoteDaysOptions(): SelectOption[] {
    return Array.from({length: 6}, (_, i) => ({
      value: i,
      label: "<div class=\"fd-flex fd-flex-row\">" + "<img alt=\"dropdown icon\" src=\"/assets/icons/home-9-fill.png\">".repeat(i)
        + "<img alt=\"dropdown icon\" src=\"/assets/icons/home-9-line.png\">".repeat(5 - i) + "</div>",
    }));
  }

  public getRemoteDaysByValue(value: number): string {
    const remoteDaysOptions = this.buildRemoteDaysOptions();
    const option = remoteDaysOptions.find(option => option.value === value);
    return option ? option.label : '';
  }

  public clearPositionToEditAndForm(form: FormGroup, position: Position | undefined) {
    if (this.nullityUtilService.isNotNullOrUndefined(position)) {
      this.store.dispatch(PositionActions.ResetPositionToEdit())
      form.setValue({
        startingDate: '',
        client: '',
        address: '',
        remoteDays: '',
        dailyRate: '',
        currency: '',
        role: '',
        project: '',
        team: '',
        manager: '',
        intermediaryCorporation: '',
        intermediaryName: '',
        intermediaryPhones: '',
        intermediaryEmail: '',
        notes: '',
        initialStatus: '',
      });
    }
  }

  public updatePositionState(position: Position, state: PositionState | undefined): Position {
    return {
      ...position,
      updateDate: this.dateService.today(DateService.YYYY_MM_DD_FORMAT),
      state: state === undefined ? (position.state === PositionState.Active ? PositionState.Archived : PositionState.Active) : state
    };
  }

  public updatePosition(positionForm: FormGroup, position: Position) {
    let editedPosition = this.createPositionFromForm(true, positionForm, position);
    editedPosition.id = position?.id;
    editedPosition.freelancerId = position?.freelancerId;
    this.store.dispatch(PositionActions.UpdatePosition({position: editedPosition}))
  }

  private handleFormDisable(positionForm: FormGroup, position: Position | undefined) {
    if (position?.state === PositionState.Archived) {
      positionForm.disable();
    }
  }
}
