import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Currency, Position, PositionsService, State} from '../../../generated';
import {Store} from '@ngrx/store';
import * as PositionActions from '../../core/store/actions/position.actions';
import {Router} from '@angular/router';
import {DateService} from '../../core/services/date.service';


@Component({
  selector: 'app-add-position',
  templateUrl: './add-position.component.html',
  styleUrls: ['./add-position.component.scss']
})
export class AddPositionComponent implements OnInit {

  public addPositionForm: FormGroup;
  public currencies: string[] = Object.values(Currency);


  constructor(private positionService: PositionsService,
              private dateService: DateService,
              private store: Store<{ positions: Position[] }>,
              private router: Router) {
    this.buildForm();
  }

  ngOnInit(): void {
  }

  private buildForm() {
    this.addPositionForm = new FormGroup({
      startingDate: new FormControl('', [Validators.required]),
      client: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      isFullRemote: new FormControl(),
      dailyRate: new FormControl('', [Validators.required]),
      currency: new FormControl('', [Validators.required]),
      role: new FormControl(''),
      project: new FormControl(''),
      tribe: new FormControl(''),
      manager: new FormControl(''),
      intermediaryCorporation: new FormControl('', [Validators.required]),
      intermediaryName: new FormControl('', [Validators.required]),
      intermediaryPhones: new FormControl(''),
      intermediaryEmail: new FormControl(''),
      remarks: new FormControl(),
      initialStatus: new FormControl('', [Validators.required]),
    });
  }

  public savePosition() {
    if (this.addPositionForm.valid) {
      this.store.dispatch(PositionActions.SaveNewPosition({position: this.createPositionFromForm()}));
      this.router.navigate(['/main']);
    }
  }

  private createPositionFromForm(): Position {
    return {
      startingDate: this.dateService.formatAndUtc(this.addPositionForm.controls['startingDate'].value, DateService.YYYY_MM_DD_FORMAT),
      client: this.addPositionForm.controls['client'].value,
      address: this.addPositionForm.controls['address'].value,
      isFullRemote: this.addPositionForm.controls['isFullRemote'].value !== null,
      dailyRate: {
        amount: this.addPositionForm.controls['dailyRate'].value,
        currency: this.addPositionForm.controls['currency'].value
      },
      mission: {
        role: this.addPositionForm.controls['role'].value,
        project: this.addPositionForm.controls['project'].value,
        tribe: this.addPositionForm.controls['tribe'].value,
        manager: this.addPositionForm.controls['manager'].value,
      },
      intermediary: {
        corporation: this.addPositionForm.controls['intermediaryCorporation'].value,
        name: this.addPositionForm.controls['intermediaryName'].value,
        phones: this.addPositionForm.controls['intermediaryPhones'].value,
      },
      remarks: this.addPositionForm.controls['remarks'].value,
      statuses: [{
        label: this.addPositionForm.controls['initialStatus'].value,
        date: this.dateService.today(DateService.YYYY_MM_DD_FORMAT)
      }],
      state: State.Active
    };
  }

  public cancel() {
    this.router.navigate(['/main']);
  }

  /*public addStatus() {
    if (isNotNullOrUndefined(this.addPositionForm.controls['newStatus'].value)) {
      this.statusHistory.push(this.addPositionForm.controls['newStatus'].value);
    }
  }*/
}
