import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {FreelancerService} from '../../../../generated';
import {AuthService} from '@auth0/auth0-angular';
import {EncryptionService} from '../../../core/services/encryption.service';
import {Store} from '@ngrx/store';
import {SetFreelancer} from '../../../core/store/actions/auth.actions';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public signUpForm: FormGroup;
  public isRedirectedFromLogin: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private freelancerService: FreelancerService,
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

  //TODO user store (actions, effects) to signup user and detect errors
  public signUpUser() {
    this.authService.user$.subscribe(user => {
      this.freelancerService.signUp({
        name: user?.name,
        firstname: user?.given_name,
        lastname: user?.family_name,
        email: this.encryptionService.encrypt(<string>user?.email),
        password: this.encryptionService.encrypt(this.signUpForm.controls['password'].value),
        picture: user?.picture
      }).subscribe(savedUser => {this.store.dispatch(SetFreelancer({freelancer: savedUser}))});
    });
  }

  private buildForm(userMail: string) {
    this.signUpForm = new FormGroup({
      email: new FormControl(userMail ? userMail : '', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }
}
