import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {getAuthState} from '../../core/store/reducers/auth.reducers';
import {Subject, takeUntil} from 'rxjs';
import {checkPasswords, passwordStrengthValidator} from '../../core/utils/password-validators';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {Freelancer} from '../../../generated';
import {
  DeleteAccount,
  UpdateFreelancerInformations,
  UpdateFreelancerPassword
} from '../../core/store/actions/freelancer.actions';
import {EncryptionService} from '../../core/services/encryption.service';
import {UpdateType} from '../../core/domain/update-type.enum';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: []
})
export class ProfileComponent implements OnInit, OnDestroy {

  public personalInformationForm: FormGroup;
  public passwordModificationForm: FormGroup;

  protected readonly UpdateType = UpdateType;

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
      email: new FormControl(freelancer.email, [Validators.required, Validators.email]),
      firstname: new FormControl(freelancer.firstname, [Validators.required]),
      lastname: new FormControl(freelancer.lastname, [Validators.required])
    });
  }

  public submitFreelancerDataUpdate(updateType: UpdateType) {
    if (UpdateType.PERSONAL_INFO === updateType) {
      this.store.dispatch(UpdateFreelancerInformations(
        {
          informationsUpdateRequest: {
            id: this.freelancer.id,
            email: this.personalInformationForm.controls['email'].value,
            firstname: this.personalInformationForm.controls['firstname'].value,
            lastname: this.personalInformationForm.controls['lastname'].value,
          }
        }));
    } else {
      this.store.dispatch(UpdateFreelancerPassword(
        {
          passwordUpdateRequest: {
            email: this.freelancer.email,
            password: this.encryptionService.encrypt(this.passwordModificationForm.controls['newPassword'].value),
          }
        }));
    }
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
          this.store.dispatch(DeleteAccount({id: this.freelancer.id!}))
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
