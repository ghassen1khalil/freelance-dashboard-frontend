import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '@auth0/auth0-angular';
import {Store} from '@ngrx/store';
import {Login, LoginViaSocial} from '../../../core/store/actions/auth.actions';
import {EncryptionService} from '../../../core/services/encryption.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public logInForm: FormGroup;

  constructor(private authService: AuthService,
              private encryptionService: EncryptionService,
              private store: Store) {
    this.buildForm();
  }

  ngOnInit(): void {
  }

  public connectViaSocial() {
    this.store.dispatch(LoginViaSocial());
  }

  private buildForm() {
    this.logInForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  public loginWhenEnterPushed() {
    if (this.logInForm.valid) {
      this.login();
    }
  }

  public login() {
    this.store.dispatch(Login({
      email: this.encryptionService.encrypt(this.logInForm.controls['email'].value),
      password: this.encryptionService.encrypt(this.logInForm.controls['password'].value)
    }));
  }
}
