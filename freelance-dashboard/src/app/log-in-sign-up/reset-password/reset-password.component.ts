import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {ResetPassword, SendResetPasswordRequest} from '../../../core/store/actions/auth.actions';
import {checkPasswords, passwordStrengthValidator} from '../../../core/utils/password-validators';
import {EncryptionService} from '../../../core/services/encryption.service';
import {CheckPasswordResetToken} from '../../../core/store/actions/password-reset-token.actions';
import {Subject, takeUntil} from 'rxjs';
import {getPasswordResetToken} from '../../../core/store/reducers/password-reset-token.reducers';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  public resetPasswordForm: FormGroup;
  public newPasswordForm: FormGroup;
  public isNewPasswordForm: boolean;
  public isRequestSent: boolean;
  public isTokenValid: boolean;

  private passwordResetToken: string;
  private unsubscribe$ = new Subject<void>();

  constructor(private router: Router,
              private store: Store,
              private route: ActivatedRoute,
              private encryptionService: EncryptionService) {
  }

  ngOnInit(): void {
    this.buildResetPasswordForm();
    this.buildNewPasswordForm();

    this.store.pipe(
      select(getPasswordResetToken),
      takeUntil(this.unsubscribe$)
    ).subscribe(state => {
      this.isTokenValid = state.isTokenValid;
    });

    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.passwordResetToken = params['token']
        this.isNewPasswordForm = true;
        this.store.dispatch(CheckPasswordResetToken({
            passwordResetToken: this.passwordResetToken
          }
        ));
      } else {
        this.isNewPasswordForm = false;
      }
    });
  }

  private buildResetPasswordForm() {
    this.resetPasswordForm = new FormGroup<any>({
      email: new FormControl('', [Validators.email, Validators.required])
    });
  }

  private buildNewPasswordForm() {
    this.newPasswordForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, passwordStrengthValidator()]),
      confirmPassword: new FormControl('', [Validators.required, passwordStrengthValidator()])
      // @ts-ignore
    }, {validators: checkPasswords});
  }

  public sendRestPasswordRequest() {
    this.store.dispatch(SendResetPasswordRequest(
      {email: this.resetPasswordForm.controls['email'].value}
    ));
    this.isRequestSent = true;
  }

  public setNewPassword() {
    if (this.newPasswordForm.valid) {
      this.store.dispatch(ResetPassword({
          token: this.passwordResetToken,
          newPassword: this.encryptionService.encrypt(this.newPasswordForm.controls['newPassword'].value)
        })
      );
    }
  }

  public goToLogin() {
    this.router.navigate(['login'])
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
