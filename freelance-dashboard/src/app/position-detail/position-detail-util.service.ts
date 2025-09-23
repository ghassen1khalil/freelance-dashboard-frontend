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
    const hasIntermediary = !!(position && position.intermediary && (
      position.intermediary.corporation || position.intermediary.name || position.intermediary.phones || position.intermediary.email
    ));

    const hasPlannedStartingDate = !!(position && position.startingDate);

    let positionForm = new FormGroup({
      // Toggle to control planned starting date visibility/requirement
      hasPlannedStartingDate: new FormControl(hasPlannedStartingDate),
      startingDate: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.startingDate : ''),
      client: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.client : '', [Validators.required]),
      address: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.address : '', [Validators.required]),
      remoteDays: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.remoteDays : ''),
      dailyRate: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.dailyRate?.amount : '', [Validators.required]),
      currency: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.dailyRate?.currency : '', [Validators.required]),
      role: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.mission?.role : '', [Validators.required]),
      project: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.mission?.project : ''),
      team: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.mission?.team : ''),
      manager: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.mission?.manager : ''),
      // Skills controls
      skills: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? (position?.skills ?? []) : []),
      skillInput: new FormControl(''),
      // Intermediary toggle
      hasIntermediary: new FormControl(hasIntermediary),
      // Intermediary fields (validators applied conditionally)
      intermediaryCorporation: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.intermediary?.corporation : ''),
      intermediaryName: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.intermediary?.name : ''),
      intermediaryPhones: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.intermediary?.phones : ''),
      intermediaryEmail: new FormControl(this.nullityUtilService.isNotNullOrUndefined(position) ? position?.intermediary?.email : '', [Validators.email]),
      note: new FormControl(''),
    });

    // Apply conditional validators for intermediary fields based on toggle
    this.applyIntermediaryValidators(positionForm);
    // Apply conditional validators for starting date based on toggle
    this.applyStartingDateValidators(positionForm);

    this.handleFormDisable(positionForm, position);
    return positionForm;
  }

  public createPositionFromForm(isEditMode: boolean, form: FormGroup, position: Position | undefined): Position {
    const hasIntermediary = !!form.controls['hasIntermediary']?.value;
    const intermediary = hasIntermediary ? {
      corporation: form.controls['intermediaryCorporation'].value,
      name: form.controls['intermediaryName'].value,
      phones: form.controls['intermediaryPhones'].value,
      email: form.controls['intermediaryEmail'].value
    } : undefined;

    const hasPlannedStartingDate = !!form.controls['hasPlannedStartingDate']?.value;
    const startingDate = hasPlannedStartingDate && form.controls['startingDate'].value
      ? this.dateService.toApiDateOnly(form.controls['startingDate'].value)!.toString()
      : undefined;

    return {
      startingDate: startingDate,
      creationDate: isEditMode ? position?.creationDate : this.dateService.toApiDateTime(new Date())?.toString(),
      updateDate: isEditMode ? this.dateService.toApiDateTime(new Date())?.toString() : undefined,
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
      skills: form.controls['skills'].value,
      intermediary: intermediary,
      //notes: isEditMode ? [...(position?.notes ?? []), form.get('notes')?.value] : form.controls['notes'].value,
      statuses: isEditMode ? position?.statuses :
        [
          {
            'label': StatusLabelEnum.CommercialSuggestion,
            'date': this.dateService.toApiDateTime(new Date())?.toString()
          }
        ],
      state: PositionState.Active
    };
  }

  public clearPositionToEditAndForm(form: FormGroup, position: Position | undefined) {
    if (this.nullityUtilService.isNotNullOrUndefined(position)) {
      this.store.dispatch(PositionActions.ResetPositionToEdit())
      form.setValue({
        hasPlannedStartingDate: false,
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
        // Skills
        skills: [],
        skillInput: '',
        intermediaryCorporation: '',
        intermediaryName: '',
        intermediaryPhones: '',
        intermediaryEmail: '',
        note: ''
      });
    }
  }

  public updatePositionState(position: Position, state: PositionState | undefined): Position {
    return {
      ...position,
      updateDate: this.dateService.toApiDateTime(new Date())?.toString(),
      state: state === undefined ? (position.state === PositionState.Active ? PositionState.Archived : PositionState.Active) : state
    };
  }

  public generateRemoteDaysOptions(): SelectOption[] {
    const options: SelectOption[] = [];
    for (let i = 0; i <= 5; i++) {
      const filledIcons = "<img alt=\"dropdown icon\" src=\"/assets/icons/home-9-fill.png\">".repeat(i);
      const outlineIcons = "<img alt=\"dropdown icon\" src=\"/assets/icons/home-9-line.png\">".repeat(5 - i);
      const label = `<div class="fd-flex fd-flex-row">${filledIcons}${outlineIcons}</div>`;
      options.push({label, value: i});
    }
    return options;
  }

  public handleSelectedRemoteDaysOptionDisplay(selectedOption: SelectOption, options: SelectOption[], position: Position): string {
    if (selectedOption) {
      return selectedOption.label;
    } else if (position) {
      return options.filter(option => option.value === position.remoteDays)[0]?.label;
    } else {
      return options[0]?.label;
    }
  }

  public updatePosition(positionForm: FormGroup, position: Position) {
    let editedPosition = this.createPositionFromForm(true, positionForm, position);
    editedPosition.id = position?.id;
    editedPosition.freelancerId = position?.freelancerId;
    this.store.dispatch(PositionActions.UpdatePosition({position: editedPosition}))
  }

  public applyIntermediaryValidators(form: FormGroup): void {
    const hasIntermediary = !!form.get('hasIntermediary')?.value;
    const corpCtrl = form.get('intermediaryCorporation');
    const nameCtrl = form.get('intermediaryName');

    if (!corpCtrl || !nameCtrl) return;

    if (hasIntermediary) {
      corpCtrl.setValidators([Validators.required]);
      nameCtrl.setValidators([Validators.required]);
    } else {
      corpCtrl.clearValidators();
      nameCtrl.clearValidators();
    }

    corpCtrl.updateValueAndValidity({emitEvent: false});
    nameCtrl.updateValueAndValidity({emitEvent: false});
  }

  public applyStartingDateValidators(form: FormGroup): void {
    const hasPlanned = !!form.get('hasPlannedStartingDate')?.value;
    const startingCtrl = form.get('startingDate');
    if (!startingCtrl) return;

    if (hasPlanned) {
      startingCtrl.setValidators([Validators.required]);
    } else {
      startingCtrl.clearValidators();
      // Also clear the value when disabled to avoid accidental submission
      if (startingCtrl.enabled && startingCtrl.value) {
        // don't emit event to avoid loops; just clear if toggle is off
        startingCtrl.setValue('');
      }
    }
    startingCtrl.updateValueAndValidity({emitEvent: false});
  }

  private handleFormDisable(positionForm: FormGroup, position: Position | undefined) {
    if (position?.state === PositionState.Archived) {
      positionForm.disable();
    }
  }
}
