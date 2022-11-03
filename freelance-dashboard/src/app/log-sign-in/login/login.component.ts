import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public logInForm: FormGroup;

  constructor() {
    this.buildForm();
  }

  ngOnInit(): void {
  }

  private buildForm() {
    this.logInForm = new FormGroup({
      usernameOrEmail: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

}
