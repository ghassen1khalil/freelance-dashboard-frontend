import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public signIn: FormGroup;


  constructor() {
    this.buildForm();
  }

  ngOnInit(): void {
  }

  private buildForm() {
    this.signIn = new FormGroup({
      usernameOrEmail: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

}
