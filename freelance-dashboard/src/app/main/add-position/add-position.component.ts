import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Position, PositionsService} from '../../../../generated';
import {TranslateService} from '@ngx-translate/core';
import {PrimeNGConfig} from 'primeng/api';
import {Store} from '@ngrx/store';
import * as PositionActions from '../../core/store/actions/position.action';
import {PositionState} from '../../core/store/state/app.states';


@Component({
  selector: 'app-add-position',
  templateUrl: './add-position.component.html',
  styleUrls: ['./add-position.component.scss']
})
export class AddPositionComponent implements OnInit {

  public addPositionForm: FormGroup;

  /*public statusHistory = ['Entretien planifié le XX/XX', 'Abandonné'];*/
  public statusHistory: any[] = [];

  @Output()
  public closeDialog: EventEmitter<any> = new EventEmitter();

  constructor(private positionService: PositionsService,
              private translateService: TranslateService,
              private config: PrimeNGConfig,
              private store: Store<{ positions: Position[] }>) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.translateService.use('fr');
    this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
  }

  private buildForm() {
    this.addPositionForm = new FormGroup({
      date: new FormControl('', [Validators.required]),
      client: new FormControl('', [Validators.required]),
      projectOrEntity: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      isFullRemote: new FormControl(),
      intermediaryCorporation: new FormControl('', [Validators.required]),
      intermediaryName: new FormControl('', [Validators.required]),
      intermediaryPhones: new FormControl('', [Validators.required]),
      intermediaryEmail: new FormControl('', [Validators.required]),
      /*statusHistory: new FormControl(),
      newStatus: new FormControl(),*/
      initialStatus: new FormControl('', [Validators.required]),
      remarks: new FormControl(),
    });
  }

  public savePosition() {
    if (this.addPositionForm.valid) {
      this.store.dispatch(PositionActions.SaveNewPosition({position: this.createPositionFromForm()}));
    }
  }

  private createPositionFromForm(): Position {
    return {
      date: this.addPositionForm.controls['date'].value,
      client: this.addPositionForm.controls['client'].value,
      projectOrEntity: this.addPositionForm.controls['projectOrEntity'].value,
      address: this.addPositionForm.controls['address'].value,
      isFullRemote: this.addPositionForm.controls['isFullRemote'].value !== null,
      remarks: this.addPositionForm.controls['remarks'].value,
      intermediary: {
        corporation: this.addPositionForm.controls['intermediaryCorporation'].value,
        name: this.addPositionForm.controls['intermediaryName'].value,
        phones: this.addPositionForm.controls['intermediaryPhones'].value,
      }
    };
  }

  public cancel() {
    this.closeDialog.emit();
  }

  /*public addStatus() {
    if (isNotNullOrUndefined(this.addPositionForm.controls['newStatus'].value)) {
      this.statusHistory.push(this.addPositionForm.controls['newStatus'].value);
    }
  }*/
}
