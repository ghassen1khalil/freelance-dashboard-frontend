import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {getAuthState} from '../../core/store/reducers/auth.reducers';
import {Subject, takeUntil} from 'rxjs';
import {checkPasswords, passwordStrengthValidator} from '../../core/utils/password-validators';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';

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
      this.personalInformationForm = new FormGroup<any>({
        email: new FormControl(authState.freelancer?.email),
        firstname: new FormControl(authState.freelancer?.firstname, [Validators.required]),
        lastname: new FormControl(authState.freelancer?.lastname, [Validators.required])
      });
    });
  }

  private buildPasswordModificationForm() {
    this.passwordModificationForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, passwordStrengthValidator()]),
      confirmPassword: new FormControl('', [Validators.required, passwordStrengthValidator()])
      // @ts-ignore
    }, {validators: checkPasswords});
  }

  public sendModificationRequest() {
  }

  public deleteMyAccount() {
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

  public onSubmit() {
    console.log(JSON.stringify(this.passwordModificationForm.value));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
