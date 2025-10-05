import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {AuthService} from '@auth0/auth0-angular';
import {EncryptionService} from '../../../core/services/encryption.service';
import {Store} from '@ngrx/store';
import {LoginViaSocial, Signup} from '../../../core/store/actions/auth.actions';
import {passwordStrengthValidator} from '../../../core/utils/password-validators';
import {FreelancerState} from '../../../../generated';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public signupForm: FormGroup;
  public isRedirectedFromLogin: boolean;

  constructor(private location: Location,
              private authService: AuthService,
              private encryptionService: EncryptionService,
              private store: Store) {
  }

  ngOnInit(): void {
    // @ts-ignore
    this.isRedirectedFromLogin = this.location.getState().isRedirected
    // @ts-ignore
    this.buildForm(this.location.getState().user);


  }

  public signupUser() {
    this.authService.user$.subscribe(user => {
      this.store.dispatch(Signup({
        freelancer: {
          name: user !== null && user !== undefined ? user.name :
            `${this.signupForm.controls['firstname'].value} ${this.signupForm.controls['lastname'].value}`,
          firstname: user !== null && user !== undefined ? user?.given_name : this.signupForm.controls['firstname'].value,
          lastname: user !== null && user !== undefined ? user?.family_name : this.signupForm.controls['lastname'].value,
          email: this.signupForm.controls['email'].value,
          password: this.encryptionService.encrypt(this.signupForm.controls['password'].value),
          picture: user?.picture,
          state: FreelancerState.Active
        }
      }));
    });
  }

  public signupWhenEnterPushed() {
    if (this.signupForm.valid) {
      this.signupUser();
    }
  }

  public signupViaSocial() {
    this.store.dispatch(LoginViaSocial());
  }

  private buildForm(userMail: string) {
    this.signupForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl(userMail ? userMail : '', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, passwordStrengthValidator()])
    });
  }
}
