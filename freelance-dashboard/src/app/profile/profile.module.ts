import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile.component';
import {ProfileRoutingModule} from './profile-routing.module';
import {FieldsetModule} from 'primeng/fieldset';
import {TranslateModule} from '@ngx-translate/core';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {DividerModule} from 'primeng/divider';
import {PasswordModule} from 'primeng/password';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {SelectButtonModule} from 'primeng/selectbutton';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  exports: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FieldsetModule,
    TranslateModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    RippleModule,
    DividerModule,
    PasswordModule,
    ConfirmDialogModule,
    SelectButtonModule,
    FormsModule
  ]
})
export class ProfileModule {
}
