import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {getAuthState} from '../../core/store/reducers/auth.reducers';
import {Subject, takeUntil} from 'rxjs';
import {checkPasswords, passwordStrengthValidator} from '../../core/utils/password-validators';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {Freelancer} from '../../../generated';
import {UpdateFreelancer} from '../../core/store/actions/freelancer.actions';
import {FreelancerEffects} from '../../core/store/effects/freelancer.effects';
import {EncryptionService} from '../../core/services/encryption.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [ConfirmationService]
})
export class ProfileComponent implements OnInit, OnDestroy {

  public personalInformationForm: FormGroup;
  public passwordModificationForm: FormGroup;

  private encryptionService = inject(EncryptionService);
  private freelancer: Freelancer = {};
  private unsubscribe$ = new Subject<void>();

  constructor(private translate: TranslateService,
              private store: Store,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    this.buildPasswordModificationForm();

    this.store.pipe(
      select(getAuthState),
      takeUntil(this.unsubscribe$)
    ).subscribe(authState => {
      if (authState.freelancer !== undefined) {
        this.buildPersonalInformationForm(authState.freelancer);
        this.freelancer = authState.freelancer;
      }
    });
  }

  private buildPasswordModificationForm() {
    this.passwordModificationForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, passwordStrengthValidator()]),
      confirmPassword: new FormControl('', [Validators.required, passwordStrengthValidator()])
      // @ts-ignore
    }, {validators: checkPasswords});
  }

  private buildPersonalInformationForm(freelancer: Freelancer) {
    this.personalInformationForm = new FormGroup<any>({
      email: new FormControl(freelancer.email),
      firstname: new FormControl(freelancer.firstname, [Validators.required]),
      lastname: new FormControl(freelancer.lastname, [Validators.required])
    });
  }

  public submitPersonalInfosModificationRequest() {
    this.store.dispatch(UpdateFreelancer({freelancer: this.buildUpdatedFreelancer()}))
  }

  private buildUpdatedFreelancer(): Freelancer {
    this.freelancer = {
      ...this.freelancer,
      firstname: this.personalInformationForm.controls['firstname'].value,
      lastname:this.personalInformationForm.controls['lastname'].value,
      email: this.encryptionService.encrypt(this.personalInformationForm.controls['email'].value),
    }
    return this.freelancer;
  }

  public submitPasswordChangeRequest() {
    console.log(JSON.stringify(this.passwordModificationForm.value));
  }

  public sendDeleteMyAccountRequest() {
    this.translate.get([
      'delete-modal.account.areYouSure',
      'delete-modal.confirmation',
    ]).subscribe(res => {
      this.confirmationService.confirm({
        message: res['delete-modal.account.areYouSure'],
        header: res['delete-modal.confirmation'],
        icon: 'pi pi-info-circle',
        accept: () => {
          //TODO dispatch delete account action
          console.log("accepted");
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
