import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {checkPasswords, passwordStrengthValidator} from '../../../../core/utils/password-validators';
import {ResetPassword} from '../../../../core/store/actions/auth.actions';
import {Store} from '@ngrx/store';
import {EncryptionService} from '../../../../core/services/encryption.service';

@Component({
  selector: 'app-new-password-form',
  templateUrl: './new-password-form.component.html',
  styleUrls: ['./new-password-form.component.scss']
})
export class NewPasswordFormComponent implements OnInit {

  @Input() passwordResetToken: string;
  public newPasswordForm: FormGroup;


  constructor(private store: Store,
              private encryptionService: EncryptionService) { }

  ngOnInit(): void {
    this.buildNewPasswordForm();
  }

  onSubmit() {
    if (this.newPasswordForm.valid) {
      this.store.dispatch(ResetPassword({
          token: this.passwordResetToken,
          newPassword: this.encryptionService.encrypt(this.newPasswordForm.controls['newPassword'].value)
        })
      );
    }
  }

  private buildNewPasswordForm() {
    this.newPasswordForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, passwordStrengthValidator()]),
      confirmPassword: new FormControl('', [Validators.required, passwordStrengthValidator()])
      // @ts-ignore
    }, {validators: checkPasswords});
  }
}
