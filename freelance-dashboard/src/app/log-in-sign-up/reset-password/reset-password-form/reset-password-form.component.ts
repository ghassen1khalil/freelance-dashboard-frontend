import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SendResetPasswordRequest} from '../../../../core/store/actions/auth.actions';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss']
})
export class ResetPasswordFormComponent implements OnInit {

  @Output() isRequestSent = new EventEmitter<boolean>()

  public resetPasswordForm: FormGroup;

  constructor(private router: Router,
              private store: Store) { }

  ngOnInit(): void {
    this.buildResetPasswordForm();
  }

  private buildResetPasswordForm() {
    this.resetPasswordForm = new FormGroup<any>({
      email: new FormControl('', [Validators.email, Validators.required])
    });
  }

  public sendRestPasswordRequest() {
    this.store.dispatch(SendResetPasswordRequest(
      {email: this.resetPasswordForm.controls['email'].value}
    ));
    this.isRequestSent.emit(true);
  }

  public goToLogin() {
    this.router.navigate(['login']);
  }
}
