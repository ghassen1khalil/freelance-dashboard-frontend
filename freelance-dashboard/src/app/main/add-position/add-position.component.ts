import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';

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

  constructor() {
    this.buildForm();
  }

  ngOnInit(): void {
  }

  private buildForm() {
    this.addPositionForm = new FormGroup({
      year: new FormControl('', [Validators.required]),
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
    if (this.addPositionForm.valid){
      //TODO : implement save call to backend
      console.log(JSON.stringify(this.addPositionForm.value));
    }
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
