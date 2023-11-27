import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {getAuthState} from '../../core/store/reducers/auth.reducers';
import {Subject, takeUntil} from 'rxjs';
import {checkPasswords, passwordStrengthValidator} from '../../core/utils/password-validators';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {Freelancer} from '../../../generated';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [ConfirmationService]
})
export class ProfileComponent implements OnInit, OnDestroy {

  public personalInformationForm: FormGroup;
  public passwordModificationForm: FormGroup;

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
    console.log(JSON.stringify(this.personalInformationForm.value));
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

  public submitPasswordChangeRequest() {
    console.log(JSON.stringify(this.passwordModificationForm.value));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
